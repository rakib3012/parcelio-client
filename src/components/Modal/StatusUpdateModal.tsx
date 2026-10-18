import React, { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import type { AdminBooking } from "@/lib/hooks/api/admin/getAllBookings";
import {
  useUpdateBookingStatus,
  type UpdateBookingStatusPayload,
} from "@/lib/hooks/api/admin/updateBookingStatus";
import { statusConfig } from "@/components/AdminComponent/StatusBadge";

interface StatusUpdateModalProps {
  booking: AdminBooking;
  onClose: () => void;
}

export function StatusUpdateModal({ booking, onClose }: StatusUpdateModalProps) {
  const updateMutation = useUpdateBookingStatus();
  const [newStatus, setNewStatus] = useState(booking.status);
  const [newPaymentStatus, setNewPaymentStatus] = useState(booking.paymentStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const allStatuses = [
    "pending",
    "accepted",
    "in_transit",
    "delivered",
    "cancelled",
  ] as const;
  const allPaymentStatuses = ["pending", "paid", "cancelled"] as const;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const token = Cookies.get("accessToken");

    const payload: UpdateBookingStatusPayload & { id: string } = {
      id: booking.identifier,
      status: newStatus,
      paymentStatus:
        newPaymentStatus !== booking.paymentStatus ? newPaymentStatus : undefined,
      note: note || undefined,
      token,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => onClose(),
      onError: (err) => setError(err.message),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#151a23] border border-neutral-100 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Update Status</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {booking.trackingId} — {booking.parcelName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Delivery Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Delivery Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {allStatuses.map((status) => {
                const currentStatusConfig = statusConfig[status];
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setNewStatus(status)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      newStatus === status
                        ? `${currentStatusConfig.bg} ${currentStatusConfig.text} ring-2 ring-offset-1 ring-current/20`
                        : "bg-white dark:bg-[#10141d] text-neutral-500 dark:text-neutral-300 border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${currentStatusConfig.dot}`}
                    />
                    {currentStatusConfig.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Payment Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {allPaymentStatuses.map((paymentStatus) => (
                <button
                  key={paymentStatus}
                  type="button"
                  onClick={() => setNewPaymentStatus(paymentStatus)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    newPaymentStatus === paymentStatus
                      ? "bg-[#CAEA3C] text-neutral-900 border-[#CAEA3C] font-bold shadow-xs"
                      : "bg-white dark:bg-[#10141d] text-neutral-500 dark:text-neutral-300 border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5"
                  }`}
                >
                  {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all resize-none"
              placeholder="Add a note about this status change..."
            />
          </div>

          {/* Footer */}
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
              disabled={updateMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#CAEA3C] hover:bg-[#bde028] text-neutral-900 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
            >
              {updateMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
