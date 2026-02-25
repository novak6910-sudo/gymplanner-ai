import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Droplets, Target } from "lucide-react";

interface StreakCardProps {
  workoutStreak: number;
  waterStreak: number;
  consistencyScore: number;
}

export default function StreakCard({ workoutStreak, waterStreak, consistencyScore }: StreakCardProps) {
  const streaks = [
    {
      label: "Workout Streak",
      value: workoutStreak,
      icon: Flame,
      color: "text-destructive",
      bg: "bg-destructive/10",
      suffix: "days",
      emoji: workoutStreak >= 7 ? "🔥" : workoutStreak >= 3 ? "💪" : "🌱",
    },
    {
      label: "Water Streak",
      value: waterStreak,
      icon: Droplets,
      color: "text-accent",
      bg: "bg-accent/10",
      suffix: "days",
      emoji: waterStreak >= 7 ? "🌊" : waterStreak >= 3 ? "💧" : "🌱",
    },
    {
      label: "Consistency",
      value: consistencyScore,
      icon: Target,
      color: "text-success",
      bg: "bg-success/10",
      suffix: "%",
      emoji: consistencyScore >= 80 ? "⭐" : consistencyScore >= 50 ? "📈" : "🎯",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          🔥 Streaks & Consistency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {streaks.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <span className="text-xl">{s.emoji}</span>
              <p className={`text-xl font-bold ${s.color} mt-1`}>
                {s.value}<span className="text-xs font-normal ml-0.5">{s.suffix}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
