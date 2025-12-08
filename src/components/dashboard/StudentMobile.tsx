"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    Plus, Clock, CheckCircle, XCircle,
    FileText, Home, User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
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

// Components
const QuickActionCard = ({
    title, icon: Icon, color, count, onClick
}: {
    title: string, icon: any, color: string, count?: number, onClick?: () => void
}) => (
    <div onClick={onClick} className={`relative p-5 rounded-[24px] ${color} h-[160px] flex flex-col justify-between shadow-lg active:scale-[0.98] transition-all`}>
        <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                <Icon size={20} fill="currentColor" className="text-white" />
            </div>
            {count !== undefined && (
                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white text-xs font-bold backdrop-blur-sm">
                    {count}
                </div>
            )}
        </div>
        <p className="text-white font-bold text-sm tracking-wide">{title}</p>
    </div>
);

export default function StudentMobile({ profile, requests, stats }: any) {
    // Mobile specific view
    return (
        <div className="min-h-screen w-full bg-[#0f1014] text-white font-sans pb-28">
            {/* 1. Header */}
            <div className="pt-12 px-6 flex justify-between items-start mb-6">
                <div>
                    <p className="text-neutral-400 text-sm font-medium mb-1">Welcome back,</p>
                    <h1 className="text-2xl font-bold">{profile.full_name || "Student"}</h1>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-[#5D5FEF] text-xs font-bold text-white shadow-lg shadow-[#5D5FEF]/20">
                    {profile.stream || "Stream"}
                </div>
            </div>

            <div className="px-6 space-y-6">
                {/* 2. Top Stats Card */}
                <div className="w-full bg-[#7B61FF] rounded-[24px] p-6 shadow-lg shadow-[#7B61FF]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1 flex flex-col items-center border-r border-white/20">
                            <span className="text-3xl font-bold">{stats.total}</span>
                            <span className="text-xs text-white/80 font-medium mt-1">Total Requests</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">{stats.pending}</span>
                            <span className="text-xs text-white/80 font-medium mt-1">Pending</span>
                        </div>
                    </div>
                </div>

                {/* 3. Quick Actions Grid */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {/* New Leave (Purple) */}
                        <Link href="/student/apply">
                            <QuickActionCard
                                title="New Leave"
                                icon={FileText}
                                color="bg-[#7B61FF]"
                            />
                        </Link>

                        {/* Pending (Blue) */}
                        <Link href="/student/requests?filter=pending">
                            <QuickActionCard
                                title="Pending"
                                icon={Clock}
                                color="bg-[#5D5FEF]"
                                count={stats.pending}
                            />
                        </Link>

                        {/* Approved (Green) */}
                        <Link href="/student/requests?filter=approved">
                            <QuickActionCard
                                title="Approved"
                                icon={CheckCircle}
                                color="bg-[#10B981]"
                                count={stats.approved}
                            />
                        </Link>

                        {/* Rejected (Red/Orange) */}
                        <Link href="/student/requests?filter=declined">
                            <QuickActionCard
                                title="Rejected"
                                icon={XCircle}
                                color="bg-[#FF5C39]"
                                count={stats.rejected}
                            />
                        </Link>
                    </div>
                </div>

                {/* 4. Recent Activity */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Recent Activity</h2>
                        <span className="text-[#7B61FF] text-xs font-bold">View All</span>
                    </div>

                    {/* Info Banner */}
                    <div className="mb-4 bg-[#1E1E2D] p-4 rounded-2xl flex items-start gap-3 border border-white/5">
                        <div className="w-5 h-5 rounded-full bg-[#7B61FF]/20 flex items-center justify-center mt-0.5">
                            <span className="text-[#7B61FF] text-xs font-bold">i</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Leave Balance</p>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                                You have 12 days of leave remaining this semester.
                            </p>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        {requests.slice(0, 3).map((req: any) => (
                            <div key={req.id} className="bg-[#1E1E2D] p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                                {/* Active Indicator */}
                                {req.status.includes('pending') && <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                                {req.status === 'approved' && <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                                {req.status === 'declined' && <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#FF5C39] shadow-[0_0_8px_rgba(255,92,57,0.5)]" />}

                                <h3 className="text-base font-bold text-white mb-1">
                                    {/* Fallback title if reason is long */}
                                    {req.reason?.length > 20 ? req.reason.substring(0, 20) + "..." : req.reason || "Leave"}
                                </h3>
                                <p className="text-xs text-neutral-400 mb-2">
                                    {new Date(req.from_date).toLocaleDateString()} - {new Date(req.to_date).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-neutral-500 line-clamp-1">
                                    {req.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Floating Action Button */}
            <Link href="/student/apply" className="fixed bottom-24 right-6 w-14 h-14 bg-[#7B61FF] rounded-full flex items-center justify-center shadow-lg shadow-[#7B61FF]/40 active:scale-90 transition-transform z-50">
                <Plus className="w-6 h-6 text-white" />
            </Link>

            {/* 6. Mobile Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-white h-20 rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.2)] flex items-center justify-around px-2 z-40 pb-2">
                <button className="flex flex-col items-center gap-1 p-2">
                    <Home className="w-6 h-6 text-[#7B61FF]" fill="#7B61FF" />
                    <span className="text-[10px] font-bold text-[#7B61FF]">Dashboard</span>
                </button>
                <Link href="/student/requests">
                    <button className="flex flex-col items-center gap-1 p-2">
                        <FileText className="w-6 h-6 text-neutral-400" />
                        <span className="text-[10px] font-medium text-neutral-400">Requests</span>
                    </button>
                </Link>
                <Link href="/student/profile">
                    <button className="flex flex-col items-center gap-1 p-2">
                        <User className="w-6 h-6 text-neutral-400" />
                        <span className="text-[10px] font-medium text-neutral-400">Profile</span>
                    </button>
                </Link>
            </div>
        </div>
    );
}
