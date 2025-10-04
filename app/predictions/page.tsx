'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import PredictionWidgetDemo from '@/components/widgets/PredictionWidgetDemo'
import { Plus, X, BarChart3 } from 'lucide-react'

export default function PredictionsPage() {
  const [question, setQuestion] = useState('Will BTC go up in 15 minutes?')
  const [options, setOptions] = useState(['YES', 'NO'])
  const [newOption, setNewOption] = useState('')
  const [widgetKey, setWidgetKey] = useState(0)

  const addOption = () => {
    if (newOption.trim() && options.length < 4) {
      setOptions([...options, newOption.trim()])
      setNewOption('')
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Refresh widget with new data
    setWidgetKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Predictions</h1>
          <p className="text-white/60">Create and manage live prediction widgets for your stream</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Start New Prediction
                </CardTitle>
                <CardDescription>
                  Set up a prediction question with multiple options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question">Prediction Question</Label>
                    <Input
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="What will happen next?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options (2-4)</Label>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...options]
                              newOptions[index] = e.target.value
                              setOptions(newOptions)
                            }}
                            className="flex-1"
                          />
                          {options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {options.length < 4 && (
                      <div className="flex gap-2">
                        <Input
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          placeholder="Add new option"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addOption()
                            }
                          }}
                        />
                        <Button type="button" onClick={addOption} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Create Prediction
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Prediction Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Active Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60 text-sm">Status</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold">
                    VOTING OPEN
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60 text-sm">Total Votes</span>
                  <span className="text-white font-bold">70</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    Lock Voting
                  </Button>
                  <Button variant="destructive" className="flex-1" size="sm">
                    Settle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Widget Preview Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Widget Preview</CardTitle>
                <CardDescription>
                  This is how your prediction will appear in OBS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 bg-black/20 rounded-lg">
                  <PredictionWidgetDemo
                    key={widgetKey}
                    question={question}
                    options={options}
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <Label className="text-xs text-white/50">Widget URL</Label>
                    <code className="block mt-1 text-sm text-white/80 break-all">
                      http://localhost:3000/widget?mode=prediction&streamer=demo
                    </code>
                  </div>

                  <Button variant="outline" className="w-full">
                    📋 Copy Widget URL
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
