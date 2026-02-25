
-- Add consistency score to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS consistency_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_workout_date DATE,
  ADD COLUMN IF NOT EXISTS last_water_date DATE,
  ADD COLUMN IF NOT EXISTS total_calories_burned INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_workouts INTEGER NOT NULL DEFAULT 0;
