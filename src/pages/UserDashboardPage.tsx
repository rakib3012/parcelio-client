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
interface DarkStatsCardProps {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  sparkColor: string
  sparkVariant?: "wave" | "flat" | "up"
  subtitle?: string
}

function DarkStatsCard({
  label,
  value,
  icon: Icon,
  iconColor,
  sparkColor,
  sparkVariant = "wave",
  subtitle,
}: DarkStatsCardProps) {
  return (
    <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
            {label}
          </span>
          <div
            className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-[11px] text-white/40 mt-1">{subtitle}</p>
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
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-[#1a1f2e]/80 rounded-2xl p-6 sm:p-8 border border-white/10 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-semibold text-white/70 mb-2 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#CAEA3C] animate-pulse"></span>
            Protected Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser?.fullName || "Member"}!
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Manage your personal shipments, active riders, and courier history.
          </p>
        </div>

        <Link
          to="/user_dashboard/deliveries"
          className="inline-flex items-center gap-2 bg-[#CAEA3C] text-neutral-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#d4f050] transition-colors shadow-lg shadow-[#CAEA3C]/20"
        >
          <span>View All Deliveries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DarkStatsCard
          label="In Transit"
          value={4}
          icon={Truck}
          iconColor="bg-amber-500/30"
          sparkColor="#f59e0b"
          sparkVariant="wave"
          subtitle="Active parcels on route"
        />
        <DarkStatsCard
          label="Delivered"
          value={28}
          icon={CheckCircle2}
          iconColor="bg-emerald-500/30"
          sparkColor="#34d399"
          sparkVariant="up"
          subtitle="Total successfully sent"
        />
        <DarkStatsCard
          label="Total Spent"
          value="৳3,420"
          icon={TrendingUp}
          iconColor="bg-[#CAEA3C]/30"
          sparkColor="#CAEA3C"
          sparkVariant="wave"
          subtitle="Lifetime courier costs"
        />
        <DarkStatsCard
          label="Saved Hubs"
          value={3}
          icon={PlusCircle}
          iconColor="bg-cyan-500/30"
          sparkColor="#22d3ee"
          sparkVariant="flat"
          subtitle="Favorite pickup hubs"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spending Area Chart */}
        <Card className="lg:col-span-2 bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold">
              Monthly Spending
            </CardTitle>
            <CardDescription className="text-white/40 text-xs">
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
                      stopColor="#CAEA3C"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#CAEA3C"
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
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      className="bg-[#1a1f2e] border-white/10 text-white"
                    />
                  }
                />
                <ChartLegend
                  content={
                    <ChartLegendContent className="text-white/60" />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#CAEA3C"
                  strokeWidth={2.5}
                  fill="url(#fillSpent)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#CAEA3C",
                    stroke: "#0f1419",
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
                    stroke: "#0f1419",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Donut */}
        <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold">
              Delivery Status
            </CardTitle>
            <CardDescription className="text-white/40 text-xs">
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
                    <ChartTooltipContent className="bg-[#1a1f2e] border-white/10 text-white" />
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
                <span className="text-xs text-white/60 font-medium">Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-white/60 font-medium">In Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-xs text-white/60 font-medium">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/user_dashboard/booking"
            className="group bg-[#1a1f2e]/80 rounded-2xl p-6 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#CAEA3C]/20 text-[#CAEA3C] flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Book a Parcel</h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Send a new parcel with Parcelio
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/user_dashboard/deliveries"
            className="group bg-[#1a1f2e]/80 rounded-2xl p-6 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Track Deliveries</h3>
                <p className="text-xs text-white/40 mt-0.5">
                  View all your sent parcels
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserDashboardPage
