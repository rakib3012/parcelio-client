import { Link } from "react-router"
import {
  Users,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  UserCheck,
  Bike,
  ShieldCheck,
  TrendingUp,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { useAdminDashboardStats } from "@/lib/hooks/api/admin/getDashboardStats"
import Cookies from "js-cookie"

const AdminOverviewPage = () => {
  const token = Cookies.get("accessToken")
  const { data, isLoading, isError } = useAdminDashboardStats({ token })
  const stats = data?.data?.stats

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-neutral-600 font-medium">Failed to load dashboard stats</p>
          <p className="text-xs text-neutral-400">Please check your connection and try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Overview of your platform's performance and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 bg-[#1C1D20] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 bg-white text-neutral-800 px-4 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <Package className="w-4 h-4" />
            Manage Bookings
          </Link>
        </div>
      </div>

      {/* User Stats Row */}
      <div>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Users"
            value={stats?.users.total ?? 0}
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            subtitle="All registered accounts"
          />
          <StatsCard
            label="Customers"
            value={stats?.users.customers ?? 0}
            icon={UserCheck}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            subtitle="Regular users"
          />
          <StatsCard
            label="Riders"
            value={stats?.users.riders ?? 0}
            icon={Bike}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            subtitle="Delivery partners"
          />
          <StatsCard
            label="Admins"
            value={stats?.users.admins ?? 0}
            icon={ShieldCheck}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            subtitle="Platform administrators"
          />
        </div>
      </div>

      {/* Booking Stats Row */}
      <div>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
          Booking Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            label="Total Bookings"
            value={stats?.bookings.total ?? 0}
            icon={Package}
            iconBg="bg-neutral-100"
            iconColor="text-neutral-700"
            subtitle="All-time parcels"
          />
          <StatsCard
            label="Pending"
            value={stats?.bookings.pending ?? 0}
            icon={Clock}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
            subtitle="Awaiting pickup"
          />
          <StatsCard
            label="In Transit"
            value={stats?.bookings.inTransit ?? 0}
            icon={Truck}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
            subtitle="Currently on route"
          />
          <StatsCard
            label="Delivered"
            value={stats?.bookings.delivered ?? 0}
            icon={CheckCircle2}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            subtitle="Successfully delivered"
          />
          <StatsCard
            label="Cancelled"
            value={stats?.bookings.cancelled ?? 0}
            icon={XCircle}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            subtitle="Cancelled parcels"
          />
          <StatsCard
            label="Revenue"
            value={`৳ ${(stats?.revenue ?? 0).toLocaleString()}`}
            icon={TrendingUp}
            iconBg="bg-[#CAEA3C]/20"
            iconColor="text-[#3d5a00]"
            subtitle="From paid bookings"
            isRevenue
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/users"
            className="group bg-white rounded-2xl p-6 border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">User Management</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Create, edit, and manage user accounts
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/bookings"
            className="group bg-white rounded-2xl p-6 border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Booking Management</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Track, update, and manage parcel bookings
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Reusable Stats Card ────────────────────────────────────────

function StatsCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
  isRevenue = false,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  subtitle: string
  isRevenue?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p className={`mt-2 font-bold text-neutral-900 ${isRevenue ? "text-xl" : "text-2xl"}`}>
        {value}
      </p>
      <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
    </div>
  )
}

export default AdminOverviewPage
