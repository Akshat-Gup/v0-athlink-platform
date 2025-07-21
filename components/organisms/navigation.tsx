import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/atoms/button"
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeTab: "landing" | "pricing"
  onTabChange: (tab: "landing" | "pricing") => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
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
            onClick={() => onTabChange("landing")}
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
            onClick={() => onTabChange("pricing")}
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
  )
}
