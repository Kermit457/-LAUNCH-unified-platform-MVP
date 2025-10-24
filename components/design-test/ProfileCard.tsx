'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MessageCircle, Eye, Users } from 'lucide-react';
import { PremiumButton } from '../design-system/DesignSystemShowcase';
import { Tag } from './Tag';

export interface Profile {
  id: string;
  name: string;
  handle: string;
  roles: string[];
  mutuals: number;
  followers: number;
}

interface ProfileCardProps {
  profile: Profile;
  onInvite?: (id: string) => void;
  onMessage?: (id: string) => void;
  onView?: (id: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onInvite,
  onMessage,
  onView,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-lime-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-violet-500/30 transition-all">
        {/* Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-lime-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors truncate">
              {profile.name}
            </h3>
            <p className="text-sm text-zinc-400 truncate">@{profile.handle}</p>
          </div>
        </div>

        {/* Roles */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.roles.map((role) => (
            <Tag key={role} variant="default" size="sm">
              {role}
            </Tag>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{profile.mutuals} mutual</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{(profile.followers / 1000).toFixed(1)}K</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <PremiumButton
            variant="secondary"
            className="flex-1 text-sm py-2"
            onClick={() => onInvite?.(profile.id)}
            aria-label={`Invite ${profile.name}`}
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </PremiumButton>
          <button
            onClick={() => onMessage?.(profile.id)}
            className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-violet-500/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            aria-label={`Message ${profile.name}`}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView?.(profile.id)}
            className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-violet-500/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            aria-label={`View ${profile.name}'s profile`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
