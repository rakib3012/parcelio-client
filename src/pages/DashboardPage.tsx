import { Link } from "react-router"
import { Package, Truck, CheckCircle2, PlusCircle, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"

const DashboardPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser)

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-800 mb-2 border border-neutral-200">
            <span className="w-2 h-2 rounded-full bg-[#CAEA3C]"></span>
            Protected Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Welcome back, {currentUser?.fullName || "Member"}!
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage your personal shipments, active riders, and courier history.
          </p>
        </div>

        <Link
          to="/dashboard/deliveries"
          className="inline-flex items-center gap-2 bg-[#1C1D20] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <span>View All Deliveries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              In Transit
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">4</p>
          <p className="text-xs text-neutral-500 mt-1">
            Active parcels on route
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Delivered
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">28</p>
          <p className="text-xs text-neutral-500 mt-1">Total successfully sent</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Spent
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">৳ 3,420</p>
          <p className="text-xs text-neutral-500 mt-1">Lifetime courier costs</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Saved Hubs
            </span>
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-lime-800 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">3</p>
          <p className="text-xs text-neutral-500 mt-1">Favorite pickup hubs</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
