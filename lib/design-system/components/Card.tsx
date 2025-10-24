/**
 * BTDEMO Card Component
 *
 * Glassmorphic card with active/default states.
 * Based on user specs: 360x68px box with translucent background,
 * border-radius 15px, backdrop-blur, and lime border when active.
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, glass, activeState, transition, focusRing } from '../utils'

const cardVariants = cva(
  [
    'relative',
    'overflow-hidden',
    transition(),
  ],
  {
    variants: {
      variant: {
        // Default - Translucent card with border
        default: [
          'bg-btdemo-card',
          'border border-btdemo',
          'backdrop-blur-btdemo-md',
        ],

        // Hover - Interactive card with hover effect
        hover: [
          'bg-btdemo-card',
          'border border-btdemo',
          'backdrop-blur-btdemo-md',
          'hover:bg-btdemo-card-hover',
          'hover:border-btdemo-border-active',
          'cursor-pointer',
        ],

        // Active - Selected/active state with lime glow
        active: [
          'bg-btdemo-card-hover',
          'border border-btdemo-border-active',
          'backdrop-blur-btdemo-md',
          'shadow-btdemo-glow',
        ],

        // Glass - Heavy blur effect
        glass: [
          'bg-btdemo-card/40',
          'border border-btdemo',
          'backdrop-blur-btdemo-md',
        ],

        // Outline - Border-only, no background
        outline: [
          'bg-transparent',
          'border border-btdemo',
        ],
      },

      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4 sm:p-5', // 20px desktop, 16px mobile
        lg: 'p-6',
        xl: 'p-8',
      },

      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-btdemo-md', // 15px from user spec
        lg: 'rounded-btdemo-lg', // 20px
        xl: 'rounded-3xl',
      },

      shadow: {
        none: '',
        inset: 'shadow-btdemo-inset',
        glow: 'shadow-btdemo-glow',
      },
    },

    defaultVariants: {
      variant: 'default',
      padding: 'md',
      radius: 'md',
      shadow: 'none',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * If true, card is in active/selected state
   */
  isActive?: boolean

  /**
   * Make card clickable (adds focus ring)
   */
  isClickable?: boolean

  /**
   * As prop for polymorphic rendering
   */
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      radius,
      shadow,
      isActive,
      isClickable,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Determine final variant based on isActive state
    const finalVariant = isActive ? 'active' : variant

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          cardVariants({ variant: finalVariant, padding, radius, shadow }),
          isClickable && focusRing(),
          isClickable && 'cursor-pointer',
          className
        )}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/**
 * CardHeader - Top section of card (title, actions)
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between gap-4', className)}
    {...props}
  />
))

CardHeader.displayName = 'CardHeader'

/**
 * CardTitle - Main heading in card
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-base font-semibold text-btdemo-text leading-tight',
      className
    )}
    {...props}
  />
))

CardTitle.displayName = 'CardTitle'

/**
 * CardDescription - Subtitle/description text
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-btdemo-text-muted', className)}
    {...props}
  />
))

CardDescription.displayName = 'CardDescription'

/**
 * CardContent - Main content area
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4', className)}
    {...props}
  />
))

CardContent.displayName = 'CardContent'

/**
 * CardFooter - Bottom section (actions, metadata)
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between gap-4 mt-4', className)}
    {...props}
  />
))

CardFooter.displayName = 'CardFooter'

/**
 * CardBadge - Small label/badge in card
 */
const CardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: 'default' | 'primary' | 'muted'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variant === 'default' && 'bg-btdemo-card text-btdemo-text border border-btdemo',
      variant === 'primary' && 'bg-btdemo-primary/10 text-btdemo-primary border border-btdemo-primary',
      variant === 'muted' && 'bg-transparent text-btdemo-text-muted',
      className
    )}
    {...props}
  />
))

CardBadge.displayName = 'CardBadge'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardBadge,
  cardVariants,
}
