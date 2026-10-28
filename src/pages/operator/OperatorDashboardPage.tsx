import { Link } from "react-router";
import {
  Headset,
  PackageCheck,
  Truck,
  Users,
  Package,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Send,
  Layers,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

const OperatorDashboardPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Operator Hub Dashboard
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Welcome back, {currentUser?.fullName || "Operator"}! Manage hub parcel dispatch and rider coordination.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/operator/booking"
            className="inline-flex items-center gap-2 bg-[#CAEA3C] hover:bg-[#bde028] text-neutral-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Book a Parcel
          </Link>
          <Link
            to="/operator/bulk-assign"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white/10 dark:hover:bg-white/15 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            Bulk Assign
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151a23] p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Hub Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">Active</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Central Dispatching Online
          </p>
        </div>

        <div className="bg-white dark:bg-[#151a23] p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Pending Parcels
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">Ready</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Awaiting rider assignment
          </p>
        </div>

        <div className="bg-white dark:bg-[#151a23] p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Rider Fleet
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">Connected</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            On-duty riders available
          </p>
        </div>

        <div className="bg-white dark:bg-[#151a23] p-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Security & Role
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">Operator</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Hub verification verified
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-xs font-bold text-neutral-400 dark:text-white/40 uppercase tracking-widest mb-3">
          Hub Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/operator/booking"
            className="group bg-white dark:bg-[#151a23] rounded-2xl p-5 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#CAEA3C]/20 text-[#7ca320] dark:text-[#CAEA3C] flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Book a Parcel
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  Consign new parcel shipment for walk-in customer
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#7ca320] dark:text-[#CAEA3C]">
              <span>Book Consignment</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/operator/bulk-assign"
            className="group bg-white dark:bg-[#151a23] rounded-2xl p-5 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Bulk Assign
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  Select pending parcels and assign to fleet riders
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Open Bulk Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/operator/bookings"
            className="group bg-white dark:bg-[#151a23] rounded-2xl p-5 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  All Bookings
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  Review status, verify consignments, and inspect tracking
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>View Parcels</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/operator/riders"
            className="group bg-white dark:bg-[#151a23] rounded-2xl p-5 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Rider Pool
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  View on-duty fleet riders and active workloads
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>View Fleet</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboardPage;
