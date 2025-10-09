'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Eye, Send, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/design-system/DesignSystemShowcase';
import { Tag } from '@/components/design-test/Tag';

// Types matching the backend structure
interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  category: string;
  thumbnail?: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

interface TrendingClip {
  id: string;
  title: string;
  creator: string;
  views: number;
  thumbnail?: string;
}

// Hero section with featured stream + live chat
const FeaturedStream = ({ stream, messages, onlineCount }: {
  stream: LiveStream;
  messages: ChatMessage[];
  onlineCount: number;
}) => {
  const [chatMessage, setChatMessage] = useState('');

  return (
    <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center relative">
              <Radio className="w-6 h-6 text-white" />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">LIVE</h1>
          </div>
          <p className="text-zinc-400">
            Stream, clip, and earn in real-time • Your audience is waiting
          </p>
        </motion.div>

        {/* Featured Stream Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-0 overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_380px]">
              {/* Stream Player */}
              <div className="relative aspect-video lg:aspect-auto bg-zinc-900">
                {/* LIVE Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-md">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">LIVE</span>
                  </div>
                </div>

                {/* Stream Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{stream.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-red-400" />
                      <span className="font-semibold">{stream.viewers}</span>
                    </div>
                    <span>•</span>
                    <span>{stream.streamer}</span>
                  </div>
                </div>

                {/* Play Button (center) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-2xl hover:bg-red-600 transition-colors"
                    aria-label="Play stream"
                  >
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                  </motion.button>
                </div>
              </div>

              {/* Live Chat Sidebar */}
              <div className="bg-zinc-900/60 backdrop-blur-xl flex flex-col max-h-[500px]">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Live Chat</span>
                  </div>
                  <span className="text-xs text-zinc-500">{onlineCount} online</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                        {msg.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-semibold text-violet-400 truncate">{msg.user}</span>
                          <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm text-zinc-300 break-words">{msg.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Send a message..."
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && chatMessage.trim()) {
                          console.log('Send message:', chatMessage);
                          setChatMessage('');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (chatMessage.trim()) {
                          console.log('Send message:', chatMessage);
                          setChatMessage('');
                        }
                      }}
                      className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

// Active Streams Grid
const ActiveStreamsSection = ({ streams }: { streams: LiveStream[] }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Active Streams</h2>
          </div>
          <button className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
            View All →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-red-500/30 transition-all">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-red-900/20 via-zinc-900 to-orange-900/20">
                  {/* LIVE Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500 rounded-md">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                      />
                      <span className="text-[10px] font-bold text-white">LIVE</span>
                    </div>
                  </div>

                  {/* Viewers */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded-md flex items-center gap-1">
                    <Eye className="w-3 h-3 text-red-400" />
                    <span className="text-xs font-bold text-white">{stream.viewers}</span>
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-2 left-2">
                    <Tag variant="default" size="sm">
                      {stream.category}
                    </Tag>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-red-300 transition-colors">
                    {stream.title}
                  </h3>
                  <p className="text-xs text-zinc-500">{stream.streamer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trending Clips Gallery
const TrendingClipsSection = ({ clips }: { clips: TrendingClip[] }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Trending Clips</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {clips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-amber-500/30 transition-all">
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] bg-gradient-to-br from-amber-900/20 via-zinc-900 to-orange-900/20">
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"
                    >
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1" />
                    </motion.div>
                  </div>

                  {/* Views badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded-md flex items-center gap-1">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">
                      {clip.views > 1000 ? `${(clip.views / 1000).toFixed(0)}K` : clip.views}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2">
                  <h4 className="font-semibold text-white text-xs mb-0.5 line-clamp-2">{clip.title}</h4>
                  <p className="text-[10px] text-zinc-500">{clip.creator}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Page Component
export default function LivePage() {
  // Mock data - replace with API calls
  const [featuredStream] = useState<LiveStream>({
    id: '1',
    title: 'Trading Session: Meme Coins Only 🚀',
    streamer: '@crypto_king',
    viewers: 1247,
    category: 'Trading',
  });

  const [chatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'sarah_dev', message: 'This setup is fire! 🔥', timestamp: '1s' },
    { id: '2', user: 'mike_trader', message: 'What coin are you trading rn?', timestamp: '3s' },
    { id: '3', user: 'alex_nft', message: 'Love the energy! Keep it up', timestamp: '5s' },
    { id: '4', user: 'emma_crypto', message: 'Just joined! What did I miss?', timestamp: '8s' },
  ]);

  const [activeStreams] = useState<LiveStream[]>([
    { id: '2', title: 'NFT Art Showcase 🎨', streamer: '@artist_mike', viewers: 342, category: 'Art' },
    { id: '3', title: 'Solana Dev Tutorial', streamer: '@code_sarah', viewers: 189, category: 'Development' },
    { id: '4', title: 'Meme Coin Trading', streamer: '@trader_alex', viewers: 521, category: 'Trading' },
  ]);

  const [trendingClips] = useState<TrendingClip[]>([
    { id: '1', title: 'Epic Trading Win! 💎', creator: '@crypto_king', views: 1200 },
    { id: '2', title: 'NFT Reveal Reaction', creator: '@nft_collector', views: 850 },
    { id: '3', title: 'Coding Speedrun', creator: '@dev_wizard', views: 640 },
    { id: '4', title: 'Meme Review Session', creator: '@meme_lord', views: 2100 },
  ]);

  // TODO: Replace with actual API calls
  useEffect(() => {
    // fetch('/api/streams/active').then(...)
    // fetch('/api/clips/trending').then(...)
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-500/20 rounded-full blur-[150px] pointer-events-none" />

      <FeaturedStream
        stream={featuredStream}
        messages={chatMessages}
        onlineCount={342}
      />

      <ActiveStreamsSection streams={activeStreams} />

      <TrendingClipsSection clips={trendingClips} />
    </div>
  );
}
