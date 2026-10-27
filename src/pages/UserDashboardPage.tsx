import { Link } from "react-router"
import {
  Package,
  Truck,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
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

// ── Chart Data ──────────────────────────────────────────────────
const monthlySpending = [
  { month: "Jan", spent: 420, deliveries: 3 },
  { month: "Feb", spent: 680, deliveries: 5 },
  { month: "Mar", spent: 320, deliveries: 2 },
  { month: "Apr", spent: 890, deliveries: 7 },
  { month: "May", spent: 540, deliveries: 4 },
  { month: "Jun", spent: 750, deliveries: 6 },
  { month: "Jul", spent: 1100, deliveries: 9 },
  { month: "Aug", spent: 660, deliveries: 5 },
]

const spendingChartConfig = {
  spent: {
    label: "Amount (৳)",
    color: "#CAEA3C",
  },
  deliveries: {
    label: "Deliveries",
    color: "#06b6d4",
  },
} satisfies ChartConfig

const statusDistribution = [
  { name: "Delivered", value: 28 },
  { name: "In Transit", value: 4 },
  { name: "Pending", value: 2 },
]
const STATUS_COLORS = ["#22c55e", "#f59e0b", "#6366f1"]

const statusConfig = {
  delivered: { label: "Delivered", color: "#22c55e" },
  inTransit: { label: "In Transit", color: "#f59e0b" },
  pending: { label: "Pending", color: "#6366f1" },
} satisfies ChartConfig

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

// ── Stats Card ──────────────────────────────────────────────────
interface UserStatsCardProps {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  sparkColor: string
  sparkVariant?: "wave" | "flat" | "up"
  subtitle?: string
}

function UserStatsCard({
  label,
  value,
  icon: Icon,
  iconColor,
  sparkColor,
  sparkVariant = "wave",
  subtitle,
}: UserStatsCardProps) {
  return (
    <Card className="bg-white dark:bg-[#1a1f2e]/80 border-neutral-200/80 dark:border-white/10 shadow-xs hover:shadow-md dark:hover:border-white/20 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
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
          <div>
            <p className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-[11px] text-neutral-400 dark:text-white/40 mt-1">{subtitle}</p>
            )}
          </div>
          <MiniSparkline color={sparkColor} variant={sparkVariant} />
        </div>
      </CardContent>
    </Card>
  )
}

const UserDashboardPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser)

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Welcome Banner */}
      <div className="bg-white dark:bg-[#1a1f2e]/80 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-white/5 text-xs font-semibold text-lime-800 dark:text-white/70 mb-2 border border-lime-300/80 dark:border-white/10">
            <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-[#CAEA3C] animate-pulse"></span>
            Protected Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Welcome back, {currentUser?.fullName || "Member"}!
          </h1>
          <p className="text-sm text-neutral-500 dark:text-white/50 mt-1">
            Manage your personal shipments, active riders, and courier history.
          </p>
        </div>

        <Link
          to="/user_dashboard/deliveries"
          className="inline-flex items-center gap-2 bg-[#CAEA3C] hover:bg-[#bde028] text-neutral-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs"
        >
          <span>View All Deliveries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserStatsCard
          label="In Transit"
          value={4}
          icon={Truck}
          iconColor="bg-amber-50 text-amber-600 dark:bg-amber-500/30 dark:text-amber-300"
          sparkColor="#f59e0b"
          sparkVariant="wave"
          subtitle="Active parcels on route"
        />
        <UserStatsCard
          label="Delivered"
          value={28}
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-300"
          sparkColor="#10b981"
          sparkVariant="up"
          subtitle="Total successfully sent"
        />
        <UserStatsCard
          label="Total Spent"
          value="৳3,420"
          icon={TrendingUp}
          iconColor="bg-lime-100 text-lime-800 dark:bg-[#CAEA3C]/30 dark:text-[#CAEA3C]"
          sparkColor="#84cc16"
          sparkVariant="wave"
          subtitle="Lifetime courier costs"
        />
        <UserStatsCard
          label="Saved Hubs"
          value={3}
          icon={PlusCircle}
          iconColor="bg-cyan-50 text-cyan-600 dark:bg-cyan-500/30 dark:text-cyan-300"
          sparkColor="#06b6d4"
          sparkVariant="flat"
          subtitle="Favorite pickup hubs"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spending Area Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#1a1f2e]/80 border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-neutral-900 dark:text-white text-base font-semibold">
              Monthly Spending
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-white/40 text-xs">
              Your courier expenses over the last 8 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={spendingChartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart
                data={monthlySpending}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="fillSpent"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#84cc16"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#84cc16"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillDeliveries"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#06b6d4"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#06b6d4"
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
                  dataKey="spent"
                  stroke="#84cc16"
                  strokeWidth={2.5}
                  fill="url(#fillSpent)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#84cc16",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#fillDeliveries)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#06b6d4",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Donut */}
        <Card className="bg-white dark:bg-[#1a1f2e]/80 border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-neutral-900 dark:text-white text-base font-semibold">
              Delivery Status
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-white/40 text-xs">
              Current parcel status distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ChartContainer
              config={statusConfig}
              className="aspect-square h-[220px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent className="bg-white dark:bg-[#1a1f2e] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white shadow-lg" />
                  }
                />
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {statusDistribution.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-neutral-600 dark:text-white/60 font-medium">Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-neutral-600 dark:text-white/60 font-medium">In Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-xs text-neutral-600 dark:text-white/60 font-medium">Pending</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/user_dashboard/booking"
            className="group bg-white dark:bg-[#1a1f2e]/80 rounded-2xl p-6 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-lime-100 dark:bg-[#CAEA3C]/20 text-lime-800 dark:text-[#CAEA3C] flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Book a Parcel</h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  Send a new parcel with Parcelio
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-white/30 group-hover:text-neutral-900 dark:group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/user_dashboard/tracking"
            className="group bg-white dark:bg-[#1a1f2e]/80 rounded-2xl p-6 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Track Deliveries</h3>
                <p className="text-xs text-neutral-500 dark:text-white/40 mt-0.5">
                  View all your sent parcels
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

export default UserDashboardPage
