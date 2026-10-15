import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react"

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
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Earnings & Payouts
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          View your daily courier wages, trip bonuses, and weekly payout records.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Earnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#CAEA3C]/30 text-[#3d5a00] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">৳ 24,850</p>
          <p className="text-xs text-neutral-500 mt-1">Lifetime courier payouts</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">৳ 3,420</p>
          <p className="text-xs text-neutral-500 mt-1">Scheduled for next Monday</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              This Week's Bonuses
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">৳ 850</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">
            Peak hours & ratings reward
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Completed Trips
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">184</p>
          <p className="text-xs text-neutral-500 mt-1">Total completed parcels</p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              Recent Weekly Payouts
            </h2>
            <p className="text-xs text-neutral-500">
              Direct disbursements to your registered mobile wallet
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/75 border-b border-neutral-200/70 text-neutral-500 uppercase tracking-wider">
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
            <tbody className="divide-y divide-neutral-100">
              {mockPayouts.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="py-4 px-5 font-semibold text-neutral-900">
                    {record.payoutDate}
                  </td>
                  <td className="py-4 px-5 text-neutral-700">
                    {record.tripsCount} parcels
                  </td>
                  <td className="py-4 px-5 font-mono text-neutral-900">
                    ৳ {record.deliveryFees}
                  </td>
                  <td className="py-4 px-5 font-mono text-emerald-600 font-semibold">
                    +৳ {record.bonusAmount}
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-neutral-900 text-sm">
                    ৳ {record.totalAmount}
                  </td>
                  <td className="py-4 px-5 text-neutral-600 font-medium">
                    {record.paymentMethod}
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RiderEarningsPage
