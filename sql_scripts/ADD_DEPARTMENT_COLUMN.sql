-- =================================================================
-- ADD DEPARTMENT SUPPORT
-- Run this in Supabase SQL Editor
-- =================================================================

-- 1. Add department column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS department TEXT;

-- 2. Add department column to leave_requests
ALTER TABLE leave_requests
ADD COLUMN IF NOT EXISTS department TEXT;

-- 3. Update existing statuses or data if needed (optional)
-- For now, default 'department' to 'stream' if null to avoid breakage?
-- Or update logic to fallback.

-- 4. Enable filtering by department policies (optional, usually logic handles it)
-- We will handle filtering in the application logic mostly, but RLS can be stricter.

UPDATE profiles 
SET department = stream 
WHERE department IS NULL;

UPDATE leave_requests 
SET department = stream 
WHERE department IS NULL;
