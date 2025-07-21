import { Button } from "@/components/atoms/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/organisms/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Users, CalendarIcon, Search, Menu, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NavigationHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isScrolled: boolean
  onSearchClick: () => void
  showFavorites?: boolean
  onShowFavoritesChange?: (show: boolean) => void
  showJoinModal?: boolean
  onShowJoinModalChange?: (show: boolean) => void
}

export function NavigationHeader({
  activeTab,
  onTabChange,
  isScrolled,
  onSearchClick,
  showFavorites = false,
  onShowFavoritesChange,
  showJoinModal = false,
  onShowJoinModalChange,
}: NavigationHeaderProps) {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Island */}
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 h-12 w-12 flex items-center justify-center">
          <Link href="/landing">
            <Image src="/athlink-logo.png" alt="Athlink" width={20} height={20} />
          </Link>
        </div>

        {/* Navigation Tabs Island - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
          <nav className="flex items-center space-x-1 relative">
            <div
              className={`absolute top-0 bottom-0 bg-gray-100 rounded-full transition-all duration-300 ease-in-out ${
                activeTab === "talents"
                  ? "left-0 w-[calc(33.333%-0.125rem)]"
                  : activeTab === "events"
                    ? "left-[calc(33.333%+0.125rem)] w-[calc(33.333%-0.25rem)]"
                    : "left-[calc(66.666%+0.125rem)] w-[calc(33.333%-0.125rem)]"
              }`}
            />
            <button
              onClick={() => onTabChange("talents")}
              className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeTab === "talents" ? "text-black font-medium" : "text-gray-600 hover:text-gray-900 font-medium"
              } md:space-x-2`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Talents</span>
            </button>
            <button
              onClick={() => onTabChange("events")}
              className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeTab === "events" ? "text-black font-medium" : "text-gray-600 hover:text-gray-900 font-medium"
              } md:space-x-2`}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </button>
            <button
              onClick={() => onTabChange("teams")}
              className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeTab === "teams" ? "text-black font-medium" : "text-gray-600 hover:text-gray-900 font-medium"
              } md:space-x-2`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Teams</span>
            </button>
          </nav>
        </div>

        {/* User Actions Island - Desktop */}
        <div className="hidden md:flex bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
          <div className="flex items-center space-x-2">
            <Sheet open={showFavorites} onOpenChange={onShowFavoritesChange}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Favorites</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <p className="text-gray-600 text-sm">Your favorite talents and events will appear here.</p>
                </div>
              </SheetContent>
            </Sheet>
            {isScrolled && (
              <Button size="icon" variant="ghost" className="rounded-full" onClick={onSearchClick}>
                <Search className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              className="text-sm font-medium px-4 text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/25 animate-shimmer"
            >
              Sign In
            </Button>
            <Dialog open={showJoinModal} onOpenChange={onShowJoinModalChange}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium px-4 text-gray-900 bg-white hover:bg-gray-50 rounded-full border border-gray-200"
                >
                  Join
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-8">
                <DialogHeader>
                  <DialogTitle>Join Athlink</DialogTitle>
                </DialogHeader>
                <div className="mt-6">
                  <p className="text-gray-600">Join our platform to connect with athletes and sponsors.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Sign In
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Join Athlink
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
