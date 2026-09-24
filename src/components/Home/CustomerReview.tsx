import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules"
import { ArrowLeft, ArrowRight } from "lucide-react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"

interface Review {
  id: number
  name: string
  role: string
  review: string
  avatarBg: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Rasel Ahamed",
    role: "CTO",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatarBg: "bg-teal-700/40",
  },
  {
    id: 2,
    name: "Awlad Hossin",
    role: "Senior Product Designer",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatarBg: "bg-[#03332D]",
  },
  {
    id: 3,
    name: "Nasir Uddin",
    role: "CEO",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatarBg: "bg-teal-700/40",
  },
  {
    id: 4,
    name: "Awlad Hossin",
    role: "Senior Consultant",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatarBg: "bg-teal-700/40",
  },
  {
    id: 5,
    name: "Farhan Tanvir",
    role: "Lead Engineer",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatarBg: "bg-[#03332D]",
  },
  {
    id: 6,
    name: "Karim Rahman",
    role: "Manager",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatarBg: "bg-[#03332D]",
  },
]

const CustomerReview = () => {
  return (
    <section className="py-8 sm:py-12 my-6">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-4 space-y-3">
        <div>
          <img
            src="/assets/customer-top.png"
            alt="Customer Deliveries"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain mx-auto mb-2"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#03332D] tracking-tight">
          What our customers are sayings
        </h2>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
        </p>
      </div>

      {/* Swiper Container with Coverflow Effect */}
      <div className="relative w-full overflow-hidden px-4">
        <Swiper
          loop={true}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={1}
          coverflowEffect={{
            rotate: 0,
            stretch: 40,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{
            el: "#review-pagination-dots",
            clickable: true,
          }}
          navigation={{
            prevEl: "#review-prev-btn",
            nextEl: "#review-next-btn",
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="review-swiper py-6"
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
        >
          {reviews.map((item) => (
            <SwiperSlide key={item.id} className="w-72! sm:w-80! md:w-96!">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-xs flex flex-col justify-between h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                  <img
                    src="/assets/reviewQuote.png"
                    alt="Quote"
                    className="w-8 h-8 object-contain"
                  />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
                  {item.review}
                </p>

                {/* Dashed Line */}
                <div className="w-full border-t border-dashed border-teal-900/20 my-4" />

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-1">
                  <div
                    className={`w-10 h-10 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#03332D] leading-tight mb-0.5">
                      {item.name}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-tight">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Controls & Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* Previous Arrow Button */}
          <button
            id="review-prev-btn"
            type="button"
            aria-label="Previous Review"
            className="w-10 h-10 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Dots Pagination */}
          <div id="review-pagination-dots" className="review-pagination flex items-center justify-center w-auto!" />

          {/* Next Arrow Button */}
          <button
            id="review-next-btn"
            type="button"
            aria-label="Next Review"
            className="w-10 h-10 rounded-full bg-[#CAEA3C] hover:bg-[#bddf2e] text-neutral-950 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default CustomerReview