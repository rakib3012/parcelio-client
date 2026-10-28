import { useState } from "react";
import { X, AlertTriangle, Loader2, Ban } from "lucide-react";
import { useUpdateDeliveryStatus } from "@/lib/hooks/api/rider/updateDeliveryStatus";

interface CancelDeliveryModalProps {
  bookingId: string;
  trackingId: string;
  parcelName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const commonCancellationReasons = [
  "Customer unreachable after 3 call attempts",
  "Incorrect or non-existent recipient address",
  "Customer refused delivery / cancelled order",
  "Customer requested reschedule to another date",
  "Severe weather / inaccessible delivery zone",
];

export function CancelDeliveryModal({
  bookingId,
  trackingId,
  parcelName,
  onClose,
  onSuccess,
}: CancelDeliveryModalProps) {
  const [cancellationReason, setCancellationReason] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateStatusMutation = useUpdateDeliveryStatus();

  const handleReasonPresetClick = (presetReason: string) => {
    setCancellationReason(presetReason);
    setErrorMessage("");
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedReason = cancellationReason.trim();
    if (!trimmedReason || trimmedReason.length < 5) {
      setErrorMessage(
        "Please provide a valid cancellation reason of at least 5 characters."
      );
      return;
    }

    updateStatusMutation.mutate(
      {
        id: bookingId,
        status: "cancelled",
        cancellationReason: trimmedReason,
        note: additionalNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#151a23] border border-neutral-100 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Cancel Delivery
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tracking ID: {trackingId} · {parcelName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Reason Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Common Reasons
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonCancellationReasons.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleReasonPresetClick(preset)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left cursor-pointer ${
                    cancellationReason === preset
                      ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300 font-semibold"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 dark:bg-[#10141d] dark:border-white/10 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Reason Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Cancellation Reason * (min. 5 characters)
            </label>
            <textarea
              rows={3}
              value={cancellationReason}
              onChange={(e) => {
                setCancellationReason(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Explain why this parcel delivery could not be completed..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 transition-all resize-none"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Internal Rider Note (Optional)
            </label>
            <input
              type="text"
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              placeholder="e.g. Attempted delivery at 1:15 PM"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                updateStatusMutation.isPending ||
                cancellationReason.trim().length < 5
              }
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

