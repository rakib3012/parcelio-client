import { Link } from "react-router"

const MerchantBanner = () => {
  return (
    <section className="bg-[#03332D] rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xs">
      {/* Decorative Top Wave Graphic */}
      <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-85 select-none overflow-hidden">
        <img
          src="/assets/be-a-merchant-bg.png"
          alt=""
          className="w-full h-auto object-cover max-h-36 sm:max-h-48"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Content */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Merchant and Customer Satisfaction <br className="hidden sm:inline" />
            is Our First Priority
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/services"
              className="inline-flex items-center justify-center bg-[#CAEA3C] hover:bg-[#bddf2e] text-neutral-950 font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-xs"
            >
              Become a Merchant
            </Link>

            <Link
              to="/be-a-rider"
              className="inline-flex items-center justify-center bg-transparent hover:bg-[#CAEA3C]/10 border border-[#CAEA3C] text-[#CAEA3C] font-semibold px-7 py-3.5 rounded-full text-sm transition-colors"
            >
              Earn with Parcelio Courier
            </Link>
          </div>
        </div>

        {/* Right Column: Isometric Illustration */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md flex items-center justify-center">
            <img
              src="/assets/location-merchant.png"
              alt="Merchant Parcel Location"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MerchantBanner
