import Image from "next/image"

interface BrandLogoProps {
  name: string
  logo: string
}

export function BrandLogo({ name, logo }: BrandLogoProps) {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <Image
        src={logo || "/placeholder.svg"}
        alt={name}
        width={120}
        height={60}
        className="opacity-60 hover:opacity-100 transition-opacity"
      />
    </div>
  )
}
