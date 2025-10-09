'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BudgetBarProps {
  total: number;
  used: number;
  gradient?: string;
  showLabel?: boolean;
}

export const BudgetBar: React.FC<BudgetBarProps> = ({
  total,
  used,
  gradient = 'from-green-500 to-emerald-500',
  showLabel = true,
}) => {
  const percentage = Math.min((used / total) * 100, 100);
  const remaining = total - used;

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Budget remaining</span>
          <span className="font-semibold text-white">${remaining.toLocaleString()} / ${total.toLocaleString()}</span>
        </div>
      )}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
        />
      </div>
    </div>
  );
};
