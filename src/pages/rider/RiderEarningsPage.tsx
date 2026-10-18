import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

interface PayoutRecord {
  id: string
  payoutDate: string
  tripsCount: number
  deliveryFees: number
  bonusAmount: number
  totalAmount: number
  paymentMethod: "bKash" | "Nagad" | "Bank Transfer"
  status: "Completed" | "Processing"
}

const mockPayouts: PayoutRecord[] = [
  {
    id: "po-101",
    payoutDate: "2026-10-12",
    tripsCount: 28,
    deliveryFees: 3920,
    bonusAmount: 500,
    totalAmount: 4420,
    paymentMethod: "bKash",
    status: "Completed",
  },
  {
    id: "po-102",
    payoutDate: "2026-10-05",
    tripsCount: 34,
    deliveryFees: 4760,
    bonusAmount: 750,
    totalAmount: 5510,
    paymentMethod: "bKash",
    status: "Completed",
  },
  {
    id: "po-103",
    payoutDate: "2026-09-28",
    tripsCount: 22,
    deliveryFees: 3080,
    bonusAmount: 300,
    totalAmount: 3380,
    paymentMethod: "Nagad",
    status: "Completed",
  },
]

const RiderEarningsPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Earnings & Payouts
        </h1>
        <p className="text-sm text-white/50 mt-0.5">
          View your daily courier wages, trip bonuses, and weekly payout records.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DarkStatsCard
          label="Total Earnings"
          value="৳24,850"
          icon={Wallet}
          iconColor="bg-[#CAEA3C]/30"
          sparkColor="#CAEA3C"
          sparkVariant="up"
          subtitle="Lifetime courier payouts"
        />
        <DarkStatsCard
          label="Available Balance"
          value="৳3,420"
          icon={ArrowDownRight}
          iconColor="bg-emerald-500/30"
          sparkColor="#34d399"
          sparkVariant="wave"
          subtitle="Scheduled for next Monday"
          subtitleColor="text-emerald-400"
        />
        <DarkStatsCard
          label="This Week's Bonuses"
          value="৳850"
          icon={ArrowUpRight}
          iconColor="bg-amber-500/30"
          sparkColor="#f59e0b"
          sparkVariant="up"
          subtitle="Peak hours & ratings reward"
          subtitleColor="text-amber-400"
        />
        <DarkStatsCard
          label="Completed Trips"
          value={184}
          icon={CheckCircle2}
          iconColor="bg-blue-500/30"
          sparkColor="#60a5fa"
          sparkVariant="wave"
          subtitle="Total completed parcels"
        />
      </div>

      {/* Payout History Table */}
      <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recent Weekly Payouts
            </h2>
            <p className="text-xs text-white/40">
              Direct disbursements to your registered mobile wallet
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/5 text-white/40 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5 font-semibold">Payout Date</th>
                <th className="py-3 px-5 font-semibold">Deliveries Done</th>
                <th className="py-3 px-5 font-semibold">Delivery Fee</th>
                <th className="py-3 px-5 font-semibold">Bonus</th>
                <th className="py-3 px-5 font-semibold">Total Paid</th>
                <th className="py-3 px-5 font-semibold">Method</th>
                <th className="py-3 px-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockPayouts.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-5 font-semibold text-white">
                    {record.payoutDate}
                  </td>
                  <td className="py-4 px-5 text-white/60">
                    {record.tripsCount} parcels
                  </td>
                  <td className="py-4 px-5 font-mono text-white">
                    ৳ {record.deliveryFees}
                  </td>
                  <td className="py-4 px-5 font-mono text-emerald-400 font-semibold">
                    +৳ {record.bonusAmount}
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-white text-sm">
                    ৳ {record.totalAmount}
                  </td>
                  <td className="py-4 px-5 text-white/60 font-medium">
                    {record.paymentMethod}
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default RiderEarningsPage
