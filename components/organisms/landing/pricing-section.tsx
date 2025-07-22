import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Card, CardContent } from "@/components/molecules/card"
import { cn } from "@/lib/utils"
import { talentFeatures, sponsorFeatures } from "@/lib/landing-data"
import { FeatureList } from "@/components/molecules/feature-list"

interface PricingSectionProps {
  pricingType: "talents" | "sponsors"
  onPricingTypeChange: (type: "talents" | "sponsors") => void
}

export function PricingSection({ pricingType, onPricingTypeChange }: PricingSectionProps) {
  return (
    <section className="pt-24 pb-16 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-lg text-gray-600 mb-6">Choose the plan that works for you</p>

          <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200">
            <button
              onClick={() => onPricingTypeChange("talents")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                pricingType === "talents" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900",
              )}
            >
              For Talents
            </button>
            <button
              onClick={() => onPricingTypeChange("sponsors")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                pricingType === "sponsors" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900",
              )}
            >
              For Sponsors
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {pricingType === "talents" ? (
            <Card className="bg-white border-2 border-green-400 shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-3">Talents Plan</h2>

                <div className="mb-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    Free
                  </span>
                  <p className="text-gray-600 mt-1">Forever free for all talents</p>
                </div>

                <div className="text-left mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">Everything you need to get sponsored</h3>
                  <FeatureList features={talentFeatures} />
                </div>

                <Link href="/discover">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-8"
                  >
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="text-sm text-gray-500 mt-3">No credit card required • Start immediately</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-2 border-green-400 shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-3">Sponsors Plan</h2>

                <div className="mb-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    $10
                  </span>
                  <span className="text-xl text-gray-600">/mo</span>
                  <div className="mt-2">
                    <span className="text-lg text-orange-600 font-semibold">+ 2% Lead Generation Commission</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Only pay when you successfully connect with talents
                    </p>
                  </div>
                </div>

                <div className="text-left mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Advanced tools for finding perfect talents
                  </h3>
                  <FeatureList features={sponsorFeatures} />
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-8"
                  >
                    Start 14-Day Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 border-gray-300 bg-transparent"
                  >
                    Contact Sales
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-3">14-day free trial • No setup fees • Cancel anytime</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-center mt-12">
          <Card className="bg-white shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">Questions about pricing?</h3>
              <p className="text-gray-600 mb-4">
                Our team is here to help you choose the right plan for your needs.
              </p>
              <Button variant="outline" className="rounded-full bg-transparent">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
