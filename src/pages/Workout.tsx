import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import WorkoutSession from "@/components/WorkoutSession";
import type { WorkoutPlan, WorkoutDay } from "@/lib/workout-data";
import { toast } from "@/hooks/use-toast";

export default function Workout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { planId, dayId } = useParams();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [activeDay, setActiveDay] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !planId) return;
    
    const fetchPlan = async () => {
      const { data } = await supabase.from("workout_plans").select("*").eq("id", planId).single();
      if (data) {
        const planData = data.plan_data as WorkoutPlan;
        setPlan(planData);
        const day = planData.days.find(d => d.id === dayId) || planData.days[0];
        setActiveDay(day);
      }
      setLoading(false);
    };

    fetchPlan();
  }, [user, planId, dayId]);

  const handleFinish = async (result: {
    completedExercises: string[];
    totalMinutes: number;
    caloriesBurned: number;
    waterMl: number;
  }) => {
    if (!user) return;

    const { error } = await supabase.from("workout_logs").insert({
      user_id: user.id,
      day_id: activeDay?.id || "",
      day_focus: activeDay?.focus || "",
      completed_exercises: result.completedExercises,
      total_minutes: result.totalMinutes,
      calories_burned: result.caloriesBurned,
      water_ml: result.waterMl,
    });

    if (error) {
      toast({ title: "Error saving workout", description: error.message, variant: "destructive" });
    } else {
      // Update stats in profile
      const { data: profile } = await supabase.from("profiles").select("workout_streak, total_workouts, total_calories_burned").eq("user_id", user.id).single();
      if (profile) {
        await supabase.from("profiles").update({
          workout_streak: (profile.workout_streak || 0) + 1,
          total_workouts: (profile.total_workouts || 0) + 1,
          total_calories_burned: (profile.total_calories_burned || 0) + result.caloriesBurned,
          last_workout_date: new Date().toISOString().split('T')[0]
        }).eq("user_id", user.id);
      }

      toast({ title: "Workout Complete! 🎉", description: `${result.completedExercises.length} exercises done · ${result.caloriesBurned} cal burned` });
      navigate("/dashboard");
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading workout...</div>;
  if (!activeDay) return <div className="p-8 text-center text-muted-foreground">Workout not found.</div>;

  return (
    <WorkoutSession
      day={activeDay}
      userWeight={70} // Default or fetch from profile
      onFinish={handleFinish}
      onBack={() => navigate("/plans")}
    />
  );
}
