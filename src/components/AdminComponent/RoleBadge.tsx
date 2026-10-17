import React from "react";
import { UserCheck, Bike, ShieldCheck } from "lucide-react";

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config: Record<
    string,
    {
      bg: string;
      text: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    user: {
      bg: "bg-blue-50 border-blue-100",
      text: "text-blue-700",
      icon: UserCheck,
    },
    rider: {
      bg: "bg-amber-50 border-amber-100",
      text: "text-amber-700",
      icon: Bike,
    },
    admin: {
      bg: "bg-purple-50 border-purple-100",
      text: "text-purple-700",
      icon: ShieldCheck,
    },
  };

  const currentConfig = config[role] || config.user;
  const Icon = currentConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentConfig.bg} ${currentConfig.text}`}
    >
      <Icon className="w-3 h-3" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}
