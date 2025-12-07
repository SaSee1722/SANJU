# Mobile Push Notifications Setup Guide

To enable **real push notifications** on Android and iOS (appearing in the status bar/lock screen), you must connect your app to **Firebase Cloud Messaging (FCM)**.

I have already added the code to:

1. **Request Permissions** when the app starts.
2. **Register the device** with Apple/Google.
3. **Save the Token** to your Supabase `profiles` table.

## Missing Step: Firebase Configuration

You must provide the credentials for your app to talk to Google's servers.

### 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Create a new project (e.g., "LeaveX").
3. Add an **Android App**:
    * Package Name: `com.leaveapp.web` (Check `capacitor.config.ts`)
    * Download `google-services.json`.
    * **Place it in:** `android/app/google-services.json`.
4. Add an **iOS App**:
    * Bundle ID: `com.leaveapp.web`
    * Download `GoogleService-Info.plist`.
    * **Place it in:** `ios/App/App/GoogleService-Info.plist` (Use Xcode to drag-and-drop it for best results).

### 2. Update Android Manifest (Optional but Recommended)

I have set up the code, but Capacitor sometimes needs specific variables in `variables.gradle`.
Usually, adding the `google-services.json` is the most critical step for Android.

### 3. Backend Trigger (Supabase)

Currently, your app saves the token. To **SEND** the message, you need a backend function.
Since Supabase runs on PostgreSQL, you can use **Database Webhooks** or an **Edge Function**.

**Recommended Approach:**
Create a Supabase Edge Function (`send-push`) that listens to `INSERT` on the `notifications` table (which I created earlier).
When a row is added, the Edge Function reads the user's `fcm_token` and calls the Firebase API to send the notification.

**Why I can't do this part:**
It requires your Firebase **Private Key** (JSON) which I cannot generate. You must set this up in the Supabase Dashboard > Edge Functions.

## Summary

1. **Add `google-services.json`** to `android/app/`.
2. **Add `GoogleService-Info.plist`** to `ios/App/App/`.
3. Build the app (`npx cap sync`, then `npx cap open android`).
4. Run SQL script `sql_scripts/ADD_FCM_TOKEN.sql` in Supabase.
