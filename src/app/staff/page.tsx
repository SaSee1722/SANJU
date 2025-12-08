"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import {
  FileText, Clock, CheckCircle, XCircle, LogOut,
  Upload, Calendar, User, Search, Trash2,
  BookOpen, Hash, Percent, Award, ChevronRight
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

export default function StaffPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [userStream, setUserStream] = useState<Stream | null>(null);
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

  const fetchRequests = async (stream: Stream) => {
    const { data: rows } = await supabase
      .from("leave_requests")
      .select(`*, profiles:requested_by (full_name)`)
      .eq("stream", stream)
      .order("created_at", { ascending: false });
    setRequests((rows as any) ?? []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("[Staff] No user, redirecting to login");
          router.replace("/login");
          return;
        }

        console.log("[Staff] User found:", user.id);

        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("role, stream, full_name")
          .eq("id", user.id)
          .limit(1);

        if (profileError) {
          console.error("[Staff] Profile fetch error:", profileError);
          setLoading(false);
          return;
        }

        const profile = profiles?.[0];
        console.log("[Staff] Profile:", profile);

        if (!profile || profile.role !== "staff") {
          console.log("[Staff] Not a staff user, role:", profile?.role);
          if (profile?.role === "admin") router.replace("/admin");
          else if (profile?.role === "pc") router.replace("/pc");
          else if (profile?.role === "student") router.replace("/student");
          else router.replace("/login");
          return;
        }

        setUserStream(profile.stream as Stream);
        setUserId(user.id);
        setUserName(profile.full_name || user.email?.split('@')[0] || 'User');
        await fetchRequests(profile.stream as Stream);
        setLoading(false);
      } catch (err) {
        console.error("[Staff] Error in load:", err);
        setLoading(false);
      }
    };
    load();
  }, [router]);

  // Realtime Subscription
  useEffect(() => {
    if (!userStream) return;

    console.log("Setting up realtime subscription for Staff:", userStream);

    const channel = supabase
      .channel('staff-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leave_requests',
          filter: `stream=eq.${userStream}`
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          fetchRequests(userStream);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userStream]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null); setSubmitting(true);

    if (!userStream || !userId) return;

    let attachment_url: string | null = null;
    if (file) {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage.from("leave_attachments").upload(filePath, file);
      if (upErr) { setError(upErr.message); setSubmitting(false); return; }
      const { data } = supabase.storage.from("leave_attachments").getPublicUrl(filePath);
      attachment_url = data.publicUrl;
    }

    const { error: insErr } = await supabase.from("leave_requests").insert({
      student_name: studentName,
      student_class: studentClass,
      reg_no: regNo,
      cgpa: parseFloat(cgpa) || null,
      attendance_percentage: parseFloat(attendance) || null,
      from_date: fromDate,
      to_date: toDate,
      reason,
      attachment_url,
      status: "pending_pc",
      requested_by: userId,
      stream: userStream,
    });

    if (insErr) { setError(insErr.message); setSubmitting(false); return; }

    await fetchRequests(userStream);
    setStudentName(""); setStudentClass(""); setRegNo(""); setCgpa(""); setAttendance("");
    setFromDate(""); setToDate(""); setReason(""); setFile(null);
    setSuccess("Request Submitted Successfully");
    setSubmitting(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    await supabase.from("leave_requests").delete().eq("id", id);
    if (userStream) await fetchRequests(userStream);
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status.includes('pending')).length, // Group pending
    approved: requests.filter(r => r.status === "approved").length,
    declined: requests.filter(r => r.status === "declined").length,
  };

  const myRequests = requests.filter(r => r.requested_by === userId);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#0f172a] p-4 pb-24 relative overflow-x-hidden font-sans text-neutral-100">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <header className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow">
              <User className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hello, {userName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${getStreamGradient(userStream || "CSE")} text-white`}>
                  {userStream} ADVISOR
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Requests', val: stats.total, color: 'text-white' },
            { label: 'Pending', val: stats.pending, color: 'text-amber-400' },
            { label: 'Approved', val: stats.approved, color: 'text-emerald-400' },
            { label: 'Declined', val: stats.declined, color: 'text-red-400' }
          ].map((s, i) => (
            <div key={i} className="glass p-4 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors">
              <span className={`text-2xl font-bold ${s.color}`}>{s.val}</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Action Area */}
        <div className="grid lg:grid-cols-[1.2fr_1.8fr] gap-6">

          {/* Form Section */}
          <div className="glass p-6 rounded-[24px]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              New Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Info */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400 ml-1">Student Details</label>
                  <input
                    placeholder="Student Name"
                    value={studentName} onChange={e => setStudentName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Reg No."
                    value={regNo} onChange={e => setRegNo(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
                    required
                  />
                  <input
                    placeholder="Class (e.g. III-A)"
                    value={studentClass} onChange={e => setStudentClass(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Award className="hidden" /> {/* Just to keep lucide import used */}
                    <input
                      type="number" step="0.01" placeholder="CGPA"
                      value={cgpa} onChange={e => setCgpa(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number" step="0.1" placeholder="Attendance %"
                      value={attendance} onChange={e => setAttendance(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 ml-1">From</label>
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white dark:[color-scheme:dark]" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 ml-1">To</label>
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white dark:[color-scheme:dark]" required />
                </div>
              </div>

              <textarea
                rows={2} placeholder="Reason for leave..."
                value={reason} onChange={e => setReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none resize-none"
              />

              {/* File Upload Styles */}
              <div className="relative">
                <input type="file" id="file_upload" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                <label htmlFor="file_upload" className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-white/20 rounded-xl text-neutral-400 text-sm hover:bg-white/5 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  {file ? file.name : "Attach Proof (Optional)"}
                </label>
              </div>

              {/* Feedback Messages */}
              {error && <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}
              {success && <p className="text-emerald-400 text-xs text-center bg-emerald-500/10 py-2 rounded-lg">{success}</p>}

              <button disabled={submitting}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all">
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="glass p-6 rounded-[24px] min-h-[500px]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
              <span>Recent Requests</span>
              <span className="text-xs font-normal text-neutral-400 bg-white/5 px-2 py-1 rounded-lg">{myRequests.length} Total</span>
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {myRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p>No requests found</p>
                </div>
              ) : (
                myRequests.map(req => (
                  <div key={req.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white text-sm">{req.student_name}</h3>
                        <p className="text-xs text-neutral-400">{req.student_class} • {req.reg_no}</p>
                      </div>
                      <StatusPill status={req.status} />
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(req.from_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(req.to_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex-1" />
                      {req.attachment_url && (
                        <a href={req.attachment_url} target="_blank" className="text-xs text-blue-400 hover:underline">View Proof</a>
                      )}
                      <button onClick={() => deleteRequest(req.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-neutral-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
