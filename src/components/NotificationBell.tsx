"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    link?: string;
};

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let channel: any;

        const setup = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch initial
            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(20);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
            }

            // Subscribe to real-time
            channel = supabase
                .channel('realtime-notifications')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    const newNotif = payload.new as Notification;
                    setNotifications(prev => [newNotif, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    // Optional: Play sound or toast
                })
                .subscribe();
        };

        setup();

        // Click outside to close
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            if (channel) supabase.removeChannel(channel);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            // Mark as read when opening
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                className="relative p-2 rounded-full hover:bg-accent/50 transition-colors"
                onClick={handleOpen}
                aria-label="Notifications"
            >
                <Bell className="text-foreground w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5"
                    >
                        <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {notifications.length > 0 && <span className="text-xs text-muted-foreground">{notifications.length} recent</span>}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-muted-foreground">No matching notifications</p>
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className={`p-4 border-b border-border/50 hover:bg-accent/50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-medium text-sm text-foreground">{n.title}</p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-2 border-t border-border bg-muted/30 text-center">
                            <button className="text-xs text-primary hover:underline font-medium" onClick={() => setIsOpen(false)}>Close</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
