import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play, Edit2, Trash2, Crown, AlertCircle } from "lucide-react";
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

interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  days_per_week: number;
  experience_level: string;
  plan_data: any;
}

export default function MyPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      const [plansRes, profileRes] = await Promise.all([
        supabase.from("workout_plans").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("is_premium").eq("user_id", user.id).single()
      ]);

      if (plansRes.data) setPlans(plansRes.data);
      if (profileRes.data) setIsPremium(profileRes.data.is_premium);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleDelete = async () => {
    if (!planToDelete) return;
    const { error } = await supabase.from("workout_plans").delete().eq("id", planToDelete);
    if (!error) {
      setPlans(plans.filter(p => p.id !== planToDelete));
      toast({ title: "Plan deleted" });
    }
    setPlanToDelete(null);
  };

  const handleCreateNew = () => {
    if (!isPremium && plans.length >= 2) {
      toast({
        title: "Plan limit reached",
        description: "Free users can have up to 2 plans. Upgrade to Premium for unlimited plans!",
        variant: "destructive",
      });
      navigate("/premium");
      return;
    }
    navigate("/create");
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading plans...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Plans</h1>
        {!isPremium && (
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {plans.length}/2 Plans
          </span>
        )}
      </div>

      {plans.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground">No plans yet</p>
              <p className="text-sm text-muted-foreground">Create your first AI-powered workout plan</p>
            </div>
            <Button onClick={handleCreateNew} className="rounded-xl">
              Create Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden border-border/50 bg-secondary/10">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
                      {plan.goal} • {plan.days_per_week} Days/Week
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/create?edit=${plan.id}`)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setPlanToDelete(plan.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <Button 
                  onClick={() => navigate(`/workout/${plan.id}/day1`)}
                  className="w-full gap-2 rounded-xl h-12 font-bold"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Plan
                </Button>
              </CardContent>
            </Card>
          ))}
          
          <Button 
            onClick={handleCreateNew}
            variant="outline" 
            className="w-full h-16 rounded-2xl border-dashed border-2 gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
          >
            <Plus className="w-5 h-5" /> Add New Plan
          </Button>
        </div>
      )}

      {!isPremium && plans.length >= 2 && (
        <Card className="bg-premium/5 border-premium/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Crown className="w-5 h-5 text-premium shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-premium">Upgrade to Premium</p>
              <p className="text-[10px] text-muted-foreground">Unlock unlimited workout plans and advanced AI features.</p>
            </div>
            <Button size="sm" onClick={() => navigate("/premium")} className="bg-premium text-premium-foreground hover:bg-premium/90 text-[10px] h-7 px-3 rounded-lg">
              Upgrade
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your progress for this plan will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
