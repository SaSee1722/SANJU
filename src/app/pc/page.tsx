"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
    FileText, LogOut, CheckCircle, XCircle,
    Upload, Calendar, User, Trash2,
    Award, ChevronRight, Filter, Bell
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
        pending_pc: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Pending Review" },
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

export default function PCPage() {
    const router = useRouter();
    const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
    const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);

    const [userStream, setUserStream] = useState<Stream | null>(null);
    const [userDept, setUserDept] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    // Form State
    const [studentName, setStudentName] = useState("");

    const [studentClass, setStudentClass] = useState("");
    const [regNo, setRegNo] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [attendance, setAttendance] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    const fetchRequests = async (stream: Stream, uid: string, dept?: string) => {
        // 1. Pending Approvals - Always filter by stream first
        let query = supabase
            .from("leave_requests")
            .select(`*, profiles:requested_by (full_name)`)
            .eq("stream", stream)  // Always filter by stream
            .eq("status", "pending_pc")
            .order("created_at", { ascending: true });

        // If PC has a specific department AND we want department-level filtering,
        // add that filter. For now, just use stream to ensure requests are visible.
        // Uncomment next line to enable strict department filtering:
        // if (dept) query = query.eq("department", dept);

        const { data: pRows, error: pErr } = await query;

        if (pErr) {
            console.error("[PC] Error fetching pending requests:", pErr);
        } else {
            console.log("[PC] Found pending requests:", pRows?.length);
        }

        setPendingRequests((pRows as any) ?? []);

        // 2. My Requests
        const { data: mRows } = await supabase
            .from("leave_requests")
            .select(`*, profiles:requested_by (full_name)`)
            .eq("requested_by", uid)
            .order("created_at", { ascending: false });
        setMyRequests((mRows as any) ?? []);
    };

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace("/login"); return; }

            const { data: profiles } = await supabase.from("profiles").select("role, stream, department, full_name").eq("id", user.id).limit(1);
            const profile = profiles?.[0];

            if (!profile || profile.role !== "pc") {
                if (profile?.role === "admin") router.replace("/admin");
                else if (profile?.role === "staff") router.replace("/staff");
                else if (profile?.role === "student") router.replace("/student");
                else router.replace("/login");
                return;
            }

            setUserStream(profile.stream as Stream);
            setUserDept(profile.department);
            setUserId(user.id);
            setUserName(profile.full_name || user.email?.split('@')[0]);
            await fetchRequests(profile.stream as Stream, user.id, profile.department);
            setLoading(false);
        };
        load();
    }, [router]);

    // Realtime Subscription
    useEffect(() => {
        if (!userStream || !userId) return;

        console.log("Setting up realtime subscription for PC:", userStream);

        const channel = supabase
            .channel('pc-dashboard-changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen for INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'leave_requests',
                    filter: `stream=eq.${userStream}` // Only listen for changes in this stream
                },
                (payload) => {
                    console.log("Realtime update received:", payload);
                    fetchRequests(userStream, userId, userDept || undefined);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userStream, userId, userDept]);


    const handleApprove = async (id: string) => {
        if (!confirm("Approve and forward to Admin?")) return;
        const { error: err } = await supabase.from("leave_requests").update({
            status: "pending_admin", pc_reviewed_by: userId, pc_reviewed_at: new Date().toISOString()
        }).eq("id", id);

        if (err) setError(err.message);
        else {
            setSuccess("Approved & Forwarded");
            await fetchRequests(userStream!, userId);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const handleDecline = async (id: string) => {
        if (!confirm("Decline this request?")) return;
        const { error: err } = await supabase.from("leave_requests").update({
            status: "declined", pc_reviewed_by: userId, pc_reviewed_at: new Date().toISOString()
        }).eq("id", id);

        if (err) setError(err.message);
        else {
            setSuccess("Request Declined");
            await fetchRequests(userStream!, userId);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true); setError(null); setSuccess(null);

        if (!userStream || !userId) return;

        let attachment_url: string | null = null;
        if (file) {
            const path = `${userId}/${Date.now()}_${file.name}`;
            await supabase.storage.from("leave_attachments").upload(path, file);
            const { data } = supabase.storage.from("leave_attachments").getPublicUrl(path);
            attachment_url = data.publicUrl;
        }

        const { error: insErr } = await supabase.from("leave_requests").insert({
            student_name: studentName, student_class: studentClass, reg_no: regNo,
            cgpa: parseFloat(cgpa) || null, attendance_percentage: parseFloat(attendance) || null,
            from_date: fromDate, to_date: toDate, reason, attachment_url,
            status: "pending_admin", requested_by: userId, stream: userStream,
            pc_reviewed_by: userId, pc_reviewed_at: new Date().toISOString()
        });

        if (insErr) setError(insErr.message);
        else {
            setSuccess("Submitted Successfully");
            setStudentName(""); setStudentClass(""); setRegNo(""); setCgpa(""); setAttendance("");
            setFromDate(""); setToDate(""); setReason(""); setFile(null);
            await fetchRequests(userStream, userId);
        }
        setSubmitting(false);
        setTimeout(() => setSuccess(null), 3000);
    };

    const deleteRequest = async (id: string) => {
        if (!confirm("Delete?")) return;
        await supabase.from("leave_requests").delete().eq("id", id);
        await fetchRequests(userStream!, userId);
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

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <header className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow">
                            <User className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Dashboard</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${getStreamGradient(userStream || "CSE")} text-white`}>
                                    {userDept ? `${userDept} PC` : `${userStream} PC`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => { supabase.auth.signOut(); router.replace('/login'); }}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5 text-neutral-400" />
                    </button>
                </header>

                {/* Pending Approvals Area */}
                {pendingRequests.length > 0 && (
                    <div className="glass p-6 rounded-[24px] border-l-4 border-l-primary/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary animate-pulse" />
                                Pending Approvals
                            </h2>
                            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">{pendingRequests.length}</span>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all flex flex-col gap-3 group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-50" />

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white">{req.student_name}</h3>
                                            <p className="text-xs text-neutral-400">{req.student_class} • {req.reg_no}</p>
                                        </div>
                                        <div className="text-[10px] bg-white/5 px-2 py-1 rounded text-neutral-300">
                                            By: {req.profiles?.full_name}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-white/5">
                                        <div className="text-neutral-400">CGPA: <span className="text-white">{req.cgpa}</span></div>
                                        <div className="text-neutral-400">Att: <span className="text-white">{req.attendance_percentage}%</span></div>
                                    </div>

                                    <p className="text-xs text-neutral-300 italic line-clamp-2">"{req.reason}"</p>

                                    <div className="flex gap-2 mt-auto pt-2">
                                        <button onClick={() => handleApprove(req.id)} className="flex-1 bg-emerald-500/10 text-emerald-400 py-2 rounded-lg text-xs font-bold hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => handleDecline(req.id)} className="flex-1 bg-red-500/10 text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-500/20 border border-red-500/20 transition-colors">
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-[1.2fr_1.8fr] gap-6">

                    {/* Form Section */}
                    <div className="glass p-6 rounded-[24px]">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Submit Own Request
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Compact Form Fields similar to Staff page */}
                            <input placeholder="Student Name" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none" required />
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="Reg No" value={regNo} onChange={e => setRegNo(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none" required />
                                <input placeholder="Class" value={studentClass} onChange={e => setStudentClass(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" step="0.01" placeholder="CGPA" value={cgpa} onChange={e => setCgpa(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none" required />
                                <input type="number" step="0.1" placeholder="Att %" value={attendance} onChange={e => setAttendance(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white dark:[color-scheme:dark]" required />
                                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white dark:[color-scheme:dark]" required />
                            </div>
                            <textarea rows={2} placeholder="Reason..." value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none resize-none" />

                            <button disabled={submitting} className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all">
                                {submitting ? "Submitting..." : "Submit to Admin"}
                            </button>
                        </form>
                    </div>

                    {/* My Requests */}
                    <div className="glass p-6 rounded-[24px] min-h-[500px]">
                        <h2 className="text-lg font-bold text-white mb-6">My Recent Submissions</h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                            {myRequests.map(req => (
                                <div key={req.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{req.student_name}</h3>
                                            <p className="text-xs text-neutral-400">{req.student_class}</p>
                                        </div>
                                        <StatusPill status={req.status} />
                                    </div>
                                    <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
                                        <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                        <button onClick={() => deleteRequest(req.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                    </div>
                                </div>
                            ))}
                            {myRequests.length === 0 && <p className="text-center text-neutral-500 py-10">No submissions yet</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
