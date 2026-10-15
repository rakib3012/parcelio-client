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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-800 mb-2 border border-neutral-200">
            <span className="w-2 h-2 rounded-full bg-[#CAEA3C]"></span>
            Active Shift &bull; Fleet Rider
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Welcome back, {currentUser?.fullName || "Courier Rider"}! 🚴
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            You have active deliveries queued for today. Update statuses promptly
            to ensure on-time delivery metrics.
          </p>
        </div>

        <Link
          to="/rider/deliveries"
          className="inline-flex items-center gap-2 bg-[#1C1D20] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex-shrink-0"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Assigned Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">
            {tasks.filter((t) => t.status !== "Delivered").length}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Pending for today</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Delivered Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">12</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            +3 more than yesterday
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Today's Earnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#CAEA3C]/30 text-[#3d5a00] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">৳ 1,480</p>
          <p className="text-xs text-neutral-500 mt-1">
            Incl. express trip bonuses
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Service Rating
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">4.95 ★</p>
          <p className="text-xs text-neutral-500 mt-1">From 180+ verified reviews</p>
        </div>
      </div>

      {/* Active Deliveries List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              Active Delivery Queue
            </h2>
            <p className="text-xs text-neutral-500">
              Orders requiring immediate attention and parcel handover
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full self-start sm:self-auto">
            {tasks.length} shipments loaded
          </span>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl border border-neutral-200/80 hover:border-neutral-300 transition-colors bg-neutral-50/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                    {task.trackingCode}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      task.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : task.status === "In Transit"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                    {task.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500">Recipient: </span>
                    <span className="font-semibold text-neutral-900">
                      {task.recipientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{task.recipientPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span>
                      {task.destinationAddress} ({task.area})
                    </span>
                  </div>
                </div>
              </div>

              {/* COD & Actions */}
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-200">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    COD to Collect
                  </span>
                  <span className="text-base font-extrabold text-neutral-900 font-mono">
                    ৳ {task.codAmount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === "Assigned" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(task.id, "In Transit")}
                      className="px-3.5 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl transition-colors shadow-xs"
                    >
                      Start Trip
                    </button>
                  )}
                  {task.status === "In Transit" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(task.id, "Delivered")}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#CAEA3C] text-neutral-900 hover:bg-[#b8d82d] rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </button>
                  )}
                  {task.status === "Delivered" && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RiderDashboardPage
