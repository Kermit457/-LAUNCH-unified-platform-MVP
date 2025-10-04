import { Users, Trophy, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CommunityPage() {
  const topCreators = [
    { rank: 1, name: 'PixelPapi', clips: 2401, earnings: '$4,200', avatar: '🎬' },
    { rank: 2, name: 'CryptoClips', clips: 1834, earnings: '$3,560', avatar: '🎥' },
    { rank: 3, name: 'StreamMaster', clips: 1456, earnings: '$2,890', avatar: '🎮' },
    { rank: 4, name: 'RaidKing', clips: 1203, earnings: '$2,340', avatar: '⚔️' },
    { rank: 5, name: 'ClipQueen', clips: 987, earnings: '$1,980', avatar: '👑' },
  ];

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold gradient-text">Community</h1>
        </div>
        <p className="text-white/60 text-lg">
          Join the Frenwork. Connect with top creators, clippers, and streamers.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Community Stats */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Community Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-sm text-white/60 mb-1">Total Members</div>
              <div className="text-2xl font-bold text-white">12,847</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🎬</div>
              <div className="text-sm text-white/60 mb-1">Clips Created</div>
              <div className="text-2xl font-bold text-white">45,203</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-sm text-white/60 mb-1">Paid Out</div>
              <div className="text-2xl font-bold text-green-400">$234k</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-sm text-white/60 mb-1">Active Now</div>
              <div className="text-2xl font-bold text-orange-400">1,284</div>
            </div>
          </div>
        </div>

        {/* Frenwork Directory - Top Creators */}
        <div className="glass-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Top Creators This Week
              </h2>
              <p className="text-white/60">
                Leaderboard of highest-earning creators and clippers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {topCreators.map((creator) => (
              <div
                key={creator.rank}
                className="glass-card p-4 flex items-center justify-between hover:border-white/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${
                    creator.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                    creator.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                    creator.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                    'bg-white/10'
                  }`}>
                    {creator.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{creator.name}</span>
                      {creator.rank <= 3 && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                    </div>
                    <div className="text-sm text-white/60">
                      {creator.clips.toLocaleString()} clips created
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-green-400">{creator.earnings}</div>
                  <div className="text-xs text-white/50">this week</div>
                </div>
              </div>
            ))}
          </div>

          {/* TODO: Add real leaderboard data from Supabase */}
          {/* TODO: Implement creator profiles */}
          {/* TODO: Add filters (weekly/monthly/all-time) */}
        </div>

        {/* Join Community */}
        <div className="glass-card p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Join the Frenwork</h2>
            <p className="text-white/60 mb-6">
              Connect with thousands of creators, share strategies, and grow together.
              Get exclusive alpha, early access to launches, and community support.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" className="gap-2">
                <MessageCircle size={16} />
                Join Discord
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Follow on X
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Join Telegram
              </Button>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="font-bold text-white mb-1">Alpha Channels</div>
                <div className="text-white/60">Early launch info & insider tips</div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="font-bold text-white mb-1">Creator Support</div>
                <div className="text-white/60">Help from experienced members</div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="font-bold text-white mb-1">Exclusive Events</div>
                <div className="text-white/60">AMAs, competitions, giveaways</div>
              </div>
            </div>
          </div>

          {/* TODO: Add real Discord/Telegram invite links */}
          {/* TODO: Implement community stats tracking */}
        </div>
      </div>
    </div>
  );
}
