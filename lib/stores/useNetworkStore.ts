import { create } from 'zustand'
import type { Invite, Connection, Thread, Message } from '@/lib/types'
import { mockInvites, mockConnections, mockThreads, mockMessages } from '@/lib/mockNetworkData'

interface NetworkStore {
  invites: Invite[]
  connections: Connection[]
  threads: Thread[]
  messages: Message[]
  activeThreadId: string | null

  // Computed counts
  getPendingInvitesCount: () => number
  getUnreadDMsCount: () => number
  getThreadMessages: (threadId: string) => Message[]
  getThreadById: (threadId: string) => Thread | undefined

  // Invites actions
  setInvites: (invites: Invite[]) => void
  acceptInvite: (id: string) => void
  declineInvite: (id: string) => void

  // Connections actions
  setConnections: (connections: Connection[]) => void
  pinConnection: (userId: string) => void
  muteConnection: (userId: string) => void
  removeConnection: (userId: string) => void

  // Threads actions
  setThreads: (threads: Thread[]) => void
  addThread: (thread: Thread) => void
  setActiveThread: (threadId: string | null) => void

  // Messages actions
  addMessage: (message: Message) => void
  markThreadAsRead: (threadId: string) => void
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  invites: mockInvites,
  connections: mockConnections,
  threads: mockThreads,
  messages: mockMessages,
  activeThreadId: null,

  getPendingInvitesCount: () => {
    return get().invites.filter(inv => inv.status === 'pending').length
  },

  getUnreadDMsCount: () => {
    return get().threads.reduce((sum, t) => sum + t.unread, 0)
  },

  getThreadMessages: (threadId: string) => {
    return get().messages.filter(msg => msg.threadId === threadId).sort((a, b) => a.sentAt - b.sentAt)
  },

  getThreadById: (threadId: string) => {
    return get().threads.find(t => t.id === threadId)
  },

  setInvites: (invites) => set({ invites }),

  acceptInvite: (id) => set((state) => ({
    invites: state.invites.map(inv =>
      inv.id === id ? { ...inv, status: 'accepted' as const } : inv
    )
  })),

  declineInvite: (id) => set((state) => ({
    invites: state.invites.map(inv =>
      inv.id === id ? { ...inv, status: 'declined' as const } : inv
    )
  })),

  setConnections: (connections) => set({ connections }),

  pinConnection: (userId) => set((state) => ({
    connections: state.connections.map(conn =>
      conn.userId === userId ? { ...conn, pinned: !conn.pinned } : conn
    )
  })),

  muteConnection: (userId) => set((state) => ({
    connections: state.connections.map(conn =>
      conn.userId === userId ? { ...conn, muted: !conn.muted } : conn
    )
  })),

  removeConnection: (userId) => set((state) => ({
    connections: state.connections.filter(conn => conn.userId !== userId)
  })),

  setThreads: (threads) => set({ threads }),

  addThread: (thread) => set((state) => ({
    threads: [thread, ...state.threads]
  })),

  setActiveThread: (threadId) => set({ activeThreadId: threadId }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
    threads: state.threads.map(t =>
      t.id === message.threadId
        ? { ...t, lastMsgAt: message.sentAt }
        : t
    )
  })),

  markThreadAsRead: (threadId) => set((state) => ({
    threads: state.threads.map(t =>
      t.id === threadId ? { ...t, unread: 0 } : t
    )
  })),
}))