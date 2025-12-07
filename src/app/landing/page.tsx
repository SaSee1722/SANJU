"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import WelcomeScreen from "@/components/mobile/WelcomeScreen";

export default function LandingPage() {
  const [isNative, setIsNative] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-neutral-950" />;
  }

  // Mobile App View
  if (isNative) {
    return <WelcomeScreen />;
  }

  // Web View
  return (
    <main className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} Leave Approval System. All rights reserved.</p>
      </footer>
    </main>
  );
}
