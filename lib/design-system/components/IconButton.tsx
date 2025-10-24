/**
 * BTDEMO IconButton Component
 *
 * Square icon-only buttons for navigation and actions.
 * Based on user specs: 68x68px desktop (scales to 56x56px mobile),
 * border-radius 20px, backdrop-blur 2px.
 *
 * Used in bottom navigation, close buttons, expand/collapse actions.
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, focusRing, transition } from '../utils'
import { Loader2 } from 'lucide-react'

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'flex-shrink-0',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    transition(),
    focusRing(),
  ],
  {
    variants: {
      variant: {
        // Default - Translucent background (nav buttons from user spec)
        default: [
          'bg-btdemo-card',
          'text-btdemo-text',
          'border border-btdemo',
          'backdrop-blur-btdemo-sm',
          'hover:bg-btdemo-card-hover',
          'hover:border-btdemo-border-active',
        ],

        // Ghost - No background, appears on hover
        ghost: [
          'bg-transparent',
          'text-btdemo-text',
          'hover:bg-btdemo-card',
          'hover:backdrop-blur-btdemo-sm',
        ],

        // Primary - Lime gradient background
        primary: [
          'bg-gradient-btdemo-primary',
          'text-btdemo-canvas',
          'shadow-btdemo-inset',
          'hover:shadow-btdemo-glow',
          'active:scale-[0.98]',
        ],

        // Outline - Border only
        outline: [
          'bg-transparent',
          'text-btdemo-text',
          'border border-btdemo',
          'hover:bg-btdemo-card',
          'hover:backdrop-blur-btdemo-sm',
        ],
      },

      size: {
        // Extra small - 32px (compact UI)
        xs: 'h-8 w-8',

        // Small - 36px
        sm: 'h-9 w-9',

        // Medium - 44px (WCAG minimum)
        md: 'h-11 w-11',

        // Large - 56px (mobile nav from user spec)
        lg: 'h-14 w-14',

        // Extra large - 68px desktop, 56px mobile (nav spec)
        xl: 'h-[68px] w-[68px] sm:h-14 sm:w-14',
      },

      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-btdemo-md', // 15px
        lg: 'rounded-btdemo-lg', // 20px from user spec
        full: 'rounded-full',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'xl',
      radius: 'lg',
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /**
   * Icon to display (from lucide-react or custom icons)
   */
  icon: React.ReactNode

  /**
   * If true, shows loading spinner
   */
  isLoading?: boolean

  /**
   * Active state (for navigation)
   */
  isActive?: boolean

  /**
   * Badge count (for notifications)
   */
  badgeCount?: number

  /**
   * Badge position
   */
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

  /**
   * Accessible label (REQUIRED for icon-only buttons)
   */
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      icon,
      isLoading,
      isActive,
      badgeCount,
      badgePosition = 'top-right',
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Icon size mapping
    const iconSize = size === 'xs' ? 14
      : size === 'sm' ? 16
      : size === 'md' ? 20
      : size === 'lg' || size === 'xl' ? 24
      : 20

    // Badge position classes
    const badgePositionClass = badgePosition === 'top-right' ? 'top-0 right-0'
      : badgePosition === 'top-left' ? 'top-0 left-0'
      : badgePosition === 'bottom-right' ? 'bottom-0 right-0'
      : 'bottom-0 left-0'

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        data-active={isActive}
        aria-label={ariaLabel}
        className={cn(
          iconButtonVariants({ variant, size, radius }),
          isActive && 'border-btdemo-border-active shadow-btdemo-glow',
          'relative', // For badge positioning
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading ? (
          <Loader2
            className="animate-spin"
            size={iconSize}
            aria-hidden="true"
          />
        ) : (
          // Icon
          <span
            className="flex items-center justify-center"
            aria-hidden="true"
            style={{
              width: iconSize,
              height: iconSize,
            }}
          >
            {icon}
          </span>
        )}

        {/* Badge (notification count) */}
        {badgeCount !== undefined && badgeCount > 0 && (
          <span
            className={cn(
              'absolute',
              badgePositionClass,
              'translate-x-1/4 -translate-y-1/4',
              'flex items-center justify-center',
              'min-w-[20px] h-5 px-1.5',
              'bg-accent-red',
              'text-btdemo-text text-xs font-bold',
              'rounded-full',
              'border-2 border-btdemo-canvas',
              'pointer-events-none'
            )}
            aria-label={`${badgeCount} notifications`}
          >
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
