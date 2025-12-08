"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Filter, Search } from "lucide-react";
import Link from "next/link";

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

// Inner component using useSearchParams
function StudentRequestsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get("filter") || "all";

    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [filter, setFilter] = useState(initialFilter);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace("/login"); return; }

            const { data } = await supabase.from("leave_requests")
                .select("*")
                .eq("requested_by", user.id)
                .order("created_at", { ascending: false });

            if (data) setRequests(data as any);
            setLoading(false);
        };
        load();
    }, [router]);

    const filteredRequests = requests.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'pending') return r.status.includes('pending');
        return r.status === filter;
    });

    const StatusBadge = ({ status }: { status: string }) => {
        let color = "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
        if (status.includes("pending")) color = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        if (status === "approved") color = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        if (status === "declined") color = "bg-red-500/10 text-red-400 border-red-500/20";

        return (
            <span className={`px-2 py-0.5 rounded-full border ${color} text-[10px] font-bold uppercase tracking-wide`}>
                {status.replace("_", " ")}
            </span>
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#0f1014] text-white font-sans pb-24">
            {/* Header */}
            <div className="pt-12 px-6 pb-4 bg-[#0f1014]/50 backdrop-blur-xl sticky top-0 z-10 border-b border-white/5">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/student" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </Link>
                    <h1 className="text-xl font-bold">My Requests</h1>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'pending', 'approved', 'declined'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-[#7B61FF] text-white border-[#7B61FF]' : 'bg-white/5 text-neutral-400 border-white/10'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#7B61FF] border-t-transparent rounded-full animate-spin" /></div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-sm">No requests found</p>
                    </div>
                ) : (
                    filteredRequests.map(req => (
                        <div key={req.id} className="bg-[#1E1E2D] p-5 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white text-sm">{req.leave_type || "Leave Request"}</p>
                                    <p className="text-xs text-neutral-400 mt-0.5">Applied on {new Date(req.created_at).toLocaleDateString()}</p>
                                </div>
                                <StatusBadge status={req.status} />
                            </div>

                            <div className="bg-black/20 p-3 rounded-xl">
                                <p className="text-xs text-neutral-300 line-clamp-2">{req.reason}</p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-neutral-400 bg-white/5 px-3 py-2 rounded-lg w-fit">
                                <span className="font-medium text-white">{new Date(req.from_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                <span>to</span>
                                <span className="font-medium text-white">{new Date(req.to_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Main component wrapping in Suspense
export default function StudentRequests() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-white">Loading...</div>}>
            <StudentRequestsContent />
        </Suspense>
    );
}
