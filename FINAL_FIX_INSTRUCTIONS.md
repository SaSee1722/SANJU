# Final Fix: Push Notifications

I have implemented the backend logic to **SEND** the push notifications and updated the mobile configuration to **RECEIVE** them.

## 1. The Core Issue

You had the "Inbox" (notifications table) and the "Receiver" (App), but you were missing the **Sender**. When a Staff submitted a request, the database updated, but nothing triggered Google/Apple to wake up the PC's phone.

## 2. Changes Made

1. **Backend Sender**: Created a Supabase Edge Function (`supabase/functions/push`) that:
    * Listens for new notifications in the database.
    * Finds the user's FCM token.
    * Sends a real push notification via Firebase.
2. **Android Config**: Updated `capacitor.config.ts` to properly handle push presentation (sound/alert).
3. **iOS Config**: Updated `Info.plist` to enable "Remote Notifications" background mode (Critical for iOS).

## 3. Action Required (You MUST do this)

### Step A: Deploy the Backend Function

This is the most critical step. Without this, no notifications will be sent.
Follow the guide in: **`docs/DEPLOY_PUSH_FUNCTION.md`**

1. Get your `service-account.json` from Firebase Console.
2. Run the `supabase secrets set ...` command.
3. Run `supabase functions deploy push ...`.
4. Set up the **Database Webhook** in the [Supabase Dashboard](https://supabase.com/dashboard).

### Step B: Rebuild the Mobile App

Since we changed `capacitor.config.ts` and `Info.plist`, you need to sync and rebuild.

```bash
# 1. Sync changes
npx cap sync

# 2. Run on Android
npx cap open android
# (Then run the app on your device/emulator)

# 3. Run on iOS (Mac only)
npx cap open ios
```

## 4. Verification

1. **Staff**: Submit a Leave Request.
2. **Supabase**: Check the `Edge Function Logs` in the dashboard to key "Successfully sent message".
3. **PC**: Should receive a notification "New Leave Request".
