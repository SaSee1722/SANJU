import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import admin from 'firebase-admin'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

console.log("Hello from Push Notification Function!")

serve(async (req) => {
    try {
        const { record } = await req.json()

        // Check if we have a record
        if (!record || !record.user_id) {
            return new Response("No record or user_id", { status: 400 })
        }

        console.log(`Processing notification for user: ${record.user_id}`)

        // 1. Initialize Firebase Admin
        const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')

        if (!serviceAccountStr) {
            console.error("Missing FIREBASE_SERVICE_ACCOUNT secret")
            return new Response("Configuration Error: Missing Service Account", { status: 500 })
        }

        const serviceAccount = JSON.parse(serviceAccountStr)

        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            })
        }

        // 2. Get User's FCM Token from Supabase
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('fcm_token')
            .eq('id', record.user_id)
            .single()

        if (error || !profile) {
            console.error("Profile not found or error:", error)
            return new Response("Profile not found", { status: 404 })
        }

        if (!profile.fcm_token) {
            console.log("User has no FCM Token. Skipping push.")
            return new Response("No FCM Token", { status: 200 })
        }

        // 3. Send Notification
        try {
            const message = {
                token: profile.fcm_token,
                notification: {
                    title: record.title,
                    body: record.message,
                },
                data: {
                    link: record.link || '/',
                    notification_id: record.id
                },
                android: {
                    notification: {
                        sound: 'default',
                        clickAction: 'FCM_PLUGIN_ACTIVITY',
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                }
            }

            const response = await admin.messaging().send(message)
            console.log("Successfully sent message:", response)

            return new Response(JSON.stringify({ success: true, messageId: response }), {
                headers: { "Content-Type": "application/json" }
            })

        } catch (e) {
            console.error("Error sending to FCM:", e)
            return new Response(JSON.stringify({ error: e.message }), { status: 500 })
        }

    } catch (err) {
        console.error("Unexpected error:", err)
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
