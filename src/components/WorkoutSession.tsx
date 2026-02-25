import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, Timer, Droplets, Flame, Pause, RotateCcw, Plus, Minus, SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { WorkoutDay, Exercise } from "@/lib/workout-data";

interface WorkoutSessionProps {
  day: WorkoutDay;
  userWeight: number;
  onFinish: (log: {
    completedExercises: string[];
    totalMinutes: number;
    caloriesBurned: number;
    waterMl: number;
  }) => void;
  onBack: () => void;
}

export default function WorkoutSession({ day, userWeight, onFinish, onBack }: WorkoutSessionProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [waterMl, setWaterMl] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionRunning, setSessionRunning] = useState(true);
  const [restTimer, setRestTimer] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!sessionRunning) return;
    const id = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [sessionRunning]);

  useEffect(() => {
    if (!restRunning || restTimer <= 0) return;
    const id = setInterval(() => {
      setRestTimer((t) => {
        if (t <= 1) { setRestRunning(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restRunning, restTimer]);

  const toggleExercise = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const startRest = (exercise: Exercise) => {
    setRestTimer(exercise.restSeconds);
    setRestRunning(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const totalCalories = day.exercises
    .filter((e) => completed.has(e.id))
    .reduce((sum, e) => sum + e.caloriesPerSet * e.sets * (userWeight / 70), 0);

  const progress = day.exercises.length > 0 ? (completed.size / day.exercises.length) * 100 : 0;
  const currentExercise = day.exercises[currentIndex];

  const handleFinish = () => {
    setSessionRunning(false);
    onFinish({
      completedExercises: Array.from(completed),
      totalMinutes: Math.round(sessionSeconds / 60),
      caloriesBurned: Math.round(totalCalories),
      waterMl,
    });
  };

  return (
    <section className="min-h-screen py-6 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h2 className="font-bold text-foreground">{day.focus}</h2>
          <div />
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="p-3 text-center">
            <Timer className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-foreground">{formatTime(sessionSeconds)}</div>
          </Card>
          <Card className="p-3 text-center">
            <Flame className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <div className="text-lg font-bold text-foreground">{Math.round(totalCalories)}</div>
          </Card>
          <Card className="p-3 text-center">
            <Check className="w-5 h-5 mx-auto mb-1 text-success" />
            <div className="text-lg font-bold text-foreground">{completed.size}/{day.exercises.length}</div>
          </Card>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        {/* Current Exercise Big View */}
        {currentExercise && (
          <Card className="p-6 mb-4 text-center border-primary/30">
            <h3 className="text-xl font-bold text-foreground mb-1">{currentExercise.name}</h3>
            <p className="text-muted-foreground mb-4">
              {currentExercise.sets} sets × {currentExercise.reps}
            </p>
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => { toggleExercise(currentExercise.id); if (currentIndex < day.exercises.length - 1) setCurrentIndex(currentIndex + 1); }}
                className="gap-2 rounded-xl"
              >
                <Check className="w-4 h-4" /> Complete Set
              </Button>
              <Button variant="outline" onClick={() => startRest(currentExercise)} disabled={restRunning} className="gap-2 rounded-xl">
                <Pause className="w-4 h-4" /> Rest Timer
              </Button>
              <Button
                variant="ghost"
                onClick={() => { if (currentIndex < day.exercises.length - 1) setCurrentIndex(currentIndex + 1); }}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Rest Timer */}
        {restRunning && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4">
            <Card className="p-6 text-center border-primary/30 bg-primary/5">
              <p className="text-sm text-muted-foreground mb-2">Rest Timer</p>
              <div className="text-4xl font-bold text-primary mb-3">{formatTime(restTimer)}</div>
              <Button size="sm" variant="outline" onClick={() => { setRestTimer(0); setRestRunning(false); }}>
                <RotateCcw className="w-4 h-4 mr-1" /> Skip Rest
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Bottom mini bar */}
        <Card className="p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Water</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setWaterMl((w) => Math.max(0, w - 250))} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-foreground text-sm w-14 text-center">{waterMl}ml</span>
            <button onClick={() => setWaterMl((w) => w + 250)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Exercise list */}
        <div className="space-y-2 mb-6">
          {day.exercises.map((exercise, i) => {
            const isDone = completed.has(exercise.id);
            return (
              <button
                key={exercise.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isDone ? "bg-success/10 border-success/30" : i === currentIndex ? "border-primary/50 bg-primary/5" : "border-border"
                }`}
              >
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isDone ? "bg-success border-success text-success-foreground" : "border-border"
                }`}>
                  {isDone && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{exercise.name}</div>
                  <div className="text-xs text-muted-foreground">{exercise.sets}×{exercise.reps}</div>
                </div>
              </button>
            );
          })}
        </div>

        <Button onClick={handleFinish} size="lg" className="w-full h-14 text-lg rounded-xl bg-success text-success-foreground hover:bg-success/90">
          Finish Workout 🎉
        </Button>
      </div>
    </section>
  );
}
