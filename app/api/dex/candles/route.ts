import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const pairId = req.nextUrl.searchParams.get("pairId")
  const interval = req.nextUrl.searchParams.get("interval") ?? "5m"

  if (!pairId) {
    return NextResponse.json({ error: "pairId is required" }, { status: 400 })
  }

  try {
    // TODO: Replace with actual Dexscreener candles endpoint when available
    // const url = `https://api.dexscreener.com/v1/candles/${pairId}?interval=${interval}`
    // const res = await fetch(url, { next: { revalidate: 15 } })
    // const data = await res.json()

    // Mock data for now - return sample candles
    // Format: { t: unix_seconds, o: open, h: high, l: low, c: close }
    const now = Math.floor(Date.now() / 1000)
    const mockCandles = Array.from({ length: 100 }, (_, i) => {
      const t = now - (100 - i) * 300 // 5 min intervals going back
      const basePrice = 0.00015 + Math.random() * 0.00005
      return {
        t,
        o: basePrice,
        h: basePrice * (1 + Math.random() * 0.02),
        l: basePrice * (1 - Math.random() * 0.02),
        c: basePrice * (0.98 + Math.random() * 0.04),
      }
    })

    return NextResponse.json(mockCandles)
  } catch (error) {
    console.error("Error fetching candles:", error)
    return NextResponse.json(
      { error: "Failed to fetch candles" },
      { status: 500 }
    )
  }
}
