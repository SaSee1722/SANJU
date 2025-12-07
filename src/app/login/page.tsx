"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Mail, Lock, User, ArrowRight, BookOpen, GraduationCap, School } from "lucide-react";

type AuthMode = "signin" | "signup";
type Stream = "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"staff" | "pc" | "admin">("staff");
  const [stream, setStream] = useState<Stream>("CSE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;

      const metaRole = (user.user_metadata as any)?.role;
      if (metaRole === "admin") {
        router.replace("/admin");
        return;
      }
      if (metaRole === "pc") {
        router.replace("/pc");
        return;
      }
      if (metaRole === "staff") {
        router.replace("/staff");
        return;
      }
      // Fallback to DB check
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      const dbRole = profile?.role;
      if (dbRole === "admin") router.replace("/admin");
      else if (dbRole === "staff") router.replace("/staff");
      else if (dbRole === "pc") router.replace("/pc");
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        const user = signInData.user;
        if (!user) throw new Error("No user found");

        const metaRole = (user.user_metadata as any)?.role;
        if (metaRole) {
          if (metaRole === "admin") router.replace("/admin");
          else if (metaRole === "pc") router.replace("/pc");
          else router.replace("/staff"); // Default
        } else {
          // Fallback
          router.replace("/staff");
        }

      } else {
        // Sign Up
        const redirectTo = Capacitor.isNativePlatform()
          ? "com.leaveapp.web://login-callback"
          : `${window.location.origin}/login`;

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              full_name: name,
              role: role,
              stream: stream,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // Create profile manually as backup
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: signUpData.user.id,
            full_name: name,
            role: role,
            stream: stream
          });
          if (profileError) console.error("Profile creation warning:", profileError);

          setMessage("Account created! Please check your email to confirm.");
          setMode("signin");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            {mode === "signin" ? "Enter your credentials to access your account" : "Join the platform to manage leave requests"}
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                {message}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-neutral-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value as Stream)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none text-sm"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none text-sm"
                  >
                    <option value="staff">Staff</option>
                    <option value="pc">PC</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-neutral-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-neutral-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "signin" ? "Sign In" : "Create Account")}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-black/30 p-6 text-center border-t border-white/5">
          <p className="text-neutral-400 text-sm">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-white font-medium ml-2 hover:underline focus:outline-none"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
