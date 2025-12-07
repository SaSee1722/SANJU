"use client";
import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '@/lib/supabaseClient';
import { Capacitor } from '@capacitor/core';

export default function PushInitializer() {
    useEffect(() => {
        // Only run on native platforms (Android/iOS)
        if (!Capacitor.isNativePlatform()) return;

        const registerPush = async () => {
            let permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive === 'prompt') {
                permStatus = await PushNotifications.requestPermissions();
            }

            if (permStatus.receive !== 'granted') {
                console.log('User denied push permissions');
                return;
            }

            await PushNotifications.register();
        };

        registerPush();

        // Listeners
        const setupListeners = async () => {
            await PushNotifications.removeAllListeners();

            await PushNotifications.addListener('registration', async (token) => {
                console.log('Push Registration Token: ', token.value);
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Save token to Supabase profile
                    const { error } = await supabase
                        .from('profiles')
                        .update({ fcm_token: token.value })
                        .eq('id', user.id);

                    if (error) console.error("Failed to save FCM token", error);
                }
            });

            await PushNotifications.addListener('registrationError', (error) => {
                console.error('Error on registration: ', error);
            });

            await PushNotifications.addListener('pushNotificationReceived', (notification) => {
                console.log('Push received: ', notification);
            });

            await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                console.log('Push action performed: ', notification);
                // Can handle navigation here
            });
        };

        setupListeners();

    }, []);

    return null;
}
