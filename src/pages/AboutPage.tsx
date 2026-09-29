import { useState } from "react"

interface TabContent {
  id: string
  label: string
  paragraphs: string[]
}

const aboutTabs: TabContent[] = [
  {
    id: "story",
    label: "Story",
    paragraphs: [
      "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
      "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
      "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
    ],
  },
  {
    id: "mission",
    label: "Mission",
    paragraphs: [
      "Our mission is to revolutionize logistics through technology, transparent tracking, and dependable human connections. We aim to empower businesses and everyday senders with seamless delivery experiences across all 64 districts.",
      "By constantly investing in automated routing, green parcel transport, and dedicated rider welfare, we make sure that our growth fuels sustainable communities.",
      "We believe delivery should not be a waiting game. Our team works around the clock to maintain 99.4% on-time delivery rates and proactive customer support.",
    ],
  },
  {
    id: "success",
    label: "Success",
    paragraphs: [
      "Over 1.5M+ successful deliveries completed across Bangladesh with an unmatched reliability score and verified courier accountability.",
      "Trusted by 5,000+ registered merchants, e-commerce storefronts, and independent sellers nationwide who depend on our scheduled daily pick-ups.",
      "Awarded Best Modern Logistics Platform for our breakthrough in real-time geo-tracking and verified rider security protocols.",
    ],
  },
  {
    id: "team",
    label: "Team & Others",
    paragraphs: [
      "Behind Parcelio is an energetic team of software engineers, logistics strategists, and over 1,200 verified delivery partners across the country.",
      "Our operational hubs and customer success teams operate 24/7 to solve queries, resolve exceptions, and ensure end-to-end parcel safety.",
      "We take pride in our inclusive workplace culture that rewards innovation, accountability, and respect for our frontline riders.",
    ],
  },
]

const AboutPage = () => {
  const [activeTabId, setActiveTabId] = useState("story")

  const currentTab =
    aboutTabs.find((tab) => tab.id === activeTabId) || aboutTabs[0]

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-8">
      <div className="bg-white rounded-[32px] p-8 sm:p-14 lg:p-16 border border-neutral-200/70 shadow-xs">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B3337] tracking-tight">
            About Us
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed mt-3 max-w-2xl">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-200/80 my-8 sm:my-10" />

        {/* Navigation Tabs */}
        <div className="flex items-center flex-wrap gap-7 sm:gap-10 mb-8 sm:mb-10">
          {aboutTabs.map((tab) => {
            const isActive = tab.id === activeTabId
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`text-lg sm:text-xl font-bold transition-colors cursor-pointer select-none ${
                  isActive
                    ? "text-[#5e7724]"
                    : "text-neutral-400 hover:text-neutral-600 font-semibold"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6 sm:space-y-7 max-w-5xl">
          {currentTab.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutPage
