import { TrainSearch } from "@/components/train-search"
import { FeaturesSection } from "@/components/features-section"
import { HeroSection } from "@/components/hero-section"
import { DemoBanner } from "@/components/demo-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <DemoBanner />
        <TrainSearch />
        <FeaturesSection />
      </div>
    </div>
  )
}
