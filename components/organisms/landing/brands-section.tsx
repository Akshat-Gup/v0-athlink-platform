import { brands, stats } from "@/lib/landing-data"
import { BrandLogo } from "@/components/molecules/brand-logo"
import { StatsCard } from "@/components/molecules/stats-card"

export function BrandsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Trusted by Leading Brands</h2>
          <p className="text-xl text-gray-600">
            Join thousands of brands already using Athlink to find their perfect talent partners
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand, index) => (
            <BrandLogo key={index} name={brand.name} logo={brand.logo} />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatsCard 
                key={index}
                value={stat.value}
                label={stat.label}
                color={stat.color}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
