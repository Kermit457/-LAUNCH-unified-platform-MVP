'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Prediction {
  id: string
  question: string
  options: string[]
  state: string
  createdAt: string
}

export default function PredictionsControl() {
  const [streamerId, setStreamerId] = useState('demo')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const addOption = () => {
    setOptions([...options, ''])
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const createPrediction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!streamerId || !question) return

    setLoading(true)
    setSuccess('')
    try {
      const validOptions = options.filter((o) => o.trim())

      // Demo mode - just show success message
      setQuestion('')
      setOptions(['', ''])
      setSuccess(`✅ Prediction created! Question: "${question}" | Options: ${validOptions.join(', ')}`)

      // In production, this would call the API:
      // const res = await fetch('/api/predictions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ streamerId, question, options: validOptions }),
      // })
    } catch (error) {
      console.error('Error creating prediction:', error)
      alert('Failed to create prediction')
    } finally {
      setLoading(false)
    }
  }

  const lockPrediction = async (id: string) => {
    try {
      const res = await fetch(`/api/predictions/${id}/lock`, {
        method: 'POST',
      })

      if (res.ok) {
        alert('Prediction locked!')
      }
    } catch (error) {
      console.error('Error locking prediction:', error)
    }
  }

  const settlePrediction = async (id: string) => {
    const winningOption = prompt('Enter the winning option:')
    if (!winningOption) return

    try {
      const res = await fetch(`/api/predictions/${id}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winningOption }),
      })

      if (res.ok) {
        alert('Prediction settled!')
      }
    } catch (error) {
      console.error('Error settling prediction:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Prediction Control</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            ← Back
          </Link>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Prediction</h2>

          {success && (
            <div className="mb-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-300 text-sm">
              {success}
              <p className="mt-2 text-xs text-green-400">
                Check the widget at: <strong>/widget?mode=prediction&streamer={streamerId}</strong>
              </p>
            </div>
          )}

          <form onSubmit={createPrediction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Streamer ID (Wallet/Username)
              </label>
              <input
                type="text"
                value={streamerId}
                onChange={(e) => setStreamerId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="0x1234... or username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="BTC next 15m?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Options</label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
              >
                + Add Option
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Prediction'}
            </button>
          </form>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <p className="text-gray-400 text-sm mb-4">
            Use the API endpoints to lock or settle predictions. Check the console or
            export results using the results endpoint.
          </p>

          <div className="space-y-2 text-sm font-mono bg-gray-900/50 p-4 rounded-lg">
            <div>
              <span className="text-gray-400">Lock:</span>{' '}
              <code className="text-purple-400">POST /api/predictions/:id/lock</code>
            </div>
            <div>
              <span className="text-gray-400">Settle:</span>{' '}
              <code className="text-purple-400">
                POST /api/predictions/:id/settle
              </code>
            </div>
            <div>
              <span className="text-gray-400">Results:</span>{' '}
              <code className="text-purple-400">
                GET /api/predictions/:id/results
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
