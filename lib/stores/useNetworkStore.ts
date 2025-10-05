import { create } from 'zustand'
import type { Invite, Connection, Thread } from '@/lib/types'
import { mockInvites, mockConnections, mockThreads } from '@/lib/mockNetworkData'

interface NetworkStore {
  invites: Invite[]
  connections: Connection[]
  threads: Thread[]

  // Computed counts
  getPendingInvitesCount: () => number
  getUnreadDMsCount: () => number

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
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  invites: mockInvites,
  connections: mockConnections,
  threads: mockThreads,

  getPendingInvitesCount: () => {
    return get().invites.filter(inv => inv.status === 'pending').length
  },

  getUnreadDMsCount: () => {
    return get().threads.reduce((sum, t) => sum + t.unread, 0)
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
}))