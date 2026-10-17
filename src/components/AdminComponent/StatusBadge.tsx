export const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50 border-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  accepted: {
    label: "Accepted",
    bg: "bg-blue-50 border-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  in_transit: {
    label: "In Transit",
    bg: "bg-purple-50 border-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-50 border-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50 border-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const currentConfig = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentConfig.bg} ${currentConfig.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentConfig.dot}`} />
      {currentConfig.label}
    </span>
  );
}
