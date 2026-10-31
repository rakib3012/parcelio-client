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
  const totalRecords = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages || 1;
  const startIndex = totalRecords === 0 ? 0 : (page - 1) * limit;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Booking Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Track, inspect, and manage all parcel consignments across the system.
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

      {/* Main Single Card Table Container matching SS convention */}
      <div className="bg-white dark:bg-[#151a23] rounded-3xl p-6 border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-5 transition-colors">
        {/* Controls Toolbar: Search + Status Dropdown (Left) | Total + Rows per page (Right) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by code, recipient, city..."
                className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#CAEA3C] transition-all"
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
            <div className="relative w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none pl-3.5 pr-8 py-2 text-sm rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#10141d] text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#CAEA3C] cursor-pointer"
              >
                {statusFilterOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="dark:bg-[#151a23]"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right: Total Count + Rows Per Page */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Total: {totalRecords}
            </span>

            <div className="flex items-center gap-2">
              <label
                htmlFor="rowsPerPageSelect"
                className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap"
              >
                Rows per page:
              </label>
              <select
                id="rowsPerPageSelect"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#10141d] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#CAEA3C] cursor-pointer"
              >
                <option value={5} className="dark:bg-[#151a23]">
                  5
                </option>
                <option value={10} className="dark:bg-[#151a23]">
                  10
                </option>
                <option value={20} className="dark:bg-[#151a23]">
                  20
                </option>
                <option value={50} className="dark:bg-[#151a23]">
                  50
                </option>
                <option value={100} className="dark:bg-[#151a23]">
                  100
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Tag list if filtered */}
        {(statusFilter || debouncedSearch) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
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

        {/* Data Table with Horizontal Scroll */}
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
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
            <div className="flex flex-col items-center justify-center py-16 gap-2">
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
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-neutral-50 dark:bg-[#10141d] text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-white/10">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Booking ID
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Booked By
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Parcel
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Route
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Payment
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Charge
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
                {bookings.map((booking) => (
                  <tr
                    key={booking.identifier || booking._id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                      <span className="font-mono text-[#5e7724] dark:text-[#CAEA3C]">
                        {booking.trackingId}
                      </span>
                    </td>

                    {/* Booked By */}
                    <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
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

                    <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
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

                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {booking.senderDistrict}
                        </span>
                        <span>→</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {booking.receiverDistrict}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>

                    <td className="px-4 py-3">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>

                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                      ৳ {booking.deliveryCharge}
                    </td>

                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs whitespace-nowrap">
                      {new Date(booking.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setDetailBooking(booking)}
                          className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingDataUpdate(booking)}
                          className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
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
          )}
        </div>

        {/* Pagination Section matching SS convention */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Showing {totalRecords === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(startIndex + limit, totalRecords)} of {totalRecords}{" "}
            records
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-semibold px-2 text-neutral-800 dark:text-white">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
