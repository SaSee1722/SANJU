"use client";

import {
    Plus, Clock, CheckCircle, XCircle,
    FileText, Home, LogOut, Calendar, Search, Filter
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Desktop Web View for Student Dashboard
export default function StudentWeb({ profile, requests, stats }: any) {

    const StatusBadge = ({ status }: { status: string }) => {
        let color = "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
        if (status.includes("pending")) color = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        if (status === "approved") color = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        if (status === "declined") color = "bg-red-500/10 text-red-400 border-red-500/20";

        return (
            <span className={`px-2 py-0.5 rounded-full border ${color} text-xs font-medium uppercase tracking-wide`}>
                {status.replace("_", " ")}
            </span>
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#0f1014] text-white font-sans flex">

            {/* Sidebar */}
            <div className="w-64 border-r border-white/5 p-6 flex flex-col justify-between hidden lg:flex bg-[#0f1014]">
                <div className="space-y-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#5D5FEF] flex items-center justify-center shadow-glow">
                            <FileText className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold">LeaveX</h1>
                    </div>

                    {/* Nav */}
                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#5D5FEF]/10 text-[#5D5FEF] font-medium border border-[#5D5FEF]/20">
                            <Home className="w-5 h-5" />
                            Dashboard
                        </button>
                        <Link href="/student/requests" className="block w-full">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 transition-colors">
                                <FileText className="w-5 h-5" />
                                My Requests
                            </button>
                        </Link>
                        <Link href="/student/calendar" className="block w-full">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 transition-colors">
                                <Calendar className="w-5 h-5" />
                                Calendar
                            </button>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                            {profile.full_name?.charAt(0) || "S"}
                        </div>
                        <div>
                            <p className="text-sm font-bold truncate max-w-[120px]">{profile.full_name}</p>
                            <p className="text-[10px] text-neutral-400">{profile.stream}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
                        className="w-full text-xs text-neutral-400 hover:text-white flex items-center gap-2"
                    >
                        <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                        <p className="text-neutral-400 text-sm">Welcome back, here's what's happening.</p>
                    </div>
                    <Link href="/student/apply">
                        <button className="px-6 py-3 rounded-xl bg-[#7B61FF] hover:bg-[#6c51ef] text-white font-bold shadow-lg shadow-[#7B61FF]/20 flex items-center gap-2 transition-all active:scale-95">
                            <Plus className="w-5 h-5" />
                            New Request
                        </button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="p-6 rounded-2xl bg-[#1E1E2D] border border-white/5 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Total</p>
                            <FileText className="text-[#7B61FF] w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>

                    <Link href="/student/requests?filter=pending" className="block">
                        <div className="p-6 rounded-2xl bg-[#1E1E2D] border border-white/5 flex flex-col gap-2 hover:bg-white/5 transition-colors cursor-pointer h-full">
                            <div className="flex justify-between items-start">
                                <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Pending</p>
                                <Clock className="text-[#5D5FEF] w-5 h-5" />
                            </div>
                            <p className="text-3xl font-bold">{stats.pending}</p>
                        </div>
                    </Link>

                    <Link href="/student/requests?filter=approved" className="block">
                        <div className="p-6 rounded-2xl bg-[#1E1E2D] border border-white/5 flex flex-col gap-2 hover:bg-white/5 transition-colors cursor-pointer h-full">
                            <div className="flex justify-between items-start">
                                <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Approved</p>
                                <CheckCircle className="text-emerald-500 w-5 h-5" />
                            </div>
                            <p className="text-3xl font-bold text-emerald-500">{stats.approved}</p>
                        </div>
                    </Link>

                    <Link href="/student/requests?filter=declined" className="block">
                        <div className="p-6 rounded-2xl bg-[#1E1E2D] border border-white/5 flex flex-col gap-2 hover:bg-white/5 transition-colors cursor-pointer h-full">
                            <div className="flex justify-between items-start">
                                <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Rejected</p>
                                <XCircle className="text-red-500 w-5 h-5" />
                            </div>
                            <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Requests Table */}
                <div className="bg-[#1E1E2D] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold">Recent Requests</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                                <input placeholder="Search..." className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#7B61FF] w-64" />
                            </div>
                            <button className="p-2 border border-white/10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase text-neutral-400 font-bold border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Type/Reason</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Applied On</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        No requests found. Start by creating one!
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req: any) => (
                                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white line-clamp-1 max-w-[200px]">{req.reason}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-400">
                                            {new Date(req.from_date).toLocaleDateString()} - {new Date(req.to_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-400">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-xs font-bold text-[#7B61FF] hover:underline">View Details</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
