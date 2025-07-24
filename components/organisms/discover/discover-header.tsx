import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/atoms/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/organisms/sheet"
import { Heart, Menu, Search, X, Users, CalendarIcon, Edit } from "lucide-react"
import { TalentItem } from "@/hooks/use-discover-data"
import { DiscoverSignIn, MobileSignIn} from "@/components/atoms"
import { handleSignOut, handleSignIn } from "app/api/auth/actions";
import { Session } from "next-auth"
import { JoinRoleSelector, MobileJoinRoleSelector } from "@/components/templates"
import { ProfileEdit } from "@/components/templates/user/profile-edit"
import { useUserRole } from "@/hooks"
import { useAuth } from "@/hooks/use-auth"

interface DiscoverHeaderProps {
  session: Session | null
  showFavorites: boolean
  setShowFavorites: (show: boolean) => void
  showJoinModal: boolean
  setShowJoinModal: (show: boolean) => void
  showSearchOverlay: boolean
  setShowSearchOverlay: (show: boolean) => void
  favorites: number[]
  setFavorites: (favorites: number[]) => void
  allItems: TalentItem[]
  isScrolled: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DiscoverHeader({
  session,
  showFavorites,
  setShowFavorites,
  showJoinModal,
  setShowJoinModal,
  showSearchOverlay,
  setShowSearchOverlay,
  favorites,
  setFavorites,
  allItems,
  isScrolled,
  activeTab,
  setActiveTab,
}: DiscoverHeaderProps) {
  const { selectedUserRole, handleRoleSelect } = useUserRole()
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<any>(null)

  // Fetch user's profile data for editing
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/profile/${user.id}`)
          if (response.ok) {
            const data = await response.json()
            setProfileData(data)
          }
        } catch (error) {
          console.error("Error fetching profile data:", error)
        }
      }
    }

    if (session && user) {
      fetchProfileData()
    }
  }, [user, session])

  // Handle removing items from favorites
  const handleRemoveFromFavorites = (itemId: number) => {
    const updatedFavorites = favorites.filter(id => id !== itemId)
    setFavorites(updatedFavorites)
    localStorage.setItem('athlink-favorites', JSON.stringify(updatedFavorites))
  }

  return (
    <>
      {/* Floating Header Islands */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Island */}
          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 h-12 w-12 flex items-center justify-center">
            <Link href="/landing">
              <Image src="/athlink-logo.png" alt="Athlink" width={20} height={20} style={{ width: "auto", height: "auto" }} />
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
                  <Button size="icon" variant="ghost" className="rounded-full relative">
                    <Heart className={`h-4 w-4 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Your Watchlist ({favorites.length})</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {favorites.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No items in your watchlist yet.</p>
                        <p className="text-sm text-gray-500">Click the heart icon on profiles to add them here!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {allItems
                          .filter((item) => favorites.includes(item.id))
                          .map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-600">{item.sport}</p>
                                <p className="text-xs text-gray-500">{item.location}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveFromFavorites(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
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
              {session && session?.user && (
                <ProfileEdit 
                  userId={user?.id}
                  talentProfile={profileData?.talent_profile}
                  teamProfile={profileData?.team_profile}
                  eventProfile={profileData?.event_profile}
                >
                  <Button size="icon" variant="ghost" className="rounded-full" title="Edit Profile">
                    <Edit className="h-4 w-4" />
                  </Button>
                </ProfileEdit>
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
              <JoinRoleSelector 
                isOpen={showJoinModal} 
                onOpenChange={setShowJoinModal}
                onRoleSelect={handleRoleSelect}
                currentRole={selectedUserRole}
              >
                <Button
                  variant="ghost"
                  className="text-sm font-medium px-4 text-gray-900 bg-white hover:bg-gray-50 rounded-full border border-gray-200"
                >
                  {selectedUserRole ? `${selectedUserRole}` : "Join"}
                </Button>
              </JoinRoleSelector>
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
                        <Heart className={`h-4 w-4 mr-2 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                        Watchlist {favorites.length > 0 && `(${favorites.length})`}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Your Watchlist ({favorites.length})</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        {favorites.length === 0 ? (
                          <div className="text-center py-8">
                            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">No items in your watchlist yet.</p>
                            <p className="text-sm text-gray-500">Click the heart icon on profiles to add them here!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {allItems
                              .filter((item) => favorites.includes(item.id))
                              .map((item) => (
                                <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-600">{item.sport}</p>
                                    <p className="text-xs text-gray-500">{item.location}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveFromFavorites(item.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
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
                  {session && session?.user && (
                    <ProfileEdit 
                      userId={user?.id}
                      talentProfile={profileData?.talent_profile}
                      teamProfile={profileData?.team_profile}
                      eventProfile={profileData?.event_profile}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </ProfileEdit>
                  )}
                  <MobileSignIn />
                  <MobileJoinRoleSelector
                    isOpen={showJoinModal} 
                    onOpenChange={setShowJoinModal}
                    onRoleSelect={handleRoleSelect}
                    currentRole={selectedUserRole}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-900 bg-white hover:bg-gray-50 rounded-full border border-gray-200"
                    >
                      {selectedUserRole ? `${selectedUserRole}` : "Join"}
                    </Button>
                  </MobileJoinRoleSelector>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
