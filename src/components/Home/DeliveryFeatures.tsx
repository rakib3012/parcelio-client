interface DeliveryFeature {
  id: number
  title: string
  description: string
  image: string
}

const deliveryFeatures: DeliveryFeature[] = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: "/assets/live-tracking.png",
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: "/assets/safe-delivery.png",
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: "/assets/safe-delivery.png",
  },
]

const DeliveryFeatures = () => {
  return (
    <section className="py-8 sm:py-12 border-y border-dashed border-teal-900/20 my-6">
      <div className="space-y-6">
        {deliveryFeatures.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-xs flex flex-col md:flex-row items-center gap-6 sm:gap-10 hover:shadow-md transition-all duration-300"
          >
            {/* Left: Illustration Image */}
            <div className="w-full md:w-56 lg:w-64 flex items-center justify-center shrink-0">
              <img
                src={feature.image}
                alt={feature.title}
                className="h-28 sm:h-32 md:h-36 w-auto object-contain"
              />
            </div>

            {/* Vertical Dashed Divider (Desktop) */}
            <div
              className="hidden md:block w-px self-stretch border-r border-dashed border-teal-900/20"
              aria-hidden="true"
            />

            {/* Right: Content */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#03332D]">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DeliveryFeatures
