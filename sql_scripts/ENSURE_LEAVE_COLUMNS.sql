-- Ensure student_class exists in leave_requests
ALTER TABLE leave_requests
ADD COLUMN IF NOT EXISTS student_class TEXT;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leave_requests';
