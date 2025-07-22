"use client"

import { useState } from "react"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { 
  BackgroundEffects,
  Navigation,
  HeroSection,
  ProblemSection,
  ValuePropositionSection,
  BrandsSection,
  PricingSection,
  LandingFooter
} from "@/components/organisms"

export default function LandingPage() {
  const mousePosition = useMousePosition()
  const [activeTab, setActiveTab] = useState<"landing" | "pricing">("landing")
  const [pricingType, setPricingType] = useState<"talents" | "sponsors">("talents")

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BackgroundEffects mousePosition={mousePosition} />
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main>
        {activeTab === "landing" ? (
          <>
            <HeroSection />
            <ProblemSection />
            <ValuePropositionSection />
            <BrandsSection />
          </>
        ) : (
          <PricingSection 
            pricingType={pricingType} 
            onPricingTypeChange={setPricingType} 
          />
        )}
      </main>

      <LandingFooter onTabChange={setActiveTab} />
    </div>
  )
}