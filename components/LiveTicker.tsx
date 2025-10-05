'use client'

export function LiveTicker() {
  const activities = [
    "🚀 BuilderX just hit $120k mcap",
    "🎥 CreatorY earned $1.2k in raids",
    "🪙 $AIKIT launched on Base",
    "⚡ 50 new projects boosted in the last hour",
    "🔥 $MEME trending #1 on LaunchOS",
    "💎 AgencyZ completed 10 campaigns",
    "🎯 PredictionPro won $5k",
    "🌟 100+ streamers went live",
  ]

  // Duplicate for infinite scroll
  const duplicatedActivities = [...activities, ...activities]

  return (
    <div className="w-full bg-gradient-to-r from-launchos-fuchsia/10 via-launchos-violet/10 to-launchos-cyan/10 border-y border-white/10 py-4 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-content flex gap-12">
          {duplicatedActivities.map((activity, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 text-white/80 font-medium whitespace-nowrap px-6"
            >
              {activity}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
