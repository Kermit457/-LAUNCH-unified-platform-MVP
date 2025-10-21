"use client"

import { useState, useEffect } from 'react'
import { DollarSign, ArrowDownToLine, ArrowUpFromLine, Share2, Image as ImageIcon, Twitter, Globe, Send, Plus, X, Users2, Rocket } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { getUserProfile, updateUserProfile, createUserProfile } from '@/lib/appwrite/services/users'
import { getNetworkInvites } from '@/lib/appwrite/services/network'
import { CurveService } from '@/lib/appwrite/services/curves'
import { useSolanaBalance } from '@/hooks/useSolanaBalance'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export default function ProfilePage() {
  const { user } = usePrivy()
  const { success, error: showError } = useToast()
  const router = useRouter()
  const { balance: solBalance, isLoading: isLoadingBalance } = useSolanaBalance()

  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [displayNameInput, setDisplayNameInput] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [tokenName, setTokenName] = useState('')
  const [tokenTicker, setTokenTicker] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [profileId, setProfileId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)

  // Real stats from Appwrite
  const [stats, setStats] = useState({
    totalValue: 0,
    solBalance: 0,
    keyHolders: 0,
    yourHoldings: 0,
    networkConnections: 0,
    collaborations: 0,
  })

  const skills = [
    { id: 'trader', label: 'Trader', color: 'from-green-500 to-emerald-500' },
    { id: 'advisor', label: 'Advisor', color: 'from-blue-500 to-cyan-500' },
    { id: 'vc', label: 'VC', color: 'from-yellow-500 to-orange-500' },
    { id: 'believer', label: 'Believer', color: 'from-purple-500 to-pink-500' },
    { id: 'cultist', label: 'Cultist', color: 'from-red-500 to-rose-500' },
    { id: 'contributor', label: 'Contributor', color: 'from-teal-500 to-cyan-500' },
    { id: 'developer', label: 'Developer', color: 'from-indigo-500 to-blue-500' },
    { id: 'incubator', label: 'Incubator', color: 'from-violet-500 to-purple-500' },
    { id: 'scout', label: 'Scout', color: 'from-amber-500 to-yellow-500' },
    { id: 'influencer', label: 'Influencer', color: 'from-pink-500 to-rose-500' },
    { id: 'builder', label: 'Builder', color: 'from-slate-500 to-zinc-500' },
    { id: 'marketer', label: 'Marketer', color: 'from-orange-500 to-red-500' },
    { id: 'kol', label: 'KOL', color: 'from-fuchsia-500 to-pink-500' },
    { id: 'founder', label: 'Founder', color: 'from-yellow-400 to-amber-500' },
    { id: 'rizzer', label: 'Rizzer', color: 'from-cyan-500 to-blue-500' },
    { id: 'degen', label: 'Degen', color: 'from-lime-500 to-green-500' },
  ]

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  // Load user profile and stats from Appwrite
  useEffect(() => {
    if (!user?.id) return

    async function loadProfileData() {
      const userId = user?.id
      if (!userId) return

      try {
        // Load user profile
        const profile = await getUserProfile(userId)
        if (profile) {
          setProfileId(profile.$id)
          setDisplayNameInput(profile.displayName || '')
          setBio(profile.bio || '')
          setWebsite(profile.website || '')
          setTwitter(profile.twitter || '')
        }

        // Load network stats
        const invites = await getNetworkInvites({
          userId,
          status: 'accepted'
        })

        // Load curve stats
        const curve = await CurveService.getCurveByOwner('user', userId)

        // Query user's holdings from CURVE_HOLDERS
        let yourHoldingsValue = 0
        try {
          const holdingsResponse = await databases.listDocuments(
            DB_ID,
            COLLECTIONS.CURVE_HOLDERS,
            [
              Query.equal('userId', userId),
              Query.greaterThan('balance', 0),
              Query.limit(100)
            ]
          )

          for (const holding of holdingsResponse.documents) {
            const holdingCurve = await CurveService.getCurveById(holding.curveId as string)
            if (holdingCurve) {
              yourHoldingsValue += (holding.balance as number) * holdingCurve.price
            }
          }
        } catch (error) {
          console.error('Failed to load holdings:', error)
        }

        setStats({
          totalValue: yourHoldingsValue + solBalance,
          solBalance: solBalance,
          keyHolders: curve?.holders || 0,
          yourHoldings: yourHoldingsValue,
          networkConnections: invites.length,
          collaborations: invites.length,
        })
      } catch (error) {
        console.error('Failed to load profile data:', error)
      }
    }

    loadProfileData()
  }, [user?.id, solBalance])

  // Save profile handler
  const handleSaveProfile = async () => {
    if (!user?.id) {
      showError('Not Authenticated', 'Please log in to save your profile')
      return
    }

    setIsSaving(true)
    try {
      if (profileId) {
        // Update existing profile
        await updateUserProfile(profileId, {
          displayName: displayNameInput,
          bio,
          website,
          twitter,
        })
        success('Profile Saved!', 'Your profile has been updated')
      } else {
        // Create new profile
        const newProfile = await createUserProfile({
          userId: user.id,
          username: user.twitter?.username || user.id.slice(0, 8),
          displayName: displayNameInput,
          bio,
          website,
          twitter,
          verified: false,
          conviction: 0,
          totalEarnings: 0,
          roles: [],
        })
        if (newProfile) {
          setProfileId(newProfile.$id)
          success('Profile Created!', 'Your profile has been created')
        }
      }
      setShowProfileEditor(false)
    } catch (error: any) {
      showError('Save Failed', error.message || 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  // Action button handlers
  const handleReceive = () => {
    if (!user?.wallet?.address) {
      showError('No Wallet', 'Please connect a wallet first')
      return
    }
    setShowReceiveModal(true)
  }

  const handleSend = () => {
    if (!user?.wallet?.address) {
      showError('No Wallet', 'Please connect a wallet first')
      return
    }
    setShowSendModal(true)
  }

  const handleDeposit = () => {
    success('Coming Soon', 'Fiat on-ramp integration launching soon!')
  }

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.twitter?.username || user?.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} on LaunchOS`,
          text: 'Check out my profile on LaunchOS!',
          url: profileUrl,
        })
      } catch (error) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(profileUrl)
      success('Link Copied!', 'Profile link copied to clipboard')
    }
  }

  const handleExport = () => {
    success('Coming Soon', 'Transaction export feature launching soon!')
  }

  // Get Twitter profile pic from Privy
  const twitterAccount = user?.twitter
  const profilePicture = twitterAccount?.profilePictureUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  const displayName = user?.twitter?.username || 'Anonymous'

  const referralStats = {
    totalReferrals: 12,
    referralLink: `icmmotion.com/ref/${displayName.toLowerCase()}`,
  }

  // Mock holdings - user's own token should be first
  const holdings = [
    {
      name: displayName,
      ticker: tokenTicker || 'USER',
      amount: '1.00M',
      value: 45.0,
      logo: profilePicture,
      isOwn: true,
    },
    {
      name: 'Solana',
      ticker: 'SOL',
      amount: '0.00 SOL',
      value: 0.43,
      logo: 'solana',
    },
    {
      name: 'chefandy',
      ticker: 'COOK',
      amount: '13.07M',
      value: 80.83,
      change: -15.9,
      logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef',
    },
  ]

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 md:py-6">

        {/* Profile Header - Compact */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#00FF88] to-[#00FFFF] p-1 overflow-hidden">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-base md:text-2xl font-bold text-white">{displayName}</h1>
              <p className="text-[10px] md:text-sm text-zinc-400 font-mono">
                {user?.wallet?.address ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>

          <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Balance Display */}
        <div className="mb-3 text-center py-4">
          <div className="text-4xl md:text-6xl font-black text-white mb-1">
            ${stats.totalValue.toFixed(2)}
          </div>
          <div className="text-base md:text-xl text-zinc-400">
            {stats.solBalance.toFixed(3)} SOL
          </div>
        </div>

        {/* Social Stats */}
        <div className="mb-3 grid grid-cols-4 gap-1.5 text-center">
          <div>
            <div className="text-xl md:text-3xl font-bold text-white">{stats.keyHolders}</div>
            <div className="text-[9px] md:text-xs text-zinc-500">Key Holders</div>
          </div>
          <div>
            <div className="text-xl md:text-3xl font-bold text-white">{stats.yourHoldings}</div>
            <div className="text-[9px] md:text-xs text-zinc-500">Your Holdings</div>
          </div>
          <div>
            <div className="text-xl md:text-3xl font-bold text-white">{stats.networkConnections}</div>
            <div className="text-[9px] md:text-xs text-zinc-500">Network</div>
          </div>
          <div>
            <div className="text-xl md:text-3xl font-bold text-white">{stats.collaborations}</div>
            <div className="text-[9px] md:text-xs text-zinc-500">Collabs</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-3 grid grid-cols-5 gap-1.5">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleReceive}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#00FF88] flex items-center justify-center hover:scale-105 transition-transform"
            >
              <ArrowDownToLine className="w-5 h-5 md:w-7 md:h-7 text-black" />
            </button>
            <span className="text-[9px] md:text-xs text-white font-medium">Receive</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleSend}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-800 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <ArrowUpFromLine className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </button>
            <span className="text-[9px] md:text-xs text-white font-medium">Send</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleDeposit}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-800 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <DollarSign className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </button>
            <span className="text-[9px] md:text-xs text-white font-medium">Deposit</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleShare}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-800 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Share2 className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </button>
            <span className="text-[9px] md:text-xs text-white font-medium">Share</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleExport}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-800 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <span className="text-[9px] md:text-xs text-white font-medium">Export</span>
          </div>
        </div>

        {/* Referral Section */}
        <div className="mb-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                <Users2 className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Referral Program</h3>
                <p className="text-[10px] text-zinc-400">{referralStats.totalReferrals} referrals</p>
              </div>
            </div>
            <div className="px-2 py-1 rounded-lg bg-[#FFD700]/20 border border-[#FFD700]/40 text-[10px] font-bold text-[#FFD700]">
              Earn 3%
            </div>
          </div>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralStats.referralLink}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://${referralStats.referralLink}`)
              }}
              className="px-3 py-1.5 rounded-lg bg-[#00FF88] hover:bg-[#00FFFF] text-black text-[10px] font-bold transition-all"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8800FF] to-[#00FFFF] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">What do you bring to the table?</h3>
              <p className="text-[10px] text-zinc-400">
                {selectedSkills.length > 0 ? `${selectedSkills.length} selected` : 'Select up to 3 (optional)'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all ${
                  selectedSkills.includes(skill.id)
                    ? `bg-gradient-to-r ${skill.color} text-white border-2 border-white/20 scale-105`
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600'
                }`}
              >
                {skill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Complete Profile Card */}
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 border-2 border-zinc-700 cursor-pointer hover:border-zinc-600 transition-all"
             onClick={() => setShowProfileEditor(true)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8800FF] to-[#00FFFF] flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Complete your profile</h3>
                <p className="text-xs text-zinc-400">Only noobs stop at 50%</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all flex items-center gap-2">
              <span>→</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00FF88] to-[#00FFFF]" style={{ width: '50%' }}></div>
            </div>
            <span className="text-sm font-bold text-white">50%</span>
          </div>
        </div>

        {/* Balances Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-zinc-400" />
            <h2 className="text-base font-bold text-white">Balances</h2>
          </div>

          {/* User's Own Token - Always First */}
          {holdings.map((holding, idx) => (
            <div key={idx} className="mb-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                  {holding.logo === 'solana' ? (
                    <svg width="24" height="24" viewBox="0 0 397.7 311.7" fill="white">
                      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
                      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
                      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
                    </svg>
                  ) : (
                    <img src={holding.logo} alt={holding.name} className="w-full h-full" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{holding.name}</div>
                  <div className="text-xs text-zinc-500">{holding.amount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">${holding.value.toFixed(2)}</div>
                {holding.change !== undefined && (
                  <div className={`text-xs ${holding.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {holding.change < 0 ? '↓' : '↑'}{Math.abs(holding.change).toFixed(1)}%
                  </div>
                )}
                <div className="w-20 h-6">
                  <svg viewBox="0 0 80 24" className={holding.change && holding.change < 0 ? 'text-red-500' : 'text-green-500'}>
                    <polyline points="0,20 20,15 40,18 60,12 80,16" fill="none" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Editor Modal */}
        {showProfileEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00FFFF] p-0.5 overflow-hidden">
                      <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">My Profile</h2>
                      <p className="text-xs text-zinc-400">@{displayName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileEditor(false)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Account Information Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-[#00FFFF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <h3 className="text-base font-bold text-white">Account Information</h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Display Name</label>
                        <input
                          type="text"
                          value={displayNameInput}
                          onChange={(e) => setDisplayNameInput(e.target.value)}
                          placeholder={displayName}
                          className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#00FFFF]"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#00FFFF] resize-none h-24"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Email</label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="No email connected"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#00FFFF] placeholder:text-zinc-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Curve/Token Launch Section */}
                  <div className="border-t border-zinc-800 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Curve/Token Launch Details</h3>
                        <p className="text-xs text-zinc-400">Complete this to launch your personal bonding curve</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Token Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-zinc-400 mb-1 block">Token Name *</label>
                          <input
                            type="text"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            placeholder="e.g., My Token"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400 mb-1 block">Token Ticker *</label>
                          <input
                            type="text"
                            value={tokenTicker}
                            onChange={(e) => setTokenTicker(e.target.value.toUpperCase())}
                            placeholder="e.g., MTK"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell us about your token..."
                          className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#FFD700] resize-none h-24"
                        />
                      </div>

                      {/* Social Links */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm text-zinc-400 mb-1 block flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Website
                          </label>
                          <input
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400 mb-1 block flex items-center gap-2">
                            <Twitter className="w-4 h-4" /> Twitter
                          </label>
                          <input
                            type="text"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            placeholder="@username"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400 mb-1 block flex items-center gap-2">
                            <Send className="w-4 h-4" /> Telegram
                          </label>
                          <input
                            type="text"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            placeholder="https://t.me/..."
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                      </div>

                      {/* Token Logo */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Token Logo</label>
                        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-[#FFD700]/50 transition-colors cursor-pointer">
                          <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                          <p className="text-sm text-zinc-400">Click to upload token logo</p>
                          <p className="text-xs text-zinc-600 mt-1">PNG, JPG, WebP (max 5MB)</p>
                        </div>
                      </div>

                      {/* Additional Images (3-5) */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Additional Images (3-5)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[...Array(5)].map((_, idx) => (
                            <div key={idx} className="aspect-square border-2 border-dashed border-zinc-700 rounded-lg hover:border-[#FFD700]/50 transition-colors cursor-pointer flex items-center justify-center">
                              {uploadedImages[idx] ? (
                                <img src={uploadedImages[idx]} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Plus className="w-6 h-6 text-zinc-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black font-bold hover:opacity-90 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
