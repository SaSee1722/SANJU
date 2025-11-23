"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArrowRight, FileText, UserCheck, CheckSquare } from "lucide-react";

const steps = [
    {
        title: "Request Leave",
        description: "Staff submits leave request with dates and reason.",
        icon: <FileText className="w-8 h-8 text-white" />,
        color: "from-purple-500 to-blue-500",
        step: "01",
    },
    {
        title: "PC Review",
        description: "Program Coordinator reviews and recommends action.",
        icon: <UserCheck className="w-8 h-8 text-white" />,
        color: "from-blue-500 to-cyan-500",
        step: "02",
    },
    {
        title: "Admin Approval",
        description: "Admin grants final approval and notifies staff.",
        icon: <CheckSquare className="w-8 h-8 text-white" />,
        color: "from-pink-500 to-rose-500",
        step: "03",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 relative bg-black/20" id="how-it-works">
            <div className="container-custom">
                <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            How It <span className="text-gradient">Works</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl">
                            A simple, transparent process designed to keep everyone informed and aligned.
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((item, index) => (
                        <AnimatedSection key={index} delay={index * 0.2}>
                            <div className="group relative rounded-2xl overflow-hidden p-1 h-full">
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative bg-[#0f172a] h-full rounded-xl p-8 border border-white/5 group-hover:border-transparent transition-colors">
                                    <div className="text-6xl font-bold text-white/5 absolute top-4 right-4">{item.step}</div>

                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                        {item.description}
                                    </p>

                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                            <ArrowRight className="w-6 h-6 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
