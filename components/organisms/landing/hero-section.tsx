import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Star className="mr-2 h-4 w-4" />
          Trusted by 10,000+ talents and brands
        </Badge>

        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
          Connect Talents with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Perfect Sponsors
          </span>
        </h1>

        <p className="mb-12 text-xl text-gray-600 md:text-2xl max-w-3xl mx-auto">
          Athlink uses AI to match talents with ideal sponsors, creating authentic partnerships that drive
          mutual success. Join the future of sponsorship.
        </p>

        <Link href="/discover">
          <Button size="lg" className="rounded-full bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
