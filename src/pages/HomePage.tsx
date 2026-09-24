import HeroSection from "@/components/Home/HeroSection"
import HowItWorks from "@/components/Home/HowItWorks"
import OurServices from "@/components/Home/OurServices"
import BrandPartners from "@/components/Home/BrandPartners"
import DeliveryFeatures from "@/components/Home/DeliveryFeatures"
import MerchantBanner from "@/components/Home/MerchantBanner"
import CustomerReview from "@/components/Home/CustomerReview"
import FaqSection from "@/components/Home/FaqSection"

const HomePage = () => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Our Services Section */}
      <OurServices />

      {/* Brand Partners Section */}
      <BrandPartners />

      {/* Delivery Features Section (Live Tracking, Safe Delivery, 24/7 Support) */}
      <DeliveryFeatures />

      {/* Merchant & Customer Satisfaction Banner */}
      <MerchantBanner />

      {/* Customer Review Section (Swiper Coverflow) */}
      <CustomerReview />

      {/* Frequently Asked Questions (FAQ) Section */}
      <FaqSection />
    </div>
  )
}

export default HomePage
