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
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50",
      text: "text-blue-700 dark:text-blue-400",
      icon: UserCheck,
    },
    rider: {
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50",
      text: "text-amber-700 dark:text-amber-400",
      icon: Bike,
    },
    admin: {
      bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50",
      text: "text-purple-700 dark:text-purple-400",
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
