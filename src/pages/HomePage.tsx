import HeroSection from "@/components/Home/HeroSection"
import HowItWorks from "@/components/Home/HowItWorks"
 

const HomePage = () => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Grid */}
      <div>
        <HowItWorks />
      </div>
    </div>
  )
}

export default HomePage
