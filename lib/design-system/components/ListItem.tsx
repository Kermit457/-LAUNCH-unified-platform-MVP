/**
 * BTDEMO ListItem Component
 *
 * Interactive list item with avatar, icon, badge, and action support.
 * Based on user specs: active state with lime border (#D1FD0A),
 * backdrop-blur 4px, border 1px.
 *
 * Used in navigation menus, settings lists, connection lists, etc.
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, focusRing, transition } from '../utils'
import { ChevronRight } from 'lucide-react'

const listItemVariants = cva(
  [
    'flex items-center gap-3',
    'w-full',
    'text-left',
    transition(),
  ],
  {
    variants: {
      variant: {
        // Default - Transparent, shows on hover
        default: [
          'bg-transparent',
          'hover:bg-btdemo-card',
          'hover:backdrop-blur-btdemo-md',
        ],

        // Card - Always has background
        card: [
          'bg-btdemo-card',
          'border border-btdemo',
          'backdrop-blur-btdemo-md',
          'hover:bg-btdemo-card-hover',
          'hover:border-btdemo-border-active',
        ],

        // Interactive - For clickable lists
        interactive: [
          'bg-transparent',
          'border border-transparent',
          'hover:bg-btdemo-card',
          'hover:border-btdemo',
          'hover:backdrop-blur-btdemo-md',
          'cursor-pointer',
        ],

        // Active - Selected state with lime border
        active: [
          'bg-btdemo-card-hover',
          'border border-btdemo-border-active',
          'backdrop-blur-btdemo-md',
          'shadow-btdemo-glow',
        ],
      },

      padding: {
        none: 'p-0',
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-5 py-4',
      },

      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-btdemo-md', // 15px
        lg: 'rounded-btdemo-lg', // 20px
      },
    },

    defaultVariants: {
      variant: 'default',
      padding: 'md',
      radius: 'md',
    },
  }
)

export interface ListItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listItemVariants> {
  /**
   * Avatar image URL
   */
  avatar?: string

  /**
   * Avatar alt text
   */
  avatarAlt?: string

  /**
   * Icon to show instead of avatar (from lucide-react)
   */
  icon?: React.ReactNode

  /**
   * Icon background color
   */
  iconBg?: string

  /**
   * Primary text/label
   */
  label: string

  /**
   * Secondary text/description
   */
  description?: string

  /**
   * Badge text (e.g., "New", "3", "Pro")
   */
  badge?: string | number

  /**
   * Badge variant
   */
  badgeVariant?: 'default' | 'primary' | 'accent'

  /**
   * Show chevron right icon
   */
  showChevron?: boolean

  /**
   * Active/selected state
   */
  isActive?: boolean

  /**
   * Make item clickable
   */
  isClickable?: boolean

  /**
   * Custom action slot (buttons, switches, etc.)
   */
  action?: React.ReactNode

  /**
   * As prop for rendering as button
   */
  asButton?: boolean
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      className,
      variant,
      padding,
      radius,
      avatar,
      avatarAlt,
      icon,
      iconBg = 'bg-btdemo-card',
      label,
      description,
      badge,
      badgeVariant = 'default',
      showChevron,
      isActive,
      isClickable,
      action,
      asButton,
      onClick,
      ...props
    },
    ref
  ) => {
    // Determine final variant based on isActive state
    const finalVariant = isActive ? 'active' : variant

    // Badge styles
    const badgeClasses = badgeVariant === 'primary'
      ? 'bg-btdemo-primary/10 text-btdemo-primary border border-btdemo-primary'
      : badgeVariant === 'accent'
      ? 'bg-accent-red/10 text-accent-red border border-accent-red'
      : 'bg-btdemo-card text-btdemo-text-muted border border-btdemo'

    const Component = asButton ? 'button' : 'div'

    const componentProps = {
      ref: ref as any,
      onClick: onClick as any,
      className: cn(
        listItemVariants({ variant: finalVariant, padding, radius }),
        (isClickable || asButton) && focusRing(),
        (isClickable || asButton) && 'cursor-pointer',
        className
      ),
      tabIndex: isClickable || asButton ? 0 : undefined,
      role: asButton ? 'button' : undefined,
      ...props,
    }

    return (
      <Component {...componentProps}>
        {/* Avatar or Icon */}
        {avatar && (
          <div className="flex-shrink-0">
            <img
              src={avatar}
              alt={avatarAlt || label}
              className="h-10 w-10 rounded-full object-cover border border-btdemo"
            />
          </div>
        )}

        {icon && (
          <div
            className={cn(
              'flex-shrink-0',
              'flex items-center justify-center',
              'h-10 w-10',
              'rounded-full',
              iconBg,
              'border border-btdemo'
            )}
          >
            <span className="text-btdemo-text" aria-hidden="true">
              {icon}
            </span>
          </div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-btdemo-text truncate">
              {label}
            </p>

            {badge !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5',
                  'rounded-full text-xs font-medium',
                  'flex-shrink-0',
                  badgeClasses
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p className="text-xs text-btdemo-text-muted truncate mt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Action slot or chevron */}
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}

        {showChevron && !action && (
          <ChevronRight
            className="flex-shrink-0 text-btdemo-text-muted"
            size={20}
            aria-hidden="true"
          />
        )}
      </Component>
    )
  }
)

ListItem.displayName = 'ListItem'

/**
 * ListItemGroup - Container for grouped list items
 */
const ListItemGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    spacing?: 'none' | 'sm' | 'md'
  }
>(({ className, title, spacing = 'sm', children, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-1', className)} {...props}>
    {title && (
      <h4 className="px-4 text-xs font-semibold text-btdemo-text-muted uppercase tracking-wider mb-2">
        {title}
      </h4>
    )}
    <div
      className={cn(
        spacing === 'none' && 'space-y-0',
        spacing === 'sm' && 'space-y-1',
        spacing === 'md' && 'space-y-2'
      )}
    >
      {children}
    </div>
  </div>
))

ListItemGroup.displayName = 'ListItemGroup'

export { ListItem, ListItemGroup, listItemVariants }
