interface Brand {
  name: string
  logo: string
}

const brands: Brand[] = [
  { name: "Casio", logo: "/assets/brands/casio.png" },
  { name: "Amazon", logo: "/assets/brands/amazon.png" },
  { name: "Moonstar", logo: "/assets/brands/moonstar.png" },
  { name: "Star+", logo: "/assets/brands/star.png" },
  { name: "Start People", logo: "/assets/brands/start_people.png" },
  { name: "Randstad", logo: "/assets/brands/randstad.png" },
]

const BrandPartners = () => {
  return (
    <section className="py-6 sm:py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-[#03332D] tracking-tight mb-8">
          We've helped thousands of sales teams
        </h3>

        {/* Smooth Infinite Marquee Carousel */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee py-2">
            {/* First Set of Logos */}
            <div className="flex shrink-0 items-center justify-around gap-10 sm:gap-14 lg:gap-20 px-5 sm:px-7">
              {brands.map((brand, index) => (
                <div
                  key={`brand-1-${index}`}
                  className="flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Duplicate Set for Seamless Infinite Loop */}
            <div className="flex shrink-0 items-center justify-around gap-10 sm:gap-14 lg:gap-20 px-5 sm:px-7" aria-hidden="true">
              {brands.map((brand, index) => (
                <div
                  key={`brand-2-${index}`}
                  className="flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandPartners