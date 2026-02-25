import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Flame, Clock, Share2, Download } from "lucide-react";

interface ShareableCardProps {
  dayFocus: string;
  exerciseCount: number;
  caloriesBurned: number;
  totalMinutes: number;
  userName: string;
  level: string;
}

export default function ShareableWorkoutCard({
  dayFocus,
  exerciseCount,
  caloriesBurned,
  totalMinutes,
  userName,
  level,
}: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const text = `🏋️ Completed ${dayFocus} – ${caloriesBurned} Calories Burned 💪\n${exerciseCount} exercises in ${totalMinutes} min\n\n#GymPlanner #Fitness`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Workout Complete!", text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20" ref={cardRef}>
      <div className="hero-gradient p-6 text-primary-foreground">
        <div className="flex items-center gap-2 mb-1 opacity-80">
          <Dumbbell className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Workout Complete</span>
        </div>
        <h3 className="text-xl font-bold mb-4">{dayFocus}</h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary-foreground/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <Dumbbell className="w-5 h-5 mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{exerciseCount}</p>
            <p className="text-[10px] uppercase tracking-wide opacity-70">Exercises</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <Flame className="w-5 h-5 mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{caloriesBurned}</p>
            <p className="text-[10px] uppercase tracking-wide opacity-70">Calories</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <Clock className="w-5 h-5 mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{totalMinutes}</p>
            <p className="text-[10px] uppercase tracking-wide opacity-70">Minutes</p>
          </div>
        </div>
      </div>

      <CardContent className="pt-4 pb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">Level: {level}</p>
        </div>
        <Button size="sm" onClick={handleShare} className="gap-1.5">
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </CardContent>
    </Card>
  );
}
