import Link from 'next/link';
import { Swords, MessageCircle, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EngagePage() {
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Swords className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Engage</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          StreamWars, Raid Chat, Quests, and community challenges
        </p>
      </div>

      <div className="grid gap-6">
        {/* StreamWars */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                StreamWars
              </h2>
              <p className="text-zinc-400">
                Compete in live team battles. Raid opponents, defend your territory, earn rewards.
              </p>
            </div>
            <Link href="/discover?filter=raid">
              <Button>View Active Wars</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-xl">
              <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Active Battles</div>
              <div className="text-2xl font-bold text-white">5</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-xl">
              <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Total Participants</div>
              <div className="text-2xl font-bold text-white">1,234</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-xl">
              <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Prize Pool</div>
              <div className="text-2xl font-bold text-green-400">$8,500</div>
            </div>
          </div>

          {/* TODO: Add live StreamWars leaderboard */}
          {/* TODO: Connect to real-time battle updates */}
          {/* TODO: Add team selection interface */}
        </div>

        {/* Raid Chat */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                Raid Chat
              </h2>
              <p className="text-zinc-400">
                Coordinate raids, share targets, and dominate social platforms together.
              </p>
            </div>
            <Link href="/discover?filter=raid">
              <Button variant="secondary">Join Raid</Button>
            </Link>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-xl">
            <p className="text-zinc-500 text-sm text-center py-8">
              Raid chat interface coming soon. Join raids from the Discover page.
            </p>
          </div>

          {/* TODO: Implement real-time chat interface */}
          {/* TODO: Add raid target submission */}
          {/* TODO: Connect to Supabase real-time channels */}
        </div>

        {/* Active Quests */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Active Quests
              </h2>
              <p className="text-zinc-400">
                Complete daily and weekly quests to earn points and unlock rewards.
              </p>
            </div>
            <Link href="/discover?filter=quest">
              <Button variant="secondary">View All Quests</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Daily Quest */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-purple-300">DAILY QUEST</span>
                <span className="text-xs text-zinc-500">Resets in 8h</span>
              </div>
              <h3 className="font-bold text-white mb-1">Social Engagement</h3>
              <p className="text-sm text-zinc-400 mb-3">Like + Retweet + Comment on 3 posts</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Progress: 1/3</span>
                <span className="text-sm font-bold text-purple-400">+50 pts</span>
              </div>
            </div>

            {/* Weekly Quest */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-300">WEEKLY QUEST</span>
                <span className="text-xs text-zinc-500">Resets in 3d</span>
              </div>
              <h3 className="font-bold text-white mb-1">Content Creator</h3>
              <p className="text-sm text-zinc-400 mb-3">Create 5 clips with $LAUNCH widget</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Progress: 0/5</span>
                <span className="text-sm font-bold text-blue-400">+500 pts</span>
              </div>
            </div>
          </div>

          {/* TODO: Add quest tracking system */}
          {/* TODO: Connect to user progress via Supabase */}
          {/* TODO: Implement reward claiming */}
        </div>
      </div>
    </div>
  );
}
