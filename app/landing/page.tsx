"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Star, TrendingUp, Target, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const valueProps = [
  {
    title: "AI-Powered Matching",
    description:
      "Our advanced AI analyzes thousands of data points to find perfect sponsor-talent matches with 95% accuracy.",
    icon: (
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
        <Zap className="w-8 h-8 text-white" />
      </div>
    ),
  },
  {
    title: "Instant Connections",
    description: "Connect with verified brands and talents in real-time. No more waiting weeks for email responses.",
    icon: (
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
        <TrendingUp className="w-8 h-8 text-white" />
      </div>
    ),
  },
  {
    title: "Verified Profiles",
    description:
      "All profiles are verified and authenticated. Connect with confidence knowing you're dealing with real professionals.",
    icon: (
      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
        <Target className="w-8 h-8 text-white" />
      </div>
    ),
  },
]

const brands = [
  { name: "Nike", logo: "/placeholder.svg?height=60&width=120&text=Nike" },
  { name: "Adidas", logo: "/placeholder.svg?height=60&width=120&text=Adidas" },
  { name: "Under Armour", logo: "/placeholder.svg?height=60&width=120&text=Under+Armour" },
  { name: "Puma", logo: "/placeholder.svg?height=60&width=120&text=Puma" },
  { name: "New Balance", logo: "/placeholder.svg?height=60&width=120&text=New+Balance" },
  { name: "Reebok", logo: "/placeholder.svg?height=60&width=120&text=Reebok" },
]

const talentFeatures = [
  "Create comprehensive talent profile",
  "Browse unlimited sponsor opportunities",
  "AI-powered sponsor matching",
  "Direct messaging with brands",
  "Performance analytics dashboard",
  "Community access and networking",
]

const sponsorFeatures = [
  "Everything in Talents plan",
  "Advanced talent search filters",
  "Bulk outreach and messaging tools",
  "Campaign management dashboard",
  "ROI tracking and analytics",
  "Priority placement in search results",
  "Dedicated account manager",
  "Custom integration support",
]

/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<"landing" | "pricing">("landing")
  const [pricingType, setPricingType] = useState<"talents" | "sponsors">("talents")

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ------------------------------------------------------------------ */}
      {/* FLOATING BACKGROUND EFFECTS                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Mouse-following blob */}
        <div
          className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl"
          style={{
            left: mouse.x - 192,
            top: mouse.y - 192,
            transition: "all 0.3s ease",
          }}
        />

        {/* Floating islands */}
        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-gradient-to-r from-green-200/40 to-teal-200/40 blur-2xl animate-pulse" />
        <div className="absolute top-40 right-32 h-24 w-24 rounded-full bg-gradient-to-r from-orange-200/40 to-red-200/40 blur-xl animate-bounce" />
        <div className="absolute bottom-40 left-1/4 h-40 w-40 rounded-full bg-gradient-to-r from-purple-200/40 to-pink-200/40 blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 h-28 w-28 rounded-full bg-gradient-to-r from-blue-200/40 to-cyan-200/40 blur-xl animate-bounce" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* NAVBAR                                                              */}
      {/* ------------------------------------------------------------------ */}
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/discover"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/80 p-2 backdrop-blur"
          >
            <Image src="/athlink-logo.png" alt="Athlink" width={20} height={20} />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 backdrop-blur md:flex">
            <button
              onClick={() => setActiveTab("landing")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "landing"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("pricing")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "pricing"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              Pricing
            </button>
            <Link
              href="#about"
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-2 py-2 backdrop-blur">
            <Button variant="ghost" className="rounded-full text-gray-600">
              Sign In
            </Button>
            <Button className="rounded-full bg-gray-900 text-white hover:bg-gray-800">Get Started</Button>
          </div>
        </div>
      </header>

      <main>
        {activeTab === "landing" ? (
          <>
            {/* ---------------------------------------------------------------- */}
            {/* HERO SECTION                                                     */}
            {/* ---------------------------------------------------------------- */}
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

            {/* ---------------------------------------------------------------- */}
            {/* PROBLEM SECTION                                                  */}
            {/* ---------------------------------------------------------------- */}
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

            {/* ---------------------------------------------------------------- */}
            {/* VALUE PROPOSITION SECTION                                        */}
            {/* ---------------------------------------------------------------- */}
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
                    <Card
                      key={index}
                      className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-8">
                        <div className="mb-6">{prop.icon}</div>
                        <h3 className="text-2xl font-bold mb-4">{prop.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{prop.description}</p>
                      </CardContent>
                    </Card>
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

            {/* ---------------------------------------------------------------- */}
            {/* BRANDS SECTION                                                   */}
            {/* ---------------------------------------------------------------- */}
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
                    <div
                      key={index}
                      className="flex items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        width={120}
                        height={60}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center mt-16">
                  <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                      <div className="text-gray-600">Active Talents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                      <div className="text-gray-600">Partner Brands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">$50M+</div>
                      <div className="text-gray-600">Sponsorship Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ---------------------------------------------------------------- */
          /* PRICING TAB CONTENT                                              */
          /* ---------------------------------------------------------------- */
          <section className="pt-24 pb-16 bg-gray-50">
            <div className="mx-auto max-w-5xl px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Pricing</h1>
                <p className="text-lg text-gray-600 mb-6">Choose the plan that works for you</p>

                <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200">
                  <button
                    onClick={() => setPricingType("talents")}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                      pricingType === "talents" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    For Talents
                  </button>
                  <button
                    onClick={() => setPricingType("sponsors")}
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
                        <div className="grid gap-3">
                          {talentFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
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
                        <div className="grid gap-3">
                          {sponsorFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
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
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center">
              <Image src="/athlink-logo.png" alt="Athlink" width={24} height={24} className="mr-3" />
              <span className="text-xl font-bold text-gray-900">Athlink</span>
            </div>
            <p className="text-gray-600">Connecting talents with ideal sponsors for mutual success.</p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/discover" className="text-gray-600 transition-colors hover:text-gray-900">
                  Discover
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("landing")}
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("pricing")}
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-8 mt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© 2024 Athlink. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
