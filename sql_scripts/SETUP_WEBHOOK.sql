-- =================================================================
-- SETUP DATABASE WEBHOOK FOR PUSH NOTIFICATIONS
-- Run this AFTER deploying the Edge Function if you prefer SQL setup
-- =================================================================

-- 1. Create the hook
create trigger "send_push_notification"
after insert
on "public"."notifications"
for each row
execute function "supabase_functions"."http_request"(
  'https://[YOUR_PROJECT_REF].supabase.co/functions/v1/push',
  'POST',
  '{"Content-type":"application/json", "Authorization":"Bearer [YOUR_ANON_KEY]"}',
  '{}',
  '10000'
);

-- NOTE: Managing webhooks via SQL can be complex (requires pg_net). 
-- It is strongly recommended to use the Supabase Dashboard UI for Webhooks as described in DEPLOY_PUSH_FUNCTION.md
