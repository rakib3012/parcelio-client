export const paymentStatusConfig: Record<
  string,
  { bg: string; text: string }
> = {
  pending: {
    bg: "bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50",
    text: "text-orange-700 dark:text-orange-400",
  },
  paid: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/50",
    text: "text-red-700 dark:text-red-400",
  },
};

interface PaymentBadgeProps {
  status: string;
}

export function PaymentBadge({ status }: PaymentBadgeProps) {
  const currentConfig =
    paymentStatusConfig[status] || paymentStatusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${currentConfig.bg} ${currentConfig.text}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
