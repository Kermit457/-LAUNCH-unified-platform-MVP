import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const pairId = req.nextUrl.searchParams.get("pairId")
  const interval = req.nextUrl.searchParams.get("interval") ?? "5m"

  if (!pairId) {
    return NextResponse.json({ error: "pairId is required" }, { status: 400 })
  }

  try {
    // Note: Dexscreener doesn't currently have a public candles API
    // Using mock data until they add this endpoint or we switch to another provider

    // TODO: Replace with actual candles from:
    // - Birdeye API (Solana)
    // - CoinGecko Pro API
    // - Or cache our own candles via Appwrite Function

    // Mock data for now - return sample candles
    // Format: { t: unix_seconds, o: open, h: high, l: low, c: close, v: volume }
    const now = Math.floor(Date.now() / 1000)
    const mockCandles = Array.from({ length: 100 }, (_, i) => {
      const t = now - (100 - i) * 300 // 5 min intervals going back
      const basePrice = 0.00015 + Math.random() * 0.00005
      const volume = 10000 + Math.random() * 50000
      return {
        t,
        o: basePrice,
        h: basePrice * (1 + Math.random() * 0.02),
        l: basePrice * (1 - Math.random() * 0.02),
        c: basePrice * (0.98 + Math.random() * 0.04),
        v: volume
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
