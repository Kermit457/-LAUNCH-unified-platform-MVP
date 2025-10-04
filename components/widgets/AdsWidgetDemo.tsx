'use client'

interface AdsWidgetDemoProps {
  bannerUrl?: string
  adText?: string
  sponsorName?: string
}

export default function AdsWidgetDemo({
  bannerUrl = "https://via.placeholder.com/400x200/6366f1/ffffff?text=Your+Ad+Here",
  adText = "Boost your stream engagement with StreamWidgets",
  sponsorName = "StreamWidgets Pro"
}: AdsWidgetDemoProps) {
  return (
    <div className="w-[400px] h-[200px] glass-card p-4 relative overflow-hidden group">
      <div className="absolute top-2 right-2 z-10">
        <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-yellow-400 text-xs font-bold rounded">
          SPONSORED
        </span>
      </div>

      <div className="absolute inset-0">
        <img
          src={bannerUrl}
          alt="Advertisement"
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end">
        <p className="text-white font-bold text-lg mb-2 line-clamp-2">
          {adText}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">by {sponsorName}</span>
          <button className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded hover:from-pink-600 hover:to-purple-700 transition-all">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
