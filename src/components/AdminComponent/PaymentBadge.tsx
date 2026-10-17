export const paymentStatusConfig: Record<
  string,
  { bg: string; text: string }
> = {
  pending: { bg: "bg-orange-50 border-orange-100", text: "text-orange-700" },
  paid: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" },
  cancelled: { bg: "bg-red-50 border-red-100", text: "text-red-700" },
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
