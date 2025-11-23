"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Icons
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const role = (user.user_metadata as any)?.role;
      if (role === "admin") router.replace("/admin");
      else router.replace("/staff");
    })();
  }, [router]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
            <span className="text-xl font-bold tracking-tight">LeaveWeb</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#departments" className="hover:text-primary transition-colors">Departments</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/login" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              New Academic Year Ready
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-primary">
              Simplify Campus <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Leave Management</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              The modern, efficient way for engineering colleges to manage staff and student leave requests. Paperless, instant, and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:translate-y-[-2px]">
                Start Now <ArrowRightIcon />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center gap-2 bg-white border border-border text-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-secondary transition-all hover:translate-y-[-2px]">
                View Features
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckIcon /> <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon /> <span>Secure Data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon /> <span>24/7 Access</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] w-full flex items-center justify-center animate-slide-in-right">
            {/* Abstract Composition */}
            <div className="relative w-full h-full max-w-md mx-auto">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
               <div className="absolute top-0 -left-4 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
               <div className="absolute -bottom-8 left-20 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
               
               <div className="relative bg-white/50 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transform rotate-[-6deg] hover:rotate-0 transition-all duration-500 z-10">
                  <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
                    <div>
                      <h3 className="font-bold text-gray-900">John Doe</h3>
                      <p className="text-xs text-gray-500">Senior Lecturer, CSE</p>
                    </div>
                    <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Approved</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                  </div>
               </div>

               <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl z-20 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckIcon />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Request Approved</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Department-Based Control</h2>
            <p className="text-muted-foreground">Isolated workspaces for every department ensuring data privacy and streamlined management.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'].map((dept, i) => (
              <div key={dept} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="font-bold text-xl">{dept[0]}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{dept}</h3>
                <p className="text-xs text-muted-foreground">Engineering</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-3xl font-bold mb-6 text-primary">Why Choose LeaveWeb?</h2>
              <p className="text-muted-foreground mb-8">
                Designed specifically for educational institutions to handle the complex hierarchy of approvals and record-keeping.
              </p>
              <Link href="/login" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                Learn more about features <ArrowRightIcon />
              </Link>
            </div>
            <div className="col-span-2 grid sm:grid-cols-2 gap-8">
              {[
                { title: "Paperless Workflow", desc: "Eliminate physical forms and manual tracking completely." },
                { title: "Real-time Notifications", desc: "Get instant updates via email and dashboard alerts." },
                { title: "Role-based Access", desc: "Separate views for Staff, HODs, and Principals." },
                { title: "Analytics Dashboard", desc: "Visual insights into leave patterns and statistics." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to modernize your campus?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Join the growing number of institutions moving towards digital transformation.</p>
          <Link href="/login" className="bg-white text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl inline-block">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-white text-xs font-bold">L</div>
            <span className="text-white font-bold">LeaveWeb</span>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} LeaveWeb System. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
