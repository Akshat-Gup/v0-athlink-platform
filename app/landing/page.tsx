import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Trophy, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/discover" className="flex items-center">
                <Image src="/athlink-logo.png" alt="Athlink" width={32} height={32} className="mr-2" />
                <span className="text-xl font-semibold text-gray-900">thlink</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                How it Works
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button className="bg-green-500 hover:bg-green-600">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Connect Athletes with
                <span className="text-green-500"> Perfect Sponsors</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Athlink is the pioneering platform that connects professional and elite-level athletes with companies
                seeking impactful sponsorship opportunities. Empower your sporting journey with the right partnerships.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/discover">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8">
                    Discover Talent
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50 bg-transparent"
                >
                  Join Athlink
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Athletes and sponsors connecting"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-500">52%</div>
              <p className="text-gray-600 mt-2">of athlete budgets need external funding</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">14%</div>
              <p className="text-gray-600 mt-2">of training time spent seeking sponsors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">100%</div>
              <p className="text-gray-600 mt-2">focus on achieving full potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Athlink?</h2>
            <p className="text-xl text-gray-600 mt-4">Solving the global problem of athlete-sponsor matching</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">For Athletes</h3>
                <p className="text-gray-600">
                  Showcase your sporting goals, achievements, and content to attract the right sponsors aligned with
                  your aspirations.
                </p>
              </CardContent>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">For Brands</h3>
                <p className="text-gray-600">
                  Connect with your target audiences authentically through tailored matches with ideal athlete
                  ambassadors.
                </p>
              </CardContent>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Trophy className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Mutual Success</h3>
                <p className="text-gray-600">
                  Facilitate mutually beneficial partnerships that provide necessary funding for sporting campaigns and
                  authentic brand representation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How Athlink Works</h2>
            <p className="text-xl text-gray-600 mt-4">Simple steps to meaningful connections</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Create Your Profile</h3>
                    <p className="text-gray-600">Athletes showcase goals, achievements, photos, and videos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Smart Matching</h3>
                    <p className="text-gray-600">Our algorithm connects athletes with aligned sponsors</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Build Partnerships</h3>
                    <p className="text-gray-600">Form meaningful sponsorship relationships that benefit both parties</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="How Athlink works"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Athletic Journey?</h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of athletes and brands creating meaningful partnerships on Athlink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/discover">
              <Button size="lg" className="bg-white text-green-500 hover:bg-gray-100 px-8">
                Start Discovering
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-600 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-2xl font-bold text-green-500">A</div>
                <span className="ml-1 text-xl font-semibold">thlink</span>
              </div>
              <p className="text-gray-400">Connecting athletes with perfect sponsors for mutual success.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/discover" className="hover:text-white">
                    Discover
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Athlink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
