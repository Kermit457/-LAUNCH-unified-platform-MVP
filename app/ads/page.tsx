'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import AdsWidgetDemo from '@/components/widgets/AdsWidgetDemo'
import { Zap, DollarSign, Eye, Copy } from 'lucide-react'

export default function AdsPage() {
  const [adConfig, setAdConfig] = useState({
    bannerUrl: 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Your+Ad+Here',
    adText: 'Boost your stream engagement with StreamWidgets',
    sponsorName: 'StreamWidgets Pro',
    budget: '500'
  })

  const [copied, setCopied] = useState(false)

  const widgetUrl = `http://localhost:3000/widget?mode=ad&id=demo`

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the ad config
    alert('Ad campaign created! (Demo mode)')
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Sponsored Ads</h1>
          <p className="text-white/60">Create and manage sponsored ad widgets for your stream</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ad Configuration Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Create Ad Campaign
                </CardTitle>
                <CardDescription>
                  Configure your sponsored advertisement widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bannerUrl">Banner Image URL</Label>
                    <Input
                      id="bannerUrl"
                      value={adConfig.bannerUrl}
                      onChange={(e) => setAdConfig({ ...adConfig, bannerUrl: e.target.value })}
                      placeholder="https://..."
                      required
                    />
                    <p className="text-xs text-white/50">Recommended: 400x200px</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adText">Ad Text</Label>
                    <Input
                      id="adText"
                      value={adConfig.adText}
                      onChange={(e) => setAdConfig({ ...adConfig, adText: e.target.value })}
                      placeholder="Your compelling ad message..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorName">Sponsor Name</Label>
                    <Input
                      id="sponsorName"
                      value={adConfig.sponsorName}
                      onChange={(e) => setAdConfig({ ...adConfig, sponsorName: e.target.value })}
                      placeholder="Your Brand Name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (USDC)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={adConfig.budget}
                      onChange={(e) => setAdConfig({ ...adConfig, budget: e.target.value })}
                      placeholder="500"
                      min="0"
                      required
                    />
                    <p className="text-xs text-white/50">Total campaign budget in USDC</p>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Ad Campaign
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Performance</CardTitle>
                <CardDescription>Live metrics from your ad widget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-white/60">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Impressions</span>
                  </div>
                  <span className="text-white font-bold">1,247</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-white/60">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Clicks</span>
                  </div>
                  <span className="text-white font-bold">89</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-white/60">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Spent</span>
                  </div>
                  <span className="text-white font-bold">$127.50 USDC</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-300">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-semibold">Remaining Budget</span>
                  </div>
                  <span className="text-purple-300 font-bold">$372.50 USDC</span>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Widget Preview Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ad Widget Preview</CardTitle>
                <CardDescription>
                  Live preview of your sponsored ad (400×200)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 bg-black/20 rounded-lg">
                  <AdsWidgetDemo
                    bannerUrl={adConfig.bannerUrl}
                    adText={adConfig.adText}
                    sponsorName={adConfig.sponsorName}
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <Label className="text-xs text-white/50">Widget URL</Label>
                    <code className="block mt-1 text-sm text-white/80 break-all">
                      {widgetUrl}
                    </code>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Widget URL'}
                  </Button>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="font-semibold text-yellow-300 mb-2">Sponsored Label</h4>
                    <p className="text-sm text-white/60">
                      All ads automatically display a "SPONSORED" badge for transparency
                    </p>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">Pricing Model</h4>
                    <p className="text-sm text-white/60">
                      Pay $0.10 per impression • $1.00 per click<br />
                      Auto-pauses when budget is depleted
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
