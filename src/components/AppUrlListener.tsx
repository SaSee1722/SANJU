"use client";

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useRouter } from 'next/navigation';

export default function AppUrlListener() {
    const router = useRouter();

    useEffect(() => {
        App.addListener('appUrlOpen', (event) => {
            // Handle Deep Link
            // Example: com.leaveapp.web://login-callback#...
            console.log("App opened with URL:", event.url);

            if (event.url.includes('login-callback')) {
                // Verify email confirmed loop
                // User clicks email -> Browser opens -> Redirects to App -> App Opens
                // We send them to Login so they can sign in (or we can parse hash if it's a magic link)
                router.replace('/login');
            }
        });
    }, [router]);

    return null;
}
