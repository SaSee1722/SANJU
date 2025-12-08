"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Calendar, FileText, Upload, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const LEAVE_TYPES = ['Medical', 'Personal', 'Academic', 'Emergency', 'Other'];

export default function ApplyLeavePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // User Info
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [stream, setStream] = useState("CSE");

    // Form State
    const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
    const [regNo, setRegNo] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [originalRegNo, setOriginalRegNo] = useState("");
    const [originalClass, setOriginalClass] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace("/login"); return; }

            const { data: profiles } = await supabase
                .from("profiles")
                .select("full_name, stream, reg_no, student_class, department")
                .eq("id", user.id)
                .limit(1);

            const profile = profiles?.[0];

            setUserId(user.id);
            setUserName(profile?.full_name || "");
            setStream(profile?.stream || "CSE");

            if (profile?.reg_no) {
                setRegNo(profile.reg_no);
                setOriginalRegNo(profile.reg_no);
            }
            if (profile?.student_class) {
                setStudentClass(profile.student_class);
                setOriginalClass(profile.student_class);
            }
        };
        load();
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(null); setSuccess(null);

        try {
            if (!fromDate || !toDate || !reason || !regNo || !studentClass) {
                throw new Error("Please fill all required fields");
            }

            let attachment_url: string | null = null;
            if (file) {
                const path = `${userId}/${Date.now()}_${file.name}`;
                const { error: upErr } = await supabase.storage.from("leave_attachments").upload(path, file);
                if (upErr) throw upErr;
                const { data } = supabase.storage.from("leave_attachments").getPublicUrl(path);
                attachment_url = data.publicUrl;
            }

            // Prepend Leave Type to reason for clarity if needed, or just store it. 
            // I'll store it as "Type: Reason" to ensure it's visible.
            const finalReason = `[${leaveType}] ${reason}`;

            const { error: insErr } = await supabase.from("leave_requests").insert({
                student_name: userName,
                student_class: studentClass,
                reg_no: regNo,
                stream: stream,
                from_date: fromDate,
                to_date: toDate,
                reason: finalReason,
                attachment_url,
                requested_by: userId,
                status: "pending_pc", // Students submit to PC first
                cgpa: null, // Optional for students
                attendance_percentage: null
            });


            if (insErr) throw insErr;

            // Auto-update profile if details were missing or changed
            if (regNo !== originalRegNo || studentClass !== originalClass) {
                await supabase.from("profiles").update({
                    reg_no: regNo,
                    student_class: studentClass
                }).eq("id", userId);
            }

            setSuccess("Leave Request Submitted!");
            setTimeout(() => router.replace("/student"), 1500);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0f172a] p-4 pb-12 relative overflow-x-hidden font-sans text-neutral-100">
            <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-md mx-auto space-y-6 relative z-10 pt-2">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/student" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Apply Leave</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Leave Type */}
                    <div className="glass p-5 rounded-2xl">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Leave Type</p>
                        <div className="flex flex-wrap gap-2">
                            {LEAVE_TYPES.map(type => (
                                <button
                                    key={type} type="button"
                                    onClick={() => setLeaveType(type)}
                                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${leaveType === type ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25' : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Identification */}
                    <div className="glass p-5 rounded-2xl space-y-4">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Student Details</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 ml-1">Reg No</label>
                                <input
                                    placeholder="91XX..." value={regNo} onChange={e => setRegNo(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all" required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 ml-1">Class</label>
                                <input
                                    placeholder="III-A" value={studentClass} onChange={e => setStudentClass(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all" required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="glass p-5 rounded-2xl space-y-4">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Duration</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 ml-1">Start Date</label>
                                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white dark:[color-scheme:dark] focus:outline-none focus:border-primary/50" required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 ml-1">End Date</label>
                                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white dark:[color-scheme:dark] focus:outline-none focus:border-primary/50" required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="glass p-5 rounded-2xl">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Reason</p>
                        <textarea
                            rows={4}
                            placeholder="Please explain the reason for leave..."
                            value={reason} onChange={e => setReason(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 resize-none"
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div className="glass p-5 rounded-2xl">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Attachment (Optional)</p>
                        <div className="relative">
                            <input type="file" id="file-up" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                            <label htmlFor="file-up" className="flex flex-col items-center justify-center gap-2 py-6 border border-dashed border-white/20 rounded-xl text-neutral-400 hover:bg-white/5 cursor-pointer transition-all active:scale-[0.98]">
                                <Upload className="w-6 h-6 text-neutral-500" />
                                <span className="text-xs">{file ? file.name : "Tap to upload image/PDF"}</span>
                            </label>
                        </div>
                    </div>

                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">{error}</div>}
                    {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-center">{success}</div>}

                    <button disabled={loading} className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all">
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </form>
            </div>
        </div>
    );
}
