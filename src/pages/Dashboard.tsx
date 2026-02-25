import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell, Droplets, Flame, Crown, LogOut, Home,
  FileText, BarChart3, Target, TrendingUp, Activity, Play, User
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  display_name: string | null;
  is_premium: boolean;
  workout_streak: number;
  water_streak: number;
  xp_points: number;
  total_workouts: number;
  daily_water_goal: number;
}

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayWater, setTodayWater] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [profileRes, waterRes, workoutRes, countRes] = await Promise.all([
        supabase.from("profiles").select("display_name, is_premium, workout_streak, water_streak, xp_points, total_workouts, daily_water_goal").eq("user_id", user.id).single(),
        supabase.from("water_logs").select("amount_ml").eq("user_id", user.id).gte("logged_at", todayStart.toISOString()),
        supabase.from("workout_logs").select("calories_burned").eq("user_id", user.id).gte("logged_at", todayStart.toISOString()),
        supabase.from("workout_logs").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (waterRes.data) setTodayWater(waterRes.data.reduce((s, w) => s + w.amount_ml, 0));
      if (workoutRes.data) setTodayCalories(workoutRes.data.reduce((s, w) => s + w.calories_burned, 0));
      setTotalWorkouts(countRes.count ?? 0);
    };
    fetchData();
  }, [user]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const waterGoal = profile?.daily_water_goal ?? 2500;
  const waterPercent = Math.min(100, (todayWater / waterGoal) * 100);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="space-y-6 pt-6 pb-12">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting()}, {profile?.display_name?.split(' ')[0] || "Athlete"} 👋
          </h1>
          {profile?.is_premium ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-premium/20 text-premium text-[10px] font-bold uppercase tracking-wider mt-1 border border-premium/30">
              <Crown className="w-3 h-3" /> Premium member
            </span>
          ) : (
            <p className="text-muted-foreground text-sm">Let's crush your goals today!</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center border border-border/50">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      {/* 4 Big Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="cursor-pointer hover:border-destructive/50 transition-all active:scale-[0.98] border-border/50 bg-secondary/20" onClick={() => navigate("/tracking?tab=calories")}>
          <CardContent className="p-5 text-center">
            <Flame className="w-10 h-10 text-destructive mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{todayCalories}</p>
            <p className="text-xs text-muted-foreground mt-1">🔥 Calories Today</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent/50 transition-all active:scale-[0.98] border-border/50 bg-secondary/20" onClick={() => navigate("/tracking?tab=water")}>
          <CardContent className="p-5 text-center">
            <Droplets className="w-10 h-10 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{Math.round(waterPercent)}%</p>
            <p className="text-xs text-muted-foreground mt-1">💧 Water Today</p>
            <Progress value={waterPercent} className="h-1.5 mt-2 bg-accent/20" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-success/50 transition-all active:scale-[0.98] border-border/50 bg-secondary/20" onClick={() => navigate("/tracking?tab=streaks")}>
          <CardContent className="p-5 text-center">
            <TrendingUp className="w-10 h-10 text-success mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{profile?.workout_streak ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">📅 Day Streak</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98] border-border/50 bg-secondary/20" onClick={() => navigate("/tracking?tab=workouts")}>
          <CardContent className="p-5 text-center">
            <Target className="w-10 h-10 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{totalWorkouts}</p>
            <p className="text-xs text-muted-foreground mt-1">🏋️ Total Workouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Buttons */}
      <div className="space-y-4 pt-2">
        <Button
          size="lg"
          onClick={() => navigate("/plans")}
          className="w-full h-16 text-lg rounded-2xl gap-3 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold"
        >
          <Play className="w-6 h-6 fill-current" /> Start Today's Workout
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/plans")}
            className="h-20 rounded-2xl flex-col gap-2 border-border/50 bg-secondary/20 hover:bg-secondary/40"
          >
            <FileText className="w-6 h-6 text-primary" />
            <span className="font-bold">My Plans</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/tracking")}
            className="h-20 rounded-2xl flex-col gap-2 border-border/50 bg-secondary/20 hover:bg-secondary/40"
          >
            <Activity className="w-6 h-6 text-accent" />
            <span className="font-bold">Tracking</span>
          </Button>
        </div>

        {!profile?.is_premium && (
          <Button
            size="lg"
            onClick={() => navigate("/premium")}
            className="w-full h-14 rounded-2xl gap-3 bg-premium text-premium-foreground hover:bg-premium/90 border-none font-bold"
          >
            <Crown className="w-6 h-6" />
            Upgrade to Premium
          </Button>
        )}
      </div>

      {/* Quick Stats Summary / Tips */}
      <Card className="border-border/50 bg-primary/5 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">You're doing great!</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Consistent training is the key to progress. Keep it up!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
