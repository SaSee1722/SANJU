"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12"
        >
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">LeaveApp</span>
            </div>

            <Link href="/login">
                <button className="px-6 py-2.5 rounded-full bg-white/10 border border-white/10 text-white font-medium hover:bg-white/20 transition-all backdrop-blur-md">
                    Login
                </button>
            </Link>
        </motion.nav>
    );
}
