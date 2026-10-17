import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  subtitle: string;
  isRevenue?: boolean;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
  isRevenue = false,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p
        className={`mt-2 font-bold text-neutral-900 ${
          isRevenue ? "text-xl" : "text-2xl"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
    </div>
  );
}
