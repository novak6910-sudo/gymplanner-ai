import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WorkoutLog } from "@/lib/workout-data";

interface ProgressDashboardProps {
  logs: WorkoutLog[];
}

export default function ProgressDashboard({ logs }: ProgressDashboardProps) {
  const totalWorkouts = logs.length;
  const totalCalories = logs.reduce((s, l) => s + l.caloriesBurned, 0);
  const totalMinutes = logs.reduce((s, l) => s + l.totalMinutes, 0);
  const totalWater = logs.reduce((s, l) => s + l.waterMl, 0);

  const chartData = logs.slice(-7).map((log) => ({
    date: new Date(log.date).toLocaleDateString("en", {
      weekday: "short",
    }),
    calories: log.caloriesBurned,
    minutes: log.totalMinutes,
  }));

  const stats = [
    { icon: Calendar, label: "Workouts", value: totalWorkouts, color: "text-primary" },
    { icon: Flame, label: "Calories Burned", value: totalCalories, color: "text-destructive" },
    { icon: TrendingUp, label: "Total Minutes", value: totalMinutes, color: "text-glow-soft" },
    { icon: BarChart3, label: "Water (ml)", value: totalWater, color: "text-success" },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Your Progress
          </h2>
          <p className="text-muted-foreground">
            Track your fitness journey over time
          </p>
        </motion.div>

        {logs.length === 0 ? (
          <Card className="p-12 text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No workouts yet
            </h3>
            <p className="text-muted-foreground">
              Complete your first workout to start tracking progress!
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label} className="p-5 text-center card-glow">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 card-glow">
              <h3 className="font-semibold text-foreground mb-4">
                Last 7 Workouts
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="calories"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Calories"
                  />
                  <Bar
                    dataKey="minutes"
                    fill="hsl(var(--glow-soft))"
                    radius={[4, 4, 0, 0]}
                    name="Minutes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </section>
  );
}
