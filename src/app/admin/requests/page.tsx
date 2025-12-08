"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
    LogOut, Filter, CheckCircle, XCircle,
    Calendar, User, ArrowLeft, Search, SlidersHorizontal
} from "lucide-react";

type Stream = "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL";
type LeaveStatus = "pending_pc" | "pending_admin" | "approved" | "declined";

type LeaveRequest = {
    id: string;
    student_name: string;
    student_class: string;
    reg_no?: string;
    cgpa?: number;
    attendance_percentage?: number;
    from_date: string;
    to_date: string;
    reason: string | null;
    attachment_url?: string | null;
    status: LeaveStatus;
    created_at: string;
    stream: Stream;
    requested_by: string;
    profiles: {
        full_name: string;
    };
};

const getStreamGradient = (stream: Stream) => {
    const gradients = {
        CSE: "from-blue-500 to-blue-700",
        ECE: "from-purple-500 to-purple-700",
        EEE: "from-amber-500 to-amber-700",
        MECH: "from-red-500 to-red-700",
        CIVIL: "from-emerald-500 to-emerald-700",
    };
    return gradients[stream] || "from-gray-500 to-gray-700";
};

const StatusPill = ({ status }: { status: LeaveStatus }) => {
    const styles = {
        pending_pc: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Pending PC" },
        pending_admin: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Pending Admin" },
        approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Approved" },
        declined: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Declined" },
    };
    const style = styles[status] || styles.pending_pc;
    return (
        <div className={`px-2.5 py-1 rounded-full border ${style.bg} ${style.border} flex items-center gap-1.5`}>
            <div className={`w-1.5 h-1.5 rounded-full ${style.text.replace('text-', 'bg-')}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wide ${style.text}`}>{style.label}</span>
        </div>
    );
};

export default function AdminRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStream, setFilterStream] = useState<Stream | "ALL">("ALL");
    const [filterStatus, setFilterStatus] = useState<LeaveStatus | "ALL">("ALL");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        let query = supabase.from("leave_requests").select(`*, profiles:requested_by (full_name)`).order("created_at", { ascending: false });
        if (filterStream !== "ALL") query = query.eq("stream", filterStream);
        if (filterStatus !== "ALL") query = query.eq("status", filterStatus);

        const { data: rows, error: err } = await query;
        if (err) console.error("Error fetching requests:", err);
        else setRequests((rows as any) ?? []);

        setLoading(false);
    }, [filterStream, filterStatus]);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace("/login"); return; }
            const { data: profiles } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
            const profile = profiles?.[0];
            if (!profile || profile.role !== "admin") { router.replace("/login"); return; }
            fetchRequests();
        };
        checkAdmin();
    }, [router, fetchRequests]);

    // Realtime Subscription
    useEffect(() => {
        const channel = supabase
            .channel('admin-requests-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'leave_requests'
                },
                (payload) => {
                    console.log("Realtime update received:", payload);
                    fetchRequests();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchRequests]);

    const updateStatus = async (id: string, newStatus: "approved" | "declined") => {
        if (!confirm(`${newStatus === 'approved' ? 'Approve' : 'Decline'} this request?`)) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error: err } = await supabase.from("leave_requests").update({
            status: newStatus, reviewed_by: user.id, reviewed_at: new Date().toISOString(),
            ...(newStatus === "declined" && { declined_by: user.id })
        }).eq("id", id);

        if (err) setError(err.message);
        else {
            setSuccess(`Request ${newStatus}`);
            setTimeout(() => setSuccess(null), 3000);
            fetchRequests();
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#0f172a] p-4 pb-24 relative overflow-x-hidden font-sans text-neutral-100">
            <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <header className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin')}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-neutral-400" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">Leave Requests</h1>
                            <p className="text-xs text-neutral-400">Review & Manage</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative group">
                            <select
                                value={filterStream}
                                onChange={e => setFilterStream(e.target.value as any)}
                                className="appearance-none bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-4 py-2 pr-8 text-xs font-medium text-white focus:outline-none transition-all cursor-pointer"
                            >
                                <option value="ALL" className="bg-neutral-900">All Depts</option>
                                <option value="CSE" className="bg-neutral-900">CSE</option>
                                <option value="ECE" className="bg-neutral-900">ECE</option>
                                <option value="EEE" className="bg-neutral-900">EEE</option>
                                <option value="MECH" className="bg-neutral-900">MECH</option>
                                <option value="CIVIL" className="bg-neutral-900">CIVIL</option>
                            </select>
                            <Filter className="absolute right-3 top-2.5 w-3 h-3 text-neutral-500 pointer-events-none" />
                        </div>
                        <div className="relative group">
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value as any)}
                                className="appearance-none bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-4 py-2 pr-8 text-xs font-medium text-white focus:outline-none transition-all cursor-pointer"
                            >
                                <option value="ALL" className="bg-neutral-900">All Status</option>
                                <option value="pending_admin" className="bg-neutral-900">Pending Admin</option>
                                <option value="pending_pc" className="bg-neutral-900">Pending PC</option>
                                <option value="approved" className="bg-neutral-900">Approved</option>
                                <option value="declined" className="bg-neutral-900">Declined</option>
                            </select>
                            <SlidersHorizontal className="absolute right-3 top-2.5 w-3 h-3 text-neutral-500 pointer-events-none" />
                        </div>
                    </div>
                </header>

                {/* Messages */}
                {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
                {success && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">{success}</div>}

                {/* Requests Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {requests.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-neutral-500">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No requests found matching filters</p>
                        </div>
                    ) : (
                        requests.map(req => (
                            <div key={req.id} className="relative glass p-5 rounded-[20px] group hover:bg-white/10 transition-all flex flex-col h-full overflow-hidden">
                                {/* Stream Stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getStreamGradient(req.stream)}`} />

                                <div className="flex justify-between items-start mb-4 pl-2">
                                    <div>
                                        <h3 className="font-bold text-white text-base">{req.student_name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white bg-gradient-to-r ${getStreamGradient(req.stream)}`}>{req.stream}</span>
                                            <span className="text-xs text-neutral-400">{req.student_class}</span>
                                        </div>
                                    </div>
                                    <StatusPill status={req.status} />
                                </div>

                                <div className="pl-2 space-y-3 mb-4 flex-1">
                                    <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
                                        <div className="text-neutral-400">CGPA: <span className="text-white font-medium">{req.cgpa || 'N/A'}</span></div>
                                        <div className="text-neutral-400">Att: <span className="text-white font-medium">{req.attendance_percentage}%</span></div>
                                    </div>

                                    <div className="text-xs text-neutral-400">
                                        Date: <span className="text-white">{req.from_date}</span> → <span className="text-white">{req.to_date}</span>
                                    </div>

                                    {req.reason && (
                                        <p className="text-xs text-neutral-300 italic">"{req.reason}"</p>
                                    )}

                                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-neutral-500">By: {req.profiles?.full_name}</span>
                                        {req.attachment_url && (
                                            <a href={req.attachment_url} target="_blank" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                                                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                                <span>Attachment</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {req.status === 'pending_admin' && (
                                    <div className="pl-2 flex gap-2 pt-2 mt-auto">
                                        <button onClick={() => updateStatus(req.id, 'approved')} className="flex-1 bg-emerald-500/10 text-emerald-400 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => updateStatus(req.id, 'declined')} className="flex-1 bg-red-500/10 text-red-400 py-2.5 rounded-lg text-xs font-bold hover:bg-red-500/20 border border-red-500/20 transition-colors">
                                            Decline
                                        </button>
                                    </div>
                                )}
                                {req.status === 'pending_pc' && (
                                    <div className="pl-2 mt-auto text-center py-2 bg-amber-500/5 rounded-lg border border-amber-500/10">
                                        <p className="text-[10px] text-amber-500 font-medium">Waiting for PC Review</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
