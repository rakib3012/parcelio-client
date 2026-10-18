import { useState } from "react"
import {
  Package,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  MapPin,
} from "lucide-react"
import {
  useAdminBookings,
  type AdminBooking,
} from "@/lib/hooks/api/admin/getAllBookings"
import Cookies from "js-cookie"
import {
  StatusBadge,
  statusConfig,
} from "@/components/AdminComponent/StatusBadge"
import { PaymentBadge } from "@/components/AdminComponent/PaymentBadge"
import { BookingDetailModal } from "@/components/Modal/BookingDetailModal"
import { StatusUpdateModal } from "@/components/Modal/StatusUpdateModal"

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Booking Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {pagination ? `${pagination.total} total bookings` : "Track and manage all parcel bookings"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs p-4 transition-colors">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  statusFilter === opt.value
                    ? "bg-[#CAEA3C] text-neutral-900 border-[#CAEA3C] font-bold shadow-xs"
                    : "bg-white dark:bg-[#10141d] text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5"
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
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Failed to load bookings</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Package className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm text-neutral-400 font-medium">No bookings found</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-white/10 bg-neutral-50/50 dark:bg-[#10141d]/50">
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
                <tbody className="divide-y divide-neutral-50 dark:divide-white/10">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.identifier}
                      className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-neutral-800 dark:text-lime-400">
                          {booking.trackingId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate max-w-[180px]">
                            {booking.parcelName}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {booking.parcelType === "document" ? "Document" : "Non-document"} · {booking.parcelWeight}kg
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
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
                        <span className="text-sm font-semibold text-neutral-800 dark:text-white">
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
                            className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpdateModal(booking)}
                            className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
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
            <div className="lg:hidden divide-y divide-neutral-100 dark:divide-white/10">
              {bookings.map((booking) => (
                <div key={booking.identifier} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-neutral-800 dark:text-lime-400">
                      {booking.trackingId}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{booking.parcelName}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {booking.parcelType === "document" ? "Document" : "Non-document"} · {booking.parcelWeight}kg
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <MapPin className="w-3 h-3" />
                      <span>{booking.senderDistrict} → {booking.receiverDistrict}</span>
                    </div>
                    <span className="text-sm font-bold text-neutral-800 dark:text-white">৳ {booking.deliveryCharge}</span>
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
                        className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpdateModal(booking)}
                        className="p-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg cursor-pointer"
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
        <div className="flex items-center justify-between bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs px-6 py-3 transition-colors">
          <span className="text-xs text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} bookings
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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

export default AdminBookingsPage

