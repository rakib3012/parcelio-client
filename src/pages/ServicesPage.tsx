import { useState } from "react"
import { Link } from "react-router"
import {
  Zap,
  Truck,
  RotateCcw,
  Boxes,
  Building2,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"

interface ServiceCard {
  id: string
  badge: string
  title: string
  subtitle: string
  description: string
  features: string[]
  deliveryTime: string
  icon: React.ComponentType<{ className?: string }>
  featured?: boolean
  highlightColor: string
}

const servicesList: ServiceCard[] = [
  {
    id: "express",
    badge: "Fastest in Dhaka",
    title: "Same-Day Express Delivery",
    subtitle: "Ultra-fast direct dispatch for urgent documents & packages",
    description:
      "When every minute counts, our dedicated intra-city express fleet delivers your critical shipments within 4 to 6 hours from pickup to recipient doorsteps in Dhaka.",
    features: [
      "Guaranteed 4–6 hour delivery window in Dhaka",
      "Priority rider dispatch & dedicated route optimization",
      "Real-time SMS milestone alerts to sender & receiver",
      "Direct recipient OTP verification upon delivery",
    ],
    deliveryTime: "4–6 Hours",
    icon: Zap,
    featured: true,
    highlightColor: "#CAEA3C",
  },
  {
    id: "nationwide",
    badge: "All 64 Districts",
    title: "Nationwide Door-to-Door Courier",
    subtitle: "End-to-end reliable distribution across 495+ upazilas",
    description:
      "Whether sending to divisional capitals or rural upazilas, our multi-modal transit network ensures secure transit, sealed transport bags, and doorstep delivery.",
    features: [
      "Full coverage across all 64 districts in Bangladesh",
      "Standard delivery in 24–48 hours to major divisions",
      "Fragile goods specialized handling & protective packing",
      "Live GPS tracking link with ETA countdown",
    ],
    deliveryTime: "24–72 Hours",
    icon: Truck,
    highlightColor: "#03332D",
  },
  {
    id: "cod",
    badge: "100% Secure",
    title: "Cash on Delivery (COD) Management",
    subtitle: "Zero-risk payment collection for e-commerce sellers",
    description:
      "Empower your online business with full Cash on Delivery anywhere in Bangladesh. We collect payments safely and transfer funds directly to your bank account or mobile wallet.",
    features: [
      "100% COD collection with printed digital money receipts",
      "Fast next-day settlement payouts directly to bank or bKash",
      "Transparent 1% COD charge with zero hidden handling fees",
      "Automated SMS payment confirmation to merchant upon collection",
    ],
    deliveryTime: "Next-Day Settlement",
    icon: ShieldCheck,
    highlightColor: "#10B981",
  },
  {
    id: "fulfillment",
    badge: "Merchant Solution",
    title: "E-Commerce Fulfillment & Warehousing",
    subtitle: "Scale your storefront without logistics headaches",
    description:
      "Store your inventory in our tech-enabled hubs. We take care of automated pick, pack, labeling, and instant dispatch as soon as customer orders arrive.",
    features: [
      "Temperature-regulated secure warehouse inventory storage",
      "Barcode scanned error-free order picking & protective packing",
      "Seamless API sync with Shopify, WooCommerce, & custom stores",
      "Same-day dispatch for all orders placed before 3:00 PM",
    ],
    deliveryTime: "Same-Day Dispatch",
    icon: Boxes,
    highlightColor: "#3B82F6",
  },
  {
    id: "reverse",
    badge: "Hassle-Free",
    title: "Reverse Logistics & Parcel Returns",
    subtitle: "Smooth product exchanges & hassle-free return logistics",
    description:
      "Customer didn't like the size or needs an exchange? Our automated return facility picks up parcels from customer homes, verifies quality, and safely returns to your warehouse.",
    features: [
      "Doorstep quality inspection & packaging verification",
      "Automated return tracking with photographic proof",
      "Reduced return handling transit charges for merchants",
      "Fast 48-hour return dispatch back to sender origin",
    ],
    deliveryTime: "24–48 Hours",
    icon: RotateCcw,
    highlightColor: "#F59E0B",
  },
  {
    id: "corporate",
    badge: "Enterprise",
    title: "Corporate Contract Logistics",
    subtitle: "Customized volume contracts for banks, pharma & enterprises",
    description:
      "Specialized logistics frameworks for corporate documents, pharmaceutical delivery, sensitive contracts, and high-volume freight with dedicated account leadership.",
    features: [
      "Dedicated key account manager & priority phone hotline",
      "Customized bulk pricing schedules and monthly billing invoicing",
      "Custom API webhooks for enterprise ERP integration",
      "SLA guarantee with liability coverage for high-value cargo",
    ],
    deliveryTime: "Custom SLA",
    icon: Building2,
    highlightColor: "#8B5CF6",
  },
]

const serviceFaqs = [
  {
    question: "How fast is Dhaka Same-Day Express delivery?",
    answer:
      "Once our rider picks up your package in Dhaka, it is dispatched directly to the delivery hub or recipient with priority routing, arriving within 4 to 6 hours.",
  },
  {
    question: "How does the Cash on Delivery (COD) payout work?",
    answer:
      "Our delivery rider collects the exact invoice cash from the recipient. The amount is recorded instantly into our cloud system, and earnings are settled to your linked bank account or bKash/Nagad wallet within 24 hours.",
  },
  {
    question: "Do you deliver to remote upazilas and rural unions?",
    answer:
      "Yes! Parcelio covers all 64 districts and 495+ upazilas in Bangladesh. We maintain certified local delivery hubs to guarantee last-mile home delivery everywhere.",
  },
  {
    question: "What is your compensation policy for lost or damaged goods?",
    answer:
      "All parcels shipped with Parcelio are insured against transit damage or loss. If an exception occurs, our dispute resolution team investigates and reimburses approved claim values within 3 business days.",
  },
]

const ServicesPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const bookingLink = isAuthenticated ? "/dashboard/booking" : "/login"

  // Quick Rate Estimator State
  const [destinationZone, setDestinationZone] = useState<"inside" | "suburb" | "outside">("inside")
  const [parcelCategory, setParcelCategory] = useState<"document" | "standard" | "heavy">("standard")
  const [packageWeight, setPackageWeight] = useState<number>(1)
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)

  // Calculate quick rate
  const calculateEstimate = () => {
    let baseRate: number
    let perKgExtra: number

    if (destinationZone === "inside") {
      baseRate = parcelCategory === "document" ? 50 : 60
      perKgExtra = 20
    } else if (destinationZone === "suburb") {
      baseRate = parcelCategory === "document" ? 80 : 100
      perKgExtra = 25
    } else {
      baseRate = parcelCategory === "document" ? 110 : 130
      perKgExtra = 30
    }

    const extraWeight = Math.max(0, packageWeight - 1)
    const total = baseRate + extraWeight * perKgExtra
    return total
  }

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-[#03332D] dark:bg-[#151a23] dark:border dark:border-white/10 rounded-[32px] p-8 sm:p-14 lg:p-16 text-white shadow-md transition-colors">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#CAEA3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#CAEA3C] border border-white/15 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#CAEA3C]" />
            Complete Courier & Logistics Suite
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Reliable, Fast & Secure <br />
            <span className="text-[#CAEA3C]">Logistics Services</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 dark:text-neutral-400 leading-relaxed max-w-2xl">
            From 4-hour intra-city express delivery to comprehensive 64-district
            nationwide home delivery and full COD merchant fulfillment — Parcelio
            powers smooth parcel journeys with real-time transparency.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to={bookingLink}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#CAEA3C] text-neutral-950 font-bold text-sm hover:bg-[#b8d82d] transition-all shadow-md group"
            >
              <span>Book a Parcel Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all backdrop-blur-sm"
            >
              <Calculator className="w-4 h-4 text-[#CAEA3C]" />
              <span>Calculate Rate</span>
            </a>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#CAEA3C] font-mono">64</p>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 mt-1">Districts Doorstep Covered</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#CAEA3C] font-mono">4-6 Hrs</p>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 mt-1">Dhaka Express Transit</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#CAEA3C] font-mono">100%</p>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 mt-1">COD Payment Protection</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#CAEA3C] font-mono">99.4%</p>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 mt-1">On-Time Delivery Rate</p>
          </div>
        </div>
      </section>

      {/* 2. Core Services Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-white/10 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Tailored For Individuals & Businesses
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#03332D] dark:text-white tracking-tight">
            Our Core Courier Solutions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Every shipment is backed by verified riders, automated status tracking,
            and end-to-end cargo insurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {servicesList.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className={`rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  service.featured
                    ? "bg-[#03332D] text-white border-[#03332D] dark:border-white/15 shadow-lg shadow-[#03332D]/15"
                    : "bg-white dark:bg-[#151a23] text-neutral-900 dark:text-white border-neutral-200/80 dark:border-white/10 shadow-xs hover:shadow-md"
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        service.featured
                          ? "bg-[#CAEA3C] text-[#03332D]"
                          : "bg-neutral-100 dark:bg-white/5 text-[#03332D] dark:text-[#CAEA3C]"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                        service.featured
                          ? "bg-white/10 text-[#CAEA3C] border border-white/20"
                          : "bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold tracking-tight leading-snug">
                      {service.title}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        service.featured ? "text-[#CAEA3C]" : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {service.subtitle}
                    </p>
                  </div>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      service.featured ? "text-neutral-300" : "text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    {service.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-neutral-200/40 dark:border-white/10">
                    {service.features.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            service.featured ? "text-[#CAEA3C]" : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                        <span
                          className={
                            service.featured ? "text-neutral-200" : "text-neutral-700 dark:text-neutral-300"
                          }
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-200/30 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock
                      className={`w-4 h-4 ${
                        service.featured ? "text-[#CAEA3C]" : "text-neutral-400 dark:text-neutral-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        service.featured ? "text-neutral-200" : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {service.deliveryTime}
                    </span>
                  </div>

                  <Link
                    to={bookingLink}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                      service.featured
                        ? "bg-[#CAEA3C] text-neutral-950 hover:bg-[#b8d82d]"
                        : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200"
                    }`}
                  >
                    <span>Ship Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. Interactive Rate Estimator Tool */}
      <section
        id="calculator"
        className="bg-white dark:bg-[#151a23] rounded-[32px] p-6 sm:p-10 lg:p-12 border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-8 scroll-mt-24 transition-colors"
      >
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Instant Rate Calculator
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#03332D] dark:text-white tracking-tight">
            Estimate Your Parcel Delivery Cost
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Pick your package specifications and destination to see upfront pricing
            with zero surprise charges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Destination Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block">
                1. Delivery Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDestinationZone("inside")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    destinationZone === "inside"
                      ? "border-[#03332D] bg-[#03332D] dark:border-[#CAEA3C] dark:bg-[#CAEA3C] text-white dark:text-neutral-950 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  }`}
                >
                  <p className="text-xs font-bold">Inside Dhaka</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      destinationZone === "inside" ? "text-neutral-300 dark:text-neutral-800" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    All Dhaka Metro areas
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationZone("suburb")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    destinationZone === "suburb"
                      ? "border-[#03332D] bg-[#03332D] dark:border-[#CAEA3C] dark:bg-[#CAEA3C] text-white dark:text-neutral-950 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  }`}
                >
                  <p className="text-xs font-bold">Dhaka Suburbs</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      destinationZone === "suburb" ? "text-neutral-300 dark:text-neutral-800" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Gazipur, Savar, Narayanganj
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationZone("outside")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    destinationZone === "outside"
                      ? "border-[#03332D] bg-[#03332D] dark:border-[#CAEA3C] dark:bg-[#CAEA3C] text-white dark:text-neutral-950 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  }`}
                >
                  <p className="text-xs font-bold">Outside Dhaka</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      destinationZone === "outside" ? "text-neutral-300 dark:text-neutral-800" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    All other 63 districts
                  </p>
                </button>
              </div>
            </div>

            {/* Parcel Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block">
                2. Parcel Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setParcelCategory("document")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    parcelCategory === "document"
                      ? "border-[#03332D] bg-[#03332D] dark:border-[#CAEA3C] dark:bg-[#CAEA3C] text-white dark:text-neutral-950 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  }`}
                >
                  <p className="text-xs font-bold">Document / Letter</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      parcelCategory === "document" ? "text-neutral-300 dark:text-neutral-800" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Paper envelopes & cards
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setParcelCategory("standard")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    parcelCategory === "standard"
                      ? "border-[#03332D] bg-[#03332D] dark:border-[#CAEA3C] dark:bg-[#CAEA3C] text-white dark:text-neutral-950 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  }`}
                >
                  <p className="text-xs font-bold">Standard Box / Bag</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      parcelCategory === "standard" ? "text-neutral-300 dark:text-neutral-800" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Clothes, gadgets, cosmetics
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setParcelCategory("heavy")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    parcelCategory === "heavy"
                      ? "border-[#03332D] bg-[#03332D] dark:border-[#CAEA3C] dark:bg-[#CAEA3C] text-white dark:text-neutral-950 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  }`}
                >
                  <p className="text-xs font-bold">Bulk / Heavy Cargo</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      parcelCategory === "heavy" ? "text-neutral-300 dark:text-neutral-800" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Large packages (3kg+)
                  </p>
                </button>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  3. Approximate Weight (KG)
                </label>
                <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg">
                  {packageWeight} KG
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={packageWeight}
                onChange={(e) => setPackageWeight(Number(e.target.value))}
                className="w-full accent-[#03332D] dark:accent-[#CAEA3C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                <span>0.5 kg</span>
                <span>5 kg</span>
                <span>10 kg</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-[#F5F5F7] dark:bg-neutral-900/90 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Calculated Estimate
              </span>

              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Standard Delivery Charge</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-extrabold text-[#03332D] dark:text-[#CAEA3C] font-mono">
                    ৳ {calculateEstimate()}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">/ parcel</span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-neutral-200 dark:border-white/10">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Estimated Time:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {destinationZone === "inside"
                      ? "24 Hours (Express: 4–6h)"
                      : destinationZone === "suburb"
                      ? "24–48 Hours"
                      : "48–72 Hours"}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Tracking Included:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Yes, Live GPS</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Doorstep Pickup:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Included</span>
                </div>
              </div>
            </div>

            <Link
              to={bookingLink}
              className="w-full text-center py-3.5 px-4 rounded-full bg-[#CAEA3C] text-neutral-950 font-bold text-sm hover:bg-[#b8d82d] transition-all shadow-xs flex items-center justify-center gap-2 group"
            >
              <span>Book Parcel with this Rate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. How It Works (Delivery Process) */}
      <section className="bg-[#03332D] dark:bg-[#151a23] dark:border dark:border-white/10 rounded-[32px] p-8 sm:p-14 text-white space-y-10 transition-colors">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#CAEA3C] uppercase tracking-widest">
            Streamlined Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Parcelio Delivers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400">
            Four simple steps to get your goods from doorstep to doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-2xl font-black text-[#CAEA3C] font-mono">01</span>
            <h4 className="text-base font-bold text-white">Online Booking</h4>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              Fill in sender & receiver addresses, weight, and parcel type in 60 seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-2xl font-black text-[#CAEA3C] font-mono">02</span>
            <h4 className="text-base font-bold text-white">Doorstep Pick-Up</h4>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              Our verified rider arrives with security barcode packaging at your designated time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-2xl font-black text-[#CAEA3C] font-mono">03</span>
            <h4 className="text-base font-bold text-white">Automated Sorting</h4>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              Processed through our digital hub for the fastest route dispatch and transit protection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-2xl font-black text-[#CAEA3C] font-mono">04</span>
            <h4 className="text-base font-bold text-white">Safe Delivery & COD</h4>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              Delivered safely to recipient with OTP handover and instant funds settlement.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="bg-white dark:bg-[#151a23] rounded-[32px] p-8 sm:p-14 border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-8 transition-colors">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#03332D] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Have questions about delivery zones, timing, or payment terms?
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {serviceFaqs.map((faq, index) => {
            const isOpen = selectedFaq === index
            return (
              <div
                key={index}
                className="rounded-2xl border border-neutral-200/80 dark:border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setSelectedFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-neutral-900 dark:text-white hover:bg-neutral-50/75 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`text-neutral-400 transform transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-white/10 bg-neutral-50/40 dark:bg-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="bg-[#1C1D20] dark:bg-[#151a23] dark:border dark:border-white/10 rounded-[32px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg transition-colors">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to ship with Parcelio?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg">
            Experience next-level courier service with doorstep pickups and instant COD
            settlements today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={bookingLink}
            className="px-6 py-3 rounded-full bg-[#CAEA3C] text-neutral-950 font-bold text-sm hover:bg-[#b8d82d] transition-colors shadow-xs"
          >
            Book a Parcel
          </Link>
          <Link
            to="/be-a-rider"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-colors"
          >
            Become a Rider
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
