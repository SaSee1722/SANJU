import { UserIcon, BriefcaseIcon, ShieldIcon } from "@/components/icons";
import { User } from "lucide-react";

type UserRole = "staff" | "pc" | "admin" | "student";

interface UserRoleBadgeProps {
    role: UserRole | string;
    className?: string;
}

const getRoleConfig = (role: string) => {
    const configs: Record<string, { label: string; className: string; Icon: any }> = {
        student: {
            label: "Student",
            className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            Icon: User,
        },
        staff: {
            label: "Advisor",
            className: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
            Icon: UserIcon,
        },
        pc: {
            label: "Program Coordinator",
            className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            Icon: BriefcaseIcon,
        },
        admin: {
            label: "Admin",
            className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
            Icon: ShieldIcon,
        },
    };

    // Return config for role, or a default if role is unknown
    return configs[role] || {
        label: role || "Unknown",
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        Icon: User,
    };
};

export default function UserRoleBadge({ role, className = "" }: UserRoleBadgeProps) {
    const config = getRoleConfig(role || "student");
    const Icon = config.Icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className} ${className}`}
        >
            <Icon size={14} />
            <span>{config.label}</span>
        </span>
    );
}
