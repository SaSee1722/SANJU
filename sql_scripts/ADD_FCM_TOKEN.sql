-- Add FCM Token column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Update RLS to allow users to update their own token
CREATE POLICY "Users can update own fcm_token" ON profiles
  FOR UPDATE USING (auth.uid() = id);
