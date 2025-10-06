"use client"

import { createChart, ColorType, CrosshairMode, IChartApi } from "lightweight-charts"
import { useEffect, useRef } from "react"
import type { Candle, ActivityBin } from "@/types/launch"

interface TokenChartOverlayProps {
  candles: Candle[]
  activityBins: ActivityBin[]
  className?: string
}

export function TokenChartOverlay({
  candles,
  activityBins,
  className = '',
}: TokenChartOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || candles.length === 0) return

    const chart: IChartApi = createChart(ref.current, {
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: "#0b0b0e" },
        textColor: "#e5e7eb",
      },
      rightPriceScale: { borderColor: "#27272a" },
      timeScale: { borderColor: "#27272a" },
      grid: {
        vertLines: { color: "#18181b" },
        horzLines: { color: "#18181b" },
      },
      crosshair: { mode: CrosshairMode.Normal },
    })

    // 1) Price candles
    const cs = (chart as any).addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
      borderVisible: false,
    })

    cs.setData(
      candles.map((p: Candle) => ({
        time: p.t as any,
        open: p.o,
        high: p.h,
        low: p.l,
        close: p.c,
      }))
    )

    // 2) Conviction overlay (0..100) on its own scale, right side
    const convSeries = (chart as any).addAreaSeries({
      lineWidth: 2,
      topColor: "rgba(168,85,247,0.25)",
      bottomColor: "rgba(168,85,247,0.00)",
      lineColor: "#a855f7",
      priceScaleId: "conv",
    })

    convSeries.setData(
      activityBins.map((b: ActivityBin) => ({
        time: b.t as any,
        value: b.conviction ?? 0
      }))
    )

    chart.priceScale("conv").applyOptions({
      scaleMargins: { top: 0.12, bottom: 0.75 },
      borderColor: "#27272a",
    })

    // 3) Activity histogram (sum of all counts) on bottom scale
    const sum = (b: ActivityBin) =>
      (b.contributions || 0) +
      (b.chats || 0) +
      (b.collabs || 0) +
      (b.dms || 0) +
      (b.network || 0) +
      (b.campaigns || 0) +
      (b.social || 0)

    const histSeries = (chart as any).addHistogramSeries({
      color: "#22d3ee",
      priceScaleId: "act",
      base: 0,
    })

    histSeries.setData(
      activityBins.map((b: ActivityBin) => ({
        time: b.t as any,
        value: sum(b)
      }))
    )

    chart.priceScale("act").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0.02 },
      borderColor: "#27272a",
    })

    // 4) Event markers on candles
    const colorByKind: Record<string, string> = {
      comment: "#a78bfa",
      collab: "#22d3ee",
      raid: "#f59e0b",
      campaign: "#eab308",
      buyback: "#34d399",
      chat: "#60a5fa",
      social: "#fb7185",
    }

    cs.setMarkers(
      activityBins.flatMap((b: ActivityBin) =>
        (b.events || []).map((e: { kind: string; text: string }) => ({
          time: b.t as any,
          position: "aboveBar" as const,
          color: colorByKind[e.kind] ?? "#94a3b8",
          shape: "circle" as const,
          text: e.text.slice(0, 18),
        }))
      )
    )

    // Resize
    const ro = new ResizeObserver(() =>
      chart.applyOptions({ width: ref.current!.clientWidth })
    )
    ro.observe(ref.current)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [candles, activityBins])

  return <div ref={ref} className={`w-full rounded-xl border border-zinc-800 ${className}`} />
}
