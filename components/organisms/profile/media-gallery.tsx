"use client"

import { Card } from "@/components/molecules/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Instagram, Youtube, Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface MediaItem {
  id: number
  url: string
  title: string
  category?: string
  thumbnail?: string
}

interface YoutubeVideo {
  id: number
  videoId: string
  title: string
  thumbnail: string
}

interface InstagramPost {
  id: number
  postId: string
  thumbnail: string
  caption?: string
}

interface MediaGalleryProps {
  mediaGallery: {
    photos?: MediaItem[]
    videos?: MediaItem[]
    youtube?: YoutubeVideo[]
    instagram?: InstagramPost[]
  }
}

export default function MediaGallery({ mediaGallery }: MediaGalleryProps) {
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showVideosModal, setShowVideosModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showInstagramModal, setShowInstagramModal] = useState(false)

  // Early return if no media data
  if (!mediaGallery) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Information unavailable</p>
      </div>
    )
  }

  const photos = mediaGallery.photos || []
  const videos = mediaGallery.videos || []
  const youtube = mediaGallery.youtube || []
  const instagram = mediaGallery.instagram || []

  // Check if all media arrays are empty
  const hasAnyMedia = photos.length > 0 || videos.length > 0 || youtube.length > 0 || instagram.length > 0

  if (!hasAnyMedia) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Information unavailable</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Photos Gallery */}
      {photos.length > 0 && (
        <Dialog open={showPhotosModal} onOpenChange={setShowPhotosModal}>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Photos ({photos.length})</h3>
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(0, 3).map((photo) => (
                    <div key={photo.id} className="w-12 h-12 relative rounded overflow-hidden">
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.title || "Photo"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Photo Gallery</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.title || "Photo"}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Videos Gallery */}
      {videos.length > 0 && (
        <Dialog open={showVideosModal} onOpenChange={setShowVideosModal}>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Videos ({videos.length})</h3>
                <div className="flex items-center gap-2">
                  <Play className="w-8 h-8 text-blue-600" />
                  <span className="text-sm text-gray-600">View All</span>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Video Gallery</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video) => (
                <div key={video.id} className="space-y-2">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                    {video.thumbnail ? (
                      <Image
                        src={video.thumbnail}
                        alt={video.title || "Video"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="font-medium text-sm">{video.title || "Video title unavailable"}</h4>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* YouTube Videos */}
      {youtube.length > 0 && (
        <Dialog open={showYoutubeModal} onOpenChange={setShowYoutubeModal}>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">YouTube ({youtube.length})</h3>
                <div className="flex items-center gap-2">
                  <Youtube className="w-8 h-8 text-red-600" />
                  <span className="text-sm text-gray-600">View All</span>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>YouTube Videos</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {youtube.map((video) => (
                <div key={video.id} className="space-y-2">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title || "YouTube video"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                      <Youtube className="w-12 h-12 text-red-600" />
                    </div>
                  </div>
                  <h4 className="font-medium text-sm">{video.title || "Video title unavailable"}</h4>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Instagram Posts */}
      {instagram.length > 0 && (
        <Dialog open={showInstagramModal} onOpenChange={setShowInstagramModal}>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Instagram ({instagram.length})</h3>
                <div className="flex items-center gap-2">
                  <Instagram className="w-8 h-8 text-pink-600" />
                  <span className="text-sm text-gray-600">View All</span>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Instagram Posts</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instagram.map((post) => (
                <div key={post.id} className="space-y-2">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={post.thumbnail || "/placeholder.svg"}
                      alt={post.caption || 'Instagram post'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Instagram className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  {post.caption ? (
                    <p className="text-xs text-gray-600 line-clamp-2">{post.caption}</p>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No caption available</p>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
