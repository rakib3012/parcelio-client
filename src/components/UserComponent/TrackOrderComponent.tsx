import { useState } from "react"
import { useSearchParams, Link } from "react-router"
import {
  Search,
  Package,
  Truck,
  Clock,
  MapPin,
  Navigation,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  Phone,
  Calendar,
  X,
  CreditCard,
  Weight,
  Layers,
  Sparkles,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useTrackBooking } from "@/lib/hooks/api/parcel/trackBooking"
import { useMyBookings } from "@/lib/hooks/api/parcel/getMyBookings"
import type { BookingStatus, BookingDetail } from "@/lib/types/booking"

interface MilestoneStep {
  statusKey: BookingStatus
  title: string
  description: string
  stepNumber: number
}

const statusMilestones: MilestoneStep[] = [
  {
    statusKey: "pending",
    title: "Order Placed",
    description: "Shipment request submitted & scheduled for pickup",
    stepNumber: 1,
  },
  {
    statusKey: "accepted",
    title: "Hub Accepted",
    description: "Assigned to regional hub & pickup rider dispatched",
    stepNumber: 2,
  },
  {
    statusKey: "in_transit",
    title: "In Transit",
    description: "Package on inter-district trunk line moving to destination",
    stepNumber: 3,
  },
  {
    statusKey: "delivered",
    title: "Delivered",
    description: "Successfully handed over to recipient at doorstep",
    stepNumber: 4,
  },
]

const getStepNumber = (status: BookingStatus): number => {
  switch (status) {
    case "pending":
      return 1
    case "accepted":
      return 2
    case "in_transit":
      return 3
    case "delivered":
      return 4
    case "cancelled":
      return 0
    default:
      return 1
  }
}

const getStatusBadgeStyles = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending Pickup",
        badgeClasses:
          "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        indicatorDot: "bg-amber-500",
      }
    case "accepted":
      return {
        label: "Rider Assigned",
        badgeClasses:
          "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        indicatorDot: "bg-blue-500",
      }
    case "in_transit":
      return {
        label: "In Transit",
        badgeClasses:
          "bg-lime-100 text-neutral-950 border-lime-400 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-700",
        indicatorDot: "bg-lime-500",
      }
    case "delivered":
      return {
        label: "Delivered",
        badgeClasses:
          "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        indicatorDot: "bg-emerald-500",
      }
    case "cancelled":
      return {
        label: "Cancelled",
        badgeClasses:
          "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
        indicatorDot: "bg-rose-500",
      }
    default:
      return {
        label: status,
        badgeClasses:
          "bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200",
        indicatorDot: "bg-neutral-500",
      }
  }
}

const formatDisplayDateTime = (dateValue?: string | Date): string => {
  if (!dateValue) return "N/A"
  try {
    const dateObject = new Date(dateValue)
    return dateObject.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  } catch {
    return String(dateValue)
  }
}

const formatSimpleDate = (dateValue?: string | Date): string => {
  if (!dateValue) return "N/A"
  try {
    const dateObject = new Date(dateValue)
    return dateObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return String(dateValue)
  }
}

export default function TrackOrderComponent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTrackingId =
    (searchParams.get("id") || searchParams.get("trackingId") || "").trim().toUpperCase()

  const [inputTrackingCode, setInputTrackingCode] = useState<string>(activeTrackingId)
  const [hasCopiedCode, setHasCopiedCode] = useState<boolean>(false)

  // Fetch parcel tracking details using single-operation hook
  const {
    data: trackingResponse,
    isLoading: isTrackingLoading,
    isError: isTrackingError,
    error: trackingError,
    refetch: refetchTracking,
    isFetching: isTrackingRefetching,
  } = useTrackBooking(activeTrackingId, Boolean(activeTrackingId))

  // Fetch authenticated user's recent shipments for quick tracking
  const { data: myBookingsResponse } = useMyBookings()

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const cleanedTrackingCode = inputTrackingCode.trim().toUpperCase()
    if (!cleanedTrackingCode) return

    setSearchParams({ id: cleanedTrackingCode })
  }

  const handleSelectQuickTracking = (selectedCode: string) => {
    setInputTrackingCode(selectedCode)
    setSearchParams({ id: selectedCode })
  }

  const handleCopyTrackingCode = (trackingCodeToCopy: string) => {
    navigator.clipboard.writeText(trackingCodeToCopy)
    setHasCopiedCode(true)
    setTimeout(() => {
      setHasCopiedCode(false)
    }, 2000)
  }

  const bookingDetail: BookingDetail | undefined =
    trackingResponse?.data?.booking
  const currentStepNumber = bookingDetail
    ? getStepNumber(bookingDetail.status)
    : 0
  const isShipmentCancelled = bookingDetail?.status === "cancelled"
  const badgeStyles = bookingDetail
    ? getStatusBadgeStyles(bookingDetail.status)
    : null

  return (
    <div className="space-y-8 sm:space-y-10 py-2 sm:py-4">
      {/* 1. Header Banner & Search Box */}
      <section className="relative overflow-hidden bg-neutral-900 dark:bg-card border border-neutral-200/80 dark:border-border rounded-3xl p-6 sm:p-10 text-white shadow-md transition-colors">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-lime-400 border border-white/15">
            <Truck className="w-3.5 h-3.5 text-lime-400" />
            Live Shipment Tracker
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Track Your <span className="text-lime-400">Parcel</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400 mt-2 max-w-xl leading-relaxed">
              Real-time milestone visibility across all 64 districts in Bangladesh.
              Enter your tracking code to view active rider checkpoint and delivery SLA.
            </p>
          </div>

          {/* Search Form with shadcn Input and Button */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-2xl bg-white/5 p-2 rounded-2xl border border-white/15">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Search className="w-4 h-4 text-lime-400" />
                </div>
                <Input
                  type="text"
                  value={inputTrackingCode}
                  onChange={(event) => setInputTrackingCode(event.target.value)}
                  placeholder="Enter tracking code (e.g. PRCL-123456)..."
                  className="w-full pl-10 pr-9 py-5 text-sm rounded-xl bg-white/10 dark:bg-muted/30 border-white/10 text-white placeholder:text-neutral-400 focus-visible:ring-lime-400 font-mono uppercase tracking-wider"
                />
                {inputTrackingCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputTrackingCode("")
                      setSearchParams({})
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Button
                type="submit"
                disabled={!inputTrackingCode.trim() || isTrackingLoading}
                className="bg-lime-400 hover:bg-lime-500 text-neutral-950 font-bold text-xs sm:text-sm py-5 px-6 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
              >
                {isTrackingLoading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Track Order</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Quick Shipments Chips from user's active bookings */}
          {myBookingsResponse?.data?.bookings &&
            myBookingsResponse.data.bookings.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-neutral-300 font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-lime-400" />
                  Your Shipments:
                </span>
                {myBookingsResponse.data.bookings.slice(0, 4).map((bookingItem) => {
                  const isCurrentlyActive =
                    activeTrackingId === bookingItem.trackingId.toUpperCase()
                  return (
                    <button
                      key={bookingItem.trackingId}
                      type="button"
                      onClick={() => handleSelectQuickTracking(bookingItem.trackingId)}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                        isCurrentlyActive
                          ? "bg-lime-400 text-neutral-950 shadow-xs"
                          : "bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/10"
                      }`}
                    >
                      {bookingItem.trackingId} ({bookingItem.status.replace("_", " ")})
                    </button>
                  )
                })}
              </div>
            )}
        </div>
      </section>

      {/* 2. Loading State with Skeletons */}
      {isTrackingLoading && (
        <Card className="rounded-3xl border border-neutral-200/80 dark:border-border p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </Card>
      )}

      {/* 3. Error State (Not Found) */}
      {!isTrackingLoading && isTrackingError && (
        <Card className="rounded-3xl border border-neutral-200/80 dark:border-border p-8 sm:p-12 text-center space-y-4">
          <CardContent className="space-y-4 pt-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">
              Shipment Not Found
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              {trackingError?.message ||
                `No parcel found with tracking code "${activeTrackingId}". Please verify the code on your invoice or SMS receipt.`}
            </CardDescription>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setInputTrackingCode("")
                  setSearchParams({})
                }}
                className="rounded-full text-xs font-semibold px-5"
              >
                Clear Search
              </Button>
              <Link to="/user_dashboard/booking">
                <Button className="bg-lime-400 hover:bg-lime-500 text-neutral-950 font-bold rounded-full text-xs px-5">
                  Book a New Parcel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Active Tracking Data Display */}
      {!isTrackingLoading && !isTrackingError && bookingDetail && badgeStyles && (
        <div className="space-y-8 animate-in fade-in">
          {/* Main Status Header Card */}
          <Card className="rounded-3xl border border-neutral-200/80 dark:border-border p-6 sm:p-8 space-y-6">
            <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tracking ID
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTrackingCode(bookingDetail.trackingId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline cursor-pointer"
                  >
                    {hasCopiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-mono font-extrabold text-neutral-900 dark:text-white tracking-wider">
                  {bookingDetail.trackingId}
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Booked on {formatDisplayDateTime(bookingDetail.createdAt)}
                </CardDescription>
              </div>

              {/* Status pill & Refresh button */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${badgeStyles.badgeClasses}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${badgeStyles.indicatorDot} animate-pulse`}
                  />
                  <span>{badgeStyles.label}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => refetchTracking()}
                  title="Refresh status"
                  className="rounded-full"
                >
                  <RotateCcw
                    className={`w-3.5 h-3.5 ${
                      isTrackingRefetching ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              </div>
            </CardHeader>

            {/* Stepper Progress Bar */}
            <CardContent className="p-0 py-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  Delivery Milestones
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Doorstep Home Delivery SLA
                </span>
              </div>

              {isShipmentCancelled ? (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block text-sm font-bold">
                      Shipment Cancelled
                    </strong>
                    <span>
                      This delivery was cancelled. If you need assistance, please
                      contact our 24/7 support line.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Desktop / Tablet Stepper */}
                  <div className="hidden sm:grid grid-cols-4 gap-4 relative">
                    <div className="absolute top-5 left-12 right-12 h-1 bg-neutral-200 dark:bg-muted -z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, ((currentStepNumber - 1) / 3) * 100)
                          )}%`,
                        }}
                      />
                    </div>

                    {statusMilestones.map((milestoneItem) => {
                      const isCompleted =
                        currentStepNumber >= milestoneItem.stepNumber
                      const isCurrentActive =
                        currentStepNumber === milestoneItem.stepNumber

                      return (
                        <div
                          key={milestoneItem.statusKey}
                          className="flex flex-col items-center text-center relative z-10 space-y-2"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              isCompleted
                                ? "bg-neutral-900 dark:bg-card text-lime-400 ring-4 ring-emerald-500/20"
                                : "bg-neutral-100 dark:bg-muted text-neutral-400 border border-neutral-300 dark:border-neutral-700"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5 font-bold" />
                            ) : (
                              <span>{milestoneItem.stepNumber}</span>
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isCurrentActive
                                  ? "text-neutral-900 dark:text-white"
                                  : isCompleted
                                  ? "text-neutral-800 dark:text-neutral-200"
                                  : "text-neutral-400 dark:text-neutral-500"
                              }`}
                            >
                              {milestoneItem.title}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5 max-w-xs">
                              {milestoneItem.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Mobile Vertical Stepper */}
                  <div className="sm:hidden space-y-4 pl-2">
                    {statusMilestones.map((milestoneItem, milestoneIndex) => {
                      const isCompleted =
                        currentStepNumber >= milestoneItem.stepNumber
                      const isCurrentActive =
                        currentStepNumber === milestoneItem.stepNumber
                      const isLastStep =
                        milestoneIndex === statusMilestones.length - 1

                      return (
                        <div
                          key={milestoneItem.statusKey}
                          className="flex items-start gap-3 relative"
                        >
                          {!isLastStep && (
                            <div
                              className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                                currentStepNumber > milestoneItem.stepNumber
                                  ? "bg-emerald-500"
                                  : "bg-neutral-200 dark:bg-muted"
                              }`}
                            />
                          )}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 relative z-10 ${
                              isCompleted
                                ? "bg-neutral-900 text-lime-400"
                                : "bg-neutral-100 dark:bg-muted text-neutral-400"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <span>{milestoneItem.stepNumber}</span>
                            )}
                          </div>
                          <div className="pb-4">
                            <p
                              className={`text-xs font-bold ${
                                isCurrentActive
                                  ? "text-neutral-900 dark:text-white"
                                  : isCompleted
                                  ? "text-neutral-800 dark:text-neutral-200"
                                  : "text-neutral-400"
                              }`}
                            >
                              {milestoneItem.title}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {milestoneItem.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. Origin vs Destination Route Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sender / Origin Card */}
            <Card className="rounded-3xl border border-neutral-200/80 dark:border-border p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-muted flex items-center justify-center text-lime-600 dark:text-lime-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Origin Hub
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {bookingDetail.senderDistrict} District
                    </h4>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-muted text-neutral-600 dark:text-neutral-400 font-medium">
                  Sender
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Name:</span>{" "}
                  <strong className="text-neutral-800 dark:text-neutral-200">
                    {bookingDetail.senderName}
                  </strong>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Phone:</span>{" "}
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">
                    {bookingDetail.senderPhone}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Address:</span>{" "}
                  <span className="text-neutral-800 dark:text-neutral-200">
                    {bookingDetail.senderAddress}
                  </span>
                </div>
                {bookingDetail.pickupInstruction && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-muted/40 border border-neutral-200/60 dark:border-border text-xs text-neutral-600 dark:text-neutral-400">
                    <strong>Pickup Note: </strong>
                    {bookingDetail.pickupInstruction}
                  </div>
                )}
              </div>
            </Card>

            {/* Receiver / Destination Card */}
            <Card className="rounded-3xl border border-neutral-200/80 dark:border-border p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Destination
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {bookingDetail.receiverDistrict} District
                    </h4>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                  Recipient
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Name:</span>{" "}
                  <strong className="text-neutral-800 dark:text-neutral-200">
                    {bookingDetail.receiverName}
                  </strong>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Phone:</span>{" "}
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">
                    {bookingDetail.receiverPhone}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Address:</span>{" "}
                  <span className="text-neutral-800 dark:text-neutral-200">
                    {bookingDetail.receiverAddress}
                  </span>
                </div>
                {bookingDetail.deliveryInstruction && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-muted/40 border border-neutral-200/60 dark:border-border text-xs text-neutral-600 dark:text-neutral-400">
                    <strong>Delivery Note: </strong>
                    {bookingDetail.deliveryInstruction}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 6. Shipment Specifications & Cost Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-neutral-200/80 dark:border-border p-4">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                Parcel Name
              </span>
              <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1 truncate">
                {bookingDetail.parcelName}
              </p>
              <span className="text-xs uppercase font-semibold text-neutral-400">
                {bookingDetail.parcelType}
              </span>
            </Card>

            <Card className="rounded-2xl border border-neutral-200/80 dark:border-border p-4">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                Billable Weight
              </span>
              <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
                {bookingDetail.parcelWeight} KG
              </p>
              <span className="text-xs text-neutral-400">Insured Parcel</span>
            </Card>

            <Card className="rounded-2xl border border-neutral-200/80 dark:border-border p-4">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                Delivery Charge
              </span>
              <p className="text-sm font-bold text-emerald-600 dark:text-lime-400 mt-1">
                ৳ {bookingDetail.deliveryCharge} BDT
              </p>
              <span className="text-xs uppercase font-semibold text-emerald-600 dark:text-emerald-400">
                {bookingDetail.paymentStatus}
              </span>
            </Card>

            <Card className="rounded-2xl border border-neutral-200/80 dark:border-border p-4">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                Payment Method
              </span>
              <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1 capitalize truncate">
                {bookingDetail.paymentMethod.replace(/_/g, " ")}
              </p>
              <span className="text-xs text-neutral-400">100% Guaranteed</span>
            </Card>
          </div>

          {/* 7. Milestone Activity Log (Status History) */}
          <Card className="rounded-3xl border border-neutral-200/80 dark:border-border p-6 sm:p-8 space-y-4">
            <CardHeader className="p-0 flex flex-row items-center justify-between pb-3 border-b border-neutral-100 dark:border-border">
              <CardTitle className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                Real-Time Tracking Logs
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                {bookingDetail.statusHistory?.length || 1} Events Recorded
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-3 pt-2">
              {bookingDetail.statusHistory &&
              bookingDetail.statusHistory.length > 0 ? (
                [...bookingDetail.statusHistory]
                  .reverse()
                  .map((historyItem, historyIndex) => {
                    const itemBadge = getStatusBadgeStyles(historyItem.status)
                    return (
                      <div
                        key={historyIndex}
                        className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-muted/30 border border-neutral-200/60 dark:border-border"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 shrink-0 ${itemBadge.indicatorDot}`}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white capitalize">
                              {historyItem.note ||
                                historyItem.status.replace("_", " ")}
                            </span>
                            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                              {formatDisplayDateTime(historyItem.timestamp)}
                            </span>
                          </div>
                          <span
                            className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${itemBadge.badgeClasses}`}
                          >
                            Status: {itemBadge.label}
                          </span>
                        </div>
                      </div>
                    )
                  })
              ) : (
                <div className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                  Order was created on {formatDisplayDateTime(bookingDetail.createdAt)}.
                  Next milestone will appear once pickup rider confirms.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 8. Help Desk / Quick Support Bar */}
          <div className="bg-neutral-900 dark:bg-card border border-neutral-200/80 dark:border-border text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <HelpCircle className="w-4 h-4 text-lime-400" />
                Have an inquiry about this shipment?
              </h4>
              <p className="text-xs text-neutral-400 max-w-md">
                Our 24/7 customer care team is available to help you with pickup
                rescheduling, address updates, or rider coordination.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="tel:16222"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-lime-400" />
                <span>Call Hotline (16222)</span>
              </a>
              <Link to="/user_dashboard/deliveries">
                <Button className="bg-lime-400 hover:bg-lime-500 text-neutral-950 font-bold text-xs rounded-xl">
                  <span>My Deliveries</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. Initial Empty State (When no tracking code entered yet) */}
      {!isTrackingLoading && !activeTrackingId && (
        <div className="space-y-8 animate-in fade-in">
          {/* Active Shipments Cards */}
          {myBookingsResponse?.data?.bookings &&
            myBookingsResponse.data.bookings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    Your Active Shipments
                  </h3>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Click any parcel to view live tracking details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myBookingsResponse.data.bookings.map((bookingItem) => {
                    const itemBadge = getStatusBadgeStyles(bookingItem.status)
                    return (
                      <Card
                        key={bookingItem.trackingId}
                        onClick={() =>
                          handleSelectQuickTracking(bookingItem.trackingId)
                        }
                        className="rounded-2xl border border-neutral-200/80 dark:border-border p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all text-left flex flex-col justify-between group cursor-pointer"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                              {bookingItem.trackingId}
                            </span>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${itemBadge.badgeClasses}`}
                            >
                              {itemBadge.label}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                              {bookingItem.parcelName}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              To: {bookingItem.receiverName} (
                              {bookingItem.receiverDistrict})
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-border flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                          <span>{formatSimpleDate(bookingItem.createdAt)}</span>
                          <span className="inline-flex items-center gap-1 font-bold text-neutral-900 dark:text-lime-400">
                            Track
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

          {/* Educational How-It-Works Card */}
          <Card className="rounded-3xl border border-neutral-200/80 dark:border-border p-8 sm:p-10 space-y-6">
            <CardHeader className="p-0 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                How Tracking Works
              </div>
              <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                Track your parcel from origin to recipient doorstep
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-muted flex items-center justify-center font-bold text-sm text-neutral-900 dark:text-white">
                  1
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Get your Tracking Code
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Upon booking confirmation, you will receive an SMS and email with
                  your tracking code (e.g. PRCL-123456).
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-muted flex items-center justify-center font-bold text-sm text-neutral-900 dark:text-white">
                  2
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Enter Tracking ID
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Paste the code into the search box above to access real-time hub
                  checkpoints and rider status.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-muted flex items-center justify-center font-bold text-sm text-neutral-900 dark:text-white">
                  3
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Doorstep Arrival
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Receive phone notifications when the delivery rider is on the way
                  with your parcel.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}