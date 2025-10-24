/**
 * BTDEMO Button Component
 *
 * Comprehensive button system covering all 87 buttons found in the audit.
 * Includes 12 variants to handle every use case across the app.
 *
 * Based on:
 * - BUTTON_AUDIT_REPORT.md (87 buttons across 6 pages)
 * - BUTTON_DESIGN_SYSTEM.md (specifications)
 * - BUTTON_VISUAL_SPECS.md (visual mockups)
 * - User specs (167x64px Connect Wallet, lime gradient)
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, focusRing, transition } from '../utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  // Base styles (applied to all buttons)
  [
    'inline-flex items-center justify-center',
    'font-medium',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'whitespace-nowrap',
    transition(),
    focusRing(),
  ],
  {
    variants: {
      variant: {
        // 1. Primary - Lime gradient (Connect Wallet, Create, Launch)
        primary: [
          'bg-gradient-btdemo-primary',
          'text-btdemo-canvas',
          'shadow-btdemo-inset',
          'hover:shadow-btdemo-glow',
          'active:scale-[0.98]',
        ],

        // 2. Secondary - Solid background (Learn More, View Details)
        secondary: [
          'bg-btdemo-card',
          'text-btdemo-text',
          'border border-btdemo',
          'backdrop-blur-btdemo-sm',
          'hover:bg-btdemo-card-hover',
          'hover:border-btdemo-border-active',
        ],

        // 3. Ghost - Transparent (Cancel, secondary actions)
        ghost: [
          'bg-transparent',
          'text-btdemo-text',
          'hover:bg-btdemo-card',
          'hover:backdrop-blur-btdemo-sm',
        ],

        // 4. Tertiary/Link - Text-only (Learn more links)
        tertiary: [
          'bg-transparent',
          'text-btdemo-primary',
          'underline-offset-4',
          'hover:underline',
          'hover:text-btdemo-primary-hover',
        ],

        // 5. Filter Pill - Chip-style (Type filters, Sort filters)
        filter: [
          'bg-btdemo-card',
          'text-btdemo-text-muted',
          'border border-btdemo',
          'backdrop-blur-btdemo-md',
          'hover:text-btdemo-text',
          'hover:border-btdemo-border-active',
          'data-[active=true]:bg-btdemo-card-hover',
          'data-[active=true]:text-btdemo-primary',
          'data-[active=true]:border-btdemo-border-active',
          'data-[active=true]:shadow-btdemo-glow',
        ],

        // 6. Tab - Tab navigation (6-7 tabs in /clip, 4 tabs in /chat)
        tab: [
          'bg-transparent',
          'text-btdemo-text-muted',
          'border-b-2 border-transparent',
          'hover:text-btdemo-text',
          'hover:border-btdemo-border',
          'data-[active=true]:text-btdemo-primary',
          'data-[active=true]:border-btdemo-primary',
        ],

        // 7. Batch Action - Destructive/bulk actions (Clear, Reject Selected)
        batch: [
          'bg-btdemo-card',
          'text-btdemo-text',
          'border border-btdemo',
          'backdrop-blur-btdemo-sm',
          'hover:bg-accent-red/10',
          'hover:border-accent-red',
          'hover:text-accent-red',
        ],

        // 8. Modal Trigger - Opens modal/drawer (with ChevronRight icon)
        modal: [
          'bg-btdemo-card',
          'text-btdemo-text',
          'border border-btdemo',
          'backdrop-blur-btdemo-md',
          'hover:bg-btdemo-card-hover',
          'hover:border-btdemo-border-active',
          'justify-between', // Space between text and icon
        ],

        // 9. Navigation - Bottom nav style
        nav: [
          'bg-transparent',
          'text-btdemo-text-muted',
          'flex-col gap-1',
          'hover:text-btdemo-text',
          'data-[active=true]:text-btdemo-primary',
        ],

        // 10. Circular - Circular action buttons (56px in /profile)
        circular: [
          'bg-btdemo-card',
          'text-btdemo-text',
          'border border-btdemo',
          'backdrop-blur-btdemo-sm',
          'rounded-full',
          'hover:bg-btdemo-card-hover',
          'hover:border-btdemo-border-active',
          'hover:shadow-btdemo-glow',
        ],

        // 11. Skill Pill - Dynamic gradients (16 skill buttons)
        skill: [
          'bg-gradient-to-r',
          'text-btdemo-text',
          'border border-btdemo',
          'shadow-btdemo-inset',
          'hover:shadow-btdemo-glow',
          'data-[active=true]:border-btdemo-border-active',
        ],

        // 12. Icon-Only - Icon without text (close X, expand/collapse)
        icon: [
          'bg-transparent',
          'text-btdemo-text',
          'hover:bg-btdemo-card',
          'hover:text-btdemo-primary',
          'rounded-full',
        ],
      },

      size: {
        // Extra small - 32px height (icon buttons, compact UI)
        xs: 'h-8 px-3 text-xs gap-1.5',

        // Small - 36px height (filter pills, tabs)
        sm: 'h-9 px-4 text-sm gap-2',

        // Medium - 44px height (WCAG minimum, default buttons)
        md: 'h-11 px-5 text-base gap-2',

        // Large - 56px height (primary CTAs, circular buttons)
        lg: 'h-14 px-6 text-lg gap-3',

        // Extra large - 64px height (Connect Wallet from user spec)
        xl: 'h-16 px-8 text-lg gap-3',

        // Icon sizes (square buttons)
        'icon-xs': 'h-8 w-8 p-0',
        'icon-sm': 'h-9 w-9 p-0',
        'icon-md': 'h-11 w-11 p-0',
        'icon-lg': 'h-14 w-14 p-0', // 56px from audit
        'icon-xl': 'h-[68px] w-[68px] p-0 sm:h-14 sm:w-14', // 68px desktop, 56px mobile (nav spec)
      },

      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-btdemo-md', // 15px from user spec
        lg: 'rounded-btdemo-lg', // 20px from user spec
        full: 'rounded-full',
      },

      width: {
        auto: 'w-auto',
        full: 'w-full',
        fixed: '', // Custom width via className
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
      radius: 'md',
      width: 'auto',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, button shows loading spinner and is disabled
   */
  isLoading?: boolean

  /**
   * Icon to show before text (from lucide-react)
   */
  iconBefore?: React.ReactNode

  /**
   * Icon to show after text (e.g., ChevronRight for modal triggers)
   */
  iconAfter?: React.ReactNode

  /**
   * Active state (for filter pills, tabs, nav)
   */
  isActive?: boolean

  /**
   * Gradient direction for skill pills
   * Format: 'from-[color] to-[color]'
   */
  gradientClass?: string

  /**
   * Make button full width on mobile
   */
  fullWidthMobile?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      width,
      isLoading,
      iconBefore,
      iconAfter,
      isActive,
      gradientClass,
      fullWidthMobile,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Icon size mapping based on button size
    const iconSize = size?.includes('xs') || size === 'xs' ? 14
      : size?.includes('sm') || size === 'sm' ? 16
      : size?.includes('lg') || size === 'lg' ? 24
      : size?.includes('xl') || size === 'xl' ? 24
      : 20

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        data-active={isActive}
        className={cn(
          buttonVariants({ variant, size, radius, width }),
          variant === 'skill' && gradientClass,
          fullWidthMobile && 'w-full sm:w-auto',
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2
            className="animate-spin flex-shrink-0"
            size={iconSize}
            aria-hidden="true"
          />
        )}

        {/* Icon before text */}
        {!isLoading && iconBefore && (
          <span className="flex-shrink-0" aria-hidden="true">
            {iconBefore}
          </span>
        )}

        {/* Button text */}
        {children && <span>{children}</span>}

        {/* Icon after text */}
        {!isLoading && iconAfter && (
          <span className="flex-shrink-0" aria-hidden="true">
            {iconAfter}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
