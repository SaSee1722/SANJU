"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { Calendar, CheckCircle, Shield, Bell } from "lucide-react";

const features = [
    {
        icon: <Shield className="w-6 h-6 text-purple-400" />,
        title: "Role-Based Access",
        description: "Secure access controls for Staff, Program Coordinators, and Admins.",
    },
    {
        icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
        title: "Multi-Level Approval",
        description: "Streamlined workflow from staff request to final admin approval.",
    },
    {
        icon: <Bell className="w-6 h-6 text-yellow-400" />,
        title: "Real-time Notifications",
        description: "Instant alerts for leave status updates and pending actions.",
    },
    {
        icon: <Calendar className="w-6 h-6 text-pink-400" />,
        title: "Calendar View",
        description: "Visual overview of team availability and leave schedules.",
    },
];

export default function Features() {
    return (
        <section className="py-24 relative" id="features">
            <div className="container-custom">
                <AnimatedSection className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Powerful <span className="text-gradient-blue">Features</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Everything you need to manage workforce leave efficiently and transparently.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <AnimatedSection key={index} delay={index * 0.1} direction="up">
                            <div className="glass p-8 rounded-2xl h-full hover:bg-white/5 transition-colors duration-300 card-hover-glow group">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
