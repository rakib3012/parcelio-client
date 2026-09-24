import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface WarehouseLocation {
  region: string
  district: string
  city: string
  covered_area: string[]
  status: string
}

// ---------------------------------------------------------------------------
// 1. Zod Validation Schema Definition
// ---------------------------------------------------------------------------
// Zod is a TypeScript-first schema declaration and validation library.
// It allows us to define the shape and constraints of our form data in one place,
// and automatically infers static TypeScript types from it.
export const riderRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(60, { message: "Name must not exceed 60 characters" }),

  drivingLicense: z
    .string()
    .trim()
    .min(5, { message: "Driving license number is required (min 5 characters)" })
    .max(30, { message: "Driving license cannot exceed 30 characters" }),

  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please provide a valid email address (e.g. user@example.com)" }),

  region: z
    .string()
    .min(1, { message: "Please select your region" }),

  district: z
    .string()
    .min(1, { message: "Please select your district" }),

  nid: z
    .string()
    .trim()
    .min(10, { message: "NID number must be at least 10 digits" })
    .max(17, { message: "NID number must not exceed 17 digits" })
    .regex(/^\d+$/, { message: "NID number must contain only numeric digits" }),

  phone: z
    .string()
    .trim()
    .min(11, { message: "Phone number must be at least 11 digits" })
    .regex(
      /^(?:\+?8801|01)[3-9]\d{8}$/,
      { message: "Please enter a valid Bangladeshi phone number (e.g., 017xxxxxxxx)" }
    ),

  bikeBrandModelYear: z
    .string()
    .trim()
    .min(3, { message: "Bike brand, model and year is required (e.g., Honda CB Shine 2021)" })
    .max(80, { message: "Character limit exceeded (max 80 characters)" }),

  bikeRegistrationNumber: z
    .string()
    .trim()
    .min(4, { message: "Bike registration number is required" })
    .max(40, { message: "Registration number cannot exceed 40 characters" }),

  aboutYourself: z
    .string()
    .trim()
    .max(500, { message: "About yourself must not exceed 500 characters" })
    .optional()
    .or(z.literal("")),
})

// Extract the TypeScript type directly from the Zod schema
export type RiderRegistrationFormData = z.infer<typeof riderRegistrationSchema>

const BeARiderPage = () => {
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<RiderRegistrationFormData | null>(null)

  // -------------------------------------------------------------------------
  // 2. Initializing React Hook Form with Zod Resolver
  // -------------------------------------------------------------------------
  // zodResolver acts as the bridge connecting React Hook Form with Zod.
  // It intercepts validation on change, blur, or submit and maps Zod errors
  // into React Hook Form's `formState.errors`.
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RiderRegistrationFormData>({
    resolver: zodResolver(riderRegistrationSchema),
    mode: "onTouched", // Validates when an input loses focus (touch), giving prompt feedback
    defaultValues: {
      name: "",
      drivingLicense: "",
      email: "",
      region: "",
      district: "",
      nid: "",
      phone: "",
      bikeBrandModelYear: "",
      bikeRegistrationNumber: "",
      aboutYourself: "",
    },
  })

  // Watch the selected region to filter districts dynamically
  const selectedRegion = watch("region")

  // Load warehouse regions and districts from public/assets/warehouses.json
  useEffect(() => {
    fetch("/assets/warehouses.json")
      .then((res) => res.json())
      .then((data: WarehouseLocation[]) => {
        setWarehouses(data)
      })
      .catch((error) => {
        console.error("Failed to load warehouses data:", error)
      })
  }, [])

  // Extract unique regions
  const uniqueRegions = Array.from(new Set(warehouses.map((w) => w.region))).filter(Boolean)

  // Update available districts when selectedRegion changes
  useEffect(() => {
    if (!selectedRegion) {
      setAvailableDistricts([])
      setValue("district", "")
      return
    }

    const filtered = warehouses
      .filter((w) => w.region.toLowerCase() === selectedRegion.toLowerCase())
      .map((w) => w.district)

    const uniqueFiltered = Array.from(new Set(filtered))
    setAvailableDistricts(uniqueFiltered)
    setValue("district", "")
  }, [selectedRegion, warehouses, setValue])

  // Form submission handler called ONLY when all Zod validations pass
  const onRiderFormSubmit = async (data: RiderRegistrationFormData) => {
    setIsSubmitting(true)

    // Simulate server processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    setIsSubmitting(false)
    setIsSuccessSubmitted(true)
    setSubmittedData(data)
    reset()
  }

  return (
    <div className="w-full py-6 sm:py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-neutral-200/80 shadow-xs max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-950 tracking-tight">
            Be a Rider
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From
            personal packages to business shipments — we deliver on time, every time.
          </p>
        </header>

        {/* Subheader with Divider */}
        <div className="mt-8 pb-3 border-b border-neutral-200">
          <h2 className="text-lg sm:text-xl font-bold text-teal-950">
            Tell us about yourself
          </h2>
        </div>

        {/* Success Banner */}
        {isSuccessSubmitted && submittedData && (
          <div className="mt-6 p-5 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3.5 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-teal-950">
                Application Submitted Successfully!
              </h3>
              <p className="text-xs text-teal-800 leading-relaxed">
                Thank you, <span className="font-semibold">{submittedData.name}</span>. We have received your rider application for{" "}
                <span className="font-semibold">{submittedData.district}, {submittedData.region}</span>. Our recruitment coordinator will verify your NID and Driving License and contact you via phone (<span className="font-semibold">{submittedData.phone}</span>) within 24 hours.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSuccessSubmitted(false)}
                className="mt-2 text-xs"
              >
                Submit another application
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Layout: Form on Left, Illustration on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit(onRiderFormSubmit)}
              noValidate
              className="space-y-4 sm:space-y-5"
            >
              {/* 1. Your Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                  className={errors.name ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* 2. Driving License Number */}
              <div className="space-y-1.5">
                <Label htmlFor="drivingLicense">Driving License Number</Label>
                <Input
                  id="drivingLicense"
                  type="text"
                  placeholder="Driving License Number"
                  {...register("drivingLicense")}
                  aria-invalid={errors.drivingLicense ? "true" : "false"}
                  className={errors.drivingLicense ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.drivingLicense && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.drivingLicense.message}</span>
                  </p>
                )}
              </div>

              {/* 3. Your Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  className={errors.email ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* 4. Your Region */}
              <div className="space-y-1.5">
                <Label htmlFor="region">Your Region</Label>
                <Select
                  id="region"
                  {...register("region")}
                  aria-invalid={errors.region ? "true" : "false"}
                  className={errors.region ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                >
                  <option value="">Select your Region</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </Select>
                {errors.region && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.region.message}</span>
                  </p>
                )}
              </div>

              {/* 5. Your District */}
              <div className="space-y-1.5">
                <Label htmlFor="district">Your District</Label>
                <Select
                  id="district"
                  {...register("district")}
                  disabled={!selectedRegion || availableDistricts.length === 0}
                  aria-invalid={errors.district ? "true" : "false"}
                  className={errors.district ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                >
                  <option value="">
                    {selectedRegion ? "Select your District" : "Select Region First"}
                  </option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Select>
                {errors.district && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.district.message}</span>
                  </p>
                )}
              </div>

              {/* 6. NID No */}
              <div className="space-y-1.5">
                <Label htmlFor="nid">NID No</Label>
                <Input
                  id="nid"
                  type="text"
                  placeholder="NID"
                  {...register("nid")}
                  aria-invalid={errors.nid ? "true" : "false"}
                  className={errors.nid ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.nid && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.nid.message}</span>
                  </p>
                )}
              </div>

              {/* 7. Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  {...register("phone")}
                  aria-invalid={errors.phone ? "true" : "false"}
                  className={errors.phone ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone.message}</span>
                  </p>
                )}
              </div>

              {/* 8. Bike Brand Model and Year */}
              <div className="space-y-1.5">
                <Label htmlFor="bikeBrandModelYear">Bike Brand Model and Year</Label>
                <Input
                  id="bikeBrandModelYear"
                  type="text"
                  placeholder="Bike Brand Model and Year"
                  {...register("bikeBrandModelYear")}
                  aria-invalid={errors.bikeBrandModelYear ? "true" : "false"}
                  className={errors.bikeBrandModelYear ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.bikeBrandModelYear && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.bikeBrandModelYear.message}</span>
                  </p>
                )}
              </div>

              {/* 9. Bike Registration Number */}
              <div className="space-y-1.5">
                <Label htmlFor="bikeRegistrationNumber">Bike Registration Number</Label>
                <Input
                  id="bikeRegistrationNumber"
                  type="text"
                  placeholder="Bike Registration Number"
                  {...register("bikeRegistrationNumber")}
                  aria-invalid={errors.bikeRegistrationNumber ? "true" : "false"}
                  className={errors.bikeRegistrationNumber ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.bikeRegistrationNumber && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.bikeRegistrationNumber.message}</span>
                  </p>
                )}
              </div>

              {/* 10. Tell Us About Yourself */}
              <div className="space-y-1.5">
                <Label htmlFor="aboutYourself">Tell Us About Yourself</Label>
                <Input
                  id="aboutYourself"
                  type="text"
                  placeholder="Tell Us About Yourself"
                  {...register("aboutYourself")}
                  aria-invalid={errors.aboutYourself ? "true" : "false"}
                  className={errors.aboutYourself ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" : ""}
                />
                {errors.aboutYourself && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.aboutYourself.message}</span>
                  </p>
                )}
              </div>

              {/* 11. Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-lime-400 hover:bg-lime-500 text-neutral-900 font-semibold py-3 px-6 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Rider Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center py-4 lg:py-8 lg:sticky lg:top-24">
            <img
              src="/assets/agent-pending.png"
              alt="Parcelio Delivery Rider with parcel box"
              className="w-full max-w-sm sm:max-w-md object-contain select-none pointer-events-none drop-shadow-sm transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeARiderPage
