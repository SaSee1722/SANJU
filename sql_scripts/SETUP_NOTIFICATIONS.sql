-- =================================================================
-- SETUP NOTIFICATIONS SYSTEM
-- Run this in Supabase SQL Editor
-- =================================================================

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 3. Trigger Function for Notifications
CREATE OR REPLACE FUNCTION public.notify_on_leave_change()
RETURNS TRIGGER AS $$
DECLARE
  pc_rec RECORD;
  admin_rec RECORD;
  student_name TEXT;
BEGIN
  student_name := NEW.student_name;

  -- CASE 1: Staff submits request (pending_pc) -> Notify PCs
  IF (TG_OP = 'INSERT' AND NEW.status = 'pending_pc') THEN
    FOR pc_rec IN 
      SELECT id FROM profiles WHERE role = 'pc' AND stream = NEW.stream
    LOOP
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (pc_rec.id, 'New Leave Request', 'New request from ' || student_name, '/pc');
    END LOOP;
  END IF;

  -- CASE 2: PC Approves (pending_admin) -> Notify Admins
  IF (TG_OP = 'UPDATE' AND OLD.status = 'pending_pc' AND NEW.status = 'pending_admin') THEN
    FOR admin_rec IN 
      SELECT id FROM profiles WHERE role = 'admin' AND stream = NEW.stream
    LOOP
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (admin_rec.id, 'PC Approved Request', 'Request for ' || student_name || ' requires final approval.', '/admin/requests');
    END LOOP;
  END IF;

  -- CASE 3: Admin Approves/Declines -> Notify Staff (Requester)
  IF (TG_OP = 'UPDATE' AND (NEW.status = 'approved' OR NEW.status = 'declined')) THEN
    INSERT INTO notifications (user_id, title, message, link)
    VALUES (NEW.requested_by, 'Request ' || UPPER(NEW.status), 'Your request for ' || student_name || ' was ' || NEW.status, '/staff');

    -- Also Notify PC who reviewed it (if any)
    IF (NEW.pc_reviewed_by IS NOT NULL) THEN
       INSERT INTO notifications (user_id, title, message, link)
       VALUES (NEW.pc_reviewed_by, 'Admin Decision', 'The request for ' || student_name || ' was ' || NEW.status, '/pc');
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach Trigger
DROP TRIGGER IF EXISTS tr_notify_leave ON leave_requests;

CREATE TRIGGER tr_notify_leave
  AFTER INSERT OR UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_leave_change();
