import { useState, useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  CheckCircle2,
  AlertCircle,
  Package,
  Copy,
  Check,
  ArrowRight,
  Truck,
  RotateCcw,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateBooking } from "@/lib/hooks/api/parcel"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store/authStore"
import { Link } from "react-router"

// ---------------------------------------------------------------------------
// 1. Zod Validation Schema
// ---------------------------------------------------------------------------
const bookingSchema = z.object({
  parcelType: z.enum(["document", "not-document"], {
    message: "Please select parcel type",
  }),
  parcelName: z
    .string()
    .trim()
    .min(2, { message: "Parcel name must be at least 2 characters" })
    .max(80, { message: "Parcel name cannot exceed 80 characters" }),
  parcelWeight: z
    .string()
    .trim()
    .min(1, { message: "Parcel weight is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Weight must be a positive number (e.g. 0.5 or 2)",
    }),

  // Sender Details
  senderName: z
    .string()
    .trim()
    .min(2, { message: "Sender name is required" })
    .max(60, { message: "Name is too long" }),
  senderAddress: z
    .string()
    .trim()
    .min(5, { message: "Full sender address is required" }),
  senderPhone: z
    .string()
    .trim()
    .min(11, { message: "Phone number must be at least 11 digits" })
    .regex(/^01[3-9]\d{8}$/, {
      message: "Please enter a valid BD phone number (e.g. 01712345678)",
    }),
  senderDistrict: z
    .string()
    .trim()
    .min(1, { message: "Please select sender district" }),
  pickupInstruction: z.string().trim().optional(),

  // Receiver Details
  receiverName: z
    .string()
    .trim()
    .min(2, { message: "Receiver name is required" })
    .max(60, { message: "Name is too long" }),
  receiverAddress: z
    .string()
    .trim()
    .min(5, { message: "Full receiver address is required" }),
  receiverPhone: z
    .string()
    .trim()
    .min(11, { message: "Contact number must be at least 11 digits" })
    .regex(/^01[3-9]\d{8}$/, {
      message: "Please enter a valid BD phone number (e.g. 01812345678)",
    }),
  receiverDistrict: z
    .string()
    .trim()
    .min(1, { message: "Please select receiver district" }),
  deliveryInstruction: z.string().trim().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface WarehouseItem {
  region: string
  district: string
}

export default function BookingPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([])
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<{
    trackingId: string
    data: BookingFormData
    estimatedCost: number
  } | null>(null)
  const [copiedTracking, setCopiedTracking] = useState(false)

  const createBookingMutation = useCreateBooking()

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: {
      parcelType: "document",
      parcelName: "",
      parcelWeight: "",
      senderName: currentUser?.fullName || "",
      senderAddress: "",
      senderPhone: "",
      senderDistrict: "",
      pickupInstruction: "",
      receiverName: "",
      receiverAddress: "",
      receiverPhone: "",
      receiverDistrict: "",
      deliveryInstruction: "",
    },
  })

  // Watch form fields to calculate real-time cost estimation
  const parcelType = watch("parcelType")
  const parcelWeight = watch("parcelWeight")
  const senderDistrict = watch("senderDistrict")
  const receiverDistrict = watch("receiverDistrict")

  // Load districts list from public/assets/warehouses.json
  useEffect(() => {
    fetch("/assets/warehouses.json")
      .then((res) => res.json())
      .then((data: WarehouseItem[]) => {
        setWarehouses(data)
      })
      .catch((err) => {
        console.error("Failed to load districts from warehouses.json:", err)
      })
  }, [])

  // Unique sorted districts list
  const districtList = useMemo(() => {
    const list = Array.from(new Set(warehouses.map((w) => w.district))).filter(Boolean)
    return list.sort((a, b) => a.localeCompare(b))
  }, [warehouses])

  const districtItems = useMemo(
    () => Object.fromEntries(districtList.map((d) => [d, d])),
    [districtList]
  )

  // Dynamic delivery charge calculation
  const estimatedCost = useMemo(() => {
    const weight = parseFloat(parcelWeight) || 0
    if (weight <= 0) return 0

    const isSameDistrict =
      senderDistrict && receiverDistrict && senderDistrict === receiverDistrict
    let baseCharge: number

    if (parcelType === "document") {
      baseCharge = isSameDistrict ? 60 : 100
      if (weight > 1) {
        baseCharge += Math.ceil(weight - 1) * 20
      }
    } else {
      // Non-document / parcel package
      baseCharge = isSameDistrict ? 80 : 130
      if (weight > 1) {
        baseCharge += Math.ceil(weight - 1) * 30
      }
    }
    return baseCharge
  }, [parcelType, parcelWeight, senderDistrict, receiverDistrict])

  // Form submission: open confirmation dialog
  const onProceedBooking = () => {
    setApiError(null)
    setIsConfirmModalOpen(true)
  }

  // Final Confirmation
  const handleFinalBookingSubmit = (data: BookingFormData) => {
    setApiError(null)
    createBookingMutation.mutate(
      {
        ...data,
        parcelWeight: Number(data.parcelWeight),
      },
      {
        onSuccess: (res) => {
          setConfirmedBooking({
            trackingId: res.data.booking.trackingId,
            data,
            estimatedCost: res.data.booking.deliveryCharge,
          })
          setIsConfirmModalOpen(false)
        },
        onError: (err) => {
          setApiError(err.message || "Failed to submit booking. Please try again.")
        },
      }
    )
  }

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedTracking(true)
    setTimeout(() => setCopiedTracking(false), 2000)
  }

  const handleBookAnother = () => {
    setConfirmedBooking(null)
    reset({
      parcelType: "document",
      parcelName: "",
      parcelWeight: "",
      senderName: currentUser?.fullName || "",
      senderAddress: "",
      senderPhone: "",
      senderDistrict: "",
      pickupInstruction: "",
      receiverName: "",
      receiverAddress: "",
      receiverPhone: "",
      receiverDistrict: "",
      deliveryInstruction: "",
    })
  }

  return (
    <div className="w-full py-6 sm:py-10 bg-neutral-50/50 min-h-screen">
      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-neutral-200/80 shadow-xs max-w-5xl mx-auto">
        {/* Header Title */}
        <header className="space-y-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3B3C] tracking-tight">
            Send A Parcel
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-[#0B3B3C] pt-4">
            Enter your parcel details
          </h2>
        </header>

        {/* Success Screen after confirmation */}
        {confirmedBooking ? (
          <div className="mt-8 p-6 sm:p-10 bg-teal-50/70 border border-teal-200 rounded-3xl animate-in fade-in slide-in-from-top-3">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-teal-950">
                Booking Confirmed!
              </h3>
              <p className="text-sm text-teal-800 leading-relaxed">
                Your parcel booking request has been successfully scheduled. Our delivery rider
                will pick up the parcel today between{" "}
                <span className="font-bold">4:00 PM – 7:00 PM</span>.
              </p>

              {/* Tracking ID Badge */}
              <div className="bg-white border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs mt-4">
                <div className="text-left">
                  <span className="text-xs text-neutral-500 font-medium">Tracking Number</span>
                  <div className="text-lg font-mono font-bold text-teal-950">
                    {confirmedBooking.trackingId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTracking(confirmedBooking.trackingId)}
                  className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-100/70 hover:bg-teal-200/70 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedTracking ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-700" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-teal-700" />
                      <span>Copy Tracking ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-left">
                <div className="bg-white/80 p-3 rounded-xl border border-teal-100">
                  <span className="text-[11px] text-neutral-500 block">Type</span>
                  <span className="text-xs font-bold text-neutral-800 capitalize">
                    {confirmedBooking.data.parcelType}
                  </span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-teal-100">
                  <span className="text-[11px] text-neutral-500 block">Weight</span>
                  <span className="text-xs font-bold text-neutral-800">
                    {confirmedBooking.data.parcelWeight} KG
                  </span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-teal-100">
                  <span className="text-[11px] text-neutral-500 block">Route</span>
                  <span className="text-xs font-bold text-neutral-800 truncate block">
                    {confirmedBooking.data.senderDistrict} → {confirmedBooking.data.receiverDistrict}
                  </span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-teal-100">
                  <span className="text-[11px] text-neutral-500 block">Estimated Charge</span>
                  <span className="text-xs font-bold text-teal-700">
                    ৳ {confirmedBooking.estimatedCost} BDT
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  to="/deliveries"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>View All Deliveries</span>
                </Link>
                <button
                  type="button"
                  onClick={handleBookAnother}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-teal-300 bg-white hover:bg-teal-50/60 text-teal-900 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Book Another Parcel</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onProceedBooking)}
            noValidate
            className="mt-6 space-y-6"
          >
            {/* Parcel Type Radio Selector: Document vs Not-Document */}
            <Controller
              name="parcelType"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-8 py-2">
                  {/* Document Radio */}
                  <label
                    className="flex items-center gap-2.5 cursor-pointer group select-none"
                    onClick={() => field.onChange("document")}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        field.value === "document"
                          ? "border-emerald-600 bg-white"
                          : "border-neutral-300 group-hover:border-neutral-400"
                      )}
                    >
                      {field.value === "document" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        field.value === "document"
                          ? "text-neutral-900"
                          : "text-neutral-600 group-hover:text-neutral-900"
                      )}
                    >
                      Document
                    </span>
                  </label>

                  {/* Not-Document Radio */}
                  <label
                    className="flex items-center gap-2.5 cursor-pointer group select-none"
                    onClick={() => field.onChange("not-document")}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        field.value === "not-document"
                          ? "border-emerald-600 bg-white"
                          : "border-neutral-300 group-hover:border-neutral-400"
                      )}
                    >
                      {field.value === "not-document" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        field.value === "not-document"
                          ? "text-neutral-900"
                          : "text-neutral-600 group-hover:text-neutral-900"
                      )}
                    >
                      Not-Document
                    </span>
                  </label>
                </div>
              )}
            />

            {/* Row: Parcel Name & Parcel Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Parcel Name */}
              <div className="space-y-1.5">
                <Label htmlFor="parcelName" className="text-xs font-semibold text-neutral-700">
                  Parcel Name
                </Label>
                <Input
                  id="parcelName"
                  type="text"
                  placeholder="Parcel Name"
                  {...register("parcelName")}
                  aria-invalid={errors.parcelName ? "true" : "false"}
                  className={cn(
                    "h-11 bg-white border-neutral-300 text-sm",
                    errors.parcelName &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  )}
                />
                {errors.parcelName && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.parcelName.message}</span>
                  </p>
                )}
              </div>

              {/* Parcel Weight (KG) */}
              <div className="space-y-1.5">
                <Label htmlFor="parcelWeight" className="text-xs font-semibold text-neutral-700">
                  Parcel Weight (KG)
                </Label>
                <Input
                  id="parcelWeight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Parcel Weight (KG)"
                  {...register("parcelWeight")}
                  aria-invalid={errors.parcelWeight ? "true" : "false"}
                  className={cn(
                    "h-11 bg-white border-neutral-300 text-sm",
                    errors.parcelWeight &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  )}
                />
                {errors.parcelWeight && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.parcelWeight.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200/80 my-8" />

            {/* 2-Column Section: Sender Details & Receiver Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column: Sender Details */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#0B3B3C]">
                  Sender Details
                </h3>

                {/* Sender Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="senderName" className="text-xs font-semibold text-neutral-700">
                    Sender Name
                  </Label>
                  <Input
                    id="senderName"
                    type="text"
                    placeholder="Sender Name"
                    {...register("senderName")}
                    aria-invalid={errors.senderName ? "true" : "false"}
                    className={cn(
                      "h-11 bg-white border-neutral-300 text-sm",
                      errors.senderName &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                    )}
                  />
                  {errors.senderName && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.senderName.message}</span>
                    </p>
                  )}
                </div>

                {/* Sender Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="senderAddress" className="text-xs font-semibold text-neutral-700">
                    Address
                  </Label>
                  <Input
                    id="senderAddress"
                    type="text"
                    placeholder="Address"
                    {...register("senderAddress")}
                    aria-invalid={errors.senderAddress ? "true" : "false"}
                    className={cn(
                      "h-11 bg-white border-neutral-300 text-sm",
                      errors.senderAddress &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                    )}
                  />
                  {errors.senderAddress && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.senderAddress.message}</span>
                    </p>
                  )}
                </div>

                {/* Sender Phone No */}
                <div className="space-y-1.5">
                  <Label htmlFor="senderPhone" className="text-xs font-semibold text-neutral-700">
                    Sender Phone No
                  </Label>
                  <Input
                    id="senderPhone"
                    type="tel"
                    placeholder="Sender Phone No"
                    {...register("senderPhone")}
                    aria-invalid={errors.senderPhone ? "true" : "false"}
                    className={cn(
                      "h-11 bg-white border-neutral-300 text-sm",
                      errors.senderPhone &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                    )}
                  />
                  {errors.senderPhone && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.senderPhone.message}</span>
                    </p>
                  )}
                </div>

                {/* Sender District (Shadcn Select) */}
                <div className="space-y-1.5">
                  <Label htmlFor="senderDistrict" className="text-xs font-semibold text-neutral-700">
                    Your District
                  </Label>
                  <Controller
                    name="senderDistrict"
                    control={control}
                    render={({ field }) => (
                      <Select
                        items={districtItems}
                        value={field.value || null}
                        onValueChange={(val) => field.onChange(val || "")}
                      >
                        <SelectTrigger
                          id="senderDistrict"
                          className={cn(
                            "w-full h-11 bg-white border-neutral-300 text-sm px-3.5",
                            errors.senderDistrict &&
                              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                          )}
                          aria-invalid={errors.senderDistrict ? "true" : "false"}
                        >
                          <SelectValue placeholder="Select your District" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Districts</SelectLabel>
                            {districtList.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.senderDistrict && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.senderDistrict.message}</span>
                    </p>
                  )}
                </div>

                {/* Pickup Instruction */}
                <div className="space-y-1.5">
                  <Label htmlFor="pickupInstruction" className="text-xs font-semibold text-neutral-700">
                    Pickup Instruction
                  </Label>
                  <Textarea
                    id="pickupInstruction"
                    rows={3}
                    placeholder="Pickup Instruction"
                    {...register("pickupInstruction")}
                    className="resize-y"
                  />
                </div>
              </div>

              {/* Right Column: Receiver Details */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#0B3B3C]">
                  Receiver Details
                </h3>

                {/* Receiver Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="receiverName" className="text-xs font-semibold text-neutral-700">
                    Receiver Name
                  </Label>
                  <Input
                    id="receiverName"
                    type="text"
                    placeholder="Receiver Name"
                    {...register("receiverName")}
                    aria-invalid={errors.receiverName ? "true" : "false"}
                    className={cn(
                      "h-11 bg-white border-neutral-300 text-sm",
                      errors.receiverName &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                    )}
                  />
                  {errors.receiverName && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.receiverName.message}</span>
                    </p>
                  )}
                </div>

                {/* Receiver Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="receiverAddress" className="text-xs font-semibold text-neutral-700">
                    Receiver Address
                  </Label>
                  <Input
                    id="receiverAddress"
                    type="text"
                    placeholder="Receiver Address"
                    {...register("receiverAddress")}
                    aria-invalid={errors.receiverAddress ? "true" : "false"}
                    className={cn(
                      "h-11 bg-white border-neutral-300 text-sm",
                      errors.receiverAddress &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                    )}
                  />
                  {errors.receiverAddress && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.receiverAddress.message}</span>
                    </p>
                  )}
                </div>

                {/* Receiver Contact No */}
                <div className="space-y-1.5">
                  <Label htmlFor="receiverPhone" className="text-xs font-semibold text-neutral-700">
                    Receiver Contact No
                  </Label>
                  <Input
                    id="receiverPhone"
                    type="tel"
                    placeholder="Receiver Contact No"
                    {...register("receiverPhone")}
                    aria-invalid={errors.receiverPhone ? "true" : "false"}
                    className={cn(
                      "h-11 bg-white border-neutral-300 text-sm",
                      errors.receiverPhone &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                    )}
                  />
                  {errors.receiverPhone && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.receiverPhone.message}</span>
                    </p>
                  )}
                </div>

                {/* Receiver District (Shadcn Select) */}
                <div className="space-y-1.5">
                  <Label htmlFor="receiverDistrict" className="text-xs font-semibold text-neutral-700">
                    Receiver District
                  </Label>
                  <Controller
                    name="receiverDistrict"
                    control={control}
                    render={({ field }) => (
                      <Select
                        items={districtItems}
                        value={field.value || null}
                        onValueChange={(val) => field.onChange(val || "")}
                      >
                        <SelectTrigger
                          id="receiverDistrict"
                          className={cn(
                            "w-full h-11 bg-white border-neutral-300 text-sm px-3.5",
                            errors.receiverDistrict &&
                              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                          )}
                          aria-invalid={errors.receiverDistrict ? "true" : "false"}
                        >
                          <SelectValue placeholder="Select your District" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Districts</SelectLabel>
                            {districtList.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.receiverDistrict && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.receiverDistrict.message}</span>
                    </p>
                  )}
                </div>

                {/* Delivery Instruction */}
                <div className="space-y-1.5">
                  <Label htmlFor="deliveryInstruction" className="text-xs font-semibold text-neutral-700">
                    Delivery Instruction
                  </Label>
                  <Textarea
                    id="deliveryInstruction"
                    rows={3}
                    placeholder="Delivery Instruction"
                    {...register("deliveryInstruction")}
                    className="resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Price Preview Card (if details selected) */}
            {estimatedCost > 0 && (
              <div className="p-4 bg-lime-50/70 border border-lime-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5 text-lime-950 font-medium">
                  <Package className="w-4 h-4 text-lime-700 shrink-0" />
                  <span>
                    Estimated Delivery Charge ({senderDistrict === receiverDistrict ? "Intra-District" : "Inter-District"}):
                  </span>
                </div>
                <div className="text-lg font-extrabold text-lime-950">
                  ৳ {estimatedCost} <span className="text-xs font-normal text-lime-800">BDT</span>
                </div>
              </div>
            )}

            {/* Note & Submit Button */}
            <div className="pt-2 space-y-4">
              <p className="text-xs text-neutral-600 font-medium">
                * PickUp Time 4pm-7pm Approx.
              </p>

              <div>
                <button
                  type="submit"
                  className="bg-[#B7F436] hover:bg-[#a5e426] text-neutral-900 font-bold px-8 py-3.5 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  Proceed to Confirm Booking
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl border border-neutral-100">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#0B3B3C]">
                Confirm Booking Details
              </h3>
              <p className="text-xs text-neutral-500">
                Please review your parcel shipment details before placing the order.
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
              <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                <span className="text-neutral-500">Parcel:</span>
                <span className="font-semibold text-neutral-900">
                  {watch("parcelName")} ({watch("parcelWeight")} KG, {watch("parcelType")})
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                <span className="text-neutral-500">Pickup From:</span>
                <span className="font-semibold text-neutral-900 text-right">
                  {watch("senderName")} ({watch("senderDistrict")})
                  <br />
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {watch("senderAddress")} • {watch("senderPhone")}
                  </span>
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                <span className="text-neutral-500">Delivery To:</span>
                <span className="font-semibold text-neutral-900 text-right">
                  {watch("receiverName")} ({watch("receiverDistrict")})
                  <br />
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {watch("receiverAddress")} • {watch("receiverPhone")}
                  </span>
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                <span className="text-neutral-500">Pickup Slot:</span>
                <span className="font-semibold text-neutral-900">Today, 4:00 PM – 7:00 PM</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-[#0B3B3C]">
                <span>Estimated Cost:</span>
                <span>৳ {estimatedCost} BDT</span>
              </div>
            </div>

            {apiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={createBookingMutation.isPending}
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={createBookingMutation.isPending}
                onClick={() => handleFinalBookingSubmit(watch())}
                className="px-6 py-2.5 rounded-lg bg-[#B7F436] hover:bg-[#a5e426] disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
