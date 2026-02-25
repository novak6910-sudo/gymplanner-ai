import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, ArrowRight, ArrowLeft, Flame, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/workout-data";

interface PlannerFormProps {
  onGenerate: (profile: UserProfile) => void;
}

const steps = ["goal", "level", "equipment", "days"] as const;
type Step = typeof steps[number];

const goals = [
  { value: "cut" as const, label: "🔥 Lose Fat", desc: "Burn fat & get lean" },
  { value: "bulk" as const, label: "💪 Build Muscle", desc: "Pack on muscle mass" },
  { value: "maintain" as const, label: "⚖️ Maintain", desc: "Stay in shape" },
];

const levels = [
  { value: "beginner" as const, label: "Beginner", desc: "Less than 6 months" },
  { value: "intermediate" as const, label: "Intermediate", desc: "6+ months training" },
];

const equipmentOptions = [
  { value: "dumbbells", label: "🏠 Home (Dumbbells)" },
  { value: "resistance bands", label: "🔗 Bands" },
  { value: "gym", label: "🏋️ Full Gym" },
];

const dayOptions = [3, 4, 5];

export default function PlannerForm({ onGenerate }: PlannerFormProps) {
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState<UserProfile["goal"]>("bulk");
  const [level, setLevel] = useState<UserProfile["level"]>("beginner");
  const [equipment, setEquipment] = useState<string[]>(["dumbbells"]);
  const [daysPerWeek, setDaysPerWeek] = useState(4);

  const stepIndex = steps.indexOf(step);

  const toggleEquipment = (eq: string) =>
    setEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );

  const next = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
  };

  const back = () => {
    const i = steps.indexOf(step);
    if (i > 0) setStep(steps[i - 1]);
  };

  const handleSubmit = () => {
    onGenerate({ age: 25, weight: 70, height: 175, goal, level, equipment, workoutMinutes: daysPerWeek <= 3 ? 45 : 40 });
  };

  return (
    <section id="planner" className="py-12 px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Build Your Plan</h2>
          <p className="text-muted-foreground">Quick & easy — just pick your preferences</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                i <= stepIndex ? "bg-primary w-8" : "bg-secondary w-4"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === "goal" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">What's your goal?</h3>
                <div className="space-y-3">
                  {goals.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => { setGoal(g.value); next(); }}
                      className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                        goal === g.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="text-lg font-semibold text-foreground">{g.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "level" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">Experience level?</h3>
                <div className="space-y-3">
                  {levels.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => { setLevel(l.value); next(); }}
                      className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                        level === l.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="text-lg font-semibold text-foreground">{l.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{l.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "equipment" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">What equipment do you have?</h3>
                <div className="space-y-3">
                  {equipmentOptions.map((eq) => (
                    <button
                      key={eq.value}
                      onClick={() => toggleEquipment(eq.value)}
                      className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                        equipment.includes(eq.value)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="text-lg font-semibold text-foreground">{eq.label}</div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={next}
                  disabled={equipment.length === 0}
                  size="lg"
                  className="w-full h-12 rounded-xl mt-4"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === "days" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">Days per week?</h3>
                <div className="flex gap-3 justify-center">
                  {dayOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDaysPerWeek(d)}
                      className={`w-20 h-20 rounded-2xl border-2 text-2xl font-bold transition-all ${
                        daysPerWeek === d
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full h-14 text-lg rounded-xl mt-6 shadow-lg shadow-primary/20"
                >
                  Generate My Plan <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Back button */}
        {stepIndex > 0 && (
          <button
            onClick={back}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>
    </section>
  );
}
