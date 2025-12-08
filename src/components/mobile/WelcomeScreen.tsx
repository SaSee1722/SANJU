"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function WelcomeScreen() {
    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans">
            {/* Premium Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]" />
            <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm relative z-10 gap-10">
                {/* Logo Section */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative"
                >
                    <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark p-[1px] shadow-glow relative z-10">
                        <div className="w-full h-full bg-[#0f172a] rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                            <FileText className="w-14 h-14 text-white" />
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <div className="text-center space-y-3">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-white tracking-tight"
                    >
                        Welcome to <span className="text-primary-light">LeaveX</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-neutral-400 text-base leading-relaxed max-w-[280px] mx-auto"
                    >
                        The intelligent leave management solution for modern institutions.
                    </motion.p>
                </div>
            </div>

            {/* Bottom Section */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full max-w-sm relative z-10 space-y-6 pb-8"
            >
                <Link href="/login" className="block w-full">
                    <button className="w-full h-14 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all group">
                        Get Started
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>

                <div className="flex justify-center items-center gap-4 text-[10px] text-neutral-500 font-medium uppercase tracking-widest">
                    <span>Fast</span>
                    <div className="w-1 h-1 rounded-full bg-neutral-700" />
                    <span>Secure</span>
                    <div className="w-1 h-1 rounded-full bg-neutral-700" />
                    <span>Reliable</span>
                </div>
            </motion.div>
        </div>
    );
}
