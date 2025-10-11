/**
 * LaunchOS Design System - Type Definitions
 */

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

// Glass Card
export interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

// Premium Button
export interface PremiumButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

// Floating Tab Bar
export interface FloatingTabBarProps {
  items: {
    icon: LucideIcon
    label: string
  }[]
  activeIndex: number
  onChange: (index: number) => void
}

// Sheet Modal
export interface SheetModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

// Stories Viewer
export interface StoriesViewerProps {
  stories: {
    id: string
    user: string
    avatar: string
    content: string
    timestamp: string
  }[]
  isOpen: boolean
  onClose: () => void
}

// Floating Action Button
export interface FloatingActionButtonProps {
  icon: LucideIcon
  actions: {
    icon: LucideIcon
    label: string
    onClick: () => void
  }[]
}

// Interactive List Item
export interface InteractiveListItemProps {
  title: string
  subtitle?: string
  avatar?: ReactNode
  badge?: number
  trailing?: ReactNode
  onClick?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

// Segmented Control
export interface SegmentedControlProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}
