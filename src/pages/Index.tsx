import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PlannerForm from "@/components/PlannerForm";
import WorkoutPlanView from "@/components/WorkoutPlanView";
import WorkoutSession from "@/components/WorkoutSession";
import ProgressDashboard from "@/components/ProgressDashboard";
import {
  generateWorkoutPlan,
  type UserProfile,
  type WorkoutPlan,
  type WorkoutDay,
  type WorkoutLog,
} from "@/lib/workout-data";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type View = "home" | "plan" | "workout" | "progress" | "upgrade" | "planner";

const Index = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>("home");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [activeDay, setActiveDay] = useState<WorkoutDay | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [userWeight, setUserWeight] = useState(70);
  const [downloadsLeft, setDownloadsLeft] = useState(2);

  const handleGenerate = useCallback((profile: UserProfile) => {
    setUserWeight(profile.weight);
    const newPlan = generateWorkoutPlan(profile);
    setPlan(newPlan);
    setView("plan");
    toast({
      title: "Plan Generated! 🎯",
      description: `${newPlan.daysPerWeek}-day ${newPlan.goal} plan created for you.`,
    });
  }, []);

  const handleStartWorkout = useCallback((day: WorkoutDay) => {
    setActiveDay(day);
    setView("workout");
  }, []);

  const handleFinishWorkout = useCallback(
    (result: {
      completedExercises: string[];
      totalMinutes: number;
      caloriesBurned: number;
      waterMl: number;
    }) => {
      const log: WorkoutLog = {
        date: new Date().toISOString(),
        dayId: activeDay?.id || "",
        completedExercises: result.completedExercises,
        totalMinutes: result.totalMinutes,
        caloriesBurned: result.caloriesBurned,
        waterMl: result.waterMl,
        notes: "",
      };
      setLogs((prev) => [...prev, log]);
      setView("progress");
      toast({
        title: "Workout Complete! 🎉",
        description: `${result.completedExercises.length} exercises done · ${result.caloriesBurned} cal burned`,
      });
    },
    [activeDay]
  );

  const handleDownload = useCallback(() => {
    if (!isPaid && downloadsLeft <= 0) {
      toast({
        title: "No downloads left",
        description: "Upgrade to Pro for unlimited downloads, or watch an ad to unlock one.",
        variant: "destructive",
      });
      return;
    }
    if (!isPaid) {
      setDownloadsLeft((d) => d - 1);
      toast({
        title: "PDF Downloaded 📄",
        description: `${downloadsLeft - 1} free download(s) remaining this month.`,
      });
    } else {
      toast({
        title: "PDF Downloaded 📄",
        description: "Your workout plan has been saved.",
      });
    }
  }, [isPaid, downloadsLeft]);

  const handleNavigate = useCallback((target: View) => {
    if (target === "upgrade") {
      setIsPaid((p) => !p);
      toast({
        title: isPaid ? "Switched to Free" : "Upgraded to Pro! 👑",
        description: isPaid
          ? "You are now on the free plan."
          : "Enjoy unlimited downloads & all exercises.",
      });
      return;
    }
    setView(target);
  }, [isPaid]);

  const scrollToPlanner = useCallback(() => {
    setView("home");
    setTimeout(() => {
      document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentView={view} onNavigate={handleNavigate} isPaid={false} />

      <div className="max-w-lg mx-auto">
        {view === "home" && (
          <>
            <HeroSection onGetStarted={scrollToPlanner} />
            <div id="planner" className="px-6 py-12">
              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 space-y-4 text-center">
                <h2 className="text-2xl font-bold text-foreground">Try our AI Planner</h2>
                <p className="text-muted-foreground">Generate a personalized workout plan in seconds. No account required for the first look!</p>
                <Button onClick={() => setView("planner")} size="lg" className="rounded-2xl h-14 w-full text-lg font-bold">Get Started Free</Button>
              </div>
            </div>
          </>
        )}

        {view === "planner" && (
          <div className="p-4 pt-8">
            <PlannerForm onGenerate={handleGenerate} />
          </div>
        )}
      </div>

      {view === "plan" && plan && (
        <WorkoutPlanView
          plan={plan}
          isPaid={isPaid}
          onPlanChange={setPlan}
          onStartWorkout={handleStartWorkout}
          onDownload={handleDownload}
        />
      )}

      {view === "plan" && !plan && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            No plan generated yet.
          </p>
          <button
            onClick={() => setView("home")}
            className="text-primary font-semibold underline"
          >
            Go to planner →
          </button>
        </div>
      )}

      {view === "workout" && activeDay && (
        <WorkoutSession
          day={activeDay}
          userWeight={userWeight}
          onFinish={handleFinishWorkout}
          onBack={() => setView("plan")}
        />
      )}

      {view === "progress" && <ProgressDashboard logs={logs} />}
    </div>
  );
};

export default Index;
