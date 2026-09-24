interface ServiceItem {
  id: number
  title: string
  description: string
  isFeatured?: boolean
}

const servicesData: ServiceItem[] = [
  {
    id: 1,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    id: 2,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    isFeatured: true,
  },
  {
    id: 3,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    id: 4,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    id: 5,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    id: 6,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
]

const OurServices = () => {
  return (
    <section className="bg-[#03332D] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xs">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Our Services
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className={`rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 ${
              service.isFeatured
                ? "bg-[#CAEA3C] text-[#03332D] shadow-md"
                : "bg-white text-[#03332D] shadow-xs hover:shadow-lg"
            }`}
          >
            {/* Icon with soft circular backdrop */}
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-5">
              <img
                src="/assets/service.png"
                alt={service.title}
                className="w-6 h-6 object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mb-3 leading-snug">
              {service.title}
            </h3>

            {/* Description */}
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                service.isFeatured ? "text-[#03332D]/80" : "text-neutral-600"
              }`}
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OurServices
