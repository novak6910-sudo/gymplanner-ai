import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Flame, Activity, TrendingUp, Plus, Minus, CheckCircle2, Trophy, Target, History, Calendar, Rocket, Download, ClipboardList } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Tracking() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("water");
  const [profile, setProfile] = useState<any>(null);
  const [waterToday, setWaterToday] = useState(0);
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [profileRes, waterRes, workoutRes, countRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("water_logs").select("amount_ml").eq("user_id", user.id).gte("logged_at", todayStart.toISOString()),
        supabase.from("workout_logs").select("calories_burned").eq("user_id", user.id).gte("logged_at", todayStart.toISOString()),
        supabase.from("workout_logs").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (waterRes.data) setWaterToday(waterRes.data.reduce((s, w) => s + w.amount_ml, 0));
      if (workoutRes.data) setCaloriesToday(workoutRes.data.reduce((s, w) => s + w.calories_burned, 0));
      setTotalWorkouts(countRes.count || 0);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const updateWater = async (amount: number) => {
    if (!user) return;
    const { error } = await supabase.from("water_logs").insert({ user_id: user.id, amount_ml: amount });
    if (!error) {
      setWaterToday(prev => Math.max(0, prev + amount));
      toast({ title: amount > 0 ? "Water added! 💧" : "Water removed", description: `${Math.abs(amount)}ml updated.` });
    }
  };

  const updateCalories = async (amount: number) => {
    if (!user) return;
    const { error } = await supabase.from("workout_logs").insert({ 
      user_id: user.id, 
      calories_burned: amount, 
      day_id: "manual",
      completed_exercises: []
    });
    if (!error) {
      setCaloriesToday(prev => Math.max(0, prev + amount));
      toast({ title: amount > 0 ? "Calories added! 🔥" : "Calories removed", description: `${Math.abs(amount)}cal updated.` });
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading tracking data...</div>;

  const waterGoal = profile?.daily_water_goal || 2500;
  const calorieGoal = profile?.daily_calorie_goal || 2000;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground py-4">Tracking</h1>

      <Tabs defaultValue="water" onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full h-12 rounded-2xl bg-secondary/20 p-1 border border-border/50 grid grid-cols-4 mb-8">
          <TabsTrigger value="water" className="rounded-xl font-bold text-xs uppercase tracking-wider h-full data-[state=active]:bg-background data-[state=active]:text-accent shadow-none transition-all">Water</TabsTrigger>
          <TabsTrigger value="calories" className="rounded-xl font-bold text-xs uppercase tracking-wider h-full data-[state=active]:bg-background data-[state=active]:text-destructive shadow-none transition-all">Calories</TabsTrigger>
          <TabsTrigger value="workouts" className="rounded-xl font-bold text-xs uppercase tracking-wider h-full data-[state=active]:bg-background data-[state=active]:text-primary shadow-none transition-all">Workouts</TabsTrigger>
          <TabsTrigger value="streaks" className="rounded-xl font-bold text-xs uppercase tracking-wider h-full data-[state=active]:bg-background data-[state=active]:text-success shadow-none transition-all">Streaks</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Water Tab */}
            <TabsContent value="water" className="m-0 space-y-6">
              <Card className="border-none shadow-xl shadow-accent/5 bg-accent/5 overflow-hidden">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="relative w-40 h-40 mx-auto">
                    <Droplets className="w-40 h-40 text-accent/20 absolute inset-0 scale-110" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-black text-accent">{waterToday}ml</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Today</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground px-2">
                      <span>0%</span>
                      <span>Target: {waterGoal}ml</span>
                    </div>
                    <Progress value={(waterToday / waterGoal) * 100} className="h-4 rounded-full bg-accent/10" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => updateWater(250)} size="lg" className="h-20 rounded-2xl flex-col gap-1 bg-accent hover:bg-accent/90 border-none shadow-lg shadow-accent/20">
                  <Plus className="w-5 h-5" />
                  <span className="font-bold">+250ml</span>
                </Button>
                <Button onClick={() => updateWater(500)} size="lg" className="h-20 rounded-2xl flex-col gap-1 bg-accent hover:bg-accent/90 border-none shadow-lg shadow-accent/20">
                  <Plus className="w-5 h-5" />
                  <span className="font-bold">+500ml</span>
                </Button>
                <Button variant="outline" onClick={() => updateWater(-250)} size="lg" className="h-16 rounded-2xl gap-2 border-border/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                  <Minus className="w-4 h-4" />
                  <span className="font-bold">Remove 250ml</span>
                </Button>
                <Button variant="outline" size="lg" className="h-16 rounded-2xl gap-2 border-border/50 text-muted-foreground hover:bg-secondary/40 transition-all font-bold">
                  Custom
                </Button>
              </div>
            </TabsContent>

            {/* Calories Tab */}
            <TabsContent value="calories" className="m-0 space-y-6">
              <Card className="border-none shadow-xl shadow-destructive/5 bg-destructive/5 overflow-hidden">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="relative w-40 h-40 mx-auto">
                    <Flame className="w-40 h-40 text-destructive/20 absolute inset-0 scale-110" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-black text-destructive">{caloriesToday}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Cal Burned</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground px-2">
                      <span>0%</span>
                      <span>Goal: {calorieGoal} cal</span>
                    </div>
                    <Progress value={(caloriesToday / calorieGoal) * 100} className="h-4 rounded-full bg-destructive/10" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => updateCalories(100)} size="lg" className="h-20 rounded-2xl flex-col gap-1 bg-destructive hover:bg-destructive/90 border-none shadow-lg shadow-destructive/20">
                  <Plus className="w-5 h-5" />
                  <span className="font-bold">+100 cal</span>
                </Button>
                <Button onClick={() => updateCalories(250)} size="lg" className="h-20 rounded-2xl flex-col gap-1 bg-destructive hover:bg-destructive/90 border-none shadow-lg shadow-destructive/20">
                  <Plus className="w-5 h-5" />
                  <span className="font-bold">+250 cal</span>
                </Button>
                <Button variant="outline" onClick={() => updateCalories(-100)} size="lg" className="h-16 rounded-2xl gap-2 border-border/50 text-muted-foreground hover:bg-secondary/40 transition-all">
                  <Minus className="w-4 h-4" />
                  <span className="font-bold">Remove 100</span>
                </Button>
                <Button variant="outline" size="lg" className="h-16 rounded-2xl gap-2 border-border/50 text-muted-foreground hover:bg-secondary/40 transition-all font-bold">
                  Custom
                </Button>
              </div>
            </TabsContent>

            {/* Workouts Tab */}
            <TabsContent value="workouts" className="m-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-none shadow-lg shadow-primary/5 bg-secondary/10 p-6 rounded-2xl text-center">
                  <Activity className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-black text-foreground">{totalWorkouts}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Total Workouts</p>
                </Card>
                <Card className="border-none shadow-lg shadow-primary/5 bg-secondary/10 p-6 rounded-2xl text-center">
                  <History className="w-10 h-10 text-success mx-auto mb-3" />
                  <p className="text-3xl font-black text-foreground">{Math.round(profile?.total_calories_burned || 0)}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Lifetime Cal</p>
                </Card>
              </div>

              <Card className="border-border/50 bg-secondary/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Weekly Summary</h3>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[3, 5, 2, 7, 4, 6, 8].map((v, i) => (
                      <div key={i} className="flex-1 space-y-2">
                        <div className="relative w-full h-full flex items-end">
                          <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${(v / 8) * 100}%` }} 
                            className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-colors"
                          />
                        </div>
                        <p className="text-[8px] font-black text-muted-foreground text-center uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Streaks Tab */}
            <TabsContent value="streaks" className="m-0 space-y-6">
              <div className="space-y-4">
                <Card className="border-none shadow-xl shadow-success/10 bg-success/5 overflow-hidden p-6 rounded-3xl">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-success/10 flex items-center justify-center border-2 border-success/20 shrink-0">
                      <TrendingUp className="w-10 h-10 text-success" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-2xl font-black text-foreground">{profile?.workout_streak || 0} Days</h3>
                      <p className="text-xs font-bold text-success uppercase tracking-widest">Workout Streak 🔥</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">Don't break the chain! 12 days left to your next milestone.</p>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border/50 bg-secondary/10 p-5 rounded-2xl text-center space-y-2">
                    <Droplets className="w-8 h-8 text-accent mx-auto" />
                    <p className="text-2xl font-black text-foreground">{profile?.water_streak || 0}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Water Streak 💧</p>
                  </Card>
                  <Card className="border-border/50 bg-secondary/10 p-5 rounded-2xl text-center space-y-2">
                    <Trophy className="w-8 h-8 text-premium mx-auto" />
                    <p className="text-2xl font-black text-foreground">LVL {Math.floor((profile?.xp_points || 0) / 100) + 1}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fitness Level 🏆</p>
                  </Card>
                </div>

                <Card className="border-border/50 bg-secondary/10 rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Streak Milestones
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "7 Day Starter", icon: CheckCircle2, done: (profile?.workout_streak || 0) >= 7 },
                      { label: "14 Day Committed", icon: Trophy, done: (profile?.workout_streak || 0) >= 14 },
                      { label: "30 Day Beast", icon: Rocket, done: (profile?.workout_streak || 0) >= 30 },
                    ].map((m, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${m.done ? 'bg-success/10 border-success/30' : 'bg-background border-border/50 opacity-60'}`}>
                        <div className="flex items-center gap-3">
                          <m.icon className={`w-5 h-5 ${m.done ? 'text-success' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-bold ${m.done ? 'text-foreground' : 'text-muted-foreground'}`}>{m.label}</span>
                        </div>
                        {m.done && <CheckCircle2 className="w-4 h-4 text-success" />}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
