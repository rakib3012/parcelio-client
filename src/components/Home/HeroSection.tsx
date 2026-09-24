import { useState, useEffect } from "react"
import { Link } from "react-router"
import { ArrowUpRight } from "lucide-react"

interface SlideData {
  titleLine1: string
  titleHighlight: string
  titleLine2: string
  titleLine3?: string
  subtitle: string
  primaryBtnText: string
  primaryBtnLink: string
  secondaryBtnText: string
  secondaryBtnLink: string
  bigImage: string
  bigImageAlt: string
}

const slides: SlideData[] = [
  {
    titleLine1: "We Make Sure Your",
    titleHighlight: "Parcel Arrives",
    titleLine2: "On Time",
    titleLine3: "– No Fuss.",
    subtitle:
      "Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.",
    primaryBtnText: "Track Your Parcel",
    primaryBtnLink: "/services",
    secondaryBtnText: "Be A Rider",
    secondaryBtnLink: "/be-a-rider",
    bigImage: "/assets/big-deliveryman.png",
    bigImageAlt: "Delivery rider with packages in electric van",
  },
  {
    titleLine1: "Fastest",
    titleHighlight: "Delivery & Easy",
    titleLine2: "Pickup",
    titleLine3: "Across All Hubs.",
    subtitle:
      "Doorstep pickup and swift delivery network connecting 64 districts nationwide with verified couriers.",
    primaryBtnText: "Send a Parcel",
    primaryBtnLink: "/services",
    secondaryBtnText: "View Pricing",
    secondaryBtnLink: "/pricing",
    bigImage: "/assets/delivery-van.png",
    bigImageAlt: "Parcelio delivery van",
  },
  {
    titleLine1: "Delivery in",
    titleHighlight: "30 Minutes",
    titleLine2: "At Your",
    titleLine3: "Doorstep.",
    subtitle:
      "Instant hyper-local courier service designed for quick commerce, merchants, and critical documents.",
    primaryBtnText: "Explore Services",
    primaryBtnLink: "/services",
    secondaryBtnText: "Coverage Map",
    secondaryBtnLink: "/coverage",
    bigImage: "/assets/safe-delivery.png",
    bigImageAlt: "Safe doorstep delivery",
  },
  {
    titleLine1: "Safe, Insured &",
    titleHighlight: "Live Tracking",
    titleLine2: "Every Mile",
    titleLine3: "Of The Way.",
    subtitle:
      "100% damage protection with OTP-verified drop-offs and real-time live map tracking for complete peace of mind.",
    primaryBtnText: "Track Your Parcel",
    primaryBtnLink: "/services",
    secondaryBtnText: "Be A Rider",
    secondaryBtnLink: "/be-a-rider",
    bigImage: "/assets/live-tracking.png",
    bigImageAlt: "Real-time parcel tracking",
  },
]

const HeroSection = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const currentSlide = slides[activeSlideIndex]

  // Optional auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-neutral-200/80 shadow-xs relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Content */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Top Decorative Tiny Deliveryman */}
          <div>
            <img
              src="/assets/tiny-deliveryman.png"
              alt="Express Delivery"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#03332D] leading-tight">
            {currentSlide.titleLine1} <br className="hidden sm:inline" />
            <span className="text-[#258a84]">{currentSlide.titleHighlight}</span>{" "}
            {currentSlide.titleLine2}
            {currentSlide.titleLine3 && (
              <>
                <br className="hidden sm:inline" />
                {currentSlide.titleLine3}
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-lg leading-relaxed">
            {currentSlide.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Action Button with attached/adjacent Arrow */}
            <div className="inline-flex items-center gap-2 group">
              <Link
                to={currentSlide.primaryBtnLink}
                className="inline-flex items-center justify-center bg-[#CAEA3C] hover:bg-[#bddf2e] text-neutral-950 font-bold px-6 py-3.5 rounded-full text-sm transition-all shadow-xs"
              >
                {currentSlide.primaryBtnText}
              </Link>
              <Link
                to={currentSlide.primaryBtnLink}
                aria-label={currentSlide.primaryBtnText}
                className="w-11 h-11 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs"
              >
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Secondary Action Button */}
            <Link
              to={currentSlide.secondaryBtnLink}
              className="inline-flex items-center justify-center bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-bold px-6 py-3.5 rounded-2xl text-sm transition-colors shadow-xs"
            >
              {currentSlide.secondaryBtnText}
            </Link>
          </div>

          {/* Slider Pagination Dashes */}
          <div className="flex items-center gap-2 pt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlideIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlideIndex === index
                    ? "w-9 bg-[#03332D]"
                    : "w-6 bg-[#D8E7E4] hover:bg-[#b8d6d1]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Illustration Image */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center">
            <img
              key={currentSlide.bigImage}
              src={currentSlide.bigImage}
              alt={currentSlide.bigImageAlt}
              className="w-full h-auto object-contain transition-all duration-300 animate-in fade-in"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
