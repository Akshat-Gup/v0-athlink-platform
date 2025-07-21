import { Button } from "@/components/atoms/button"
import Link from "next/link"
import { TalentCard } from "./talent-card"

interface TalentSectionProps {
  title: string
  items: any[]
  activeTab: string
  showTalentType?: boolean
  onTalentTypeClick?: (talentType: string) => void
  onFavoriteToggle: (id: number, e: React.MouseEvent) => void
  favorites: number[]
}

export function TalentSection({
  title,
  items,
  activeTab,
  showTalentType = true,
  onTalentTypeClick,
  onFavoriteToggle,
  favorites
}: TalentSectionProps) {
  if (items.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <Link href={`/discover/${activeTab}`}>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            Show all
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.slice(0, 8).map((item, index) => (
          <TalentCard
            key={item.id}
            item={item}
            showTalentType={showTalentType}
            onTalentTypeClick={onTalentTypeClick}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={favorites.includes(item.id)}
            animationDelay={index * 100}
          />
        ))}
      </div>
    </section>
  )
}
