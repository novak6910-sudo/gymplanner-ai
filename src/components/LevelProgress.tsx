import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Target, Star } from "lucide-react";

interface LevelProgressProps {
  xpPoints: number;
}

const LEVELS = [
  { name: "Beginner", minXp: 0, icon: "🌱" },
  { name: "Intermediate", minXp: 500, icon: "💪" },
  { name: "Advanced", minXp: 2000, icon: "🔥" },
  { name: "Elite", minXp: 5000, icon: "👑" },
];

export function getLevelInfo(xp: number) {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
      break;
    }
  }

  const xpInLevel = xp - currentLevel.minXp;
  const xpForNext = nextLevel ? nextLevel.minXp - currentLevel.minXp : 1;
  const progress = nextLevel ? Math.min(100, (xpInLevel / xpForNext) * 100) : 100;

  return { currentLevel, nextLevel, xpInLevel, xpForNext, progress };
}

export default function LevelProgress({ xpPoints }: LevelProgressProps) {
  const { currentLevel, nextLevel, progress } = getLevelInfo(xpPoints);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4 text-premium" /> Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentLevel.icon}</span>
            <div>
              <p className="font-bold text-foreground">{currentLevel.name}</p>
              <p className="text-xs text-muted-foreground">{xpPoints} XP</p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-right">
              <span className="text-lg">{nextLevel.icon}</span>
              <p className="text-xs text-muted-foreground">{nextLevel.name}</p>
            </div>
          )}
        </div>
        <Progress value={progress} className="h-2" />
        {nextLevel && (
          <p className="text-xs text-muted-foreground text-center">
            {nextLevel.minXp - xpPoints} XP to {nextLevel.name}
          </p>
        )}
        {!nextLevel && (
          <p className="text-xs text-center text-premium font-medium">Max level reached! 👑</p>
        )}
      </CardContent>
    </Card>
  );
}
