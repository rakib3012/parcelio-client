import {
  X,
  Package,
  FileText,
  CreditCard,
  User,
  Phone,
  MapPin,
  Calendar,
  ArrowUpDown,
  Headset,
  Truck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { AdminBooking } from "@/lib/hooks/api/admin/getAllBookings";
import {
  StatusBadge,
  statusConfig,
} from "@/components/AdminComponent/StatusBadge";
import { PaymentBadge } from "@/components/AdminComponent/PaymentBadge";
import { BookingDetailSection } from "@/components/AdminComponent/BookingDetailSection";
import { BookingInfoItem } from "@/components/AdminComponent/BookingInfoItem";

interface BookingDetailModalProps {
  booking: AdminBooking;
  onClose: () => void;
  onUpdateStatus: () => void;
}

export function BookingDetailModal({
  booking,
  onClose,
  onUpdateStatus,
}: BookingDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#151a23] border border-neutral-100 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/10 sticky top-0 bg-white dark:bg-[#151a23] rounded-t-3xl z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {booking.trackingId}
              </h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {booking.parcelName}
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

        <div className="p-6 space-y-6">
          {/* Parcel Info */}
          <BookingDetailSection title="Parcel Information">
            <div className="grid grid-cols-2 gap-4">
              <BookingInfoItem
                icon={Package}
                label="Name"
                value={booking.parcelName}
              />
              <BookingInfoItem
                icon={FileText}
                label="Type"
                value={
                  booking.parcelType === "document"
                    ? "Document"
                    : "Non-document"
                }
              />
              <BookingInfoItem
                icon={Package}
                label="Weight"
                value={`${booking.parcelWeight} kg`}
              />
              <BookingInfoItem
                icon={CreditCard}
                label="Charge"
                value={`৳ ${booking.deliveryCharge}`}
              />
            </div>
          </BookingDetailSection>

          {/* Sender Info */}
          <BookingDetailSection title="Sender Details">
            <div className="grid grid-cols-2 gap-4">
              <BookingInfoItem
                icon={User}
                label="Name"
                value={booking.senderName}
              />
              <BookingInfoItem
                icon={Phone}
                label="Phone"
                value={booking.senderPhone}
              />
              <BookingInfoItem
                icon={MapPin}
                label="District"
                value={booking.senderDistrict}
              />
              <BookingInfoItem
                icon={MapPin}
                label="Address"
                value={booking.senderAddress}
              />
            </div>
            {booking.pickupInstruction && (
              <div className="mt-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#10141d] border border-neutral-100 dark:border-white/10">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Pickup Instruction
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-200">
                  {booking.pickupInstruction}
                </p>
              </div>
            )}
          </BookingDetailSection>

          {/* Receiver Info */}
          <BookingDetailSection title="Receiver Details">
            <div className="grid grid-cols-2 gap-4">
              <BookingInfoItem
                icon={User}
                label="Name"
                value={booking.receiverName}
              />
              <BookingInfoItem
                icon={Phone}
                label="Phone"
                value={booking.receiverPhone}
              />
              <BookingInfoItem
                icon={MapPin}
                label="District"
                value={booking.receiverDistrict}
              />
              <BookingInfoItem
                icon={MapPin}
                label="Address"
                value={booking.receiverAddress}
              />
            </div>
            {booking.deliveryInstruction && (
              <div className="mt-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#10141d] border border-neutral-100 dark:border-white/10">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Delivery Instruction
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-200">
                  {booking.deliveryInstruction}
                </p>
              </div>
            )}
          </BookingDetailSection>

          {/* Payment Info */}
          <BookingDetailSection title="Payment Information">
            <div className="grid grid-cols-2 gap-4">
              <BookingInfoItem
                icon={CreditCard}
                label="Method"
                value={booking.paymentMethod
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (character) => character.toUpperCase())}
              />
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Payment Status</p>
                <PaymentBadge status={booking.paymentStatus} />
              </div>
            </div>
          </BookingDetailSection>

          {/* Cancellation Alert Callout */}
          {booking.cancellationReason && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-1">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Delivery Cancelled</span>
              </div>
              <p className="text-sm font-medium text-red-900 dark:text-red-200">
                Reason: {booking.cancellationReason}
              </p>
              {booking.cancelledAt && (
                <p className="text-[11px] text-red-600/80 dark:text-red-400/80">
                  Cancelled on: {new Date(booking.cancelledAt).toLocaleString("en-US")}
                </p>
              )}
            </div>
          )}

          {/* Hub Dispatch & Assignment Audit */}
          {(booking.operatorId || booking.riderId || booking.assignedAt) && (
            <BookingDetailSection title="Dispatch & Rider Assignment">
              <div className="grid grid-cols-2 gap-4">
                <BookingInfoItem
                  icon={Headset}
                  label="Dispatch Operator"
                  value={
                    typeof booking.operatorId === "object" && booking.operatorId?.fullName
                      ? booking.operatorId.fullName
                      : "Central Hub Operator"
                  }
                />
                <BookingInfoItem
                  icon={Truck}
                  label="Assigned Rider"
                  value={
                    booking.riderId
                      ? typeof booking.riderId === "object" && (booking.riderId as { fullName?: string })?.fullName
                        ? (booking.riderId as { fullName?: string }).fullName || "Fleet Courier"
                        : "Active Fleet Rider"
                      : "Unassigned"
                  }
                />
                {booking.assignedAt && (
                  <BookingInfoItem
                    icon={Calendar}
                    label="Assigned Time"
                    value={new Date(booking.assignedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                )}
                {booking.deliveredAt && (
                  <BookingInfoItem
                    icon={CheckCircle2}
                    label="Delivered At"
                    value={new Date(booking.deliveredAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                )}
              </div>
            </BookingDetailSection>
          )}

          {/* Status History */}
          {booking.statusHistory && booking.statusHistory.length > 0 && (
            <BookingDetailSection title="Status History">
              <div className="space-y-3">
                {booking.statusHistory.map((entry, index) => {
                  const currentStatusConfig =
                    statusConfig[entry.status] || statusConfig.pending;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 ${currentStatusConfig.dot} flex-shrink-0`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-semibold ${currentStatusConfig.text}`}
                          >
                            {currentStatusConfig.label}
                          </span>
                          {entry.updatedByRole && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 uppercase">
                              by {entry.updatedByRole}
                            </span>
                          )}
                          <span className="text-[11px] text-neutral-400">
                            {new Date(entry.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </BookingDetailSection>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created:{" "}
              {new Date(booking.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={onUpdateStatus}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1D20] dark:bg-lime-400 text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-lime-500 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowUpDown className="w-4 h-4" />
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}
