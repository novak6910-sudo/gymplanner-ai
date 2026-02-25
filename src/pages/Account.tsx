import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, Trash2, Crown, ChevronRight, Settings, Bell, Shield, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Profile {
  display_name: string | null;
  is_premium: boolean;
  user_id: string;
}

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) setProfile(data as Profile);
    };
    fetchProfile();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").delete().eq("user_id", user.id);
    if (!error) {
      await signOut();
      navigate("/");
      toast({ title: "Account deleted" });
    }
    setIsDeleting(false);
  };

  const menuItems = [
    { label: "Notification Settings", icon: Bell, path: "/account/notifications" },
    { label: "Privacy & Security", icon: Shield, path: "/account/privacy" },
    { label: "Help Center", icon: HelpCircle, path: "/account/help" },
    { label: "Settings", icon: Settings, path: "/account/settings" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">Account</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-5 p-2 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground truncate">{profile?.display_name || "Athlete"}</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <div className="mt-2">
            {profile?.is_premium ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-premium/20 text-premium text-[10px] font-bold uppercase tracking-wider border border-premium/30">
                <Crown className="w-3 h-3" /> Premium member
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                Free Plan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      {!profile?.is_premium && (
        <Card className="bg-premium text-premium-foreground overflow-hidden border-none shadow-lg shadow-premium/20 cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => navigate("/premium")}>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-bold text-lg">Upgrade to Premium</p>
              <p className="text-xs text-premium-foreground/80">Unlock all features & unlimited plans</p>
            </div>
            <Crown className="w-10 h-10 opacity-40 shrink-0 rotate-12" />
          </CardContent>
        </Card>
      )}

      {/* Menu Options */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/50 shadow-sm">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-bold text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4 pb-12">
        <Button
          variant="outline"
          onClick={() => { signOut(); navigate("/"); }}
          className="w-full h-14 rounded-2xl gap-3 border-border/50 bg-secondary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </Button>

        <Button
          variant="ghost"
          onClick={() => setIsDeleting(true)}
          className="w-full h-12 rounded-2xl gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-sm transition-all"
        >
          <Trash2 className="w-4 h-4" /> Delete Account
        </Button>
      </div>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This is permanent. All your workout data, tracking history, and plans will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
