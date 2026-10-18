import React from "react";

interface BookingInfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export function BookingInfoItem({
  icon: Icon,
  label,
  value,
}: BookingInfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-neutral-400">{label}</p>
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">{value}</span>
      </div>
    </div>
  );
}
