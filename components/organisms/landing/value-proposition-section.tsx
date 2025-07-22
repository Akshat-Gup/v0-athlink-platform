import { valueProps } from "@/lib/landing-data"
import { ValuePropCard } from "@/components/molecules/value-prop-card"

export function ValuePropositionSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Why Choose Athlink?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform revolutionizes how talents and brands connect, creating meaningful
            partnerships that drive results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <ValuePropCard
              key={index}
              title={prop.title}
              description={prop.description}
              icon={prop.icon as "zap" | "trending-up" | "target"}
              gradient={prop.gradient}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <div className="text-sm text-gray-500 mb-2">ATHLINK RESULTS</div>
            <div className="text-5xl font-bold mb-4">
              <span className="text-green-600">20x</span> better matching
            </div>
            <p className="text-gray-600">
              Our AI increases sponsorship fit accuracy and revenue potential by 2000% compared to traditional
              methods.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
