# Deploying the Push Notification Function

To send real push notifications, we need to deploy the backend function I just created.

## Prerequisites

1. **Supabase CLI** installed (`brew install supabase/tap/supabase` on Mac).
2. **Firebase Service Account Key**:
    * Go to Firebase Console > Project Settings > Service Accounts.
    * Click **Generate Private Key**.
    * Open the JSON file and copy its ENTIRE content.
3. **Supabase Access Token**: You need to be logged in (`supabase login`).

## Deployment Steps

1. **Login to Supabase CLI**:

    ```bash
    supabase login
    ```

2. **Generate Types** (Optional but good practice):

    ```bash
    supabase gen types typescript --project-id "your-project-id" > src/lib/database.types.ts
    ```

3. **Set the Secret**:
    Run this command in your terminal. Replace `[PASTE_JSON_HERE]` with the content of your `service-account.json`.
    *IMPORTANT: Keep the single quotes!*

    ```bash
    supabase secrets set --project-ref "your-project-ref" FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'
    ```

    *(You can find your Project Reference ID in Supabase Dashboard > Settings > General)*

4. **Deploy the Function**:

    ```bash
    supabase functions deploy push --project-ref "your-project-ref" --no-verify-jwt
    ```

    *Note: We use `--no-verify-jwt` because we will trigger this from a Database Webhook.*

## Connecting the Database (Webhook)

Once deployed, you need to tell Supabase to run this function whenever a notification is created.

1. Go to **Supabase Dashboard** > **Database** > **Webhooks**.
2. Click **Create a new webhook**.
3. **Name**: `send-push-notification`.
4. **Table**: `notifications`.
5. **Events**: Select `INSERT`.
6. **Type**: `HTTP Request`.
7. **HTTP Method**: `POST`.
8. **URL**: URL of your deployed function (e.g., `https://[project-ref].supabase.co/functions/v1/push`).
9. **Headers**:
    * `Authorization`: `Bearer [YOUR_ANON_KEY]` (Find in Project Settings > API).
    * `Content-Type`: `application/json`.
10. Click **Confirm**.

## Testing

1. Log in as Staff.
2. Submit a request.
3. The PC (if logged in on a real device with the app) should receive a notification.
    * *Check the Edge Function Logs in Supabase Dashboard to see if it fired.*
