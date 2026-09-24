interface WorkStep {
  id: number
  title: string
  description: string
  icon: string
}

const workSteps: WorkStep[] = [
  {
    id: 1,
    title: "Booking Pick & Drop",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: "/assets/bookingIcon.png",
  },
  {
    id: 2,
    title: "Cash On Delivery",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: "/assets/bookingIcon.png",
  },
  {
    id: 3,
    title: "Delivery Hub",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: "/assets/bookingIcon.png",
  },
  {
    id: 4,
    title: "Booking SME & Corporate",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: "/assets/bookingIcon.png",
  },
]

const HowItWorks = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#03332D] tracking-tight">
        How it Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {workSteps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
          >
            <div className="mb-4">
              <img
                src={step.icon}
                alt={step.title}
                className="w-10 h-10 object-contain"
              />
            </div>

            <h3 className="text-base font-bold text-[#03332D] mb-2 leading-snug">
              {step.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks