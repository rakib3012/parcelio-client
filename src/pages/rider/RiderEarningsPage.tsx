import { useState } from "react";
import {
  Wallet,
  CheckCircle2,
  Truck,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Package,
  Calendar,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  useRiderEarnings,
  type CompletedDeliveryItem,
} from "@/lib/hooks/api/rider/getRiderEarnings";

// ── Sparkline ───────────────────────────────────────────────────
function MiniSparkline({
  color,
  variant = "wave",
}: {
  color: string;
  variant?: "wave" | "flat" | "up";
}) {
  const paths: Record<string, string> = {
    wave: "M0,20 Q10,5 20,15 Q30,25 40,10 Q50,0 60,12 Q70,22 80,8",
    flat: "M0,15 L20,15 L40,15 L60,15 L80,15",
    up: "M0,20 Q20,18 40,12 Q60,6 80,2",
  };

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
  );
}

// ── Stats Card ──────────────────────────────────────────────────
interface DarkStatsCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  sparkColor: string;
  sparkVariant?: "wave" | "flat" | "up";
  subtitle?: string;
  subtitleColor?: string;
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
  );
}

const RiderEarningsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, refetch } = useRiderEarnings();

  const earningsData = data?.data;
  const totalEarnings = earningsData?.totalEarnings ?? 0;
  const completedTrips = earningsData?.completedTrips ?? 0;
  const inTransitEarnings = earningsData?.inTransitEarnings ?? 0;
  const inTransitCount = earningsData?.inTransitCount ?? 0;
  const todayEarnings = earningsData?.todayEarnings ?? 0;
  const todayCount = earningsData?.todayCount ?? 0;
  const completedDeliveries = earningsData?.completedDeliveries ?? [];

  // Filter completed deliveries by search
  const filteredDeliveries = completedDeliveries.filter(
    (item: CompletedDeliveryItem) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.trackingId?.toLowerCase().includes(query) ||
        item.receiverName?.toLowerCase().includes(query) ||
        item.receiverPhone?.toLowerCase().includes(query) ||
        item.receiverDistrict?.toLowerCase().includes(query) ||
        item.parcelName?.toLowerCase().includes(query)
      );
    }
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;
    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CAEA3C]/20 text-[#CAEA3C] border border-[#CAEA3C]/30 uppercase tracking-wider">
              Settlement Ledger
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Earnings & Payouts
          </h1>
          <p className="text-sm text-white/50 mt-0.5">
            Real-time courier earnings from completed parcel orders.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/rider/deliveries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-[#CAEA3C]" />
            <span>Active Deliveries</span>
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#CAEA3C] animate-spin" />
          <p className="text-xs text-white/40">Calculating total rider earnings...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4 bg-[#1a1f2e]/80 border border-white/10 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
          <p className="text-sm text-white/70 font-medium">
            Failed to load earnings ledger
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Real KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DarkStatsCard
              label="Total Earnings"
              value={`৳${totalEarnings.toLocaleString()}`}
              icon={Wallet}
              iconColor="bg-[#CAEA3C]/30 text-neutral-900"
              sparkColor="#CAEA3C"
              sparkVariant="up"
              subtitle={`From ${completedTrips} completed orders`}
              subtitleColor="text-[#CAEA3C]"
            />

            <DarkStatsCard
              label="Completed Trips"
              value={completedTrips}
              icon={CheckCircle2}
              iconColor="bg-emerald-500/30 text-emerald-400"
              sparkColor="#10b981"
              sparkVariant="wave"
              subtitle="Successfully delivered parcels"
              subtitleColor="text-emerald-400"
            />

            <DarkStatsCard
              label="In Transit (Pending)"
              value={`৳${inTransitEarnings.toLocaleString()}`}
              icon={Truck}
              iconColor="bg-amber-500/30 text-amber-400"
              sparkColor="#f59e0b"
              sparkVariant="up"
              subtitle={`${inTransitCount} parcel(s) out on route`}
              subtitleColor="text-amber-400"
            />

            <DarkStatsCard
              label="Today's Earnings"
              value={`৳${todayEarnings.toLocaleString()}`}
              icon={Calendar}
              iconColor="bg-blue-500/30 text-blue-400"
              sparkColor="#60a5fa"
              sparkVariant="flat"
              subtitle={`${todayCount} parcel(s) delivered today`}
              subtitleColor="text-blue-400"
            />
          </div>

          {/* Completed Orders Table */}
          <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Completed Deliveries Ledger
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Breakdown of delivered parcels and earned courier delivery fees
                </p>
              </div>

              {completedDeliveries.length > 0 && (
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by tracking, receiver..."
                    className="w-full pl-3 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 transition-all"
                  />
                </div>
              )}
            </div>

            {completedDeliveries.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
                <Package className="w-10 h-10 text-white/20" />
                <p className="text-sm font-medium text-white/60">
                  No completed deliveries recorded yet
                </p>
                <p className="text-xs text-white/40 max-w-sm">
                  When you deliver parcels on your route and click &quot;Mark Delivered&quot;,
                  the completed orders and earned amounts will appear in this ledger.
                </p>
                <Link
                  to="/rider/deliveries"
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CAEA3C] text-neutral-900 text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <span>Go to Active Deliveries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : filteredDeliveries.length === 0 ? (
              <div className="p-12 text-center text-xs text-white/40">
                No completed deliveries match your search query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] border-b border-white/5 text-white/40 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-5 font-semibold">Delivered Date</th>
                      <th className="py-3 px-5 font-semibold">Tracking ID</th>
                      <th className="py-3 px-5 font-semibold">Recipient & Area</th>
                      <th className="py-3 px-5 font-semibold">Parcel Info</th>
                      <th className="py-3 px-5 font-semibold">Payment</th>
                      <th className="py-3 px-5 font-semibold text-right">
                        Earned Fee
                      </th>
                      <th className="py-3 px-5 font-semibold text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDeliveries.map((record: CompletedDeliveryItem) => (
                      <tr
                        key={record._id || record.identifier}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-5 text-white/70 whitespace-nowrap">
                          {formatDate(record.deliveredAt || record.createdAt)}
                        </td>

                        <td className="py-4 px-5 font-mono font-bold text-white whitespace-nowrap">
                          <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 text-[11px]">
                            {record.trackingId}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-semibold text-white">
                            {record.receiverName}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-white/50 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-white/30" />
                              {record.receiverDistrict}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-white/30" />
                              <a
                                href={`tel:${record.receiverPhone}`}
                                className="hover:text-[#CAEA3C] hover:underline"
                              >
                                {record.receiverPhone}
                              </a>
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5 text-white/70">
                          <div>{record.parcelName}</div>
                          <div className="text-[11px] text-white/40">
                            {record.parcelWeight} kg · {record.parcelType}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-white/60 capitalize whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10">
                            {record.paymentMethod.replace(/_/g, " ")}
                          </span>
                        </td>

                        <td className="py-4 px-5 font-mono font-extrabold text-[#CAEA3C] text-sm text-right whitespace-nowrap">
                          ৳ {record.deliveryCharge}
                        </td>

                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Delivered
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default RiderEarningsPage;
