export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  muscleGroup: string;
  restSeconds: number;
  equipment: string;
  isPremium: boolean;
  caloriesPerSet: number;
}

export interface WorkoutDay {
  id: string;
  day: string;
  focus: string;
  exercises: Exercise[];
  warmup: string[];
  cooldown: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  level: string;
  daysPerWeek: number;
  days: WorkoutDay[];
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: "bulk" | "cut" | "maintain";
  level: "beginner" | "intermediate";
  equipment: string[];
  workoutMinutes: number;
}

export interface WorkoutLog {
  date: string;
  dayId: string;
  completedExercises: string[];
  totalMinutes: number;
  caloriesBurned: number;
  waterMl: number;
  notes: string;
}

const exerciseDB: Record<string, Exercise[]> = {
  chest: [
    { id: "bp", name: "Bench Press", sets: 4, reps: "8-10", muscleGroup: "Chest", restSeconds: 90, equipment: "gym", isPremium: false, caloriesPerSet: 8 },
    { id: "ip", name: "Incline Dumbbell Press", sets: 3, reps: "10-12", muscleGroup: "Chest", restSeconds: 75, equipment: "dumbbells", isPremium: false, caloriesPerSet: 7 },
    { id: "cf", name: "Cable Flyes", sets: 3, reps: "12-15", muscleGroup: "Chest", restSeconds: 60, equipment: "gym", isPremium: true, caloriesPerSet: 5 },
    { id: "pu", name: "Push-Ups", sets: 3, reps: "15-20", muscleGroup: "Chest", restSeconds: 60, equipment: "none", isPremium: false, caloriesPerSet: 5 },
    { id: "rbf", name: "Resistance Band Flyes", sets: 3, reps: "12-15", muscleGroup: "Chest", restSeconds: 60, equipment: "resistance bands", isPremium: false, caloriesPerSet: 4 },
  ],
  back: [
    { id: "br", name: "Barbell Rows", sets: 4, reps: "8-10", muscleGroup: "Back", restSeconds: 90, equipment: "gym", isPremium: false, caloriesPerSet: 9 },
    { id: "lp", name: "Lat Pulldowns", sets: 3, reps: "10-12", muscleGroup: "Back", restSeconds: 75, equipment: "gym", isPremium: false, caloriesPerSet: 7 },
    { id: "dr", name: "Dumbbell Rows", sets: 3, reps: "10-12", muscleGroup: "Back", restSeconds: 75, equipment: "dumbbells", isPremium: false, caloriesPerSet: 7 },
    { id: "sr", name: "Seated Cable Rows", sets: 3, reps: "12-15", muscleGroup: "Back", restSeconds: 60, equipment: "gym", isPremium: true, caloriesPerSet: 6 },
    { id: "rbr", name: "Resistance Band Rows", sets: 3, reps: "12-15", muscleGroup: "Back", restSeconds: 60, equipment: "resistance bands", isPremium: false, caloriesPerSet: 5 },
  ],
  shoulders: [
    { id: "ohp", name: "Overhead Press", sets: 4, reps: "8-10", muscleGroup: "Shoulders", restSeconds: 90, equipment: "gym", isPremium: false, caloriesPerSet: 7 },
    { id: "lr", name: "Lateral Raises", sets: 3, reps: "12-15", muscleGroup: "Shoulders", restSeconds: 60, equipment: "dumbbells", isPremium: false, caloriesPerSet: 4 },
    { id: "fp", name: "Face Pulls", sets: 3, reps: "15-20", muscleGroup: "Shoulders", restSeconds: 60, equipment: "gym", isPremium: true, caloriesPerSet: 4 },
    { id: "rblr", name: "Band Lateral Raises", sets: 3, reps: "15-20", muscleGroup: "Shoulders", restSeconds: 60, equipment: "resistance bands", isPremium: false, caloriesPerSet: 3 },
  ],
  legs: [
    { id: "sq", name: "Squats", sets: 4, reps: "8-10", muscleGroup: "Legs", restSeconds: 120, equipment: "gym", isPremium: false, caloriesPerSet: 12 },
    { id: "rdl", name: "Romanian Deadlifts", sets: 3, reps: "10-12", muscleGroup: "Legs", restSeconds: 90, equipment: "gym", isPremium: false, caloriesPerSet: 10 },
    { id: "lp2", name: "Leg Press", sets: 3, reps: "10-12", muscleGroup: "Legs", restSeconds: 90, equipment: "gym", isPremium: true, caloriesPerSet: 10 },
    { id: "gl", name: "Goblet Squats", sets: 3, reps: "12-15", muscleGroup: "Legs", restSeconds: 75, equipment: "dumbbells", isPremium: false, caloriesPerSet: 8 },
    { id: "lu", name: "Lunges", sets: 3, reps: "12 each", muscleGroup: "Legs", restSeconds: 60, equipment: "none", isPremium: false, caloriesPerSet: 7 },
    { id: "bsq", name: "Band Squats", sets: 3, reps: "15-20", muscleGroup: "Legs", restSeconds: 60, equipment: "resistance bands", isPremium: false, caloriesPerSet: 6 },
  ],
  arms: [
    { id: "bc", name: "Barbell Curls", sets: 3, reps: "10-12", muscleGroup: "Biceps", restSeconds: 60, equipment: "gym", isPremium: false, caloriesPerSet: 5 },
    { id: "td", name: "Tricep Dips", sets: 3, reps: "10-12", muscleGroup: "Triceps", restSeconds: 60, equipment: "gym", isPremium: false, caloriesPerSet: 6 },
    { id: "hc", name: "Hammer Curls", sets: 3, reps: "10-12", muscleGroup: "Biceps", restSeconds: 60, equipment: "dumbbells", isPremium: false, caloriesPerSet: 5 },
    { id: "oe", name: "Overhead Tricep Extension", sets: 3, reps: "12-15", muscleGroup: "Triceps", restSeconds: 60, equipment: "dumbbells", isPremium: false, caloriesPerSet: 5 },
    { id: "rbc", name: "Band Curls", sets: 3, reps: "15-20", muscleGroup: "Biceps", restSeconds: 60, equipment: "resistance bands", isPremium: false, caloriesPerSet: 3 },
  ],
  core: [
    { id: "pl", name: "Plank", sets: 3, reps: "45-60s", muscleGroup: "Core", restSeconds: 45, equipment: "none", isPremium: false, caloriesPerSet: 4 },
    { id: "cr", name: "Crunches", sets: 3, reps: "20", muscleGroup: "Core", restSeconds: 45, equipment: "none", isPremium: false, caloriesPerSet: 3 },
    { id: "lrs", name: "Leg Raises", sets: 3, reps: "15", muscleGroup: "Core", restSeconds: 45, equipment: "none", isPremium: false, caloriesPerSet: 4 },
    { id: "rw", name: "Russian Twists", sets: 3, reps: "20", muscleGroup: "Core", restSeconds: 45, equipment: "none", isPremium: false, caloriesPerSet: 4 },
  ],
};

export function getAllExercises(): Exercise[] {
  return Object.values(exerciseDB).flat();
}

export function getExercisesByMuscle(muscleGroup: string): Exercise[] {
  return exerciseDB[muscleGroup.toLowerCase()] || [];
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const { goal, level, equipment, workoutMinutes } = profile;
  const availableEquip = new Set([...equipment, "none"]);

  const filterByEquipment = (exercises: Exercise[]) =>
    exercises.filter((e) => availableEquip.has(e.equipment));

  const pickExercises = (groups: string[], count: number): Exercise[] => {
    const pool = groups.flatMap((g) => filterByEquipment(exerciseDB[g] || []));
    return pool.slice(0, count);
  };

  const exerciseCount = workoutMinutes <= 30 ? 4 : workoutMinutes <= 45 ? 5 : workoutMinutes <= 60 ? 6 : 7;

  const warmup = ["5 min light cardio", "Dynamic stretching", "Arm circles & leg swings"];
  const cooldown = ["5 min walking", "Static stretching", "Deep breathing"];

  let days: WorkoutDay[];

  if (goal === "bulk") {
    days = [
      { id: "d1", day: "Monday", focus: "Chest & Triceps", exercises: pickExercises(["chest", "arms"], exerciseCount), warmup, cooldown },
      { id: "d2", day: "Wednesday", focus: "Back & Biceps", exercises: pickExercises(["back", "arms"], exerciseCount), warmup, cooldown },
      { id: "d3", day: "Friday", focus: "Legs & Shoulders", exercises: pickExercises(["legs", "shoulders"], exerciseCount), warmup, cooldown },
      { id: "d4", day: "Saturday", focus: "Arms & Core", exercises: pickExercises(["arms", "core"], exerciseCount), warmup, cooldown },
    ];
  } else if (goal === "cut") {
    days = [
      { id: "d1", day: "Monday", focus: "Full Body A", exercises: pickExercises(["chest", "back", "legs", "core"], exerciseCount), warmup, cooldown },
      { id: "d2", day: "Wednesday", focus: "Full Body B", exercises: pickExercises(["shoulders", "arms", "legs", "core"], exerciseCount), warmup, cooldown },
      { id: "d3", day: "Friday", focus: "Full Body C", exercises: pickExercises(["chest", "back", "shoulders", "core"], exerciseCount), warmup, cooldown },
    ];
  } else {
    days = [
      { id: "d1", day: "Monday", focus: "Upper Body", exercises: pickExercises(["chest", "back", "shoulders"], exerciseCount), warmup, cooldown },
      { id: "d2", day: "Wednesday", focus: "Lower Body", exercises: pickExercises(["legs", "core"], exerciseCount), warmup, cooldown },
      { id: "d3", day: "Friday", focus: "Full Body", exercises: pickExercises(["chest", "back", "legs", "arms"], exerciseCount), warmup, cooldown },
    ];
  }

  if (level === "beginner") {
    days.forEach((d) => {
      d.exercises = d.exercises.map((e) => ({
        ...e,
        sets: Math.max(2, e.sets - 1),
        restSeconds: e.restSeconds + 15,
      }));
    });
  }

  return {
    id: crypto.randomUUID(),
    name: `${goal.charAt(0).toUpperCase() + goal.slice(1)} Plan`,
    goal,
    level,
    daysPerWeek: days.length,
    days,
  };
}
