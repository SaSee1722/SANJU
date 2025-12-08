-- =================================================================
-- SETUP STUDENT PROFILE SUPPORT
-- Run this in Supabase SQL Editor
-- =================================================================

-- 1. Update Profiles Table to support 'student' role
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'staff', 'pc', 'admin'));

-- 2. Add Student-Specific Columns to Profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS reg_no TEXT,
ADD COLUMN IF NOT EXISTS student_class TEXT, -- e.g. "III-A"
ADD COLUMN IF NOT EXISTS year INTEGER,       -- e.g. 3
ADD COLUMN IF NOT EXISTS cgpa NUMERIC(4,2),
ADD COLUMN IF NOT EXISTS attendance_percentage NUMERIC(5,2);

-- 3. Update the handle_new_user function to support 'student' default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, stream)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'), -- Default to student if undefined
    COALESCE(NEW.raw_user_meta_data->>'stream', 'CSE')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    stream = EXCLUDED.stream,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update RLS Policies to allow Students to view their own profile and update it
CREATE POLICY "Students can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Force update existing RLS on 'view own' just in case
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);
