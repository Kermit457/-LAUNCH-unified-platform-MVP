import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  try {
    // Fetch from Dexscreener
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`
    const res = await fetch(url, {
      next: { revalidate: 30 } // Cache for 30 seconds
    })

    if (!res.ok) {
      throw new Error(`Dexscreener API error: ${res.status}`)
    }

    const data = await res.json()

    // Extract first pair data
    const pair = data.pairs?.[0]
    if (!pair) {
      return NextResponse.json({ error: 'No pair data found' }, { status: 404 })
    }

    return NextResponse.json({
      address: pair.baseToken.address,
      symbol: pair.baseToken.symbol,
      name: pair.baseToken.name,
      priceUsd: parseFloat(pair.priceUsd || '0'),
      volume24h: pair.volume?.h24 || 0,
      priceChange24h: pair.priceChange?.h24 || 0,
      liquidity: pair.liquidity?.usd || 0,
      fdv: pair.fdv || 0,
      marketCap: pair.marketCap || 0,
      pairAddress: pair.pairAddress,
      dexId: pair.dexId,
      chainId: pair.chainId
    })
  } catch (error) {
    console.error('Error fetching token data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    )
  }
}
