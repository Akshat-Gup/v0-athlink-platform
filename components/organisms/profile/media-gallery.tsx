"use client"

import { Card } from "@/components/molecules/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Instagram, Youtube, Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface MediaGalleryProps {
  mediaGallery: {
    photos: Array<{
      id: number
      url: string
      title: string
      category: string
    }>
    videos: Array<{
      id: number
      url: string
      title: string
      category: string
    }>
    youtube: Array<{
      id: number
      url: string
      title: string
    }>
    instagram: Array<{
      id: number
      url: string
      title: string
    }>
  }
}

export function MediaGallery({ mediaGallery }: MediaGalleryProps) {
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showVideosModal, setShowVideosModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showInstagramModal, setShowInstagramModal] = useState(false)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Photos Gallery */}
      <Dialog open={showPhotosModal} onOpenChange={setShowPhotosModal}>
        <DialogTrigger asChild>
          <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg font-semibold mb-4">Photos</h3>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
              {mediaGallery.photos.map((photo) => (
                <Image
                  key={photo.id}
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.title}
                  width={200}
                  height={150}
                  className="flex-shrink-0 w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
              ))}
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Photos</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            {["Event Setup", "Competition", "Awards", "Behind the Scenes"].map((category) => {
              const categoryPhotos = mediaGallery.photos.filter((photo) => photo.category === category)
              if (categoryPhotos.length === 0) return null

              return (
                <div key={category}>
                  <h4 className="text-lg font-semibold mb-4">{category}</h4>
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {categoryPhotos.map((photo) => (
                      <div key={photo.id} className="break-inside-avoid">
                        <Image
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.title}
                          width={400}
                          height={300}
                          className="w-full rounded-lg object-cover"
                          style={{ height: "auto" }}
                        />
                        <p className="text-sm text-gray-600 mt-2 px-1">{photo.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Videos Gallery */}
      <Dialog open={showVideosModal} onOpenChange={setShowVideosModal}>
        <DialogTrigger asChild>
          <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg font-semibold mb-4">Videos</h3>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
              {mediaGallery.videos.map((video) => (
                <div key={video.id} className="relative flex-shrink-0">
                  <Image
                    src={video.url || "/placeholder.svg"}
                    alt={video.title}
                    width={200}
                    height={150}
                    className="w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Videos</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            {["Competition", "Event Highlights", "Behind the Scenes"].map((category) => {
              const categoryVideos = mediaGallery.videos.filter((video) => video.category === category)
              if (categoryVideos.length === 0) return null

              return (
                <div key={category}>
                  <h4 className="text-lg font-semibold mb-4">{category}</h4>
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {categoryVideos.map((video) => (
                      <div key={video.id} className="break-inside-avoid">
                        <div className="relative">
                          <Image
                            src={video.url || "/placeholder.svg"}
                            alt={video.title}
                            width={400}
                            height={300}
                            className="w-full rounded-lg object-cover"
                            style={{ height: "auto" }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 px-1">{video.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* YouTube Gallery */}
      <Dialog open={showYoutubeModal} onOpenChange={setShowYoutubeModal}>
        <DialogTrigger asChild>
          <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-4">
              <Youtube className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">YouTube</h3>
            </div>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
              {mediaGallery.youtube.map((video) => (
                <div key={video.id} className="relative flex-shrink-0">
                  <Image
                    src={video.url || "/placeholder.svg"}
                    alt={video.title}
                    width={200}
                    height={150}
                    className="w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Youtube className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 bg-white rounded-full p-1" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl mx-4">
          <DialogHeader>
            <DialogTitle>YouTube Videos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mediaGallery.youtube.map((video) => (
              <div key={video.id} className="relative">
                <Image
                  src={video.url || "/placeholder.svg"}
                  alt={video.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Youtube className="h-12 w-12 text-red-500 bg-white rounded-full p-3" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Instagram Gallery */}
      <Dialog open={showInstagramModal} onOpenChange={setShowInstagramModal}>
        <DialogTrigger asChild>
          <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-4">
              <Instagram className="h-5 w-5 text-pink-500" />
              <h3 className="text-lg font-semibold">Instagram</h3>
            </div>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
              {mediaGallery.instagram.map((post) => (
                <Image
                  key={post.id}
                  src={post.url || "/placeholder.svg"}
                  alt={post.title}
                  width={200}
                  height={150}
                  className="flex-shrink-0 w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
              ))}
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl mx-4">
          <DialogHeader>
            <DialogTitle>Instagram Posts</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mediaGallery.instagram.map((post) => (
              <Image
                key={post.id}
                src={post.url || "/placeholder.svg"}
                alt={post.title}
                width={400}
                height={300}
                className="w-full h-32 sm:h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
