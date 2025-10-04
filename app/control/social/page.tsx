'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SocialControl() {
  const [streamerId, setStreamerId] = useState('demo')
  const [actionKey, setActionKey] = useState('')
  const [label, setLabel] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [goal, setGoal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const createAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!streamerId || !actionKey || !label || !targetUrl) return

    setLoading(true)
    setSuccess('')
    try {
      // Demo mode - just show success message
      setSuccess(`✅ Social action created! Label: "${label}" | URL: ${targetUrl} | Goal: ${goal}`)
      setActionKey('')
      setLabel('')
      setTargetUrl('')
      setGoal(0)

      // In production, this would call the API:
      // const res = await fetch('/api/social', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ streamerId, actionKey, label, targetUrl, goal }),
      // })
    } catch (error) {
      console.error('Error creating social action:', error)
      alert('Failed to create social action')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Social Actions Control</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            ← Back
          </Link>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">Create Social Action</h2>

          {success && (
            <div className="mb-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-300 text-sm">
              {success}
              <p className="mt-2 text-xs text-green-400">
                Check the widget at: <strong>/widget?mode=social&streamer={streamerId}</strong>
              </p>
            </div>
          )}

          <form onSubmit={createAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Streamer ID (Wallet/Username)
              </label>
              <input
                type="text"
                value={streamerId}
                onChange={(e) => setStreamerId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="0x1234... or username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Action Key</label>
              <input
                type="text"
                value={actionKey}
                onChange={(e) => setActionKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="join_telegram, follow_x, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Join Telegram"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target URL</label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="https://t.me/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Goal (optional, 0 = no goal)
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="100"
                min="0"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Social Action'}
            </button>
          </form>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Common Action Keys</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-900/50 p-3 rounded">
              <code className="text-pink-400">join_telegram</code>
            </div>
            <div className="bg-gray-900/50 p-3 rounded">
              <code className="text-pink-400">follow_x</code>
            </div>
            <div className="bg-gray-900/50 p-3 rounded">
              <code className="text-pink-400">join_discord</code>
            </div>
            <div className="bg-gray-900/50 p-3 rounded">
              <code className="text-pink-400">retweet</code>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm font-mono bg-gray-900/50 p-4 rounded-lg">
            <div>
              <span className="text-gray-400">Toggle:</span>{' '}
              <code className="text-pink-400">POST /api/social/:id/toggle</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
