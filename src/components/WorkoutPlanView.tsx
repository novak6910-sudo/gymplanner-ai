import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, RefreshCw, Lock, ChevronDown, ChevronUp, Play, Download, Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { WorkoutPlan, WorkoutDay, Exercise } from "@/lib/workout-data";
import { getAllExercises } from "@/lib/workout-data";

interface WorkoutPlanViewProps {
  plan: WorkoutPlan;
  isPaid: boolean;
  onPlanChange: (plan: WorkoutPlan) => void;
  onStartWorkout: (day: WorkoutDay) => void;
  onDownload: () => void;
}

export default function WorkoutPlanView({
  plan, isPaid, onPlanChange, onStartWorkout, onDownload,
}: WorkoutPlanViewProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(plan.days[0]?.id);
  const [replacingExercise, setReplacingExercise] = useState<{ dayId: string; exerciseId: string } | null>(null);

  const removeExercise = (dayId: string, exerciseId: string) => {
    const updated = {
      ...plan,
      days: plan.days.map((d) =>
        d.id === dayId ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) } : d
      ),
    };
    onPlanChange(updated);
  };

  const replaceExercise = (dayId: string, oldId: string, newExercise: Exercise) => {
    const updated = {
      ...plan,
      days: plan.days.map((d) =>
        d.id === dayId
          ? { ...d, exercises: d.exercises.map((e) => e.id === oldId ? { ...newExercise, id: newExercise.id + "_r" } : e) }
          : d
      ),
    };
    onPlanChange(updated);
    setReplacingExercise(null);
  };

  const getSuggestions = (exercise: Exercise): Exercise[] =>
    getAllExercises().filter((e) => e.muscleGroup === exercise.muscleGroup && e.id !== exercise.id).slice(0, 4);

  return (
    <section className="py-8 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h2>
          <p className="text-sm text-muted-foreground">
            {plan.daysPerWeek} days/week · {plan.level} · {plan.goal}
          </p>
        </div>

        {/* Top Buttons */}
        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-2" onClick={onDownload}>
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button size="sm" className="flex-1 rounded-xl gap-2" onClick={() => plan.days[0] && onStartWorkout(plan.days[0])}>
            <Play className="w-4 h-4" /> Start Workout
          </Button>
        </div>

        {/* Days */}
        <div className="space-y-3">
          {plan.days.map((day) => {
            const isExpanded = expandedDay === day.id;
            return (
              <Card key={day.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div>
                    <h3 className="font-bold text-foreground">{day.day}</h3>
                    <p className="text-sm text-muted-foreground">{day.focus}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                      {day.exercises.length} exercises
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {day.exercises.map((exercise) => {
                          const locked = exercise.isPremium && !isPaid;
                          const isReplacing = replacingExercise?.dayId === day.id && replacingExercise?.exerciseId === exercise.id;

                          return (
                            <div key={exercise.id}>
                              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                locked ? "border-premium/30 bg-premium/5" : "border-border"
                              }`}>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground text-sm">
                                    {locked ? "🔒 Premium Exercise" : exercise.name}
                                  </div>
                                  {!locked && (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {exercise.sets} sets × {exercise.reps} · Rest {exercise.restSeconds}s
                                    </div>
                                  )}
                                </div>
                                {!locked && (
                                  <div className="flex items-center gap-0.5">
                                    <button onClick={() => setReplacingExercise(isReplacing ? null : { dayId: day.id, exerciseId: exercise.id })} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" title="Replace">
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => removeExercise(day.id, exercise.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Remove">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                                {locked && <Lock className="w-4 h-4 text-premium" />}
                              </div>

                              <AnimatePresence>
                                {isReplacing && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="ml-3 mt-1.5 space-y-1.5">
                                      {getSuggestions(exercise).map((s) => (
                                        <button
                                          key={s.id}
                                          onClick={() => replaceExercise(day.id, exercise.id, s)}
                                          className="w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm"
                                        >
                                          <span className="font-medium text-foreground">{s.name}</span>
                                          <span className="text-xs text-muted-foreground ml-2">{s.sets}×{s.reps}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}

                        <Button onClick={() => onStartWorkout(day)} className="w-full mt-2 gap-2 rounded-xl">
                          <Play className="w-4 h-4" /> Start Workout
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>

        {!isPaid && (
          <div className="mt-4 text-center p-4 rounded-xl bg-premium/10 border border-premium/30">
            <p className="text-sm text-foreground">
              🔒 Some exercises are locked.{" "}
              <button className="font-bold text-primary underline">Upgrade to Pro</button>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
