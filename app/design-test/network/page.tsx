'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, MessageCircle,
  Heart, Share2, MessageSquare, Activity, Filter
} from 'lucide-react';
import { ProfileCard, Profile } from '@/components/design-test/ProfileCard';

// Mock Data
const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    handle: 'sarah_crypto',
    roles: ['Clipper', 'Trader'],
    mutuals: 12,
    followers: 45200,
  },
  {
    id: '2',
    name: 'Mike Rivers',
    handle: 'mike_streams',
    roles: ['Streamer', 'Creator'],
    mutuals: 8,
    followers: 128400,
  },
  {
    id: '3',
    name: 'Emma Davis',
    handle: 'emma_dev',
    roles: ['Developer', 'Designer'],
    mutuals: 15,
    followers: 23100,
  },
  {
    id: '4',
    name: 'Alex Turner',
    handle: 'alex_memes',
    roles: ['Memer', 'Creator'],
    mutuals: 5,
    followers: 67800,
  },
  {
    id: '5',
    name: 'Lisa Wang',
    handle: 'lisa_trader',
    roles: ['Trader', 'Analyst'],
    mutuals: 20,
    followers: 92300,
  },
  {
    id: '6',
    name: 'John Smith',
    handle: 'john_clips',
    roles: ['Clipper', 'Editor'],
    mutuals: 3,
    followers: 15600,
  },
];

interface NetworkActivity {
  id: string;
  user: string;
  action: string;
  subtitle: string;
  time: string;
  icon: 'join' | 'like' | 'share' | 'comment';
  badge?: number;
}

const mockActivities: NetworkActivity[] = [
  {
    id: '1',
    user: '@sarah_crypto',
    action: 'joined your network',
    subtitle: '2 mutual connections',
    time: '2m ago',
    icon: 'join',
    badge: 1,
  },
  {
    id: '2',
    user: '@mike_trader',
    action: 'liked your launch',
    subtitle: 'Meme Competition Campaign',
    time: '5m ago',
    icon: 'like',
  },
  {
    id: '3',
    user: '@emma_nft',
    action: 'shared your stream',
    subtitle: '12 new viewers joined',
    time: '15m ago',
    icon: 'share',
    badge: 3,
  },
  {
    id: '4',
    user: '@alex_dev',
    action: 'commented',
    subtitle: 'Great work on the new feature!',
    time: '1h ago',
    icon: 'comment',
  },
];

// Connection Graph Component
const ConnectionGraph = () => {
  const connections = [
    { x: 30, y: 25, label: 'A', color: 'from-violet-400 to-purple-400' },
    { x: 70, y: 25, label: 'S', color: 'from-fuchsia-400 to-pink-400' },
    { x: 20, y: 50, label: 'M', color: 'from-purple-400 to-violet-400' },
    { x: 50, y: 40, label: 'YOU', color: 'from-violet-500 to-fuchsia-500', isCenter: true },
    { x: 80, y: 50, label: 'E', color: 'from-pink-400 to-rose-400' },
    { x: 35, y: 75, label: 'J', color: 'from-indigo-400 to-violet-400' },
    { x: 65, y: 75, label: 'L', color: 'from-fuchsia-400 to-violet-400' },
  ];

  const centerNode = connections.find(c => c.isCenter)!;

  return (
    <div className="relative h-full min-h-[400px] rounded-3xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 backdrop-blur-xl border border-zinc-800 overflow-hidden group">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-5 bg-gradient-to-br from-violet-500 to-fuchsia-500"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* SVG Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {connections.filter(c => !c.isCenter).map((conn, index) => (
          <motion.line
            key={`line-${index}`}
            x1={`${centerNode.x}%`}
            y1={`${centerNode.y}%`}
            x2={`${conn.x}%`}
            y2={`${conn.y}%`}
            stroke="url(#line-gradient)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
        ))}
      </svg>

      {/* Connection Nodes */}
      {connections.map((conn, index) => (
        <motion.div
          key={`node-${index}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: conn.isCenter ? 1.1 : 1.3, zIndex: 10 }}
          className="absolute cursor-pointer"
          style={{
            left: `${conn.x}%`,
            top: `${conn.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`${conn.isCenter ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-gradient-to-br ${conn.color} flex items-center justify-center shadow-lg border-2 border-zinc-900 relative`}>
            {conn.isCenter && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-50 blur-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <span className={`${conn.isCenter ? 'text-xs' : 'text-sm'} text-white font-bold relative z-10`}>
              {conn.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Hover instruction */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span className="text-xs text-zinc-500 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800">
          Hover nodes to explore connections
        </span>
      </div>
    </div>
  );
};

// Activity Feed Component
const ActivityFeed = ({ activities }: { activities: NetworkActivity[] }) => {
  const iconMap = {
    join: <UserPlus className="w-5 h-5 text-violet-400" />,
    like: <Heart className="w-5 h-5 text-pink-400" />,
    share: <Share2 className="w-5 h-5 text-blue-400" />,
    comment: <MessageSquare className="w-5 h-5 text-cyan-400" />,
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ x: 4 }}
          className="relative group cursor-pointer"
        >
          <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 group-hover:border-violet-500/30 transition-all">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                {iconMap[activity.icon]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-violet-400 text-sm">{activity.user}</span>
                  <span className="text-sm text-white">{activity.action}</span>
                  {activity.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-[10px] text-white font-bold">
                      {activity.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">{activity.subtitle}</p>
              </div>

              {/* Time */}
              <span className="text-xs text-zinc-600 flex-shrink-0">{activity.time}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function NetworkPage() {
  const [activeTab, setActiveTab] = React.useState<'discover' | 'invites' | 'connections'>('discover');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Grid: Graph + Stats */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
            {/* Connection Graph */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <ConnectionGraph />
              </motion.div>

              {/* Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800"
              >
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'discover'
                      ? 'bg-violet-500 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Discover
                </button>
                <button
                  onClick={() => setActiveTab('invites')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'invites'
                      ? 'bg-violet-500 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Invites
                </button>
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'connections'
                      ? 'bg-violet-500 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Connections
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-400">0</span>
                </button>
              </motion.div>
            </div>

            {/* Stats Boxes - 2x3 Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Connections */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-violet-500/30 transition-all">
                  <div className="text-4xl font-bold bg-gradient-to-br from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    342
                  </div>
                  <div className="text-xs text-zinc-400">Connections</div>
                </div>
              </motion.div>

              {/* Mutual */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-fuchsia-500/30 transition-all">
                  <div className="text-4xl font-bold bg-gradient-to-br from-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    42
                  </div>
                  <div className="text-xs text-zinc-400">Mutual</div>
                </div>
              </motion.div>

              {/* Messages */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-cyan-500/30 transition-all">
                  <div className="text-4xl font-bold bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    7
                  </div>
                  <div className="text-xs text-zinc-400">Messages</div>
                </div>
              </motion.div>

              {/* Invites */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-green-500/30 transition-all">
                  <div className="text-4xl font-bold bg-gradient-to-br from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    12
                  </div>
                  <div className="text-xs text-zinc-400">Invites</div>
                </div>
              </motion.div>

              {/* Collaborations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-orange-500/30 transition-all">
                  <div className="text-4xl font-bold bg-gradient-to-br from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
                    8
                  </div>
                  <div className="text-xs text-zinc-400">Collaborations</div>
                </div>
              </motion.div>

              {/* Chat Grps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-blue-500/30 transition-all">
                  <div className="text-4xl font-bold bg-gradient-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                    5
                  </div>
                  <div className="text-xs text-zinc-400">Chat Grps</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Cards Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Recommended for You</h2>
              <p className="text-zinc-400 text-sm">{mockProfiles.length} profiles with mutual connections</p>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-violet-500/50 text-zinc-300 hover:text-white transition-all">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">All Roles</span>
              </button>
            </div>
          </div>

          {/* Profile Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {mockProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProfileCard
                  profile={profile}
                  onInvite={(id) => console.log('Invite:', id)}
                  onMessage={(id) => console.log('Message:', id)}
                  onView={(id) => console.log('View:', id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Network Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                <h2 className="text-2xl font-bold text-white">Network Activity</h2>
              </div>
              <button className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors">
                View All
              </button>
            </div>
            <ActivityFeed activities={mockActivities} />
          </motion.div>
        </div>
      </section>

      {/* DM Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          className="relative group"
          onClick={() => console.log('Open messages')}
          aria-label="Open messages"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          {/* Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 border-2 border-black flex items-center justify-center">
            <span className="text-xs font-bold text-white">3</span>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
