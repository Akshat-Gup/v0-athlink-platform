import { ArrowRight } from "lucide-react"
import { Button } from "@/components/atoms/button"

export function ProblemSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Most talented individuals never find sponsorships
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              95% of up-and-coming talents struggle to connect with brands, while sponsors miss out on authentic
              partnerships with emerging talent.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <div className="text-sm text-gray-400 mb-2">CURRENT MARKET REALITY</div>
            <div className="text-5xl font-bold mb-4">
              <span className="text-red-400">3%</span> success rate
            </div>
            <p className="text-gray-300 mb-6">
              Traditional sponsorship outreach has a 97% failure rate, leaving talent undiscovered and brands
              disconnected.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              See the Solution
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
