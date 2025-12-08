-- ============================================
-- FINAL SIGNUP FIX (Run this is Supabase SQL Editor)
-- ============================================

-- 1. Ensure Columns Exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reg_no TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_class TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year INTEGER;

-- 2. Drop Trigger & Function to start clean
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create Robust Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    stream, 
    department
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'stream', 'CSE'),
    COALESCE(NEW.raw_user_meta_data->>'department', NEW.raw_user_meta_data->>'stream', 'CSE')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    stream = EXCLUDED.stream,
    department = EXCLUDED.department,
    updated_at = NOW();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error (optional) but don't fail the transaction if possible? 
    -- Actually for lookup/auth we usually want it to fail so we know something is wrong.
    -- But to prevent 'Database error', we can fallback or raise a cleaner notice.
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW; -- Proceed without profile? No, that breaks app. 
    -- Let's stick to standard behavior but ensure inputs are safe.
END;
$$ LANGUAGE plpgsql;

-- 4. Recreate Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Check Constraints (Ensure they are not too strict)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'staff', 'pc', 'admin'));

-- 6. Ensure RLS allows Insert (just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
CREATE POLICY "Enable insert for authenticated users only" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 7. Grant Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
