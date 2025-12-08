# Final Steps: Test the Notification System

Great! You have deployed the backend and configured the webhook. The last piece of the puzzle is updating the actual app on your phone.

## How to Test

### 1. Update the Android App

Since we changed `capacitor.config.ts`, you **must** build a new APK/Run the app again.

1. I have already run `npx cap sync` for you.
2. I have opened Android Studio (or you can open it manually).
3. Click the **Run (Play button)** in Android Studio to install the updated app on your phone/emulator.

### 2. Perform the Test (The "Staff Request" Flow)

You need two devices or two users to test this effectively.

1. **Device A (PC)**:
    * Log in as a **Program Coordinator (PC)**.
    * Close the app (or put it in background). This is important to see the system notification.
    * *Note: Ensure you accepted the "Allow Notifications" permission when you logged in.*

2. **Device B (Staff/Browser)**:
    * Log in as a **Staff Member** (same stream as the PC).
    * Submit a new Leave Request.

### 3. Verification

* **Ideal Result**: Device A (PC) triggers a sound and shows "New Leave Request" in the status bar.
* **Troubleshooting**:
  * If no notification: Go to Supabase Dashboard > database > Webhooks. Check the "History" tab on the webhook you made.
  * If it says `200 OK`, then the signal was sent to Google.
  * If it says `500` or `401`, check the URL and Bearer Token values.

## iOS Note

If you are testing on iOS, you **must** run on a physical device. Simulators do not receive remote push notifications.
