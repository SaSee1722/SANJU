"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Capacitor } from "@capacitor/core";
import StudentMobile from "@/components/dashboard/StudentMobile";
import StudentWeb from "@/components/dashboard/StudentWeb";

type LeaveRequest = {
    id: string;
    leave_type: string;
    student_name: string;
    from_date: string;
    to_date: string;
    reason: string;
    status: string;
    created_at: string;
};

export default function StudentDashboard() {
    const router = useRouter();
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [profile, setProfile] = useState<any>({ full_name: "Student" });
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(true); // Default to mobile for safety

    const [userId, setUserId] = useState<string | null>(null);

    const fetchData = async (uid: string) => {
        const { data } = await supabase.from("leave_requests")
            .select("*")
            .eq("requested_by", uid)
            .order("created_at", { ascending: false });
        if (data) setRequests(data as any);
    };

    useEffect(() => {
        // 1. Check Platform/View
        const checkView = () => {
            const isNative = Capacitor.isNativePlatform();
            const isSmallScreen = window.innerWidth < 1024; // < 1024px is usually tablet/mobile
            setIsMobileView(isNative || isSmallScreen);
        };

        checkView();
        window.addEventListener('resize', checkView);

        // 2. Load Data
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace("/login"); return; }

            setUserId(user.id);

            const { data: profiles } = await supabase.from("profiles").select("*").eq("id", user.id).limit(1);
            const profileData = profiles?.[0];
            setProfile(profileData || { full_name: "Student" });

            await fetchData(user.id);
            setLoading(false);
        };
        load();

        return () => window.removeEventListener('resize', checkView);
    }, [router]);

    // Realtime Subscription
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('student-dashboard-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'leave_requests',
                    filter: `requested_by=eq.${userId}`
                },
                (payload) => {
                    console.log("Realtime update received:", payload);
                    fetchData(userId);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status.includes('pending')).length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'declined').length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1014] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#7B61FF] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Render appropriate view
    if (isMobileView) {
        return <StudentMobile profile={profile} requests={requests} stats={stats} />;
    } else {
        return <StudentWeb profile={profile} requests={requests} stats={stats} />;
    }
}
