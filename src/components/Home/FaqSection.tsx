import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

interface FaqItem {
  id: number
  question: string
  answer: string
}

const faqList: FaqItem[] = [
  {
    id: 1,
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
  },
  {
    id: 2,
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, our product features adjustable straps and ergonomic contours designed to adapt comfortably to various body shapes and sizes for adults, students, and seniors alike.",
  },
  {
    id: 3,
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Regular daily use helps develop muscle memory, reduces unnecessary spinal stress, and gradually relieves upper back, neck, and shoulder strain caused by prolonged sitting.",
  },
  {
    id: 4,
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Selected pro editions come equipped with an intelligent angle sensor that vibrates gently to remind you whenever your posture slouches beyond 15 degrees.",
  },
  {
    id: 5,
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You can enter your email on our alert list or register in your dashboard. We will send an instant SMS and email confirmation the moment new stock arrives at the hub.",
  },
]

const FaqSection = () => {
  return (
    <section className="py-8 sm:py-12 my-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#03332D] tracking-tight">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
          </p>
        </div>

        {/* Shadcn Accordion */}
        <Accordion
          className="space-y-4"
          defaultValue={["faq-1"]}
        >
          {faqList.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${faq.id}`}
              className="rounded-2xl border border-neutral-100 bg-white shadow-xs data-[panel-open]:border-[#288E89] data-[panel-open]:bg-[#EBF7F5] transition-all overflow-hidden"
            >
              <AccordionTrigger className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer text-sm sm:text-base font-bold text-neutral-900 data-[panel-open]:text-[#03332D] [&>svg]:text-neutral-700 data-[panel-open]:[&>svg]:text-[#288E89]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <div className="border-t border-[#288E89]/20 pt-3">
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom CTA Button matching screenshot */}
        <div className="flex items-center justify-center gap-2 pt-8 sm:pt-10">
          <Link
            to="/about"
            className="inline-flex items-center justify-center bg-[#CAEA3C] hover:bg-[#bddf2e] text-neutral-950 font-bold px-7 py-3 rounded-full text-sm transition-all shadow-xs"
          >
            See More FAQ's
          </Link>
          <Link
            to="/about"
            aria-label="See More FAQ's"
            className="w-10 h-10 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
