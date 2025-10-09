'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import { PremiumButton } from '../design-system/DesignSystemShowcase';

export interface Prediction {
  id: string;
  question: string;
  yesPct: number;
  endsAt: string; // ISO date string
}

interface PredictionCardProps {
  prediction: Prediction;
  onVote?: (id: string, vote: 'yes' | 'no') => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onVote }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const end = new Date(prediction.endsAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [prediction.endsAt]);

  const noPct = 100 - prediction.yesPct;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative group min-w-[300px]"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-amber-500/30 transition-all">
        {/* Question */}
        <div className="mb-4">
          <h4 className="font-bold text-white text-lg mb-2">{prediction.question}</h4>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Ends in {timeLeft}</span>
          </div>
        </div>

        {/* Odds Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-green-400">YES {prediction.yesPct}%</span>
            <span className="text-red-400">NO {noPct}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prediction.yesPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-green-500 to-emerald-500"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${noPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-red-500 to-rose-500"
            />
          </div>
        </div>

        {/* Vote Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <PremiumButton
            variant="secondary"
            className="text-sm py-2 bg-green-500/10 border-green-500/20 hover:border-green-500/40 text-green-400"
            onClick={() => onVote?.(prediction.id, 'yes')}
            aria-label={`Vote YES on: ${prediction.question}`}
          >
            <TrendingUp className="w-4 h-4" />
            Vote YES
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            className="text-sm py-2 bg-red-500/10 border-red-500/20 hover:border-red-500/40 text-red-400"
            onClick={() => onVote?.(prediction.id, 'no')}
            aria-label={`Vote NO on: ${prediction.question}`}
          >
            Vote NO
          </PremiumButton>
        </div>
      </div>
    </motion.div>
  );
};
