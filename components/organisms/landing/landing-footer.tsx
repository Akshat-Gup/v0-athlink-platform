import Link from "next/link"
import Image from "next/image"

interface LandingFooterProps {
  onTabChange: (tab: "landing" | "pricing") => void
}

export function LandingFooter({ onTabChange }: LandingFooterProps) {
  return (
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
                onClick={() => onTabChange("landing")}
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange("pricing")}
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
  )
}
