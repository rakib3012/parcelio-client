import { Clock, ShieldCheck, Truck } from 'lucide-react'

const HowItWorks = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">
            Nationwide Coverage
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Delivering across 64 districts with verified hubs and swift pickup
            points.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">
            Guaranteed Speed
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Same-day and next-day express delivery services optimized for modern
            e-commerce.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">
            Secure & Insured
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Safe parcel handling with OTP confirmation and comprehensive damage
            protection.
          </p>
        </div>
      </section>
  )
}

export default HowItWorks