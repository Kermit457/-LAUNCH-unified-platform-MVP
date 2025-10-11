'use client'

import { useState } from 'react'
import { ProjectCurveCard } from '@/components/curve/ProjectCurveCard'
import { UserProfileCurveCard } from '@/components/curve/UserProfileCurveCard'
import { Code, Rocket, TestTube, User, Briefcase } from 'lucide-react'

export default function CurveDemoPage() {
  const [mockUserId] = useState('demo-user-123')
  const [mockBalance] = useState(100) // 100 SOL
  const [activeView, setActiveView] = useState<'demo' | 'api'>('demo')
  const [profileType, setProfileType] = useState<'user' | 'project'>('user')

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black pb-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            🎯 Curve System Demo
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Test the complete bonding curve lifecycle
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>Mock User ID: {mockUserId}</span>
            <span>•</span>
            <span>Balance: {mockBalance} SOL</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveView('demo')}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2
              ${activeView === 'demo'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/30'
              }
            `}
          >
            <TestTube className="w-4 h-4" />
            Live Demo
          </button>
          <button
            onClick={() => setActiveView('api')}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2
              ${activeView === 'api'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/30'
              }
            `}
          >
            <Code className="w-4 h-4" />
            API Docs
          </button>
        </div>

        {/* Demo View */}
        {activeView === 'demo' && (
          <div className="space-y-8">
            {/* Instructions */}
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Rocket className="w-6 h-6" />
                Testing Instructions
              </h2>
              <ol className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">1</span>
                  <span>Run <code className="px-2 py-0.5 bg-black/30 rounded text-purple-400 font-mono text-sm">node scripts/reset-curves.js && node scripts/seed-curves.js</code></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">2</span>
                  <span>Switch between User and Project tabs to see both curve types</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">3</span>
                  <span>Click "Buy Keys" on project cards (replaces Boost & Burn)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">4</span>
                  <span>On user profiles, "Buy Keys" appears next to "Invite" button</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">5</span>
                  <span>Watch stats update in real-time after each trade</span>
                </li>
              </ol>
            </div>

            {/* Profile Type Toggle */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setProfileType('user')}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                  ${profileType === 'user'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/30'
                  }
                `}
              >
                <User className="w-5 h-5" />
                User/Creator Profile
              </button>
              <button
                onClick={() => setProfileType('project')}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                  ${profileType === 'project'
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-pink-500/30'
                  }
                `}
              >
                <Briefcase className="w-5 h-5" />
                Project Profile
              </button>
            </div>

            {/* Profile Cards */}
            <div className="max-w-md mx-auto">
              {profileType === 'user' && (
                <UserProfileCurveCard
                  userId={mockUserId}
                  userName="Solidity Dev"
                  userHandle="@solidity_dev"
                  userBadges={['Builder', 'Developer']}
                  userBio="Smart contract auditor | Web3 builder | Security first 🔒"
                  currentUserId={mockUserId}
                  userBalance={mockBalance}
                  isVerified={true}
                />
              )}

              {profileType === 'project' && (
                <ProjectCurveCard
                  projectId="demo-project-456"
                  projectName="ICM.RUN"
                  projectTags={['UPCOMING', 'ICM']}
                  projectDescription="Conviction-based project with community-driven launch mechanism"
                  currentUserId={mockUserId}
                  userBalance={mockBalance}
                  rank={1}
                  conviction={0}
                />
              )}
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-purple-400 font-bold mb-2">✨ Simple UI</div>
                <div className="text-sm text-gray-400">
                  Clean buy/sell modal inspired by friend.tech with Solana styling
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-pink-400 font-bold mb-2">🚀 Owner Launch</div>
                <div className="text-sm text-gray-400">
                  Launch button only visible to owner when thresholds are met
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-cyan-400 font-bold mb-2">📊 Live Stats</div>
                <div className="text-sm text-gray-400">
                  Real-time price, holders, reserve updates after each trade
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Docs View */}
        {activeView === 'api' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">API Endpoints</h3>
              <p className="text-sm text-gray-400">
                Test these endpoints using the Live Demo tab or your own HTTP client.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  method: 'POST',
                  path: '/api/curve/create',
                  desc: 'Create a new curve for user or project',
                  body: '{ "ownerType": "user", "ownerId": "123", "basePrice": 0.01 }'
                },
                {
                  method: 'GET',
                  path: '/api/curve/owner?ownerType=user&ownerId=X',
                  desc: 'Get curve by owner'
                },
                {
                  method: 'POST',
                  path: '/api/curve/[id]/buy',
                  desc: 'Buy keys (with referral tracking)',
                  body: '{ "amount": 10, "userId": "123", "isKeysInput": true }'
                },
                {
                  method: 'POST',
                  path: '/api/curve/[id]/sell',
                  desc: 'Sell keys (5% sell tax)',
                  body: '{ "keys": 10, "userId": "123" }'
                },
                {
                  method: 'POST',
                  path: '/api/curve/[id]/launch',
                  desc: 'Launch token (owner only, after meeting thresholds)',
                  body: '{ "userId": "123" }'
                }
              ].map((endpoint, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`
                      px-2 py-1 rounded text-xs font-mono font-bold
                      ${endpoint.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                      }
                    `}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm text-purple-400 font-mono">
                      {endpoint.path}
                    </code>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {endpoint.desc}
                  </div>
                  {endpoint.body && (
                    <div className="mt-2 p-2 bg-black/30 rounded border border-white/5">
                      <div className="text-xs text-gray-500 mb-1">Request Body:</div>
                      <code className="text-xs text-gray-400 font-mono">
                        {endpoint.body}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Test Data */}
            <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <h4 className="text-lg font-bold text-white mb-4">Bonding Curve Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Base Price</div>
                  <div className="text-lg font-bold text-white">0.01 SOL</div>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Fee Split</div>
                  <div className="text-lg font-bold text-white">94-3-2-1</div>
                  <div className="text-xs text-gray-500 mt-1">Reserve/Creator/Platform/Referral</div>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Sell Tax</div>
                  <div className="text-lg font-bold text-white">5%</div>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Launch Threshold</div>
                  <div className="text-lg font-bold text-white">100 keys, 4 holders, 10 SOL</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>🚀 Bonding Curve System v1.0</p>
          <p className="mt-1">Built with Next.js 14, TypeScript, Appwrite & Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
