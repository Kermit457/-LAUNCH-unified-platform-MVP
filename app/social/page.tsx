'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import SocialWidgetDemo from '@/components/widgets/SocialWidgetDemo'
import { Users, Twitter, MessageCircle, Hash, ExternalLink } from 'lucide-react'

export default function SocialPage() {
  const [actions, setActions] = useState([
    { id: '1', platform: 'Telegram', label: 'Join Telegram', url: 'https://t.me/example', counter: 123, goal: 200 },
    { id: '2', platform: 'Twitter', label: 'Follow on Twitter', url: 'https://twitter.com/example', counter: 87, goal: 150 },
    { id: '3', platform: 'Discord', label: 'Join Discord', url: 'https://discord.gg/example', counter: 156, goal: 100 },
  ])

  const [newAction, setNewAction] = useState({
    platform: '',
    label: '',
    url: '',
    goal: 100
  })

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault()
    const action = {
      id: Date.now().toString(),
      ...newAction,
      counter: 0
    }
    setActions([...actions, action])
    setNewAction({ platform: '', label: '', url: '', goal: 100 })
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'telegram': return <MessageCircle className="w-4 h-4" />
      case 'twitter': return <Twitter className="w-4 h-4" />
      case 'discord': return <Hash className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Social Actions</h1>
          <p className="text-white/60">Configure social media buttons and track community goals</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Add Social Action
                </CardTitle>
                <CardDescription>
                  Create buttons for Telegram, Twitter, Discord, or custom links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Input
                      id="platform"
                      value={newAction.platform}
                      onChange={(e) => setNewAction({ ...newAction, platform: e.target.value })}
                      placeholder="Telegram, Twitter, Discord, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="label">Button Label</Label>
                    <Input
                      id="label"
                      value={newAction.label}
                      onChange={(e) => setNewAction({ ...newAction, label: e.target.value })}
                      placeholder="Join our community"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Target URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={newAction.url}
                      onChange={(e) => setNewAction({ ...newAction, url: e.target.value })}
                      placeholder="https://..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal (optional)</Label>
                    <Input
                      id="goal"
                      type="number"
                      value={newAction.goal}
                      onChange={(e) => setNewAction({ ...newAction, goal: parseInt(e.target.value) || 0 })}
                      placeholder="200"
                      min="0"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Add Social Action
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Actions List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Social Actions</CardTitle>
                <CardDescription>
                  {actions.length} action{actions.length !== 1 ? 's' : ''} configured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {actions.map((action) => {
                  const percentage = action.goal > 0 ? (action.counter / action.goal) * 100 : 0
                  const goalReached = action.counter >= action.goal

                  return (
                    <div key={action.id} className="glass-card p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(action.platform)}
                          <span className="font-semibold text-white">{action.label}</span>
                        </div>
                        <a
                          href={action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">
                          {action.counter} / {action.goal} clicks
                        </span>
                        <span className={goalReached ? 'text-green-400 font-bold' : 'text-white/50'}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>

                      <Progress value={Math.min(percentage, 100)} />

                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Toggle
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          Remove
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Widget Preview Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Widget Preview</CardTitle>
                <CardDescription>
                  This is how your social widget will appear in OBS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 bg-black/20 rounded-lg">
                  <SocialWidgetDemo />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <Label className="text-xs text-white/50">Widget URL</Label>
                    <code className="block mt-1 text-sm text-white/80 break-all">
                      http://localhost:3000/widget?mode=social&streamer=demo
                    </code>
                  </div>

                  <Button variant="outline" className="w-full">
                    📋 Copy Widget URL
                  </Button>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      QR Code Support
                    </h4>
                    <p className="text-sm text-white/60">
                      Generate QR codes for each social action to make it easier for viewers to follow
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
