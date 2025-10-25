/**
 * Notification Settings Page
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, Mail, Smartphone, Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/blast/useNotificationPreferences'
import type { NotificationType } from '@/lib/appwrite/services/blast-notifications'

const NOTIFICATION_TYPES: { type: NotificationType; label: string; description: string }[] = [
  {
    type: 'application_accepted',
    label: 'Application Accepted',
    description: 'When your application to a room is accepted',
  },
  {
    type: 'application_rejected',
    label: 'Application Rejected',
    description: 'When your application to a room is not accepted',
  },
  {
    type: 'dm_request_received',
    label: 'DM Request Received',
    description: 'When someone sends you a DM request',
  },
  {
    type: 'dm_request_accepted',
    label: 'DM Request Accepted',
    description: 'When someone accepts your DM request',
  },
  {
    type: 'dm_request_declined',
    label: 'DM Request Declined',
    description: 'When someone declines your DM request',
  },
  {
    type: 'new_applicant',
    label: 'New Applicant',
    description: 'When someone applies to your room',
  },
  {
    type: 'room_closing_soon',
    label: 'Room Closing Soon',
    description: 'When your room is about to close',
  },
  {
    type: 'room_hot',
    label: 'Room is Hot',
    description: 'When your room starts trending',
  },
  {
    type: 'refund_processed',
    label: 'Refund Processed',
    description: 'When a refund is processed for you',
  },
  {
    type: 'match_found',
    label: 'Perfect Match Found',
    description: 'When AI finds a room that matches your profile',
  },
]

export default function NotificationSettingsPage() {
  const router = useRouter()
  const { data: preferences, isLoading } = useNotificationPreferences()
  const updateMutation = useUpdateNotificationPreferences()

  const [localPrefs, setLocalPrefs] = useState({
    inApp: preferences?.inApp ?? true,
    email: preferences?.email ?? false,
    push: preferences?.push ?? false,
    types: preferences?.types ?? {},
  })

  // Update local state when preferences load
  useState(() => {
    if (preferences) {
      setLocalPrefs({
        inApp: preferences.inApp,
        email: preferences.email,
        push: preferences.push,
        types: preferences.types,
      })
    }
  })

  const handleToggleType = (type: NotificationType) => {
    setLocalPrefs(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !(prev.types[type] ?? true),
      },
    }))
  }

  const handleSave = () => {
    updateMutation.mutate(localPrefs)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-btdemo-canvas flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00FF88]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-btdemo-canvas">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/BLAST')}
              className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl font-black text-white">Notification Settings</h1>
              <p className="text-sm text-zinc-400">Manage your notification preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Delivery Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="btdemo-glass rounded-xl p-6 border border-zinc-800"
        >
          <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#00FF88]" />
            Delivery Methods
          </h2>

          <div className="space-y-4">
            {/* In-App */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#00FF88]" />
                <div>
                  <div className="font-bold text-white">In-App Notifications</div>
                  <div className="text-sm text-zinc-400">
                    Show notifications in the app
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.inApp}
                  onChange={e =>
                    setLocalPrefs(prev => ({ ...prev, inApp: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF88]"></div>
              </label>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-bold text-white">Email Notifications</div>
                  <div className="text-sm text-zinc-400">Receive emails for important updates</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.email}
                  onChange={e =>
                    setLocalPrefs(prev => ({ ...prev, email: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF88]"></div>
              </label>
            </div>

            {/* Push */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-bold text-white">Push Notifications</div>
                  <div className="text-sm text-zinc-400">Get instant alerts on your device</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.push}
                  onChange={e =>
                    setLocalPrefs(prev => ({ ...prev, push: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF88]"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Notification Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="btdemo-glass rounded-xl p-6 border border-zinc-800"
        >
          <h2 className="text-lg font-black text-white mb-4">Notification Types</h2>

          <div className="space-y-3">
            {NOTIFICATION_TYPES.map(({ type, label, description }) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800"
              >
                <div>
                  <div className="font-bold text-white text-sm">{label}</div>
                  <div className="text-xs text-zinc-400">{description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.types[type] ?? true}
                    onChange={() => handleToggleType(type)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF88]"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full btdemo-btn-glow py-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
