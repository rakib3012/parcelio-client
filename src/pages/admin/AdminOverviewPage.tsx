import { Link } from "react-router"
import {
  Users,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Headset,
} from "lucide-react"
import { useAdminDashboardStats } from "@/lib/hooks/api/admin/getDashboardStats"
import Cookies from "js-cookie"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { useAuthStore } from "@/lib/store/authStore"

// ── Chart Data ──────────────────────────────────────────────────
const monthlyData = [
  { month: "Jan", users: 4, riders: 2 },
  { month: "Feb", users: 8, riders: 5 },
  { month: "Mar", users: 15, riders: 8 },
  { month: "Apr", users: 22, riders: 14 },
  { month: "May", users: 28, riders: 18 },
  { month: "Jun", users: 35, riders: 22 },
  { month: "Jul", users: 42, riders: 28 },
  { month: "Aug", users: 48, riders: 32 },
]

const areaChartConfig = {
  users: {
    label: "Users",
    color: "#22c55e",
  },
  riders: {
    label: "Riders",
    color: "#3b82f6",
  },
} satisfies ChartConfig

const DONUT_COLORS = ["#06b6d4", "#a855f7", "#10b981"]

// ── Sparkline Mini Component ────────────────────────────────────
function MiniSparkline({
  color,
  variant = "wave",
}: {
  color: string
  variant?: "wave" | "flat" | "up"
}) {
  const paths: Record<string, string> = {
    wave: "M0,20 Q10,5 20,15 Q30,25 40,10 Q50,0 60,12 Q70,22 80,8",
    flat: "M0,15 L20,15 L40,15 L60,15 L80,15",
    up: "M0,20 Q20,18 40,12 Q60,6 80,2",
  }

  return (
    <svg
      viewBox="0 0 80 25"
      className="w-16 h-6 opacity-60"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d={paths[variant]} />
    </svg>
  )
}

// ── Stats Card (Light & Dark Theme) ─────────────────────────────
interface OverviewStatsCardProps {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  sparkColor: string
  sparkVariant?: "wave" | "flat" | "up"
}

function OverviewStatsCard({
  label,
  value,
  icon: Icon,
  iconColor,
  sparkColor,
  sparkVariant = "wave",
}: OverviewStatsCardProps) {
  return (
    <Card className="bg-white dark:bg-[#1a1f2e]/80 border-neutral-200/80 dark:border-white/10 shadow-xs hover:shadow-md dark:hover:border-white/20 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <span className="text-[11px] font-bold text-neutral-500 dark:text-white/60 uppercase tracking-widest">
            {label}
          </span>
          <div
            className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center transition-opacity`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {value}
          </p>
          <MiniSparkline color={sparkColor} variant={sparkVariant} />
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main Page ───────────────────────────────────────────────────
const AdminOverviewPage = () => {
  const token = Cookies.get("accessToken")
  const { data, isLoading, isError } = useAdminDashboardStats({ token })
  const stats = data?.data?.stats
  const currentUser = useAuthStore((state) => state.currentUser)

  // Donut data
  const donutData = [
    { name: "Users", value: stats?.users.customers ?? 0 },
    { name: "Riders", value: stats?.users.riders ?? 0 },
    { name: "Operators", value: stats?.users.operators ?? 0 },
  ]

  const donutConfig = {
    users: {
      label: "Users",
      color: "#06b6d4",
    },
    riders: {
      label: "Riders",
      color: "#a855f7",
    },
    operators: {
      label: "Operators",
      color: "#10b981",
    },
  } satisfies ChartConfig

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neutral-400 dark:text-white/40 animate-spin" />
          <p className="text-sm text-neutral-500 dark:text-white/50 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
          </div>
          <p className="text-sm text-neutral-700 dark:text-white/70 font-medium">
            Failed to load dashboard stats
          </p>
          <p className="text-xs text-neutral-400 dark:text-white/40">
            Please check your connection and try again
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Admin Dashboard Overall View
          </h1>
          <p className="text-sm text-neutral-500 dark:text-white/50 mt-1">
            Welcome back, {currentUser?.fullName || "Admin"}!
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/operators"
            className="inline-flex items-center gap-2 bg-white dark:bg-white/10 text-neutral-700 dark:text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/15 transition-colors border border-neutral-200 dark:border-white/10 shadow-xs"
          >
            <Headset className="w-4 h-4 text-emerald-500" />
            Operators
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 bg-white dark:bg-white/10 text-neutral-700 dark:text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/15 transition-colors border border-neutral-200 dark:border-white/10 shadow-xs"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 bg-white dark:bg-white/10 text-neutral-700 dark:text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/15 transition-colors border border-neutral-200 dark:border-white/10 shadow-xs"
          >
            <Package className="w-4 h-4" />
            Manage Bookings
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <OverviewStatsCard
          label="Total Users"
          value={stats?.users.total ?? 0}
          icon={Users}
          iconColor="bg-blue-50 text-blue-600 dark:bg-blue-500/30 dark:text-blue-300"
          sparkColor="#3b82f6"
          sparkVariant="wave"
        />
        <OverviewStatsCard
          label="Operators"
          value={stats?.users.operators ?? 0}
          icon={Headset}
          iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-300"
          sparkColor="#10b981"
          sparkVariant="up"
        />
        <OverviewStatsCard
          label="Pending"
          value={stats?.bookings.pending ?? 0}
          icon={Clock}
          iconColor="bg-orange-50 text-orange-600 dark:bg-orange-500/30 dark:text-orange-300"
          sparkColor="#fb923c"
          sparkVariant="wave"
        />
        <OverviewStatsCard
          label="In Transit"
          value={stats?.bookings.inTransit ?? 0}
          icon={Truck}
          iconColor="bg-cyan-50 text-cyan-600 dark:bg-cyan-500/30 dark:text-cyan-300"
          sparkColor="#06b6d4"
          sparkVariant="flat"
        />
        <OverviewStatsCard
          label="Delivered"
          value={stats?.bookings.delivered ?? 0}
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-300"
          sparkColor="#10b981"
          sparkVariant="flat"
        />
        <OverviewStatsCard
          label="Revenue"
          value={`৳${(stats?.revenue ?? 0).toLocaleString()}`}
          icon={TrendingUp}
          iconColor="bg-lime-100 text-lime-800 dark:bg-[#CAEA3C]/30 dark:text-[#CAEA3C]"
          sparkColor="#84cc16"
          sparkVariant="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart - spans 2 cols */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#1a1f2e]/80 border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-neutral-900 dark:text-white text-base font-semibold">
              Growth Overview
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-white/40 text-xs">
              Monthly users and riders registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={areaChartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#22c55e"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#22c55e"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient id="fillRiders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-neutral-200 dark:stroke-white/10"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-neutral-500 dark:text-neutral-400"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-neutral-500 dark:text-neutral-400"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      className="bg-white dark:bg-[#1a1f2e] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white shadow-lg"
                    />
                  }
                />
                <ChartLegend
                  content={
                    <ChartLegendContent className="text-neutral-600 dark:text-white/60" />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#fillUsers)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#22c55e",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="riders"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#fillRiders)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#3b82f6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="bg-white dark:bg-[#1a1f2e]/80 border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-neutral-900 dark:text-white text-base font-semibold">
              User Distribution
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-white/40 text-xs">
              Customer vs Rider ratio
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ChartContainer
              config={donutConfig}
              className="aspect-square h-[220px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="bg-white dark:bg-[#1a1f2e] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white shadow-lg"
                    />
                  }
                />
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {donutData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-xs text-neutral-600 dark:text-white/60 font-medium">
                  Users
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-xs text-neutral-600 dark:text-white/60 font-medium">
                  Riders
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-neutral-600 dark:text-white/60 font-medium">
                  Operators
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-neutral-400 dark:text-white/40 uppercase tracking-widest mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="group bg-white dark:bg-[#1a1f2e]/80 rounded-2xl p-6 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  User Management
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  Create, edit, and manage user accounts
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-white/30 group-hover:text-neutral-900 dark:group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/operators"
            className="group bg-white dark:bg-[#1a1f2e]/80 rounded-2xl p-6 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Headset className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Operator Management
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  Hub dispatchers & branch staff
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-white/30 group-hover:text-neutral-900 dark:group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/bookings"
            className="group bg-white dark:bg-[#1a1f2e]/80 rounded-2xl p-6 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Booking Management
                </h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  Track, update, and manage parcel bookings
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-white/30 group-hover:text-neutral-900 dark:group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminOverviewPage
