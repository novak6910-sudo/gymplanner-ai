import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, ShieldCheck, Zap, BarChart3, Rocket, ArrowLeft, Heart, Target, Flame, ClipboardList, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Premium() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async (plan: string) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ is_premium: true }).eq("user_id", user.id);
    if (!error) {
      toast({ title: "Upgraded to Premium! 👑", description: `You're now on the ${plan} plan. Enjoy all features!` });
      navigate("/dashboard");
    }
  };

  const benefits = [
    { title: "Unlimited Workout Plans", desc: "Create as many custom plans as you need.", icon: ClipboardList },
    { title: "Unlimited PDF Downloads", desc: "Save and share your plans offline.", icon: Download },
    { title: "Advanced Analytics", desc: "Deep dive into your fitness trends.", icon: BarChart3 },
    { title: "Smart AI Adjustments", desc: "AI tweaks your plan as you progress.", icon: Rocket },
    { title: "No Advertisements", desc: "Zero distractions, just results.", icon: ShieldCheck },
    { title: "Early Access Features", desc: "Be the first to try new updates.", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center space-y-8 pb-12 pt-12">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-premium/10 flex items-center justify-center mx-auto mb-4 border border-premium/20 animate-pulse">
          <Crown className="w-8 h-8 text-premium" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Upgrade to Premium</h1>
        <p className="text-muted-foreground font-medium max-w-xs mx-auto">
          Unlock your full fitness potential and achieve your goals faster.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/50 shrink-0 group-hover:scale-110 transition-transform">
              <benefit.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground">{benefit.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm pt-4">
        <Card className="relative overflow-hidden border-border/50 bg-secondary/10 cursor-pointer hover:border-premium/50 transition-all active:scale-[0.98] group" onClick={() => handleUpgrade("Monthly")}>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Monthly</p>
              <p className="text-2xl font-black text-foreground">€3.99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
            <Button size="lg" className="bg-primary text-white font-bold h-12 rounded-xl px-6 group-hover:bg-primary/90 transition-colors">
              Start Premium
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-premium bg-premium/5 cursor-pointer hover:bg-premium/10 transition-all active:scale-[0.98] shadow-lg shadow-premium/10 group" onClick={() => handleUpgrade("Annual")}>
          <div className="absolute top-0 right-0 bg-premium text-premium-foreground text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Best Value</div>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-premium uppercase tracking-widest">Annual</p>
              <p className="text-2xl font-black text-foreground">€29.99<span className="text-sm font-normal text-muted-foreground">/yr</span></p>
              <p className="text-[10px] text-success font-bold">Save €17.89 per year</p>
            </div>
            <Button size="lg" className="bg-premium text-premium-foreground font-bold h-12 rounded-xl px-6 group-hover:bg-premium/90 transition-colors">
              Start Premium
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-[10px] text-muted-foreground text-center max-w-xs mx-auto px-4 opacity-60">
        Subscription will auto-renew at the end of each period. Cancel anytime in your account settings. Secure payments via Stripe.
      </p>
    </div>
  );
}
