"use client"

export type Contributor = {
  id: string
  name: string
  twitter?: string
  avatar: string
}

interface ContributorRowProps {
  contributors: Contributor[]
  max?: number
  label?: string // Custom label (e.g., "team", "contributors")
  className?: string
}

export function ContributorRow({
  contributors,
  max = 6,
  label,
  className = "",
}: ContributorRowProps) {
  if (!contributors?.length) return null

  const list = contributors.slice(0, max)
  const extra = contributors.length - list.length

  // Auto-generate label if not provided
  const displayLabel = label || `${contributors.length} contributor${contributors.length === 1 ? "" : "s"}`

  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="contrib-row">
      <div className="flex -space-x-2">
        {list.map((c) => (
          <a
            key={c.id}
            href={c.twitter ? `https://twitter.com/${c.twitter.replace("@", "")}` : "#"}
            target={c.twitter ? "_blank" : undefined}
            rel={c.twitter ? "noopener noreferrer" : undefined}
            aria-label={c.name}
            title={c.name}
            className="inline-block"
          >
            <img
              src={c.avatar}
              alt={c.name}
              className="h-7 w-7 rounded-full border-2 border-[#0D1220] hover:scale-110 hover:z-10 transition-transform duration-150"
            />
          </a>
        ))}
        {extra > 0 && (
          <div className="h-7 w-7 rounded-full border-2 border-[#0D1220] bg-white/5 text-[11px] font-medium text-white/60 grid place-items-center">
            +{extra}
          </div>
        )}
      </div>
      <span className="text-[11px] text-white/40 font-medium">
        {displayLabel}
      </span>
    </div>
  )
}
