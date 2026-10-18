import { AlertCircle, Loader2, ArrowRight } from "lucide-react";

export interface BookingConfirmDetails {
  parcelName: string;
  parcelWeight: number | string;
  parcelType: string;
  senderName: string;
  senderDistrict: string;
  senderAddress: string;
  senderPhone: string;
  receiverName: string;
  receiverDistrict: string;
  receiverAddress: string;
  receiverPhone: string;
}

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  apiError: string | null;
  estimatedCost: number;
  details: BookingConfirmDetails;
}

export function BookingConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  apiError,
  estimatedCost,
  details,
}: BookingConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#151a23] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl border border-neutral-100 dark:border-white/10 transition-colors">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#0B3B3C] dark:text-white">
            Confirm Booking Details
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Please review your parcel shipment details before placing the order.
          </p>
        </div>

        <div className="space-y-3.5 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-[#10141d] p-4 rounded-2xl border border-neutral-200/80 dark:border-white/10">
          <div className="flex justify-between border-b border-neutral-200/60 dark:border-white/10 pb-2">
            <span className="text-neutral-500 dark:text-neutral-400">Parcel:</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {details.parcelName} ({details.parcelWeight} KG, {details.parcelType})
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-200/60 dark:border-white/10 pb-2">
            <span className="text-neutral-500 dark:text-neutral-400">Pickup From:</span>
            <span className="font-semibold text-neutral-900 dark:text-white text-right">
              {details.senderName} ({details.senderDistrict})
              <br />
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">
                {details.senderAddress} • {details.senderPhone}
              </span>
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-200/60 dark:border-white/10 pb-2">
            <span className="text-neutral-500 dark:text-neutral-400">Delivery To:</span>
            <span className="font-semibold text-neutral-900 dark:text-white text-right">
              {details.receiverName} ({details.receiverDistrict})
              <br />
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">
                {details.receiverAddress} • {details.receiverPhone}
              </span>
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-200/60 dark:border-white/10 pb-2">
            <span className="text-neutral-500 dark:text-neutral-400">Pickup Slot:</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              Today, 4:00 PM – 7:00 PM
            </span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold text-[#0B3B3C] dark:text-lime-400">
            <span>Estimated Cost:</span>
            <span>৳ {estimatedCost} BDT</span>
          </div>
        </div>

        {apiError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-white/20 text-neutral-700 dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Back to Edit
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg bg-[#B7F436] hover:bg-[#a5e426] disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Placing Booking...</span>
              </>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
