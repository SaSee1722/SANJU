"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type LeaveRequest = {
    id: string;
    leave_type: string;
    from_date: string;
    to_date: string;
    status: string;
};

export default function StudentCalendar() {
    const router = useRouter();
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace("/login"); return; }

            const { data } = await supabase.from("leave_requests")
                .select("id, leave_type, from_date, to_date, status")
                .eq("requested_by", user.id);

            if (data) setRequests(data as any);
            setLoading(false);
        };
        load();
    }, [router]);

    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Generate calendar grid
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null); // Empty slots
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    const getStatusColor = (date: Date) => {
        // Check if this date falls in any request range
        const req = requests.find(r => {
            const start = new Date(r.from_date);
            const end = new Date(r.to_date);
            // Normalize to YYYY-MM-DD for comparison to avoid time issues
            const check = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            return check >= s && check <= e;
        });

        if (!req) return null;
        if (req.status === 'approved') return 'bg-emerald-500 text-white';
        if (req.status === 'declined') return 'bg-red-500 text-white';
        return 'bg-blue-500 text-white'; // Pending
    };

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(year, month + delta, 1));
    };

    return (
        <div className="min-h-screen w-full bg-[#0f1014] text-white font-sans pb-24">
            {/* Header */}
            <div className="pt-12 px-6 pb-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/student" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Leave Calendar</h1>
                </div>

                {/* Calendar Controls */}
                <div className="flex items-center justify-between bg-[#1E1E2D] p-4 rounded-2xl border border-white/5 mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold">{monthYearString}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Grid */}
                <div className="bg-[#1E1E2D] p-4 rounded-2xl border border-white/5">
                    {/* Week Days */}
                    <div className="grid grid-cols-7 mb-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-center text-xs font-bold text-neutral-500 py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((date, i) => {
                            if (!date) return <div key={i} className="aspect-square" />;

                            const statusClass = getStatusColor(date);
                            const isToday = new Date().toDateString() === date.toDateString();

                            return (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                                    ${statusClass ? statusClass : 'bg-white/5 text-neutral-300 hover:bg-white/10'}
                                    ${isToday && !statusClass ? 'border border-[#7B61FF] text-[#7B61FF]' : ''}
                                `}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex gap-4 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs text-neutral-400">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-xs text-neutral-400">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-neutral-400">Rejected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
