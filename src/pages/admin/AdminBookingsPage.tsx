import { useState, useEffect } from "react";
import {
  Package,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
 
  Search,
  X,
  Filter,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
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

const statusFilterOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminBookingsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [detailBooking, setDetailBooking] = useState<AdminBooking | null>(null);
  const [bookingDataUpdate, setBookingDataUpdate] = useState<AdminBooking | null>(
    null
  );

  // Debounce search input to avoid spamming requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const token = Cookies.get("accessToken");

  const { data, isLoading, isError, refetch } = useAdminBookings({
    page,
    limit,
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
    token,
  });

  const bookings = data?.data?.bookings ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Booking Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {pagination
              ? `Total ${pagination.total} parcel consignments recorded`
              : "Track, filter, and manage all parcel consignments across the system"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#151a23] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Filter Bar: Search + Status Dropdown */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs p-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search by Booking ID / Tracking / Parcel Name */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by booking ID, tracking code, or parcel name..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-56">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all cursor-pointer"
            >
              {statusFilterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Active Filter Tags */}
        {(statusFilter || debouncedSearch) && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 text-xs">
            <span className="text-neutral-400 text-[11px] font-medium">
              Active filters:
            </span>
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium">
                Keyword: &quot;{debouncedSearch}&quot;
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium capitalize">
                {statusConfig[statusFilter] && (
                  <span
                    className={`w-2 h-2 rounded-full ${statusConfig[statusFilter].dot}`}
                  />
                )}
                Status: {statusFilter.replace("_", " ")}
                <button
                  type="button"
                  onClick={() => setStatusFilter("")}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setStatusFilter("");
                setPage(1);
              }}
              className="text-[#7ca320] dark:text-[#CAEA3C] hover:underline font-semibold text-[11px] ml-1 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}
      </div>


<div>
            {/* Complete Pagination Controls & Rows Per Page */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs px-5 py-3.5 transition-colors">
        {/* Left: Total Bookings and Current Range */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Total Bookings:{" "}
            <strong className="text-neutral-900 dark:text-white font-mono">
              {pagination?.total ?? 0}
            </strong>
          </span>
          {pagination && pagination.total > 0 && (
            <>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              <span>
                Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </span>
            </>
          )}
        </div>

        {/* Right: Rows per page selector + Page navigation buttons */}
        <div className="flex flex-wrap items-center justify-end gap-4 w-full sm:w-auto">
          {/* Rows per page dropdown */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="py-1 px-2.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-400 mr-2 font-mono">
              Page {pagination?.page || 1} of {pagination?.totalPages || 1}
            </span>

            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={!pagination || pagination.page <= 1}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination || pagination.page <= 1}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(pagination?.totalPages || 1, p + 1))
              }
              disabled={!pagination || pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setPage(pagination?.totalPages || 1)}
              disabled={!pagination || pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>


      {/* Bookings Table / List */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-7 h-7 text-[#7ca320] dark:text-[#CAEA3C] animate-spin" />
            <p className="text-xs text-neutral-400">Loading bookings...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Failed to load bookings
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-1 px-3.5 py-1.5 bg-neutral-100 dark:bg-white/10 text-xs font-semibold rounded-lg hover:bg-neutral-200"
            >
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Package className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm text-neutral-400 font-medium">
              No bookings found
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {searchInput || statusFilter
                ? "Try clearing or adjusting your search and status filter"
                : "No parcel bookings recorded in the system yet"}
            </p>
          </div>
        ) : (
          <>

            {/* Desktop Table */}
            <div className=" lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-white/10 bg-neutral-50/50 dark:bg-[#10141d]/50">
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Booking ID
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Booked By
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
                      key={booking.identifier || booking._id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-neutral-800 dark:text-lime-400">
                          {booking.trackingId}
                        </span>
                      </td>

                      {/* Booked By: formatted with user name if populated */}
                      <td className="px-6 py-4">
                        {typeof booking.userId === "object" && booking.userId ? (
                          <div>
                            <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                              {booking.userId.fullName}
                            </p>
                            <p className="text-[11px] text-neutral-400 truncate max-w-36">
                              {booking.userId.phone || booking.userId.emailAddress}
                            </p>
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                            {typeof booking.userId === "string" && booking.userId
                              ? `${booking.userId.substring(0, 8)}...`
                              : "Guest / Hub"}
                          </span>
                        )}
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
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
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
                        <span className="text-sm font-bold font-mono text-neutral-800 dark:text-white">
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            {/* <div className="lg:hidden divide-y divide-neutral-100 dark:divide-white/10">
              {bookings.map((booking) => (
                <div
                  key={booking.identifier || booking._id}
                  className="p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-neutral-800 dark:text-lime-400">
                      {booking.trackingId}
                    </span>
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
                    <span className="text-sm font-bold font-mono text-neutral-800 dark:text-white">
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
              ))}
            </div> */}
          </>
        )}
      </div>
</div>
     

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

export default AdminBookingsPage;
