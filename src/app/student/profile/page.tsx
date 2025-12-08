"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, User, Mail, BookOpen, Layers, Hash, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function StudentProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace("/login"); return; }

            const { data: profiles } = await supabase.from("profiles").select("*").eq("id", user.id).limit(1);
            setProfile(profiles?.[0]);
            setLoading(false);
        };
        load();
    }, [router]);

    const InfoItem = ({ icon: Icon, label, value }: any) => (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#7B61FF]/10 flex items-center justify-center text-[#7B61FF]">
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-white font-bold">{value || "N/A"}</p>
            </div>
        </div>
    );

    if (loading) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#7B61FF] border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen w-full bg-[#0f1014] text-white font-sans pb-24">
            {/* Header */}
            <div className="pt-12 px-6 pb-6 bg-[#0f1014]">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/student" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </Link>
                    <h1 className="text-xl font-bold">My Profile</h1>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#5D5FEF] p-[2px] shadow-2xl shadow-[#7B61FF]/30 mb-4">
                        <div className="w-full h-full rounded-full bg-[#1E1E2D] flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{profile?.full_name?.charAt(0)}</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
                    <p className="text-[#5D5FEF] font-medium bg-[#5D5FEF]/10 px-3 py-1 rounded-full text-xs mt-2">{profile?.role?.toUpperCase()} ACCOUNT</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="px-6 space-y-3">
                <InfoItem icon={Mail} label="Email Address" value={profile?.email} />
                <InfoItem icon={BookOpen} label="Stream" value={profile?.stream} />
                <InfoItem icon={Layers} label="Department" value={profile?.department} />
                <div className="grid grid-cols-2 gap-3">
                    <InfoItem icon={Hash} label="Reg No" value={profile?.reg_no} />
                    <InfoItem icon={User} label="Class" value={profile?.student_class} />
                </div>
            </div>

            {/* Logout */}
            <div className="px-6 mt-8">
                <button
                    onClick={() => supabase.auth.signOut().then(() => router.replace('/login'))}
                    className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
