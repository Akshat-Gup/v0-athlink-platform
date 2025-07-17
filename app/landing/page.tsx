"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Trophy, Target, Sparkles, Zap, Globe, Rocket } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20" />
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/discover" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Image src="/athlink-logo.png" alt="Athlink" width={24} height={24} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Athlink
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors relative group">
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-sm">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-500/30 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-green-400 font-medium">The Future of Sports Sponsorship</span>
                </div>
                <h1 className="text-6xl font-bold leading-tight">
                  Connect Athletes with
                  <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
                    {" "}
                    Perfect Sponsors
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Athlink is the pioneering AI-powered platform that connects professional and elite-level athletes with
                  companies seeking impactful sponsorship opportunities. Empower your sporting journey with the right
                  partnerships in the digital age.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/discover">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 group"
                  >
                    Discover Talent
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg transition-all duration-300 bg-transparent"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Join Athlink
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-3xl blur-2xl" />
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Athletes and sponsors connecting"
                  width={600}
                  height={500}
                  className="relative z-10 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full blur-xl animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: "52%", label: "of athlete budgets need external funding", icon: Target },
              { value: "14%", label: "of training time spent seeking sponsors", icon: Zap },
              { value: "100%", label: "focus on achieving full potential", icon: Trophy },
            ].map((stat, index) => (
              <div key={index} className="group">
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 p-8">
                  <CardContent className="pt-6 text-center">
                    <stat.icon className="h-12 w-12 mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform" />
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <p className="text-gray-300">{stat.label}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Athlink?
              </span>
            </h2>
            <p className="text-xl text-gray-300">Solving the global problem of athlete-sponsor matching with AI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "For Athletes",
                description:
                  "Showcase your sporting goals, achievements, and content to attract the right sponsors aligned with your aspirations.",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: Target,
                title: "For Brands",
                description:
                  "Connect with your target audiences authentically through AI-powered matches with ideal athlete ambassadors.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Trophy,
                title: "Mutual Success",
                description:
                  "Facilitate mutually beneficial partnerships that provide necessary funding for sporting campaigns and authentic brand representation.",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 p-8 group hover:scale-105"
              >
                <CardContent className="pt-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">How Athlink Works</h2>
            <p className="text-xl text-gray-300">Simple steps to meaningful connections</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              {[
                {
                  step: "1",
                  title: "Create Your Profile",
                  description: "Athletes showcase goals, achievements, photos, and videos with AI-powered optimization",
                },
                {
                  step: "2",
                  title: "Smart AI Matching",
                  description:
                    "Our advanced algorithm connects athletes with perfectly aligned sponsors using machine learning",
                },
                {
                  step: "3",
                  title: "Build Partnerships",
                  description:
                    "Form meaningful sponsorship relationships that benefit both parties with real-time analytics",
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6 group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="How Athlink works"
                width={500}
                height={400}
                className="relative z-10 rounded-3xl shadow-2xl border border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl p-16 border border-white/20 backdrop-blur-xl">
            <Globe className="h-16 w-16 mx-auto mb-8 text-green-400 animate-spin" />
            <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Athletic Journey?</h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of athletes and brands creating meaningful partnerships on Athlink
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/discover">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-4 text-lg shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                >
                  Start Discovering
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-12 py-4 text-lg transition-all duration-300 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-black/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  thlink
                </span>
              </div>
              <p className="text-gray-400">
                Connecting athletes with perfect sponsors for mutual success in the digital age.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: ["Discover", "How it Works", "Pricing"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "Safety"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Athlink. All rights reserved. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
