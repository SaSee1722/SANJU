#!/bin/bash

# 0. Ensure you are logged in
echo "Checking Supabase login status..."
supabase projects list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ You are not logged in. Please run 'supabase login' first, then run this script again."
    exit 1
fi

echo "✅ Logged in!"

# 1. Set the Firebase Secret
echo "Setting Firebase Secret..."
YOUR_FIREBASE_SERVICE_ACCOUNT_JSON_HERE

# 2. Deploy the Function
echo "Deploying Push Function..."
supabase functions deploy push --project-ref rnarahkyfkdfsqixcuiq --no-verify-jwt

echo "✅ Done! Your function is deployed."
echo "👉 Now go to Supabase Dashboard > Database > Webhooks and create the webhook pointing to the URL above."
