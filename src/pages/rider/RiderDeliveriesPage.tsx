import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  Package,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Ban,
  Clock,
  RefreshCw,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  useRiderAssignedBookings,
  type AssignedBookingItem,
} from "@/lib/hooks/api/rider/getRiderAssignedBookings";
import { useUpdateDeliveryStatus } from "@/lib/hooks/api/rider/updateDeliveryStatus";
import { CancelDeliveryModal } from "@/components/Modal/CancelDeliveryModal";

const statusFilterTabs = [
  { label: "Awaiting Acceptance", value: "accepted" },
  { label: "All Assigned", value: "" },
];

const RiderDeliveriesPage = () => {
  // Default to accepted so newly assigned parcels show up immediately
  const [activeTab, setActiveTab] = useState<string>("accepted");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string>("");
  const [cancellingBooking, setCancellingBooking] = useState<{
    id: string;
    trackingId: string;
    parcelName: string;
  } | null>(null);

  const { data, isLoading, isError, refetch } = useRiderAssignedBookings({
    status: activeTab || undefined,
    page,
    limit: 10,
  });

  const updateDeliveryStatusMutation = useUpdateDeliveryStatus();

  const deliveries = data?.data?.bookings ?? [];
  const pagination = data?.data?.pagination;

  // Search filter across key attributes
  const filteredDeliveries = deliveries.filter((item: AssignedBookingItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.trackingId?.toLowerCase().includes(query) ||
      item.receiverName?.toLowerCase().includes(query) ||
      item.receiverPhone?.toLowerCase().includes(query) ||
      item.receiverAddress?.toLowerCase().includes(query) ||
      item.receiverDistrict?.toLowerCase().includes(query) ||
      item.parcelName?.toLowerCase().includes(query)
    );
  });

  const handleAcceptDelivery = (bookingId: string, trackingId: string) => {
    setActionLoadingId(bookingId);
    setSuccessNotice("");

    updateDeliveryStatusMutation.mutate(
      {
        id: bookingId,
        status: "in_transit",
        note: "Delivery accepted by rider. Out for delivery (In Transit).",
      },
      {
        onSuccess: () => {
          setSuccessNotice(
            `Parcel ${trackingId} accepted! It has been moved to your active Deliveries route.`
          );
          refetch();
        },
        onSettled: () => {
          setActionLoadingId(null);
        },
      }
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;
    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              Dispatch Queue
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Assigned Deliveries
          </h1>
          <p className="text-sm text-white/50 mt-0.5">
            Review new assignments from hub operators and accept them to begin route delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/rider/deliveries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#CAEA3C] hover:bg-[#bde028] text-neutral-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Active Deliveries Route</span>
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

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-300">
              {successNotice}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/rider/deliveries"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#CAEA3C] hover:underline"
            >
              <span>View in Deliveries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setSuccessNotice("")}
              className="text-xs text-white/50 hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tab Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {statusFilterTabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                  setSuccessNotice("");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.value
                    ? "bg-[#CAEA3C] text-neutral-900 shadow-sm"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracking, receiver, phone, area..."
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Cards List */}
      <Card className="bg-[#1a1f2e]/80 border-white/10 backdrop-blur-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#CAEA3C] animate-spin" />
            <p className="text-xs text-white/40">Loading assigned deliveries...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
            <p className="text-sm text-white/70 font-medium">
              Failed to load assigned deliveries
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
            <Package className="w-10 h-10 text-white/20" />
            <p className="text-sm font-medium text-white/60">
              No assigned deliveries waiting for acceptance
            </p>
            <p className="text-xs text-white/40 max-w-sm">
              {searchQuery
                ? "No assigned parcels match your search query."
                : "All assigned parcels have been accepted or processed! Check your active deliveries on the Deliveries route."}
            </p>
            <Link
              to="/rider/deliveries"
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#CAEA3C]" />
              <span>Go to Active Deliveries</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredDeliveries.map((delivery: AssignedBookingItem) => {
              const bookingId = delivery._id || delivery.id;
              const isItemBusy =
                actionLoadingId === bookingId &&
                updateDeliveryStatusMutation.isPending;

              return (
                <div
                  key={bookingId}
                  className="p-5 sm:p-6 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                >
                  <div className="space-y-3 flex-1 w-full">
                    {/* Header line: Tracking ID, Status, Assigned By */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                        {delivery.trackingId}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          delivery.status === "delivered"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : delivery.status === "in_transit"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : delivery.status === "cancelled"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {delivery.status.replace("_", " ")}
                      </span>

                      {/* Operator Assign Stamp */}
                      {delivery.operatorId && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#CAEA3C]/90 bg-[#CAEA3C]/10 border border-[#CAEA3C]/20 px-2 py-0.5 rounded-md">
                          <UserCheck className="w-3 h-3" />
                          Operator: {delivery.operatorId.fullName}
                        </span>
                      )}

                      {/* Assigned Date */}
                      {delivery.assignedAt && (
                        <span className="text-[11px] text-white/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Assigned: {formatDate(delivery.assignedAt)}
                        </span>
                      )}
                    </div>

                    {/* Customer & Route Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <span className="text-white/40">Receiver: </span>
                        <span className="font-semibold text-white">
                          {delivery.receiverName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-white/70">
                        <Phone className="w-3.5 h-3.5 text-white/40 shrink-0" />
                        <a
                          href={`tel:${delivery.receiverPhone}`}
                          className="hover:text-[#CAEA3C] hover:underline"
                        >
                          {delivery.receiverPhone}
                        </a>
                      </div>

                      <div>
                        <span className="text-white/40">Parcel: </span>
                        <span className="text-white/80 font-medium">
                          {delivery.parcelName} ({delivery.parcelWeight} kg)
                        </span>
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3 flex items-start gap-1.5 text-white/70">
                        <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                        <span>
                          {delivery.receiverAddress}, {delivery.receiverDistrict}
                        </span>
                      </div>

                      {/* Delivery Instructions if provided */}
                      {delivery.deliveryInstruction && (
                        <div className="sm:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 rounded-lg p-2 text-white/70 text-[11px]">
                          <span className="font-semibold text-[#CAEA3C]">
                            Note:{" "}
                          </span>
                          {delivery.deliveryInstruction}
                        </div>
                      )}

                      {/* Cancellation Reason Alert if cancelled */}
                      {delivery.status === "cancelled" && (
                        <div className="sm:col-span-2 lg:col-span-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg p-2 text-[11px] flex items-start gap-1.5">
                          <Ban className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">
                              Cancellation Reason:{" "}
                            </span>
                            {delivery.cancellationReason || "No reason specified"}
                            {delivery.cancelledAt && (
                              <span className="text-white/40 ml-2">
                                ({formatDate(delivery.cancelledAt)})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* COD Collection & Action Buttons */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-bold text-white/40 block">
                        COD Collection
                      </span>
                      <span className="text-base font-extrabold text-white font-mono">
                        {delivery.deliveryCharge > 0
                          ? `৳ ${delivery.deliveryCharge}`
                          : "Paid Online"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Assigned / Accepted State: Accept & Start Delivery */}
                      {(delivery.status === "accepted" || delivery.status === "pending") && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setCancellingBooking({
                                id: bookingId,
                                trackingId: delivery.trackingId,
                                parcelName: delivery.parcelName,
                              })
                            }
                            disabled={isItemBusy}
                            className="px-3 py-2 text-xs font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/20 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Decline
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAcceptDelivery(bookingId, delivery.trackingId)
                            }
                            disabled={isItemBusy}
                            className="px-3.5 py-2 text-xs font-bold bg-[#CAEA3C] text-neutral-900 hover:opacity-90 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isItemBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Truck className="w-3.5 h-3.5" />
                            )}
                            <span>Accept & Start Delivery</span>
                          </button>
                        </>
                      )}

                      {/* Cancelled State */}
                      {delivery.status === "cancelled" && (
                        <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-3 py-1.5 rounded-xl border border-rose-500/20 flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5" />
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#1a1f2e]/80 border border-white/10 rounded-2xl p-4 text-xs text-white/50">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total}{" "}
            assigned deliveries
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(pagination.totalPages, current + 1)
                )
              }
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <CancelDeliveryModal
          bookingId={cancellingBooking.id}
          trackingId={cancellingBooking.trackingId}
          parcelName={cancellingBooking.parcelName}
          onClose={() => setCancellingBooking(null)}
          onSuccess={() => {
            setCancellingBooking(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default RiderDeliveriesPage;
