import { useState, useEffect } from "react"
import { Link } from "react-router"
import {
  MapPin,
  Search,
  Building2,
  Navigation,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  ChevronDown,
  Globe2,
  Layers,
  Sparkles,
  Check,
} from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { DistrictHubModal } from "@/components/Modal/DistrictHubModal"

export interface WarehouseLocation {
  region: string
  district: string
  city: string
  covered_area: string[]
  status: string
  flowchart?: string
  longitude: number
  latitude: number
}

interface TransitZone {
  zone: string
  title: string
  timeline: string
  description: string
  districts: string
  badgeColor: string
}

const transitZones: TransitZone[] = [
  {
    zone: "Zone 1",
    title: "Dhaka Metro Express",
    timeline: "4–6 Hours / Same-Day",
    description: "Intra-city priority courier with same-day doorstep pickup and express drop-off.",
    districts: "All areas inside Dhaka North & South City Corporations",
    badgeColor: "bg-[#CAEA3C] text-neutral-950",
  },
  {
    zone: "Zone 2",
    title: "Dhaka Suburbs & Periphery",
    timeline: "24–36 Hours",
    description: "Fast transit connecting greater manufacturing and suburban residential belts.",
    districts: "Gazipur, Narayanganj, Savar, Keraniganj, Tongi, Dhamrai",
    badgeColor: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  },
  {
    zone: "Zone 3",
    title: "Divisional Headquarters",
    timeline: "24–48 Hours",
    description: "Daily trunk line logistics connecting all 7 divisional metropolises.",
    districts: "Chattogram, Sylhet, Khulna, Rajshahi, Barishal, Rangpur, Mymensingh",
    badgeColor: "bg-blue-100 text-blue-900 border border-blue-300",
  },
  {
    zone: "Zone 4",
    title: "Nationwide Upazilas & Thanas",
    timeline: "48–72 Hours",
    description: "Last-mile doorstep coverage across all 495+ verified upazilas and unions.",
    districts: "Remote thanas, coastal belts, tea estates, and rural upazilas",
    badgeColor: "bg-amber-100 text-amber-900 border border-amber-300",
  },
]

interface CoverageFaq {
  question: string
  answer: string
}

const coverageFaqs: CoverageFaq[] = [
  {
    question: "Do you deliver to remote upazilas and rural unions in Bangladesh?",
    answer:
      "Yes! Parcelio covers all 64 districts and 495+ upazilas across Bangladesh. Through our local distribution hubs and certified last-mile riders, we guarantee home doorstep delivery rather than making recipients travel to distant depot counters.",
  },
  {
    question: "How do I verify if my recipient's specific area or village has home delivery?",
    answer:
      "Use our instant search bar above. Simply type the recipient's district, thana, or upazila name (e.g., Teknaf, Shibchar, Sreepur, Tungipara). If the district hub is listed, our riders service the entire administrative upazila jurisdiction.",
  },
  {
    question: "Is Cash on Delivery (COD) supported in all 64 districts?",
    answer:
      "Yes, 100% of our covered districts support Cash on Delivery (COD). All collected cash is insured during transit and disbursed directly to your bank account or bKash/Nagad wallet within 24 to 48 hours of successful delivery.",
  },
  {
    question: "What are the daily cutoff times for same-day and next-day pickup?",
    answer:
      "Inside Dhaka Metro, same-day express orders must be booked before 12:00 PM. For nationwide inter-district deliveries, bookings confirmed before 4:00 PM are picked up same-day and enter inter-district transit lines by night.",
  },
  {
    question: "What happens if a recipient is temporarily unavailable during delivery?",
    answer:
      "Our delivery rider attempts delivery up to 3 times on consecutive business days. Each attempt includes real-time SMS notifications and phone coordination with both the recipient and sender before any return is initiated.",
  },
]

const divisionSummaries = [
  { name: "Dhaka", count: 13, transit: "4–24 Hours", hub: "Dhaka Central Logistics Hub" },
  { name: "Chattogram", count: 11, transit: "24–48 Hours", hub: "Agrabad Commercial Hub" },
  { name: "Khulna", count: 10, transit: "24–48 Hours", hub: "Khulna Regional Transit Center" },
  { name: "Rajshahi", count: 8, transit: "24–48 Hours", hub: "Rajshahi Division Depot" },
  { name: "Rangpur", count: 8, transit: "48–72 Hours", hub: "Rangpur City Hub" },
  { name: "Barisal", count: 6, transit: "48–72 Hours", hub: "Barishal Riverine & Highway Hub" },
  { name: "Sylhet", count: 4, transit: "24–48 Hours", hub: "Sylhet Sadar Gateway" },
  { name: "Mymensingh", count: 4, transit: "24–48 Hours", hub: "Mymensingh Central Depot" },
]

export default function CoveragePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const bookingLink = isAuthenticated ? "/dashboard/booking" : "/login"

  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedDivision, setSelectedDivision] = useState<string>("Dhaka")
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [modalLocation, setModalLocation] = useState<WarehouseLocation | null>(null)

  // Load locations dataset
  useEffect(() => {
    let ignore = false

    fetch("/assets/warehouses.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok")
        return res.json()
      })
      .then((data: WarehouseLocation[]) => {
        if (!ignore) {
          setWarehouses(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to fetch warehouses.json:", err)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // 1. Shob warehouse theke unique division-er list toiri kora
  const allRegions = warehouses.map((item) => item.region)
  const uniqueDivisions = Array.from(new Set(allRegions)).filter(Boolean)
  const divisionList = ["All", ...uniqueDivisions]

  // 2. Search ebong selected division onujayi warehouse filter kora
  const cleanSearchQuery = searchQuery.trim().toLowerCase()

  const filteredWarehouses = warehouses.filter((item) => {
    // Division filter check kora
    const matchesDivision =
      selectedDivision === "All" ||
      item.region.toLowerCase() === selectedDivision.toLowerCase()

    if (!matchesDivision) {
      return false
    }

    // Search input khali thakle baki shob dekhabe
    if (!cleanSearchQuery) {
      return true
    }

    // District, city othoba covered area onujayi search match kora
    const districtMatch = item.district.toLowerCase().includes(cleanSearchQuery)
    const cityMatch = item.city.toLowerCase().includes(cleanSearchQuery)
    const regionMatch = item.region.toLowerCase().includes(cleanSearchQuery)
    const areaMatch = item.covered_area?.some((area) =>
      area.toLowerCase().includes(cleanSearchQuery)
    )

    return districtMatch || cityMatch || regionMatch || areaMatch
  })

  // Quick helper to get estimated timeline string
  const getTimelineForDistrict = (district: string, region: string) => {
    if (district.toLowerCase() === "dhaka") {
      return "4–24 Hours"
    }
    const suburbs = ["gazipur", "narayanganj", "manikganj", "munshiganj"]
    if (suburbs.includes(district.toLowerCase())) {
      return "24–36 Hours"
    }
    if (["Chattogram", "Sylhet", "Rajshahi", "Khulna"].includes(region)) {
      return "24–48 Hours"
    }
    return "48–72 Hours"
  }

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-[#03332D] dark:bg-[#151a23] dark:border dark:border-white/10 rounded-[32px] p-8 sm:p-14 lg:p-16 text-white shadow-md transition-colors">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#CAEA3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#CAEA3C] border border-white/15 backdrop-blur-sm">
            <Globe2 className="w-3.5 h-3.5 text-[#CAEA3C]" />
            Nationwide Logistics Network
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Delivery Coverage <br />
            <span className="text-[#CAEA3C]">Across Bangladesh</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 dark:text-neutral-400 leading-relaxed max-w-2xl">
            From metropolitan high-rises to remote upazila riverbanks — Parcelio
            operates active distribution hubs across all 64 districts and 495+
            upazilas with doorstep delivery and 100% insured Cash on Delivery.
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#CAEA3C]">64 / 64</p>
              <p className="text-xs text-neutral-300 dark:text-neutral-400 font-medium mt-0.5">Districts Active</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">495+</p>
              <p className="text-xs text-neutral-300 dark:text-neutral-400 font-medium mt-0.5">Upazilas Reached</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#CAEA3C]">24–72h</p>
              <p className="text-xs text-neutral-300 dark:text-neutral-400 font-medium mt-0.5">Delivery SLA</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs text-neutral-300 dark:text-neutral-400 font-medium mt-0.5">Doorstep COD</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Instant Coverage Search & Division Filter Tool */}
      <section id="search-coverage" className="space-y-6">
        <div className="bg-white dark:bg-[#151a23] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5e7724] dark:text-[#CAEA3C] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                Live Hub Locator
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                Check Delivery in Your Area
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Type any district, thana, upazila, or divisional center to see active hubs and transit speeds.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={bookingLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#CAEA3C] text-neutral-950 font-bold text-xs hover:bg-[#b8d82d] transition-all shadow-xs"
              >
                <span>Book a Parcel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by district or thana (e.g. Uttara, Cox's Bazar, Bogura, Gazipur, Sylhet)..."
              className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#CAEA3C] focus:border-neutral-900 dark:focus:border-[#CAEA3C] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center gap-1 px-2.5 my-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-200/70 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Popular hubs:</span>
            {["Dhaka", "Chattogram", "Sylhet", "Gazipur", "Cox's Bazar", "Bogura", "Khulna"].map(
              (city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSearchQuery(city)}
                  className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer"
                >
                  {city}
                </button>
              )
            )}
          </div>

          {/* Division Filter Tabs */}
          <div className="pt-2 border-t border-neutral-100 dark:border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 shrink-0 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Divisions:
              </span>
              {divisionList.map((division) => {
                const isActive = selectedDivision === division
                const count =
                  division === "All"
                    ? warehouses.length
                    : warehouses.filter((w) => w.region === division).length

                return (
                  <button
                    key={division}
                    type="button"
                    onClick={() => setSelectedDivision(division)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#03332D] dark:bg-[#CAEA3C] text-[#CAEA3C] dark:text-neutral-950 shadow-xs"
                        : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {division} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 px-2">
          <p>
            Showing <strong className="text-neutral-900 dark:text-white">{filteredWarehouses.length}</strong> of{" "}
            {warehouses.length} delivery hubs across Bangladesh
            {selectedDivision !== "All" && (
              <span className="text-neutral-500 dark:text-neutral-400"> in {selectedDivision} Division</span>
            )}
            {searchQuery && (
              <span className="text-neutral-500 dark:text-neutral-400"> matching &ldquo;{searchQuery}&rdquo;</span>
            )}
          </p>

          {(searchQuery || selectedDivision !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedDivision("All")
              }}
              className="text-xs text-[#5e7724] dark:text-[#CAEA3C] font-bold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Coverage Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#151a23] rounded-3xl p-6 border border-neutral-200 dark:border-white/10 animate-pulse space-y-4"
              >
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2" />
                <div className="h-4 bg-neutral-100 dark:bg-neutral-800/60 rounded-md w-3/4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full w-16" />
                  <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="bg-white dark:bg-[#151a23] rounded-3xl p-12 text-center border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-4 transition-colors">
            <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No matching hubs found</h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              We couldn&apos;t find any hubs matching &ldquo;{searchQuery}&rdquo;. Try searching by
              the main district name (e.g. &ldquo;Dhaka&rdquo;, &ldquo;Sylhet&rdquo;) or check our 64
              active districts.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedDivision("All")
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Show All 64 Districts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWarehouses.map((item) => {
              const timeline = getTimelineForDistrict(item.district, item.region)
              return (
                <div
                  key={`${item.region}-${item.district}`}
                  className="bg-white dark:bg-[#151a23] rounded-3xl p-6 border border-neutral-200/80 dark:border-white/10 shadow-xs hover:shadow-md hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row: District & Division */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                          <span>{item.region} Division</span>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-2 group-hover:text-[#03332D] dark:group-hover:text-[#CAEA3C] transition-colors">
                          {item.district}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                          Hub: {item.city} City Hub
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active Hub
                        </span>
                        <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#5e7724] dark:text-[#CAEA3C]" />
                          {timeline}
                        </span>
                      </div>
                    </div>

                    {/* Covered Areas / Upazilas */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                        Covered Upazilas & Thanas:
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {item.covered_area && item.covered_area.length > 0 ? (
                          item.covered_area.map((area, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium"
                            >
                              {area}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-400 italic">
                            All upazilas under {item.district} district
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-white/10 grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Doorstep Delivery</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>COD Supported</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Live GPS Tracking</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Return Pickup</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-5 mt-4 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setModalLocation(item)}
                      className="text-xs font-bold text-[#03332D] dark:text-[#CAEA3C] hover:text-[#5e7724] dark:hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Hub details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. Delivery Zones & Transit Time Breakdown */}
      <section className="bg-white dark:bg-[#151a23] rounded-[32px] p-8 sm:p-12 lg:p-14 border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-8 transition-colors">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5e7724] dark:text-[#CAEA3C] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Guaranteed SLAs
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Delivery Zones & Guaranteed Transit Speeds
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Parcelio organizes nationwide delivery into four operational tiers so senders
            always know exactly when packages will arrive at recipient doorsteps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transitZones.map((zone) => (
            <div
              key={zone.zone}
              className="rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-white/20 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                    {zone.zone}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${zone.badgeColor}`}
                  >
                    {zone.timeline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{zone.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{zone.description}</p>
              </div>

              <div className="pt-3 border-t border-neutral-200/70 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400">
                <strong className="text-neutral-700 dark:text-neutral-300">Coverage: </strong>
                {zone.districts}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bangladesh 8 Divisions Overview Matrix */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5e7724] dark:text-[#CAEA3C] uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Divisional Logistics Grid
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1">
              8 Divisions, 1 Seamless Network
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              Select any administrative division below to quickly inspect districts, regional transit
              centers, and guaranteed delivery times.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {divisionSummaries.map((div) => {
            const isSelected = selectedDivision === div.name
            return (
              <button
                key={div.name}
                type="button"
                onClick={() => {
                  setSelectedDivision(div.name)
                  const searchSection = document.getElementById("search-coverage")
                  searchSection?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`p-5 rounded-2xl text-left border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#03332D] text-white border-[#03332D] dark:border-white/20 shadow-md"
                    : "bg-white dark:bg-[#151a23] text-neutral-900 dark:text-white border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/15 text-[#CAEA3C]"
                          : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-200 dark:group-hover:bg-white/10"
                      }`}
                    >
                      {div.count} Districts
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? "text-[#CAEA3C]" : "text-[#5e7724] dark:text-[#CAEA3C]"
                      }`}
                    >
                      {div.transit}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{div.name} Division</h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isSelected ? "text-neutral-300" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Hub: {div.hub}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t text-xs font-semibold flex items-center justify-between ${
                    isSelected ? "border-white/10 text-[#CAEA3C]" : "border-neutral-100 dark:border-white/10 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <span>Explore {div.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* 5. Why Parcelio Coverage is Superior */}
      <section className="bg-[#03332D] dark:bg-[#151a23] dark:border dark:border-white/10 rounded-[32px] p-8 sm:p-14 lg:p-16 text-white space-y-10 transition-colors">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#CAEA3C]">
            <ShieldCheck className="w-4 h-4 text-[#CAEA3C]" />
            Enterprise-Grade Courier Assurance
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Why Shippers & E-Commerce Depend on Our Coverage
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400 leading-relaxed">
            Our nationwide logistics backbone is built from the ground up to solve Bangladesh&apos;s
            toughest last-mile delivery challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CAEA3C] text-neutral-950 flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Doorstep Delivery</h3>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              We never drop parcels off at a far-away bus counter. Our local hub riders deliver
              straight to the recipient&apos;s residential or office door.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CAEA3C] text-neutral-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Insured COD Remittance</h3>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              Every parcel value is guaranteed. Cash collected at delivery is deposited safely and
              disbursed quickly to merchants with transparent statements.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CAEA3C] text-neutral-950 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Automated Barcode Scans</h3>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              From origin pickup scan to central sorting belt and rider dispatch, get live milestone
              visibility via online tracking and SMS notifications.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CAEA3C] text-neutral-950 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Reverse Logistics & Returns</h3>
            <p className="text-xs text-neutral-300 dark:text-neutral-400 leading-relaxed">
              Effortless customer return collection from any of Bangladesh&apos;s 64 districts with
              instant OTP verification and dispute-free merchant return handling.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Coverage FAQs */}
      <section className="bg-white dark:bg-[#151a23] rounded-[32px] p-8 sm:p-12 lg:p-14 border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-8 transition-colors">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5e7724] dark:text-[#CAEA3C] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Frequently Asked Questions About Coverage
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Find answers regarding our delivery network, remote upazila accessibility, and COD coverage.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {coverageFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className="border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-neutral-900 dark:text-white" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-white/10 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="rounded-[32px] bg-neutral-900 dark:bg-[#151a23] dark:border dark:border-white/10 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-md transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#CAEA3C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#CAEA3C] border border-white/10">
            <Truck className="w-3.5 h-3.5" />
            Ready to dispatch?
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Deliver Your Parcels Anywhere in Bangladesh
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Create your account in seconds, schedule a doorstep rider pickup, and experience
            transparent real-time tracking across all 64 districts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link
            to={bookingLink}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#CAEA3C] text-neutral-950 font-bold text-sm hover:bg-[#b8d82d] transition-all shadow-md group"
          >
            <span>Book a Delivery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all border border-white/15"
          >
            <span>Explore Services</span>
          </Link>
        </div>
      </section>

      {/* Modal: District & Hub Details */}
      <DistrictHubModal
        location={modalLocation}
        onClose={() => setModalLocation(null)}
        timelineText={
          modalLocation
            ? getTimelineForDistrict(
                modalLocation.district,
                modalLocation.region
              )
            : ""
        }
        bookingLink={bookingLink}
      />
    </div>
  )
}
