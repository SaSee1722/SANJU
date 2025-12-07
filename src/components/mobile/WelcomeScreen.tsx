"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, LayoutGrid } from "lucide-react";

export default function WelcomeScreen() {
    return (
        <div className="min-h-screen w-full bg-neutral-950 flex flex-col justify-between p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Spacing */}
            <div className="flex-1" />

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 z-10 mb-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30"
                >
                    <LayoutGrid className="text-white w-14 h-14" />
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
                    >
                        LeaveX
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-neutral-400 text-lg leading-relaxed max-w-xs mx-auto"
                    >
                        Streamline your department's leave requests with the power of automation.
                    </motion.p>
                </div>
            </div>

            {/* Button */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="z-10 w-full pb-8"
            >
                <Link href="/login" className="block w-full">
                    <button className="w-full bg-white text-black font-bold text-lg py-4 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center group shadow-lg shadow-white/5">
                        Get Started
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
                <p className="text-center text-neutral-600 text-xs mt-6">
                    v1.0.0 • Powered by LeaveX Tech
                </p>
            </motion.div>
        </div>
    );
}
