import { Button } from "@/components/atoms/button"
import { Card, CardContent } from "@/components/molecules/card"
import { Progress } from "@/components/atoms/progress"
import { Star, Heart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    category: string
  }>
}

interface TalentItem {
  id: number
  name: string
  sport: string
  location: string
  rating: number
  currentFunding?: number
  goalFunding?: number
  image: string
  achievements: string
  category: string
  talentType?: string
  fit?: string
}

async function getCategoryData(category: string): Promise<TalentItem[]> {
  try {
    const params = new URLSearchParams({
      category: category,
      page: '1',
      limit: '100'
    })
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/discover?${params.toString()}`, {
      cache: 'no-store' // Ensure fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error fetching category data:', error)
    return []
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const allItems = await getCategoryData(category)

  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/discover">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discover
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{capitalizedCategory}</h1>
        </div>

        {allItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No {category} found. Please check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{item.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">• {item.location}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.sport}</p>
                  <p className="text-sm text-blue-600 mb-3">{item.achievements}</p>
                  
                  {item.currentFunding !== undefined && item.goalFunding !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Funding</span>
                        <span>${item.currentFunding.toLocaleString()} / ${item.goalFunding.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(item.currentFunding / item.goalFunding) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
