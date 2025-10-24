'use client'

export function LiveTicker() {
  const activities = [
    { user: "@sarah_dev", action: "joined", value: "$RUBY", highlight: true },
    { user: "$BONK", action: "hit", value: "85%", metric: "motion score" },
    { user: "$TRUMP", action: "reached", value: "launch threshold", highlight: true },
    { user: "12 buys", action: "on", value: "$BASED" },
    { user: "Pepe Lambo", action: "", value: "+18%", metric: "gains" },
    { user: "$MEME", action: "trending", value: "#1", metric: "on LaunchOS" },
    { user: "BuilderX", action: "hit", value: "$120K", metric: "mcap" },
    { user: "CreatorY", action: "earned", value: "$1.2K", metric: "in raids" },
    { user: "$AIKIT", action: "launched", value: "on Base", highlight: true },
    { user: "50", action: "new projects", value: "boosted", metric: "last hour" },
    { user: "AgencyZ", action: "completed", value: "10", metric: "campaigns" },
    { user: "PredictionPro", action: "won", value: "$5K", highlight: true },
    { user: "100+", action: "streamers", value: "went live" },
  ]

  // Duplicate for infinite scroll
  const duplicatedActivities = [...activities, ...activities]

  return (
    <div className="w-full bg-black/95 border-y-2 border-[#D1FD0A]/30 py-2 overflow-hidden relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D1FD0A]/5 via-[#D1FD0A]/10 to-[#D1FD0A]/5 animate-pulse" />

      <div className="ticker-wrapper">
        <div className="ticker-content-flash flex gap-8">
          {duplicatedActivities.map((activity, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 whitespace-nowrap px-6 group"
            >
              {/* User/Token name */}
              <span className={`font-bold ${activity.highlight ? 'text-[#D1FD0A] animate-pulse-glow' : 'text-white'}`}>
                {activity.user}
              </span>

              {/* Action */}
              {activity.action && (
                <span className="text-zinc-400">
                  {activity.action}
                </span>
              )}

              {/* Value - with LED font for numbers */}
              <span className={`font-bold ${
                activity.value.includes('$') || activity.value.includes('%') || activity.value.includes('#') || activity.value.includes('+')
                  ? 'font-led-dot text-[#D1FD0A] text-lg tracking-wider animate-flash'
                  : activity.highlight
                    ? 'text-[#D1FD0A]'
                    : 'text-white'
              }`}>
                {activity.value}
              </span>

              {/* Metric */}
              {activity.metric && (
                <span className="text-zinc-500">
                  {activity.metric}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
