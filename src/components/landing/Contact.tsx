"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { Mail, MapPin, Phone, HelpCircle } from "lucide-react";

export default function Contact() {
    return (
        <section className="py-24 relative" id="contact">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <AnimatedSection>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Need <span className="text-gradient">Support?</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-md">
                            Encountering issues or have questions about the leave policy? Reach out to the admin team.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Help Desk</p>
                                    <p className="font-medium">support@leaveapp.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Admin Hotline</p>
                                    <p className="font-medium">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.2} direction="left">
                        <form className="glass p-8 rounded-3xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 ml-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 ml-1">Staff ID</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="e.g. STF-2024-001"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Subject</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="Issue Description"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                    placeholder="Describe your issue..."
                                />
                            </div>
                            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity shadow-glow">
                                Submit Ticket
                            </button>
                        </form>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
