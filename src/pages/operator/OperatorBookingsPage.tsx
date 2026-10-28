import { useState } from "react";
import { Link } from "react-router";
import {
  Package,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  MapPin,
  Truck,
  CheckSquare,
  Square,
  Send,
  Layers,
} from "lucide-react";
import {
  useAdminBookings,
  type AdminBooking,
} from "@/lib/hooks/api/admin/getAllBookings";
import Cookies from "js-cookie";
import {
  StatusBadge,
  statusConfig,
} from "@/components/AdminComponent/StatusBadge";
import { PaymentBadge } from "@/components/AdminComponent/PaymentBadge";
import { BookingDetailModal } from "@/components/Modal/BookingDetailModal";
import { StatusUpdateModal } from "@/components/Modal/StatusUpdateModal";
import { BulkAssignModal } from "@/components/Modal/BulkAssignModal";

const OperatorBookingsPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<AdminBooking | null>(null);
  const [bookingDataUpdate, setBookingDataUpdate] = useState<AdminBooking | null>(
    null
  );

  const token = Cookies.get("accessToken");

  const { data, isLoading, isError, refetch } = useAdminBookings({
    page,
    limit: 10,
    status: statusFilter || undefined,
    token,
  });

  const bookings = data?.data?.bookings ?? [];
  const pagination = data?.data?.pagination;

  // Only pending parcels can be assigned to riders
  const pendingBookingsOnPage = bookings.filter(
    (b) => b.status === "pending"
  );

  const allPendingSelected =
    pendingBookingsOnPage.length > 0 &&
    pendingBookingsOnPage.every((b) =>
      selectedBookingIds.includes(b._id || b.identifier)
    );

  const handleToggleSelect = (bookingId: string) => {
    setSelectedBookingIds((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleToggleSelectAll = () => {
    if (allPendingSelected) {
      const pagePendingIds = new Set(
        pendingBookingsOnPage.map((b) => b._id || b.identifier)
      );
      setSelectedBookingIds((prev) =>
        prev.filter((id) => !pagePendingIds.has(id))
      );
    } else {
      const pagePendingIds = pendingBookingsOnPage.map(
        (b) => b._id || b.identifier
      );
      setSelectedBookingIds((prev) =>
        Array.from(new Set([...prev, ...pagePendingIds]))
      );
    }
  };

  const statusFilterOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "in_transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Hub Parcel Dispatch
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {pagination
              ? `${pagination.total} total hub bookings`
              : "Review parcel consignments, verify routes, and update dispatch status"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/operator/booking"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#CAEA3C] hover:bg-[#bde028] text-neutral-900 font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Book a Parcel
          </Link>
          <Link
            to="/operator/bulk-assign"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white/10 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            Bulk Assign
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs p-4 transition-colors">
        <div className="flex flex-wrap gap-2">
          {statusFilterOptions.map((option) => {
            const currentStatusConfig = option.value
              ? statusConfig[option.value]
              : null;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setStatusFilter(option.value);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  statusFilter === option.value
                    ? "bg-[#CAEA3C] text-neutral-900 border-[#CAEA3C] font-bold shadow-xs"
                    : "bg-white dark:bg-[#10141d] text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5"
                }`}
              >
                {currentStatusConfig && statusFilter !== option.value && (
                  <span
                    className={`w-2 h-2 rounded-full ${currentStatusConfig.dot}`}
                  />
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Bar (when parcels selected) */}
      {selectedBookingIds.length > 0 && (
        <div className="bg-neutral-900 text-white dark:bg-[#CAEA3C] dark:text-neutral-900 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-white/20 dark:bg-neutral-900/20 flex items-center justify-center font-bold text-xs">
              {selectedBookingIds.length}
            </span>
            <span className="text-sm font-semibold">
              {selectedBookingIds.length} pending parcel(s) selected for assignment
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedBookingIds([])}
              className="px-3.5 py-2 rounded-xl border border-white/20 dark:border-neutral-900/20 text-xs font-semibold hover:bg-white/10 dark:hover:bg-neutral-900/10 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CAEA3C] text-neutral-900 dark:bg-neutral-900 dark:text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              Assign to Rider
            </button>
          </div>
        </div>
      )}

      {/* Table / List */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Failed to load hub parcels
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Package className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm text-neutral-400 font-medium">
              No parcels found in dispatch queue
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Try adjusting your status filter
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-white/10 bg-neutral-50/50 dark:bg-[#10141d]/50">
                    <th className="w-12 px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        disabled={pendingBookingsOnPage.length === 0}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title={
                          allPendingSelected
                            ? "Deselect all pending"
                            : "Select all pending parcels"
                        }
                      >
                        {allPendingSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#7ca320] dark:text-[#CAEA3C]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
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
                  {bookings.map((booking) => {
                    const bookingId = booking._id || booking.identifier;
                    const isSelected = selectedBookingIds.includes(bookingId);
                    return (
                      <tr
                        key={bookingId}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-[#CAEA3C]/10 dark:bg-[#CAEA3C]/5"
                            : "hover:bg-neutral-50/50 dark:hover:bg-white/5"
                        }`}
                      >
                        <td className="px-4 py-4 text-center">
                          {booking.status === "pending" ? (
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(bookingId)}
                              className="cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#7ca320] dark:text-[#CAEA3C]" />
                              ) : (
                                <Square className="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" />
                              )}
                            </button>
                          ) : (
                            <span className="text-neutral-300 dark:text-neutral-700 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-bold text-neutral-800 dark:text-lime-400">
                            {booking.trackingId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate max-w-45">
                              {booking.parcelName}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {booking.parcelType === "document"
                                ? "Document"
                                : "Non-document"}{" "}
                              · {booking.parcelWeight}kg
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-medium">
                              {booking.senderDistrict}
                            </span>
                            <span>→</span>
                            <span className="font-medium">
                              {booking.receiverDistrict}
                            </span>
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
                            {new Date(booking.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
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
                              onClick={() => setBookingDataUpdate(booking)}
                              className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Update Status"
                            >
                              <ArrowUpDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-neutral-100 dark:divide-white/10">
              {bookings.map((booking) => {
                const bookingId = booking._id || booking.identifier;
                const isSelected = selectedBookingIds.includes(bookingId);
                return (
                  <div
                    key={bookingId}
                    className={`p-4 space-y-3 ${
                      isSelected ? "bg-[#CAEA3C]/10 dark:bg-[#CAEA3C]/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(bookingId)}
                            className="cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#7ca320] dark:text-[#CAEA3C]" />
                            ) : (
                              <Square className="w-4 h-4 text-neutral-400" />
                            )}
                          </button>
                        )}
                        <span className="text-sm font-mono font-bold text-neutral-800 dark:text-lime-400">
                          {booking.trackingId}
                        </span>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {booking.parcelName}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {booking.parcelType === "document"
                          ? "Document"
                          : "Non-document"}{" "}
                        · {booking.parcelWeight}kg
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {booking.senderDistrict} → {booking.receiverDistrict}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-neutral-800 dark:text-white">
                        ৳ {booking.deliveryCharge}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PaymentBadge status={booking.paymentStatus} />
                        <span className="text-xs text-neutral-400">
                          {new Date(booking.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
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
                          onClick={() => setBookingDataUpdate(booking)}
                          className="p-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg cursor-pointer"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs px-6 py-3 transition-colors">
          <span className="text-xs text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} parcels
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(pagination.totalPages, currentPage + 1)
                )
              }
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {isBulkModalOpen && (
        <BulkAssignModal
          selectedBookingIds={selectedBookingIds}
          onClose={() => setIsBulkModalOpen(false)}
          onSuccess={() => {
            setSelectedBookingIds([]);
            refetch();
          }}
        />
      )}

      {/* Detail Modal */}
      {detailBooking && (
        <BookingDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
          onUpdateStatus={() => {
            setDetailBooking(null);
            setBookingDataUpdate(detailBooking);
          }}
        />
      )}

      {/* Status Update Modal */}
      {bookingDataUpdate && (
        <StatusUpdateModal
          booking={bookingDataUpdate}
          onClose={() => setBookingDataUpdate(null)}
        />
      )}
    </div>
  );
};

export default OperatorBookingsPage;

