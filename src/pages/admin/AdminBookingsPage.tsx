import { useState } from "react"
import {
  Package,
 
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,

  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  FileText,
  Calendar,
  Eye,
  ArrowUpDown,
} from "lucide-react"
import {
  useAdminBookings,
  useUpdateBookingStatus,
} from "@/lib/hooks/api/admin/bookings"
import type { AdminBooking, UpdateBookingStatusPayload } from "@/lib/hooks/api/admin/bookings"
import Cookies from "js-cookie"

// ── Status Config ──────────────────────────────────────────────

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-50 border-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    bg: "bg-blue-50 border-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
    icon: CheckCircle2,
  },
  in_transit: {
    label: "In Transit",
    bg: "bg-sky-50 border-sky-100",
    text: "text-sky-700",
    dot: "bg-sky-500",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    bg: "bg-green-50 border-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50 border-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    icon: XCircle,
  },
}

const paymentStatusConfig: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-orange-50 border-orange-100", text: "text-orange-700" },
  paid: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" },
  cancelled: { bg: "bg-red-50 border-red-100", text: "text-red-700" },
}

function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function PaymentBadge({ status }: { status: string }) {
  const c = paymentStatusConfig[status] || paymentStatusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.bg} ${c.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ── Main Page ──────────────────────────────────────────────────

const AdminBookingsPage = () => {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [detailBooking, setDetailBooking] = useState<AdminBooking | null>(null)
  const [updateModal, setUpdateModal] = useState<AdminBooking | null>(null)

  const token = Cookies.get("accessToken")

  const { data, isLoading, isError } = useAdminBookings({
    page,
    limit: 10,
    status: statusFilter || undefined,
    token,
  })

  const bookings = data?.data?.bookings ?? []
  const pagination = data?.data?.pagination

  const statusFilterOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "in_transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Booking Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {pagination ? `${pagination.total} total bookings` : "Track and manage all parcel bookings"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-4">
        <div className="flex flex-wrap gap-2">
          {statusFilterOptions.map((opt) => {
            const sc = opt.value ? statusConfig[opt.value] : null
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.value)
                  setPage(1)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  statusFilter === opt.value
                    ? "bg-[#1C1D20] text-white border-[#1C1D20]"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {sc && statusFilter !== opt.value && (
                  <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                )}
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-neutral-500">Failed to load bookings</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Package className="w-10 h-10 text-neutral-300" />
            <p className="text-sm text-neutral-400 font-medium">No bookings found</p>
            <p className="text-xs text-neutral-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Tracking
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Parcel
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Route
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Payment
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Charge
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Date
                    </th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.identifier}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-neutral-800">
                          {booking.trackingId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 truncate max-w-[180px]">
                            {booking.parcelName}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {booking.parcelType === "document" ? "Document" : "Non-document"} · {booking.parcelWeight}kg
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <span className="font-medium">{booking.senderDistrict}</span>
                          <span>→</span>
                          <span className="font-medium">{booking.receiverDistrict}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PaymentBadge status={booking.paymentStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-neutral-800">
                          ৳ {booking.deliveryCharge}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-neutral-400">
                          {new Date(booking.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDetailBooking(booking)}
                            className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpdateModal(booking)}
                            className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Update Status"
                          >
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-neutral-100">
              {bookings.map((booking) => (
                <div key={booking.identifier} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-neutral-800">
                      {booking.trackingId}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{booking.parcelName}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {booking.parcelType === "document" ? "Document" : "Non-document"} · {booking.parcelWeight}kg
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <MapPin className="w-3 h-3" />
                      <span>{booking.senderDistrict} → {booking.receiverDistrict}</span>
                    </div>
                    <span className="text-sm font-bold text-neutral-800">৳ {booking.deliveryCharge}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PaymentBadge status={booking.paymentStatus} />
                      <span className="text-xs text-neutral-400">
                        {new Date(booking.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailBooking(booking)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpdateModal(booking)}
                        className="p-2 text-amber-600 bg-amber-50 rounded-lg"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-200/80 shadow-xs px-6 py-3">
          <span className="text-xs text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} bookings
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailBooking && (
        <BookingDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
          onUpdateStatus={() => {
            setDetailBooking(null)
            setUpdateModal(detailBooking)
          }}
        />
      )}

      {/* Status Update Modal */}
      {updateModal && (
        <StatusUpdateModal
          booking={updateModal}
          onClose={() => setUpdateModal(null)}
        />
      )}
    </div>
  )
}

// ── Booking Detail Modal ───────────────────────────────────────

function BookingDetailModal({
  booking,
  onClose,
  onUpdateStatus,
}: {
  booking: AdminBooking
  onClose: () => void
  onUpdateStatus: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-neutral-900">{booking.trackingId}</h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{booking.parcelName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Parcel Info */}
          <Section title="Parcel Information">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={Package} label="Name" value={booking.parcelName} />
              <InfoItem icon={FileText} label="Type" value={booking.parcelType === "document" ? "Document" : "Non-document"} />
              <InfoItem icon={Package} label="Weight" value={`${booking.parcelWeight} kg`} />
              <InfoItem icon={CreditCard} label="Charge" value={`৳ ${booking.deliveryCharge}`} />
            </div>
          </Section>

          {/* Sender Info */}
          <Section title="Sender Details">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={User} label="Name" value={booking.senderName} />
              <InfoItem icon={Phone} label="Phone" value={booking.senderPhone} />
              <InfoItem icon={MapPin} label="District" value={booking.senderDistrict} />
              <InfoItem icon={MapPin} label="Address" value={booking.senderAddress} />
            </div>
            {booking.pickupInstruction && (
              <div className="mt-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="text-xs font-semibold text-neutral-500 mb-1">Pickup Instruction</p>
                <p className="text-sm text-neutral-700">{booking.pickupInstruction}</p>
              </div>
            )}
          </Section>

          {/* Receiver Info */}
          <Section title="Receiver Details">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={User} label="Name" value={booking.receiverName} />
              <InfoItem icon={Phone} label="Phone" value={booking.receiverPhone} />
              <InfoItem icon={MapPin} label="District" value={booking.receiverDistrict} />
              <InfoItem icon={MapPin} label="Address" value={booking.receiverAddress} />
            </div>
            {booking.deliveryInstruction && (
              <div className="mt-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="text-xs font-semibold text-neutral-500 mb-1">Delivery Instruction</p>
                <p className="text-sm text-neutral-700">{booking.deliveryInstruction}</p>
              </div>
            )}
          </Section>

          {/* Payment Info */}
          <Section title="Payment Information">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={CreditCard} label="Method" value={booking.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} />
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Payment Status</p>
                <PaymentBadge status={booking.paymentStatus} />
              </div>
            </div>
          </Section>

          {/* Status History */}
          {booking.statusHistory && booking.statusHistory.length > 0 && (
            <Section title="Status History">
              <div className="space-y-3">
                {booking.statusHistory.map((entry, i) => {
                  const sc = statusConfig[entry.status] || statusConfig.pending
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${sc.dot} flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${sc.text}`}>{sc.label}</span>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(entry.timestamp).toLocaleString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-xs text-neutral-500 mt-0.5">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Section>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created: {new Date(booking.createdAt).toLocaleString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={onUpdateStatus}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1D20] text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">{title}</h3>
      {children}
    </div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-neutral-400">{label}</p>
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-sm text-neutral-800 font-medium">{value}</span>
      </div>
    </div>
  )
}

// ── Status Update Modal ────────────────────────────────────────

function StatusUpdateModal({
  booking,
  onClose,
}: {
  booking: AdminBooking
  onClose: () => void
}) {
  const updateMutation = useUpdateBookingStatus()
  const [newStatus, setNewStatus] = useState(booking.status)
  const [newPaymentStatus, setNewPaymentStatus] = useState(booking.paymentStatus)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")

  const allStatuses = ["pending", "accepted", "in_transit", "delivered", "cancelled"] as const
  const allPaymentStatuses = ["pending", "paid", "cancelled"] as const

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const token = Cookies.get("accessToken")

    const payload: UpdateBookingStatusPayload & { id: string } = {
      id: booking.identifier,
      status: newStatus,
      paymentStatus: newPaymentStatus !== booking.paymentStatus ? newPaymentStatus : undefined,
      note: note || undefined,
      token,
    }

    updateMutation.mutate(payload, {
      onSuccess: () => onClose(),
      onError: (err) => setError(err.message),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
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
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
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
              {allStatuses.map((s) => {
                const sc = statusConfig[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewStatus(s)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      newStatus === s
                        ? `${sc.bg} ${sc.text} ring-2 ring-offset-1 ring-current/20`
                        : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Payment Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {allPaymentStatuses.map((ps) => (
                <button
                  key={ps}
                  type="button"
                  onClick={() => setNewPaymentStatus(ps)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    newPaymentStatus === ps
                      ? "bg-[#1C1D20] text-white border-[#1C1D20]"
                      : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  {ps.charAt(0).toUpperCase() + ps.slice(1)}
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
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1D20] text-white text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminBookingsPage
