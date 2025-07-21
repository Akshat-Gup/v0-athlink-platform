interface BackgroundEffectsProps {
  mousePosition: { x: number; y: number }
}

export function BackgroundEffects({ mousePosition }: BackgroundEffectsProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Mouse-following blob */}
      <div
        className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: "all 0.3s ease",
        }}
      />

      {/* Floating islands */}
      <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-gradient-to-r from-green-200/40 to-teal-200/40 blur-2xl animate-pulse" />
      <div className="absolute top-40 right-32 h-24 w-24 rounded-full bg-gradient-to-r from-orange-200/40 to-red-200/40 blur-xl animate-bounce" />
      <div className="absolute bottom-40 left-1/4 h-40 w-40 rounded-full bg-gradient-to-r from-purple-200/40 to-pink-200/40 blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 h-28 w-28 rounded-full bg-gradient-to-r from-blue-200/40 to-cyan-200/40 blur-xl animate-bounce" />
    </div>
  )
}
