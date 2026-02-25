import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PlannerForm from "@/components/PlannerForm";
import type { UserProfile, WorkoutPlan } from "@/lib/workout-data";
import { toast } from "@/hooks/use-toast";
import { generateWorkoutPlan } from "@/lib/workout-data";

export default function CreatePlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (profile: UserProfile) => {
    if (!user) return;
    setLoading(true);

    // Check plan limit again for security
    const { data: profileData } = await supabase.from("profiles").select("is_premium").eq("user_id", user.id).single();
    const isPremium = profileData?.is_premium;

    if (!isPremium && !editId) {
      const { count } = await supabase.from("workout_plans").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if (count && count >= 2) {
        toast({
          title: "Plan limit reached",
          description: "Free users can have up to 2 plans. Upgrade to Premium for unlimited plans!",
          variant: "destructive",
        });
        navigate("/premium");
        setLoading(false);
        return;
      }
    }

    const newPlan = generateWorkoutPlan(profile);
    const planName = `${profile.goal.charAt(0).toUpperCase() + profile.goal.slice(1)} ${profile.workoutMinutes}m ${newPlan.daysPerWeek}-Day`;

    if (editId) {
      const { error } = await supabase.from("workout_plans").update({
        name: planName,
        goal: profile.goal,
        days_per_week: newPlan.daysPerWeek,
        experience_level: profile.level,
        equipment: profile.equipment,
        plan_data: newPlan
      }).eq("id", editId);

      if (error) {
        toast({ title: "Error updating plan", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Plan updated! 🎯" });
        navigate("/plans");
      }
    } else {
      const { error } = await supabase.from("workout_plans").insert({
        user_id: user.id,
        name: planName,
        goal: profile.goal,
        days_per_week: newPlan.daysPerWeek,
        experience_level: profile.level,
        equipment: profile.equipment,
        plan_data: newPlan
      });

      if (error) {
        toast({ title: "Error creating plan", description: error.message, variant: "destructive" });
      } else {
        toast({ 
          title: "Plan Created! 🎯", 
          description: "Ready to start your first workout?",
        });
        navigate("/plans");
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Generating your plan...</div>;

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate("/plans")} className="text-muted-foreground hover:text-foreground">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">{editId ? "Edit Plan" : "Create Plan"}</h1>
      </div>
      <PlannerForm onGenerate={handleGenerate} />
    </div>
  );
}
