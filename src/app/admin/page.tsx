"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  Users, User, Briefcase, FileText,
  LogOut, ArrowRight, Activity
} from "lucide-react";

type Stream = "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL";
type LeaveStatus = "pending_pc" | "pending_admin" | "approved" | "declined";

type LeaveRequest = {
  id: string;
  student_name: string;
  status: LeaveStatus;
  created_at: string;
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
    <div className={`px-2 py-0.5 rounded-full border ${style.bg} ${style.border} flex items-center gap-1`}>
      <div className={`w-1 h-1 rounded-full ${style.text.replace('text-', 'bg-')}`} />
      <span className={`text-[9px] font-bold uppercase tracking-wide ${style.text}`}>{style.label}</span>
    </div>
  );
};

export default function AdminOverview() {
  const router = useRouter();
  const [userStream, setUserStream] = useState<Stream | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [stats, setStats] = useState({
    totalRequests: 0, pendingPC: 0, pendingAdmin: 0,
    approved: 0, declined: 0, totalUsers: 0, totalStaff: 0
  });
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const metaStream = (user.user_metadata as any)?.stream as Stream;
      setUserStream(metaStream || "CSE");
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0]);

      const { data: requests } = await supabase.from("leave_requests")
        .select("id, student_name, status, created_at")
        .eq("stream", metaStream || "CSE")
        .order("created_at", { ascending: false });

      if (requests) {
        setStats(prev => ({
          ...prev,
          totalRequests: requests.length,
          pendingPC: requests.filter(r => r.status === "pending_pc").length,
          pendingAdmin: requests.filter(r => r.status === "pending_admin").length,
          approved: requests.filter(r => r.status === "approved").length,
          declined: requests.filter(r => r.status === "declined").length,
        }));
        setRecentRequests(requests.slice(0, 5));
      }

      const { data: profiles } = await supabase.from("profiles").select("id, role").eq("stream", metaStream || "CSE");
      if (profiles) {
        setStats(prev => ({
          ...prev,
          totalUsers: profiles.length,
          totalStaff: profiles.filter(p => p.role === "staff").length,
        }));
      }
      setLoading(false);
    };
    load();
  }, [router]);

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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow">
              <User className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                  {userStream || "CSE"} Department
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="glass p-5 rounded-2xl flex flex-col justify-center gap-1 hover:bg-white/5 transition-colors">
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wide">Total Requests</p>
            <p className="text-3xl font-bold text-white">{stats.totalRequests}</p>
          </div>
          <div className="glass p-5 rounded-2xl flex flex-col justify-center gap-1 hover:bg-white/5 transition-colors border-l-4 border-l-amber-500">
            <p className="text-amber-500 text-xs font-medium uppercase tracking-wide">Pending Review</p>
            <p className="text-3xl font-bold text-amber-500">{stats.pendingAdmin}</p>
          </div>
          <div className="glass p-5 rounded-2xl flex flex-col justify-center gap-1 hover:bg-white/5 transition-colors">
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wide">Total Users</p>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>
          <div className="glass p-5 rounded-2xl flex flex-col justify-center gap-1 hover:bg-white/5 transition-colors">
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wide">Staff Count</p>
            <p className="text-3xl font-bold text-white">{stats.totalStaff}</p>
          </div>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/requests" className="block group">
                <div className="glass p-6 rounded-2xl h-full flex flex-col justify-between hover:bg-white/10 transition-all border border-white/10 hover:border-primary/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                    <FileText className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Manage Requests</h3>
                    <p className="text-sm text-neutral-400 mt-1">Review, Approve or Decline leave requests.</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    OPEN <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
              <Link href="/admin/users" className="block group">
                <div className="glass p-6 rounded-2xl h-full flex flex-col justify-between hover:bg-white/10 transition-all border border-white/10 hover:border-blue-500/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Manage Users</h3>
                    <p className="text-sm text-neutral-400 mt-1">View users, manage roles and assign PCs.</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    OPEN <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass p-6 rounded-[24px] min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <Link href="/admin/requests" className="text-xs text-primary font-bold hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {recentRequests.length === 0 ? (
                <p className="text-center text-neutral-500 py-10 text-sm">No recent activity</p>
              ) : (
                recentRequests.map(req => (
                  <div key={req.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-white">{req.student_name}</p>
                      <p className="text-[10px] text-neutral-400">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                    <StatusPill status={req.status} />
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
