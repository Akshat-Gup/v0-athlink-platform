import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/atoms/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/organisms/sheet"
import { Heart, Menu, User, CalendarIcon, Trophy, Building, Users, Search, X } from "lucide-react"
import { TalentItem } from "@/hooks/use-discover-data"
import { DiscoverSignIn, MobileSignIn} from "@/components/atoms"
import { auth } from "@/auth"
import { handleSignOut, handleSignIn } from "app/api/auth/actions";

interface DiscoverHeaderProps {
  showFavorites: boolean
  setShowFavorites: (show: boolean) => void
  showJoinModal: boolean
  setShowJoinModal: (show: boolean) => void
  showSearchOverlay: boolean
  setShowSearchOverlay: (show: boolean) => void
  favorites: number[]
  allItems: TalentItem[]
  isScrolled: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
}

export async function DiscoverHeader({
  showFavorites,
  setShowFavorites,
  showJoinModal,
  setShowJoinModal,
  showSearchOverlay,
  setShowSearchOverlay,
  favorites,
  allItems,
  isScrolled,
  activeTab,
  setActiveTab,
}: DiscoverHeaderProps) {
  const session = await auth();

  return (
    <>
      {/* Floating Header Islands */}
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
              {/* Sliding background */}
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
                onClick={() => setActiveTab("talents")}
                className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeTab === "talents" ? "text-black font-medium" : "text-gray-600 hover:text-gray-900 font-medium"
                } md:space-x-2`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Talents</span>
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeTab === "events" ? "text-black font-medium" : "text-gray-600 hover:text-gray-900 font-medium"
                } md:space-x-2`}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden md:inline">Events</span>
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeTab === "teams" ? "text-black font-medium" : "text-gray-600 hover:text-gray-900 font-medium"
                } md:space-x-2`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Teams</span>
              </button>
            </nav>
          </div>

          {/* User Actions Island - Desktop */}
          <div className="hidden md:flex bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
            <div className="flex items-center space-x-2">
              <Sheet open={showFavorites} onOpenChange={setShowFavorites}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Heart className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Your Watchlist</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {favorites.length === 0 ? (
                      <p className="text-gray-600">No items in your watchlist yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {allItems
                          .filter((item) => favorites.includes(item.id))
                          .map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-2 border rounded">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-600">{item.sport}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              {isScrolled && (
                <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setShowSearchOverlay(!showSearchOverlay)}>
                  {showSearchOverlay ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                </Button>
              )}
                {session && session?.user ? (
                <>
                  <span className="text-sm font-medium px-4 text-gray-900 bg-gray-100 rounded-full border border-gray-200 mr-2 flex items-center">
                  {session.user.name}
                  </span>
                  <form action={handleSignOut}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="text-sm font-medium px-4 text-gray-900 bg-white hover:bg-gray-50 rounded-full border border-gray-200"
                  >
                    Sign Out
                  </Button>
                  </form>
                </>
                ) : (
                <form action={() => handleSignIn('google')}>
                  <Button
                  type="submit"
                  variant="ghost"
                  className="text-sm font-medium px-4 text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/25 animate-shimmer"
                  >
                  Sign In
                  </Button>
                </form>
                )}
              <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium px-4 text-gray-900 bg-white hover:bg-gray-50 rounded-full border border-gray-200"
                  >
                    Join
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-8">
                  <DialogHeader className="text-center mb-8">
                    <DialogTitle className="text-2xl font-semibold">What would you like to join as?</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Talent</h3>
                      </div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <CalendarIcon className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Event Leader</h3>
                      </div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Trophy className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Team Leader</h3>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Sponsor</h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg">Next</Button>
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
                  <Sheet open={showFavorites} onOpenChange={setShowFavorites}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Watchlist
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Your Watchlist</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        {favorites.length === 0 ? (
                          <p className="text-gray-600">No items in your watchlist yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {allItems
                              .filter((item) => favorites.includes(item.id))
                              .map((item) => (
                                <div key={item.id} className="flex items-center space-x-3 p-2 border rounded">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-600">{item.sport}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                  {isScrolled && (
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setShowSearchOverlay(!showSearchOverlay)}>
                      {showSearchOverlay ? <X className="h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                      {showSearchOverlay ? "Close Search" : "Search"}
                    </Button>
                  )}
                  <MobileSignIn />
                  <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-900 bg-white hover:bg-gray-50 rounded-full border border-gray-200"
                      >
                        Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-8">
                      <DialogHeader className="text-center mb-8">
                        <DialogTitle className="text-2xl font-semibold">What would you like to join as?</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Talent</h3>
                          </div>
                        </div>
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <CalendarIcon className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Event Leader</h3>
                          </div>
                        </div>
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <Trophy className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Team Leader</h3>
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-6">
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <Building className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Sponsor</h3>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-8">
                        <Button className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg">Next</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
