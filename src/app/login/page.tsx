"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Mail, Lock, User, FileText, ChevronDown, Check } from "lucide-react";

type AuthMode = "signin" | "signup";
type UserRole = "student" | "staff" | "admin";
type Stream = "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  const [stream, setStream] = useState<Stream>("CSE");
  const [department, setDepartment] = useState<string>("CSE");

  // Stream-Department Mapping
  const DEPARTMENTS: Record<Stream, string[]> = {
    CSE: ["CSE", "IT", "AI & DS", "AI & ML", "Cyber Security"],
    ECE: ["ECE", "VLSI"],
    EEE: ["EEE"],
    MECH: ["MECH"],
    CIVIL: ["CIVIL"]
  };

  useEffect(() => {
    setDepartment(DEPARTMENTS[stream][0]);
  }, [stream]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      // 1. Get Session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // 2. Safely Fetch Profile
        const { data: profiles } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .limit(1);

        const profile = profiles?.[0];

        // 3. Determine Role (Fallback to metadata if profile fetch fails)
        const role = profile?.role || session.user.user_metadata?.role || "student";

        // 4. Redirect
        if (role === 'admin') router.replace('/admin');
        else if (role === 'pc') router.replace('/pc');
        else if (role === 'staff') router.replace('/staff');
        else router.replace('/student');
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Routing logic
        const user = data.user;

        // Fetch Profile for accurate role
        const { data: profiles } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user?.id)
          .limit(1);

        const profile = profiles?.[0];

        const role = profile?.role || user?.user_metadata?.role;

        if (role === 'admin') router.replace('/admin');
        else if (role === 'pc') router.replace('/pc');
        else if (role === 'staff') router.replace('/staff');
        else router.replace('/student');

      } else {
        // Sign Up
        const redirectTo = Capacitor.isNativePlatform()
          ? "com.leaveapp.web://login-callback"
          : `${window.location.origin}/login`;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              full_name: name,
              role: selectedRole === 'admin' ? 'admin' : (selectedRole === 'staff' ? 'staff' : 'student'), // Map UI role to DB role
              stream: stream,
              department: selectedRole === 'student' ? department : undefined
            },
          },
        });

        if (error) throw error;
        if (data.user) {
          // Backup profile creation
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: name,
            role: selectedRole === 'admin' ? 'admin' : (selectedRole === 'staff' ? 'staff' : 'student'),
            stream: stream,
            department: selectedRole === 'student' ? department : null
          });
          setMessage("Account created! Check your email.");
          setMode("signin");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const RoleButton = ({ role, label }: { role: UserRole, label: string }) => {
    const isActive = selectedRole === role;
    return (
      <button
        type="button"
        onClick={() => setSelectedRole(role)}
        className={`flex-1 p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group
          ${isActive
            ? 'bg-gradient-to-br from-primary to-primary-dark border-transparent shadow-lg shadow-primary/25'
            : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
      >
        {/* Simple Icon Mapping */}
        {role === 'student' && <User className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`} />}
        {role === 'staff' && <FileText className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`} />}
        {role === 'admin' && <Lock className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`} />}

        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
      {/* Background Gradients matching Reference Theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]" />

      {/* Ambient Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark p-[1px] shadow-glow">
            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <FileText className="w-8 h-8 text-primary relative z-10" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">LeaveX</h1>
            <p className="text-neutral-400 text-sm font-medium mt-1">Premium Leave Management</p>
          </div>
        </div>

        {/* Glass Card */}
        <div className="glass p-6 rounded-[24px] border border-white/10 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>

          {/* Role Selector (Visible in Sign Up, optional in Sign In for visual flair) */}
          <div className="flex gap-3 mb-6">
            <RoleButton role="student" label="Student" />
            <RoleButton role="staff" label="Staff/PC" />
            <RoleButton role="admin" label="Admin" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sign Up Fields */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400 ml-1">Stream</label>
                    <div className="relative">
                      <select
                        value={stream}
                        onChange={e => setStream(e.target.value as Stream)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                      >
                        {Object.keys(DEPARTMENTS).map((s) => (
                          <option key={s} value={s} className="bg-neutral-900">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Department / Specialization (Logic: Stream -> Depts) - Only for Students */}
                  <AnimatePresence>
                    {selectedRole === 'student' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1"
                      >
                        <label className="text-xs font-medium text-neutral-400 ml-1">Department</label>
                        <div className="relative">
                          <select
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                          >
                            {DEPARTMENTS[stream]?.map((dept) => (
                              <option key={dept} value={dept} className="bg-neutral-900">{dept}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Common Fields */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  placeholder="your.id@college.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            {message && <p className="text-green-400 text-xs text-center">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button className="text-primary-light text-xs font-medium hover:text-primary transition-colors">
              Forgot Password?
            </button>

            <div className="w-full h-px bg-white/10" />

            <p className="text-neutral-400 text-xs">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-white font-bold ml-1 hover:text-primary-light transition-colors"
              >
                {mode === 'signin' ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-neutral-500 text-[10px] font-medium tracking-wide uppercase">Secure • Private • Efficient</p>
        </div>
      </motion.div>
    </div>
  );
}
