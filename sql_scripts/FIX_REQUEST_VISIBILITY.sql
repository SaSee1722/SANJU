-- ===============================================
-- COMPLETE FIX FOR LEAVE REQUEST VISIBILITY
-- Run this ENTIRE script in Supabase SQL Editor
-- ===============================================

-- Step 1: Check current data
SELECT 'PROFILES:' as table_name;
SELECT id, email, full_name, role, stream, department FROM profiles;

SELECT 'LEAVE REQUESTS:' as table_name;
SELECT id, student_name, stream, department, status, requested_by FROM leave_requests;

-- Step 2: Update leave_requests to have correct stream from requester's profile
UPDATE leave_requests lr
SET stream = (
  SELECT p.stream 
  FROM profiles p 
  WHERE p.id = lr.requested_by
)
WHERE EXISTS (SELECT 1 FROM profiles p WHERE p.id = lr.requested_by);

-- Step 3: Ensure all profiles have a stream (default to CSE)
UPDATE profiles 
SET stream = 'CSE' 
WHERE stream IS NULL OR stream = '';

-- Step 4: Ensure leave_requests have stream set
UPDATE leave_requests 
SET stream = 'CSE' 
WHERE stream IS NULL OR stream = '';

-- Step 5: Also set department from profile if missing
UPDATE leave_requests lr
SET department = (
  SELECT p.department 
  FROM profiles p 
  WHERE p.id = lr.requested_by
)
WHERE lr.department IS NULL 
  AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = lr.requested_by AND p.department IS NOT NULL);

-- Step 6: Verify the data looks correct now
SELECT 'AFTER FIX - PROFILES:' as table_name;
SELECT id, email, full_name, role, stream, department FROM profiles;

SELECT 'AFTER FIX - LEAVE REQUESTS:' as table_name;
SELECT id, student_name, stream, department, status FROM leave_requests;

-- Step 7: Check if PC can see requests
SELECT 'PC SHOULD SEE THESE REQUESTS:' as info;
SELECT 
  lr.id,
  lr.student_name,
  lr.stream,
  lr.status,
  p.full_name as requester
FROM leave_requests lr
LEFT JOIN profiles p ON p.id = lr.requested_by
WHERE lr.status = 'pending_pc' AND lr.stream = 'CSE';
