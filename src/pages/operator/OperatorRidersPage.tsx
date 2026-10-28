import { useState, useEffect } from "react";
import {
  Truck,
  Search,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useRiderFleet } from "@/lib/hooks/api/operator/getRiderFleet";
import Cookies from "js-cookie";
import { RoleBadge } from "@/components/AdminComponent/RoleBadge";

const OperatorRidersPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const token = Cookies.get("accessToken") || "";

  // Fetch riders using operator-accessible fleet endpoint
  const { data, isLoading, isError, refetch } = useRiderFleet({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    token,
  });

  const riders = data?.data?.riders ?? data?.data?.users ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Rider Pool & Coordination
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {pagination
                  ? `${pagination.total} registered fleet riders`
                  : "View and coordinate on-duty delivery riders for parcel assignments"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#151a23] p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
            Total Fleet Riders
          </span>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
            {pagination?.total ?? riders.length}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            Available for district routes
          </p>
        </div>

        <div className="bg-white dark:bg-[#151a23] p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
            Dispatch Coordination
          </span>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
            Direct Contact
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Call or message riders directly
          </p>
        </div>

        <div className="bg-white dark:bg-[#151a23] p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
            Network Status
          </span>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
            Online
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Live parcel handovers
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs p-4 transition-colors">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search riders by name, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-700 dark:text-neutral-200 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Failed to load riders
            </p>
          </div>
        ) : riders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Truck className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm text-neutral-400 font-medium">No riders found</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-white/10 bg-neutral-50/50 dark:bg-[#10141d]/50">
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Rider
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Email
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Phone
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Role
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Joined
                    </th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Direct Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-white/10">
                  {riders.map((rider) => (
                    <tr
                      key={rider._id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {rider.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-neutral-900 dark:text-white block">
                              {rider.fullName}
                            </span>
                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                              Active Courier
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">
                          {rider.emailAddress}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {rider.phone || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={rider.role} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-neutral-400">
                          {new Date(rider.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {rider.phone ? (
                          <a
                            href={`tel:${rider.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-semibold transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Call
                          </a>
                        ) : (
                          <a
                            href={`mailto:${rider.emailAddress}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 text-xs font-semibold transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Email
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-neutral-100 dark:divide-white/10">
              {riders.map((rider) => (
                <div key={rider._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                        {rider.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                          {rider.fullName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {rider.emailAddress}
                        </p>
                      </div>
                    </div>
                    <RoleBadge role={rider.role} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {rider.phone || "No phone"} · Joined{" "}
                      {new Date(rider.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {rider.phone ? (
                      <a
                        href={`tel:${rider.phone}`}
                        className="p-2 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    ) : (
                      <a
                        href={`mailto:${rider.emailAddress}`}
                        className="p-2 text-blue-700 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                    )}
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
          <span className="text-xs text-neutral-400 dark:text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} riders
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
    </div>
  );
};

export default OperatorRidersPage;

