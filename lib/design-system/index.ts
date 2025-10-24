/**
 * BTDEMO Design System
 *
 * Centralized export for all design system tokens, utilities, and components.
 * Import from this file for a clean, consistent API.
 *
 * @example
 * import { btdemoTokens, cn, Button } from '@/lib/design-system'
 */

// Tokens
export {
  btdemoTokens,
  getResponsiveSpacing,
  getLedClass,
  iconColorClasses,
  type BtdemoColors,
  type BtdemoSpacing,
  type BtdemoRadius,
  type BtdemoBorderWidth,
  type BtdemoBlur,
  type BtdemoShadows,
  type BtdemoTypography,
  type BtdemoGradients,
  type BtdemoBreakpoints,
  type IconColorClass,
} from './tokens'

// Utilities
export {
  cn,
  btdemoClass,
  responsive,
  focusRing,
  transition,
  glass,
  activeState,
  truncate,
  srOnly,
  hexToRgb,
  ledNumber,
} from './utils'

// Components
export { Button, buttonVariants } from './components/Button'
export type { ButtonProps } from './components/Button'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardBadge,
  cardVariants,
} from './components/Card'
export type { CardProps } from './components/Card'

export { IconButton, iconButtonVariants } from './components/IconButton'
export type { IconButtonProps } from './components/IconButton'

export { ListItem, ListItemGroup, listItemVariants } from './components/ListItem'
export type { ListItemProps } from './components/ListItem'
