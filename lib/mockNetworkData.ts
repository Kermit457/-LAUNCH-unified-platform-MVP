import { Invite, Connection, Thread } from './types'

export const mockInvites: Invite[] = [
  {
    id: 'inv_1',
    fromUserId: 'user_whale',
    fromHandle: '@crypto_whale',
    mutuals: 8,
    role: 'contributor',
    offer: 'Campaign Collab',
    note: 'Hey! Love your content. Want to collaborate on our upcoming Solana NFT launch campaign?',
    sentAt: Date.now() - 2 * 60 * 60 * 1000,
    status: 'pending',
    priority: 0.82
  },
  {
    id: 'inv_2',
    fromUserId: 'user_builder',
    fromHandle: '@sol_builder',
    mutuals: 5,
    project: { id: 'proj_defi', name: 'DeFi Protocol' },
    role: 'reviewer',
    note: 'We need someone to review submissions for our DeFi campaign.',
    sentAt: Date.now() - 5 * 60 * 60 * 1000,
    status: 'pending',
    priority: 0.68
  },
  {
    id: 'inv_3',
    fromUserId: 'user_influencer',
    fromHandle: '@nft_influencer',
    mutuals: 12,
    offer: 'Raid Leader',
    note: 'Join us as a raid leader for the Solana Summer event!',
    sentAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    status: 'pending',
    priority: 0.75
  },
  {
    id: 'inv_4',
    fromUserId: 'user_dev',
    fromHandle: '@dev_anon',
    mutuals: 2,
    role: 'admin',
    project: { id: 'proj_tools', name: 'Launch Tools' },
    note: 'Looking for an admin to help manage our tools project.',
    sentAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: 'pending',
    priority: 0.45
  }
]

export const mockConnections: Connection[] = [
  {
    userId: 'user_1',
    handle: '@solana_builder',
    name: 'Solana Builder',
    roles: ['Contributor', 'Admin'],
    verified: true,
    mutuals: 15,
    lastActive: Date.now() - 2 * 60 * 1000,
    unread: 3,
    pinned: true
  },
  {
    userId: 'user_2',
    handle: '@content_creator',
    name: 'Content Creator',
    roles: ['Contributor'],
    verified: false,
    mutuals: 8,
    lastActive: Date.now() - 15 * 60 * 1000,
    unread: 0
  },
  {
    userId: 'user_3',
    handle: '@nft_artist',
    name: 'NFT Artist',
    roles: ['Viewer', 'Contributor'],
    verified: true,
    mutuals: 22,
    lastActive: Date.now() - 2 * 60 * 60 * 1000,
    unread: 1
  },
  {
    userId: 'user_4',
    handle: '@web3_influencer',
    name: 'Web3 Influencer',
    roles: ['Reviewer'],
    verified: true,
    mutuals: 45,
    lastActive: Date.now() - 30 * 60 * 1000,
    unread: 0,
    pinned: true
  },
  {
    userId: 'user_5',
    handle: '@defi_degen',
    name: 'DeFi Degen',
    roles: ['Contributor', 'Reviewer'],
    verified: false,
    mutuals: 6,
    lastActive: Date.now() - 5 * 60 * 60 * 1000,
    unread: 0
  }
]

export const mockThreads: Thread[] = [
  {
    id: 'thread_1',
    type: 'group',
    name: 'Solana Builders',
    projectId: 'proj_defi',
    participantUserIds: ['user_1', 'user_2', 'user_3'],
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    lastMsgAt: Date.now() - 30 * 60 * 1000,
    unread: 2,
    pinned: true
  },
  {
    id: 'thread_2',
    type: 'group',
    name: 'NFT Launch Team',
    campaignId: 'camp_1',
    participantUserIds: ['user_3', 'user_4', 'user_5'],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    lastMsgAt: Date.now() - 2 * 60 * 60 * 1000,
    unread: 0
  },
  {
    id: 'thread_3',
    type: 'dm',
    participantUserIds: ['user_1'],
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    lastMsgAt: Date.now() - 5 * 60 * 1000,
    unread: 3
  }
]
