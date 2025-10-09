'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, TrendingUp, Users, Clock, ChevronRight,
  ArrowRight, Sparkles, Target, DollarSign
} from 'lucide-react';
import { GlassCard, PremiumButton } from '@/components/design-system/DesignSystemShowcase';

// Earnings Counter Component
const EarningsCounter = ({ amount }: { amount: number }) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = amount;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayAmount(end);
        clearInterval(timer);
      } else {
        setDisplayAmount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [amount]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-green-500/30 transition-all">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-5 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg"
          >
            <DollarSign className="w-6 h-6 text-white" />
          </motion.div>

          {/* Amount */}
          <div className="text-4xl font-bold bg-gradient-to-br from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            ${displayAmount.toLocaleString()}
          </div>

          <div className="text-sm text-zinc-400 mb-3">Total Earnings</div>

          {/* Trend indicator */}
          <div className="flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 w-fit">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.5%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Bounty Card Component
const BountyCard = ({
  title,
  description,
  reward,
  deadline,
  participants,
  progress,
  gradient
}: {
  title: string;
  description: string;
  reward: number;
  deadline: string;
  participants: number;
  progress: number;
  gradient: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative group cursor-pointer"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
        style={{ background: gradient }}
      />

      <GlassCard className="relative p-5 h-full">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: gradient }}
          >
            <Gift className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-green-300 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{description}</p>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{deadline}</span>
              </div>
              <div className="h-3 w-px bg-zinc-700" />
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{participants} joined</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: gradient }}
                />
              </div>
              <span className="text-xs text-green-400 font-bold">{progress}%</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-400">
                ${reward.toLocaleString()}
              </div>
              <PremiumButton variant="secondary" className="text-xs px-3 py-1.5">
                Join Now
              </PremiumButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Referral Loop Component
const ReferralLoop = () => {
  const referrals = [
    { name: '@alex_crypto', avatar: 'A', earnings: 125 },
    { name: '@sarah_dev', avatar: 'S', earnings: 250 },
    { name: '@mike_trader', avatar: 'M', earnings: 180 },
    { name: '@emma_nft', avatar: 'E', earnings: 320 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-green-400" />
          <h3 className="font-bold text-white">Your Referral Network</h3>
        </div>

        {/* Horizontal scroll */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {referrals.map((referral, index) => (
            <React.Fragment key={index}>
              {/* User bubble */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {referral.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">✓</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-400">{referral.name}</div>
                  <div className="text-xs font-bold text-green-400">+${referral.earnings}</div>
                </div>
              </motion.div>

              {/* Arrow */}
              {index < referrals.length - 1 && (
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-5 h-5 text-zinc-600" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        <PremiumButton variant="ghost" className="w-full mt-4 text-sm">
          Invite More Friends <ArrowRight className="w-4 h-4 ml-2" />
        </PremiumButton>
      </GlassCard>
    </motion.div>
  );
};

// Main EARN Section
export const EarnSection = () => {
  const bounties = [
    {
      title: 'Create 5 Viral Meme Videos',
      description: 'Submit your best meme content using our templates. Top submissions win big!',
      reward: 500,
      deadline: 'Ends in 2 days',
      participants: 34,
      progress: 68,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
      title: 'Stream 10 Hours This Week',
      description: 'Go live and engage with your community. Consistency pays off!',
      reward: 250,
      deadline: 'Ends in 5 days',
      participants: 18,
      progress: 42,
      gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    },
    {
      title: 'Refer 3 Active Traders',
      description: 'Invite friends who complete at least 5 trades to earn rewards.',
      reward: 750,
      deadline: 'Ends in 7 days',
      participants: 52,
      progress: 85,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
            >
              <Target className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              EARN
            </h2>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Turn engagement into earnings through bounties, referrals, and campaigns
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <EarningsCounter amount={2847} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-emerald-500/30 transition-all">
              <div className="text-4xl font-bold text-emerald-400 mb-2">12</div>
              <div className="text-sm text-zinc-400">Active Bounties</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/20 to-teal-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-green-500/30 transition-all">
              <div className="text-4xl font-bold text-green-400 mb-2">47</div>
              <div className="text-sm text-zinc-400">Referrals</div>
            </div>
          </motion.div>
        </div>

        {/* Bounty Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {bounties.map((bounty, index) => (
            <BountyCard key={index} {...bounty} />
          ))}
        </div>

        {/* Referral Loop */}
        <ReferralLoop />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <PremiumButton variant="primary" className="px-8 py-3">
            View All Opportunities <ArrowRight className="w-5 h-5 ml-2" />
          </PremiumButton>
        </motion.div>
      </div>
    </section>
  );
};
