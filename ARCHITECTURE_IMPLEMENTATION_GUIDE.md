# ARCHITECTURE IMPLEMENTATION GUIDE - QUICK START

**Date:** 2025-10-23
**Goal:** Get from 7/10 → 12/10 architecture in 4 weeks
**Status:** Ready to execute

---

## WEEK 1: FOUNDATION SETUP

### Day 1: Create Design System Structure

**Tasks:**
```bash
# 1. Create folder structure
mkdir -p lib/design-system/{tokens,primitives,components,patterns,hooks,utils,theme}

# 2. Create token files
touch lib/design-system/tokens/{colors,typography,spacing,radius,shadows,index}.ts
touch lib/design-system/tokens/index.ts

# 3. Create utility files
touch lib/design-system/utils/{cn,responsive,a11y,performance,index}.ts

# 4. Create theme files
touch lib/design-system/theme/{theme.config,variants,index}.ts
```

**File: `lib/design-system/tokens/colors.ts`**
```typescript
/**
 * Color Tokens - Single Source of Truth
 * All colors in the application derive from these tokens
 */

export const colors = {
  // Primary (Lime Green - #D1FD0A)
  primary: {
    DEFAULT: '#D1FD0A',
    hover: '#B8E309',
    active: '#9FC708',
    muted: 'rgba(209, 253, 10, 0.20)',
    border: 'rgba(209, 253, 10, 0.50)',
  },

  // Semantic Colors
  success: {
    DEFAULT: '#00FF88',
    muted: 'rgba(0, 255, 136, 0.10)',
    border: 'rgba(0, 255, 136, 0.30)',
  },
  warning: {
    DEFAULT: '#FFD700',
    muted: 'rgba(255, 215, 0, 0.10)',
    border: 'rgba(255, 215, 0, 0.30)',
  },
  danger: {
    DEFAULT: '#FF005C',
    muted: 'rgba(255, 0, 92, 0.10)',
    border: 'rgba(255, 0, 92, 0.30)',
  },

  // Neutrals (Zinc scale)
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },

  // Surfaces
  surface: {
    canvas: '#000000',
    card: 'rgba(8, 8, 9, 0.60)',
    cardHover: 'rgba(23, 23, 23, 0.60)',
    elevated: 'rgba(39, 39, 42, 0.80)',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.72)',
    muted: 'rgba(255, 255, 255, 0.56)',
    disabled: 'rgba(255, 255, 255, 0.40)',
  },
} as const

export type ColorToken = typeof colors
```

**File: `lib/design-system/tokens/index.ts`**
```typescript
export { colors } from './colors'
export { typography } from './typography'
export { spacing } from './spacing'
export { radius } from './radius'
export { shadows } from './shadows'
```

**Test it:**
```typescript
// In any component
import { colors } from '@/lib/design-system/tokens'

const primaryColor = colors.primary.DEFAULT // '#D1FD0A'
```

---

### Day 2: Set Up Theme Provider

**File: `lib/design-system/theme/theme.config.ts`**
```typescript
import { colors, typography, spacing } from '../tokens'

export interface ThemeConfig {
  colors: typeof colors
  typography: typeof typography
  spacing: typeof spacing
  mode: 'dark' | 'light'
}

export const defaultTheme: ThemeConfig = {
  colors,
  typography,
  spacing,
  mode: 'dark',
}
```

**File: `lib/design-system/theme/ThemeProvider.tsx`**
```typescript
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeConfig, defaultTheme } from './theme.config'

interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme)

  const setTheme = (updates: Partial<ThemeConfig>) => {
    setThemeState((prev) => ({ ...prev, ...updates }))
  }

  const toggleMode = () => {
    setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode }}>
      <div data-theme={theme.mode}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

**Install it in app layout:**
```typescript
// app/layout.tsx
import { ThemeProvider } from '@/lib/design-system/theme'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

### Day 3: Create Button Primitive

**File: `lib/design-system/primitives/Button/Button.types.ts`**
```typescript
import { ComponentPropsWithoutRef, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
  isFullWidth?: boolean
  className?: string
  children: ReactNode
}

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: `
    bg-primary hover:bg-primary-hover active:bg-primary-active
    text-black font-bold
    shadow-lg shadow-primary/20 hover:shadow-primary/40
    transition-all duration-300
  `,
  secondary: `
    bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600
    text-primary font-semibold
    border-2 border-primary/50 hover:border-primary
    transition-all duration-300
  `,
  ghost: `
    bg-transparent hover:bg-zinc-800/50
    text-zinc-300 hover:text-primary
    transition-all duration-200
  `,
  danger: `
    bg-danger hover:bg-danger/90 active:bg-danger/80
    text-white font-bold
    shadow-lg shadow-danger/20 hover:shadow-danger/40
    transition-all duration-300
  `,
}

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
}
```

**File: `lib/design-system/primitives/Button/Button.tsx`**
```typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/design-system/utils'
import { ButtonProps, buttonVariants, buttonSizes } from './Button.types'
import { IconLightning } from '@/lib/icons'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      isFullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-semibold tracking-tight',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transform active:scale-[0.98]',

          // Variant styles
          buttonVariants[variant],

          // Size styles
          buttonSizes[size],

          // Full width
          isFullWidth && 'w-full',

          // Custom className
          className
        )}
        {...props}
      >
        {isLoading && <IconLightning className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

**File: `lib/design-system/primitives/Button/index.ts`**
```typescript
export { Button } from './Button'
export type { ButtonProps } from './Button.types'
```

**Test it:**
```typescript
import { Button } from '@/lib/design-system/primitives/Button'
import { IconRocket } from '@/lib/icons'

<Button variant="primary" size="lg" leftIcon={<IconRocket />}>
  Launch Project
</Button>
```

---

### Day 4-5: Set Up Storybook

**Install Storybook:**
```bash
npx storybook@latest init
```

**Create first story:**
```typescript
// lib/design-system/primitives/Button/Button.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { IconRocket, IconLightning } from '@/lib/icons'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    isFullWidth: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    leftIcon: <IconRocket />,
    rightIcon: <IconLightning />,
    children: 'Launch',
  },
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Loading...',
  },
}

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    isFullWidth: true,
    children: 'Full Width Button',
  },
}
```

**Run Storybook:**
```bash
npm run storybook
```

---

## WEEK 2: CORE COMPONENTS

### Day 6-7: Card Primitive (Compound Component Pattern)

**File: `lib/design-system/primitives/Card/Card.tsx`**
```typescript
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '@/lib/design-system/utils'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'premium' | 'interactive'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl',
      premium: 'bg-zinc-900/60 backdrop-blur-xl border-2 border-primary/50 hover:border-primary rounded-3xl transition-all',
      interactive: 'bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl hover:bg-zinc-900/60 hover:scale-[1.02] transition-all',
    }

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Compound components
export const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 border-b border-zinc-800', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardBody = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)
CardBody.displayName = 'CardBody'

export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 border-t border-zinc-800', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

// Attach compound components
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
```

**Usage:**
```typescript
<Card variant="premium">
  <Card.Header>
    <h3>Project Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Project description goes here...</p>
  </Card.Body>
  <Card.Footer>
    <Button>View Details</Button>
  </Card.Footer>
</Card>
```

---

### Day 8-9: Input Primitive

**File: `lib/design-system/primitives/Input/Input.tsx`**
```typescript
import { forwardRef, ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/design-system/utils'

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-3 text-base rounded-xl',
      lg: 'px-5 py-4 text-lg rounded-2xl',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-white mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-zinc-900/60 border text-white placeholder-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              'transition-all duration-200',
              error
                ? 'border-danger focus:border-danger'
                : 'border-zinc-800 focus:border-primary/50',
              disabled && 'opacity-50 cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              sizeClasses[size],
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-xs text-danger">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-xs text-zinc-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

---

### Day 10: Modal Primitive

**File: `lib/design-system/primitives/Modal/Modal.tsx`**
```typescript
'use client'

import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/design-system/utils'
import { IconClose } from '@/lib/icons'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full glass-premium border-2 border-primary/50 rounded-3xl shadow-2xl',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <IconClose className="w-5 h-5 text-zinc-400" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
```

---

## WEEK 3: DOMAIN COMPONENTS

### Day 11-12: Extract MotionScoreDisplay

**File: `lib/design-system/components/MotionScoreDisplay/MotionScoreDisplay.tsx`**
```typescript
import { memo } from 'react'
import { cn } from '@/lib/design-system/utils'
import {
  IconMotion,
  IconMotion1,
  IconMotion2,
  IconMotion4,
  IconMotion5,
  IconMotionBar,
} from '@/lib/icons'

export interface MotionScoreDisplayProps {
  score: number // 0-100
  showBar?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const MotionScoreDisplay = memo(({
  score,
  showBar = true,
  size = 'md',
  className,
}: MotionScoreDisplayProps) => {
  const getMotionLevel = (score: number) => {
    if (score <= 20) return { Icon: IconMotion1, color: 'text-[#FF005C]', label: 'Low' }
    if (score <= 40) return { Icon: IconMotion2, color: 'text-orange-500', label: 'Medium-Low' }
    if (score <= 60) return { Icon: IconMotion, color: 'text-yellow-500', label: 'Medium' }
    if (score <= 80) return { Icon: IconMotion4, color: 'text-lime-500', label: 'High' }
    return { Icon: IconMotion5, color: 'text-[#D1FD0A]', label: 'Extreme' }
  }

  const level = getMotionLevel(score)
  const { Icon } = level

  const sizeClasses = {
    sm: { icon: 24, text: 'text-xl', height: 'h-2' },
    md: { icon: 32, text: 'text-3xl', height: 'h-2' },
    lg: { icon: 40, text: 'text-4xl', height: 'h-3' },
  }

  return (
    <div className={cn('glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary', className)}>
      <div className="flex items-center gap-3 p-4">
        <Icon className={level.color} size={sizeClasses[size].icon} />

        {showBar && (
          <div className={cn('flex-1 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50', sizeClasses[size].height)}>
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
            />
          </div>
        )}

        <div className={cn('font-led-dot text-primary', sizeClasses[size].text)}>
          {score}
        </div>
      </div>
    </div>
  )
})

MotionScoreDisplay.displayName = 'MotionScoreDisplay'
```

---

### Day 13-14: Refactor UnifiedCard to Use Design System

**Before (UnifiedCard.tsx):**
```typescript
// Mixed inline styles, inconsistent patterns
<div className="glass-premium p-6 rounded-3xl hover:shadow-xl...">
  // 700+ lines of mixed logic
</div>
```

**After:**
```typescript
import { Card } from '@/lib/design-system/primitives/Card'
import { Button } from '@/lib/design-system/primitives/Button'
import { MotionScoreDisplay } from '@/lib/design-system/components/MotionScoreDisplay'

export function UnifiedCard({ data }: { data: UnifiedCardData }) {
  return (
    <Card variant="premium">
      <Card.Header>
        {/* Avatar, Title, Badges */}
      </Card.Header>

      <Card.Body>
        <MotionScoreDisplay score={data.beliefScore} />
        {/* Stats, Contributors, etc. */}
      </Card.Body>

      <Card.Footer>
        <Button variant="primary" leftIcon={<IconLightning />}>
          Buy Keys
        </Button>
        <Button variant="secondary" leftIcon={<IconNetwork />}>
          Collaborate
        </Button>
      </Card.Footer>
    </Card>
  )
}
```

---

### Day 15: Create StatsGrid Pattern

**File: `lib/design-system/patterns/StatsGrid/StatsGrid.tsx`**
```typescript
import { ReactNode } from 'react'
import { cn } from '@/lib/design-system/utils'

export interface StatItem {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export interface StatsGridProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ stats, columns = 2, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-3',
        columns === 4 && 'grid-cols-4',
        className
      )}
    >
      {stats.map((stat, idx) => (
        <StatItem key={idx} {...stat} />
      ))}
    </div>
  )
}

function StatItem({ label, value, icon, trend, trendValue }: StatItem) {
  return (
    <div className="glass-interactive p-3 rounded-xl border-2 border-primary/50 hover:border-primary transition-all">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <div className="font-led-dot text-xl text-primary">{value}</div>
      {trend && trendValue && (
        <div className={cn(
          'text-xs mt-1',
          trend === 'up' && 'text-green-400',
          trend === 'down' && 'text-[#FF005C]',
          trend === 'neutral' && 'text-zinc-400'
        )}>
          {trendValue}
        </div>
      )}
    </div>
  )
}
```

---

## WEEK 4: DOCUMENTATION & POLISH

### Day 16-17: Generate TypeDoc Documentation

**Install TypeDoc:**
```bash
npm install --save-dev typedoc
```

**Configure TypeDoc:**
```json
// typedoc.json
{
  "entryPoints": ["lib/design-system"],
  "out": "docs",
  "exclude": ["**/*.test.ts", "**/*.stories.tsx"],
  "name": "ICM Motion Design System",
  "theme": "default",
  "readme": "lib/design-system/README.md"
}
```

**Generate docs:**
```bash
npx typedoc
```

---

### Day 18: Write Migration Guide

**File: `MIGRATION_GUIDE.md`**
```markdown
# Migration Guide: Components → Design System

## Quick Reference

| Old Import | New Import |
|------------|------------|
| `<button className="glass-premium">` | `<Button variant="primary">` |
| `<div className="card">` | `<Card>` |
| Custom styling | Design system tokens |

## Step-by-Step Migration

### 1. Update Imports
```typescript
// Before
import { useState } from 'react'

// After
import { Button } from '@/lib/design-system/primitives/Button'
import { Card } from '@/lib/design-system/primitives/Card'
```

### 2. Replace Inline Styles
```typescript
// Before
<button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl">
  Submit
</button>

// After
<Button variant="primary">
  Submit
</Button>
```

### 3. Use Design Tokens
```typescript
// Before
const primaryColor = '#D1FD0A'

// After
import { colors } from '@/lib/design-system/tokens'
const primaryColor = colors.primary.DEFAULT
```
```

---

### Day 19-20: Polish & Testing

**Create test utils:**
```typescript
// lib/design-system/test-utils.tsx

import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from './theme'

export function renderWithTheme(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  })
}
```

**Run tests:**
```bash
npm run test
```

**Visual regression tests:**
```bash
npm run build-storybook
npx chromatic --project-token=<token>
```

---

## VERIFICATION CHECKLIST

### Week 1: Foundation
- [ ] Design system folder structure created
- [ ] Design tokens extracted (colors, typography, spacing)
- [ ] ThemeProvider set up
- [ ] Button primitive created
- [ ] Storybook configured

### Week 2: Core Components
- [ ] Card primitive with compound components
- [ ] Input primitive with validation
- [ ] Modal primitive with portal
- [ ] All primitives have Storybook stories
- [ ] Unit tests for all primitives

### Week 3: Domain Components
- [ ] MotionScoreDisplay component
- [ ] StatsGrid pattern
- [ ] UnifiedCard refactored
- [ ] ProjectCard migrated
- [ ] ClipCard migrated

### Week 4: Documentation
- [ ] TypeDoc documentation generated
- [ ] Migration guide written
- [ ] Component usage examples
- [ ] Storybook deployed
- [ ] Visual regression tests passing

---

## QUICK COMMANDS

```bash
# Development
npm run dev              # Start Next.js dev server
npm run storybook        # Start Storybook

# Testing
npm run test             # Run unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Documentation
npx typedoc              # Generate docs
npm run build-storybook  # Build static Storybook

# Production
npm run build            # Production build
npm run start            # Start production server
```

---

## TROUBLESHOOTING

### "Cannot find module '@/lib/design-system'"
**Fix:** Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Button styles not applying"
**Fix:** Ensure Tailwind config includes design system paths:
```javascript
module.exports = {
  content: [
    './lib/design-system/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
}
```

### "Storybook not loading components"
**Fix:** Add to `.storybook/main.ts`:
```typescript
export default {
  stories: ['../lib/design-system/**/*.stories.tsx'],
}
```

---

## NEXT STEPS AFTER WEEK 4

1. **Migrate remaining components** (Week 5-6)
2. **Set up automated testing** (CI/CD pipeline)
3. **Create component playground** (live sandbox)
4. **Implement design token sync** (Figma → Code)
5. **White-label theme system** (custom branding)

---

**Files Created:**
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\ARCHITECTURE_SYSTEM_DESIGN_12_10.md`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\ARCHITECTURE_VISUAL_DIAGRAMS.md`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\ARCHITECTURE_IMPLEMENTATION_GUIDE.md`

**Ready to execute!** Start with Week 1, Day 1.
