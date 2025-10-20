'use client';

import React from 'react';
import { Radio, Users, Eye, Clock } from 'lucide-react';
import { GlassCard } from '@/components/design-system';

// Simple placeholder for LIVE section
export const LiveSection = () => {
  const liveEvents = [
    {
      id: 1,
      title: 'Launch Stream: ICM.RUN',
      host: 'CryptoMike',
      viewers: 1234,
      status: 'LIVE',
      thumbnail: '🎥',
    },
    {
      id: 2,
      title: 'Trading Alpha Call',
      host: 'TraderJoe',
      viewers: 892,
      status: 'LIVE',
      thumbnail: '📊',
    },
    {
      id: 3,
      title: 'Community AMA',
      host: 'LaunchOS',
      viewers: 2341,
      status: 'LIVE',
      thumbnail: '🎤',
    },
  ];

  return (
    <div className="space-y-4">
      {liveEvents.map((event) => (
        <GlassCard key={event.id} className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{event.thumbnail}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                  {event.status}
                </span>
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
              <h3 className="font-bold text-white">{event.title}</h3>
              <p className="text-sm text-white/60">by {event.host}</p>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Eye className="w-4 h-4" />
              <span className="text-sm" suppressHydrationWarning>{event.viewers.toLocaleString()}</span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
