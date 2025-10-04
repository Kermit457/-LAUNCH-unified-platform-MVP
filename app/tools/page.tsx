import Link from 'next/link';
import { Wrench, Tv, DollarSign, TrendingUp, Users, Zap, Rocket, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Wrench className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold gradient-text">Creator Tools</h1>
        </div>
        <p className="text-white/60 text-lg">
          Widgets, campaigns, launches, and monetization tools for streamers & creators
        </p>
      </div>

      <div className="grid gap-6">
        {/* OBS Widgets Section */}
        <div className="glass-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Tv className="w-6 h-6 text-indigo-400" />
                OBS Widgets
              </h2>
              <p className="text-white/60">
                Add interactive overlays to your stream. Predictions, social actions, and sponsored ads.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Prediction Widget */}
            <Link href="/predictions">
              <div className="glass-card p-6 hover:border-purple-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Prediction Widget</h3>
                <p className="text-sm text-white/60 mb-4">Live voting, outcomes, and winner tracking</p>
                <Button size="sm" className="w-full">Configure</Button>
              </div>
            </Link>

            {/* Social Widget */}
            <Link href="/social">
              <div className="glass-card p-6 hover:border-purple-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Social Widget</h3>
                <p className="text-sm text-white/60 mb-4">Follow goals, Discord, Twitter, Telegram</p>
                <Button size="sm" className="w-full">Configure</Button>
              </div>
            </Link>

            {/* Ads Widget */}
            <Link href="/ads">
              <div className="glass-card p-6 hover:border-purple-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Ads Widget</h3>
                <p className="text-sm text-white/60 mb-4">Sponsored banners and monetization</p>
                <Button size="sm" className="w-full">Configure</Button>
              </div>
            </Link>
          </div>

          {/* TODO: Add widget customization interface */}
          {/* TODO: Implement widget URL generator */}
        </div>

        {/* Campaigns & Launches */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Campaign */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white">Create Campaign</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Launch clipping campaigns, bounties, or paid promotions. Set budgets and track ROI.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Set CPM rates or bounties
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Choose platforms (YouTube, X, TikTok)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Track submissions & payouts
              </li>
            </ul>
            <Button className="w-full">Create Campaign</Button>

            {/* TODO: Add campaign creation form */}
            {/* TODO: Connect to Supabase for campaign storage */}
          </div>

          {/* Token Launch */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white">Token Launch</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Launch your own token with built-in widgets, campaigns, and community features.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                Token creation wizard
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                Integrated marketing tools
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                Community engagement features
              </li>
            </ul>
            <Button className="w-full">Start Launch</Button>

            {/* TODO: Add token launch wizard */}
            {/* TODO: Integrate with blockchain SDKs */}
          </div>
        </div>

        {/* Rewards & Payouts */}
        <div className="glass-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Gift className="w-6 h-6 text-green-400" />
                Rewards & Payouts
              </h2>
              <p className="text-white/60">
                Manage your earnings, claim rewards, and track payouts.
              </p>
            </div>
            <Link href="/earnings">
              <Button variant="outline">View Earnings</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Pending</div>
              <div className="text-xl font-bold text-yellow-400">$234.50</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Claimable</div>
              <div className="text-xl font-bold text-green-400">$567.80</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Total Earned</div>
              <div className="text-xl font-bold text-white">$12,430</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Points</div>
              <div className="text-xl font-bold text-purple-400">1,840</div>
            </div>
          </div>

          {/* TODO: Add claim functionality */}
          {/* TODO: Connect to wallet for USDC payouts */}
          {/* TODO: Implement points redemption system */}
        </div>
      </div>
    </div>
  );
}
