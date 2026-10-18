import { useState } from "react"
import { Link } from "react-router"
import {
  Package,
  Bike,
  CheckCircle2,
  Phone,
  MapPin,
  TrendingUp,
  ArrowRight,
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
const weeklyData = [
  { day: "Mon", deliveries: 8, earnings: 1120 },
  { day: "Tue", deliveries: 12, earnings: 1680 },
  { day: "Wed", deliveries: 6, earnings: 840 },
  { day: "Thu", deliveries: 15, earnings: 2100 },
  { day: "Fri", deliveries: 10, earnings: 1400 },
  { day: "Sat", deliveries: 18, earnings: 2520 },
  { day: "Sun", deliveries: 4, earnings: 560 },
]

const weeklyChartConfig = {
  deliveries: {
    label: "Deliveries",
    color: "#CAEA3C",
  },
  earnings: {
    label: "Earnings (৳)",
    color: "#a855f7",
  },
} satisfies ChartConfig

const performanceData = [
  { name: "Delivered", value: 12 },
  { name: "In Transit", value: 2 },
  { name: "Assigned", value: 1 },
]
const PERF_COLORS = ["#22c55e", "#f59e0b", "#3b82f6"]

const perfConfig = {
  delivered: { label: "Delivered", color: "#22c55e" },
  inTransit: { label: "In Transit", color: "#f59e0b" },
  assigned: { label: "Assigned", color: "#3b82f6" },
} satisfies ChartConfig

// ── Sparkline ───────────────────────────────────────────────────
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
  subtitleColor?: string
}

function DarkStatsCard({
  label,
  value,
  icon: Icon,
  iconColor,
  sparkColor,
  sparkVariant = "wave",
  subtitle,
  subtitleColor = "text-white/40",
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
              <p className={`text-[11px] ${subtitleColor} mt-1 font-medium`}>
                {subtitle}
              </p>
            )}
          </div>
          <MiniSparkline color={sparkColor} variant={sparkVariant} />
        </div>
      </CardContent>
    </Card>
  )
}

// ── Task Interface ──────────────────────────────────────────────
interface TaskItem {
  id: string
  trackingCode: string
  recipientName: string
  recipientPhone: string
  destinationAddress: string
  area: string
  codAmount: number
  status: "Assigned" | "In Transit" | "Delivered"
  priority: "Express" | "Standard"
}

const mockTasks: TaskItem[] = [
  {
    id: "task-1",
    trackingCode: "ZP-88219",
    recipientName: "Fatima Rahman",
    recipientPhone: "+880 1712-345678",
    destinationAddress: "House 42, Road 11, Banani",
    area: "Dhaka North",
    codAmount: 1400,
    status: "In Transit",
    priority: "Express",
  },
  {
    id: "task-2",
    trackingCode: "ZP-88216",
    recipientName: "Nusrat Jahan",
    recipientPhone: "+880 1819-987654",
    destinationAddress: "Flat B3, Green Valley, Dhanmondi 27",
    area: "Dhaka South",
    codAmount: 850,
    status: "Assigned",
    priority: "Standard",
  },
  {
    id: "task-3",
    trackingCode: "ZP-88214",
    recipientName: "Sadia Islam",
    recipientPhone: "+880 1611-456123",
    destinationAddress: "Holding 12, Sector 4, Uttara",
    area: "Dhaka North",
    codAmount: 2100,
    status: "Assigned",
    priority: "Express",
  },
]

const RiderDashboardPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser)
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks)

  const handleUpdateStatus = (id: string, newStatus: TaskItem["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#1a1f2e]/80 rounded-2xl p-6 sm:p-8 border border-white/10 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-semibold text-white/70 mb-2 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#CAEA3C] animate-pulse"></span>
            Active Shift &bull; Fleet Rider
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser?.fullName || "Courier Rider"}! 🚴
          </h1>
          <p className="text-sm text-white/50 mt-1 max-w-xl">
            You have active deliveries queued for today. Update statuses promptly
            to ensure on-time delivery metrics.
          </p>
        </div>

        <Link
          to="/rider/deliveries"
          className="inline-flex items-center gap-2 bg-[#CAEA3C] text-neutral-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#d4f050] transition-colors shadow-lg shadow-[#CAEA3C]/20 flex-shrink-0"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DarkStatsCard
          label="Assigned Tasks"
          value={tasks.filter((t) => t.status !== "Delivered").length}
          icon={Package}
          iconColor="bg-blue-500/30"
          sparkColor="#60a5fa"
          sparkVariant="wave"
          subtitle="Pending for today"
        />
        <DarkStatsCard
          label="Delivered Today"
          value={12}
          icon={CheckCircle2}
          iconColor="bg-emerald-500/30"
          sparkColor="#34d399"
          sparkVariant="up"
          subtitle="+3 more than yesterday"
          subtitleColor="text-emerald-400"
        />
        <DarkStatsCard
          label="Today's Earnings"
          value="৳1,480"
          icon={TrendingUp}
          iconColor="bg-[#CAEA3C]/30"
          sparkColor="#CAEA3C"
          sparkVariant="up"
          subtitle="Incl. express trip bonuses"
        />
        <DarkStatsCard
          label="Service Rating"
          value="4.95 ★"
          icon={Bike}
          iconColor="bg-amber-500/30"
          sparkColor="#f59e0b"
          sparkVariant="wave"
          subtitle="From 180+ verified reviews"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Performance Area Chart */}
        <Card className="lg:col-span-2 bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold">
              Weekly Performance
            </CardTitle>
            <CardDescription className="text-white/40 text-xs">
              Deliveries and earnings over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={weeklyChartConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <AreaChart
                data={weeklyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillRiderDel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CAEA3C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#CAEA3C" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillRiderEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
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
                  content={<ChartLegendContent className="text-white/60" />}
                />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#CAEA3C"
                  strokeWidth={2.5}
                  fill="url(#fillRiderDel)"
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
                  dataKey="earnings"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#fillRiderEarn)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#a855f7",
                    stroke: "#0f1419",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Today's Performance Donut */}
        <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold">
              Today's Status
            </CardTitle>
            <CardDescription className="text-white/40 text-xs">
              Current delivery task breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ChartContainer
              config={perfConfig}
              className="aspect-square h-[200px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent className="bg-[#1a1f2e] border-white/10 text-white" />
                  }
                />
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {performanceData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PERF_COLORS[index % PERF_COLORS.length]}
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
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-white/60 font-medium">Assigned</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Deliveries List */}
      <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white text-lg font-bold tracking-tight">
                Active Delivery Queue
              </CardTitle>
              <CardDescription className="text-white/40 text-xs">
                Orders requiring immediate attention and parcel handover
              </CardDescription>
            </div>
            <span className="text-xs font-medium text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto">
              {tasks.length} shipments loaded
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors bg-white/[0.02] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                    {task.trackingCode}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      task.status === "Delivered"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : task.status === "In Transit"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                    {task.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/40">Recipient: </span>
                    <span className="font-semibold text-white">
                      {task.recipientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <Phone className="w-3.5 h-3.5 text-white/30" />
                    <span>{task.recipientPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                    <span>
                      {task.destinationAddress} ({task.area})
                    </span>
                  </div>
                </div>
              </div>

              {/* COD & Actions */}
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] uppercase font-bold text-white/30 block">
                    COD to Collect
                  </span>
                  <span className="text-base font-extrabold text-white font-mono">
                    ৳ {task.codAmount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === "Assigned" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(task.id, "In Transit")}
                      className="px-3.5 py-2 text-xs font-semibold bg-white/10 text-white hover:bg-white/15 rounded-xl transition-colors border border-white/10"
                    >
                      Start Trip
                    </button>
                  )}
                  {task.status === "In Transit" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(task.id, "Delivered")}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#CAEA3C] text-neutral-900 hover:bg-[#d4f050] rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </button>
                  )}
                  {task.status === "Delivered" && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default RiderDashboardPage
