import React from "react";

interface BookingDetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function BookingDetailSection({
  title,
  children,
}: BookingDetailSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
