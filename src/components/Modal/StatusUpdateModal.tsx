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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Update Status</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {booking.trackingId} — {booking.parcelName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Delivery Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
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
                        : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
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
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
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
                      ? "bg-[#1C1D20] text-white border-[#1C1D20]"
                      : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all resize-none"
              placeholder="Add a note about this status change..."
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1D20] text-white text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
