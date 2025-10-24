# TypeScript Excellence Plan: 12/10 Type Safety

**Mission:** Achieve exceptional type safety across the entire btdemo rollout and application

**Status:** Currently 22 TypeScript errors, 273 `any` usage instances

---

## 1. TYPE SAFETY AUDIT

### Current State Analysis

#### Compilation Errors: 22 Total
**Category:** Icon Size Prop Mismatches (19 errors)
- **Root Cause:** Inconsistent icon size type definitions across 52 icon components
- **Impact:** btdemo page cannot use flexible icon sizes (10, 12, 32 not allowed)
- **Files Affected:**
  - `app/btdemo/page.tsx` (19 size prop errors)
  - `lib/icons/custom/*.tsx` (52 icon components with varying size unions)

**Category:** Missing Type Definitions (3 errors)
- `lib/icons/custom/IconPriceDown.tsx` - Cannot find module '../types'
- `lib/icons/custom/IconPriceUp.tsx` - Cannot find module '../types'
- `lib/icons/custom/IconVerified.tsx` - Cannot find module '../types'
- `lib/icons/custom/IconNotification.tsx` - Expects IconProps from non-existent file

**Category:** Destructuring Unknown Props (1 error)
- `app/btdemo/page.tsx:1010` - Attempting to destructure `props` from icon category object that doesn't have it

#### `any` Type Usage: 273 Instances
**Primary Sources:**
1. **API Error Handling (90%)**: All catch blocks use `catch (error: any)`
   - 67 API route files with error handling
   - Pattern: `} catch (error: any) {`
   - Location: `app/api/**/*.ts`

2. **Component Props (5%)**: ~13 instances
   - Mostly in legacy/complex components
   - Need proper interface definitions

3. **Third-party Library Integrations (5%)**: ~13 instances
   - External API responses
   - Appwrite SDK responses
   - Wallet/blockchain responses

#### Positive Findings
- **Zero** `@ts-ignore` or `@ts-expect-error` suppressions
- **Zero** ESLint disables
- Strict mode enabled in `tsconfig.json`
- Good foundation with Zod schemas in `lib/validations/`
- Well-structured type definitions in `types/` directory

---

## 2. ICON SYSTEM TYPE CONSOLIDATION

### Problem
52 icon components with 8 different size type definitions:
- `size?: 16 | 20 | 24` (most common)
- `size?: 16 | 20 | 24 | 32 | 64 | 128` (IconSolana)
- `size?: 28 | 30 | 32` (IconMotionScoreBadge)
- `size?: 38 | 42 | 48` (IconActivityBadge)
- `size?: number` (IconChartAnimation - width/height)
- No size prop (IconMotionBar, IconChartAnimation)

### Solution: Unified Icon Type System

**Step 1:** Create centralized icon types

```typescript
// lib/icons/types.ts
export interface BaseIconProps {
  className?: string
  'aria-label'?: string
}

// Standard icon sizes (cover 95% of use cases)
export type StandardIconSize = 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 128

export interface IconProps extends BaseIconProps {
  size?: StandardIconSize
}

// For special icons with custom dimensions
export interface CustomDimensionIconProps extends BaseIconProps {
  width?: number
  height?: number
}

// For badge/score icons with fixed aspect ratios
export interface BadgeIconProps extends BaseIconProps {
  size?: 28 | 30 | 32 | 38 | 40 | 42 | 48
}

// For progress/bar components
export interface ProgressIconProps extends BaseIconProps {
  width?: number
  height?: number
  progress?: number // 0-100
}

// Score letter type
export type MotionScoreLetter = 'M' | 'A' | 'B' | 'C' | 'D' | 'F'

export interface ScoreBadgeIconProps extends BaseIconProps {
  score: MotionScoreLetter
  size?: 28 | 30 | 32
}
```

**Step 2:** Update all 52 icon components to use centralized types

```typescript
// Example migration
// BEFORE (IconMotion.tsx)
interface IconMotionProps {
  className?: string
  size?: 16 | 20 | 24
}

// AFTER
import { IconProps } from '../types'

export const IconMotion = ({ className, size = 20 }: IconProps) => {
  // ...
}
```

**Step 3:** Special handling for unique icons

```typescript
// IconChartAnimation.tsx
import { CustomDimensionIconProps } from '../types'

export const IconChartAnimation = ({
  className,
  width = 79,
  height = 30
}: CustomDimensionIconProps) => {
  // ...
}

// IconMotionBar.tsx
import { ProgressIconProps } from '../types'

export const IconMotionBar = ({
  className,
  width = 142,
  height = 8,
  progress = 0
}: ProgressIconProps) => {
  // ...
}
```

**Impact:** Fixes 19 of 22 TypeScript errors

---

## 3. DESIGN TOKEN TYPES

### Create Comprehensive Type System

```typescript
// lib/design-system/types.ts

/**
 * BTDEMO Design System Types
 * Provides compile-time guarantees for design tokens
 */

// ============ COLOR SYSTEM ============

// Brand colors (exact hex values)
export type PrimaryColor = '#D1FD0A'
export type PrimaryHover = '#B8E309'
export type CanvasColor = '#000000'
export type CardBackground = 'rgba(8, 8, 9, 0.60)'
export type CardHover = 'rgba(23, 23, 23, 0.60)'

// Semantic color categories
export type StatusColor = 'success' | 'warning' | 'error' | 'info'
export type TextColor = 'primary' | 'muted' | 'disabled'
export type BorderColor = 'default' | 'active' | 'hover'

// Icon semantic colors (matches existing iconColorClasses)
export type IconColorSemantic = 'primary' | 'muted' | 'disabled' | 'interactive' | 'active'

// Full color palette type
export interface ColorPalette {
  canvas: CanvasColor
  card: CardBackground
  cardHover: CardHover
  primary: PrimaryColor
  primaryHover: PrimaryHover
  border: string
  borderActive: string
  text: string
  textMuted: string
  textDisabled: string
}

// ============ SPACING SYSTEM ============

export type SpacingScale = 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 80

export interface ResponsiveSpacing {
  desktop: {
    padding: string
    iconButton: string
    gap: string
  }
  mobile: {
    padding: string
    iconButton: string
    gap: string
  }
}

// ============ BORDER RADIUS ============

export type BorderRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface BorderRadiusScale {
  sm: '8px'
  md: '15px'
  lg: '20px'
  xl: '24px'
  full: '9999px'
}

// ============ TYPOGRAPHY ============

export type FontWeight = 400 | 500 | 600 | 700
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'

export interface TypographyToken {
  fontSize: string
  lineHeight: string
  fontWeight: FontWeight
  letterSpacing?: string
}

// LED Display specific
export type LedFontSize = 'xs' | 'sm' | 'md'
export interface LedTypography {
  fontFamily: string
  sizes: Record<LedFontSize, string>
  letterSpacing: string
}

// ============ COMPONENT VARIANTS ============

// Badge variants
export type BadgeVariant = 'live' | 'frozen' | 'launched' | 'success' | 'warning' | 'error' | 'primary'
export type BadgeSize = 'sm' | 'md' | 'lg'

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

// Card variants
export type CardVariant = 'default' | 'glass' | 'glass-interactive' | 'solid'

// ============ ANIMATION SYSTEM ============

export type AnimationDuration = 150 | 200 | 300 | 500 | 700 | 1000
export type AnimationEasing = 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'

export interface TransitionConfig {
  duration: AnimationDuration
  easing: AnimationEasing
  property: string
}

// ============ BREAKPOINTS ============

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface BreakpointValues {
  sm: '640px'
  md: '768px'
  lg: '1024px'
  xl: '1280px'
  '2xl': '1536px'
}

// ============ STATUS & STATE TYPES ============

export type ProjectStatus = 'live' | 'active' | 'frozen' | 'ended' | 'launched'
export type CampaignStatus = 'active' | 'ended' | 'upcoming'
export type ClipStatus = 'active' | 'pending' | 'rejected' | 'removed'

// ============ UTILITY TYPES ============

// Extract theme class names as const strings
export type ThemeClassName<T extends string> = `btdemo-${T}`

// Generate responsive class variants
export type ResponsiveValue<T> = T | { sm?: T; md?: T; lg?: T; xl?: T }

// Utility for strict className generation
export type ClassNameBuilder<T extends string> = (...classes: (T | undefined | false)[]) => string
```

### Enhanced Token System with Type Safety

```typescript
// lib/design-system/tokens.ts (enhanced)

import type {
  ColorPalette,
  ResponsiveSpacing,
  BorderRadiusScale,
  LedTypography,
  IconColorSemantic,
} from './types'

export const btdemoTokens = {
  colors: {
    canvas: '#000000',
    card: 'rgba(8, 8, 9, 0.60)',
    cardHover: 'rgba(23, 23, 23, 0.60)',
    primary: '#D1FD0A',
    primaryHover: '#B8E309',
    border: '#3B3B3B',
    borderActive: '#D1FD0A',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.60)',
    textDisabled: 'rgba(255, 255, 255, 0.40)',
  } as const satisfies ColorPalette,

  spacing: {
    desktop: {
      padding: '20px',
      iconButton: '68px',
      gap: '16px',
    },
    mobile: {
      padding: '16px',
      iconButton: '56px',
      gap: '12px',
    },
  } as const satisfies ResponsiveSpacing,

  radius: {
    sm: '8px',
    md: '15px',
    lg: '20px',
    xl: '24px',
    full: '9999px',
  } as const satisfies BorderRadiusScale,

  // ... rest of tokens
} as const

// Type-safe helper functions with generics
export function getColor<K extends keyof ColorPalette>(
  key: K
): ColorPalette[K] {
  return btdemoTokens.colors[key]
}

export function getSpacing(
  property: keyof ResponsiveSpacing['desktop'],
  breakpoint: 'desktop' | 'mobile' = 'desktop'
): string {
  return btdemoTokens.spacing[breakpoint][property]
}

// Type guard for icon color validation
export function isIconColorSemantic(value: string): value is IconColorSemantic {
  return ['primary', 'muted', 'disabled', 'interactive', 'active'].includes(value)
}
```

---

## 4. COMPONENT PROP TYPES EXCELLENCE

### Pattern: Strict Prop Interfaces with Discriminated Unions

```typescript
// ============ PROJECT CARD EXAMPLE ============

// types/components.ts
export interface BaseProjectCardProps {
  id: string
  title: string
  onClick?: () => void
  className?: string
}

// Discriminated union for different project types
export type ProjectCardProps = BaseProjectCardProps & (
  | {
      status: 'live' | 'active'
      metrics: {
        holders: number
        volume24h: number
        priceChange: number
      }
      endTime?: never
    }
  | {
      status: 'frozen'
      metrics: {
        holders: number
        volume24h: number
        priceChange: number | null
      }
      endTime?: never
    }
  | {
      status: 'ended'
      metrics: {
        holders: number
        volume24h: number
        priceChange: null
      }
      endTime: string
    }
  | {
      status: 'launched'
      metrics: {
        fdv: number
        poolValue: number
        priceChange: number
      }
      endTime?: never
    }
)

// ============ BADGE COMPONENT ============

export interface BadgeProps {
  variant: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  className?: string
}

// With default props documented in type
export interface BadgePropsWithDefaults extends Required<Pick<BadgeProps, 'size' | 'variant'>> {
  children: React.ReactNode
  className?: string
}

// ============ ICON BUTTON ============

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  variant?: IconButtonVariant
  size?: IconButtonSize
  onClick?: () => void
  disabled?: boolean
  'aria-label': string // Required for accessibility
  className?: string
}

// ============ MODAL PROPS ============

export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
}

// Specific modal types
export interface ConfirmModalProps extends BaseModalProps {
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  variant?: 'danger' | 'warning' | 'info'
}

export interface FormModalProps<T> extends BaseModalProps {
  initialData?: Partial<T>
  onSubmit: (data: T) => void | Promise<void>
  validationSchema?: z.ZodSchema<T>
}
```

### Migration Pattern for Existing Components

```typescript
// BEFORE: Loose typing
interface Props {
  data: any
  onUpdate: (val: any) => void
}

// AFTER: Strict typing with generics
interface Props<T extends BaseProject> {
  data: T
  onUpdate: (value: T) => void
  validationSchema?: z.ZodSchema<T>
}

// Usage
<ProjectEditor<TokenLaunch>
  data={tokenProject}
  onUpdate={handleUpdate}
  validationSchema={tokenLaunchSchema}
/>
```

---

## 5. ZOD SCHEMA VALIDATION EXPANSION

### Current State
Good foundation with `lib/validations/clip.ts`, but needs expansion

### Expansion Plan

```typescript
// lib/validations/index.ts - Central export

export * from './clip'
export * from './campaign'
export * from './project'
export * from './user'
export * from './api-responses'

// lib/validations/project.ts
import { z } from 'zod'

// Base schemas
export const statusSchema = z.enum(['live', 'active', 'frozen', 'ended', 'launched'])
export const projectTypeSchema = z.enum(['launch', 'campaign', 'raid', 'prediction', 'ad', 'quest', 'spotlight'])

// Metrics schemas (runtime validation)
export const tokenMetricsSchema = z.object({
  holders: z.number().int().nonnegative(),
  volume24h: z.number().nonnegative(),
  priceChange: z.number().nullable(),
})

export const launchedMetricsSchema = z.object({
  fdv: z.number().positive(),
  poolValue: z.number().nonnegative(),
  priceChange: z.number(),
})

// Discriminated union schema
export const projectSchema = z.discriminatedUnion('status', [
  z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(100),
    status: z.literal('live'),
    metrics: tokenMetricsSchema,
    createdAt: z.string().datetime(),
  }),
  z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(100),
    status: z.literal('launched'),
    metrics: launchedMetricsSchema,
    createdAt: z.string().datetime(),
  }),
  // ... other status variants
])

// API Response schemas
export const projectListResponseSchema = z.object({
  projects: z.array(projectSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})

// Type inference
export type Project = z.infer<typeof projectSchema>
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>

// Runtime validator with error handling
export function validateProject(data: unknown): Project {
  return projectSchema.parse(data)
}

export function validateProjectSafe(data: unknown):
  { success: true; data: Project } | { success: false; error: z.ZodError } {
  const result = projectSchema.safeParse(data)
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error }
}

// lib/validations/api-responses.ts
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
  timestamp: z.string().datetime(),
})

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    timestamp: z.string().datetime(),
  })

export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type SuccessResponse<T> = {
  success: true
  data: T
  timestamp: string
}
```

### API Route Integration Pattern

```typescript
// app/api/projects/route.ts
import { validateProjectSafe } from '@/lib/validations'
import type { ErrorResponse } from '@/lib/validations/api-responses'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate with Zod
    const validation = validateProjectSafe(body)

    if (!validation.success) {
      return Response.json(
        {
          error: 'Validation Error',
          message: validation.error.issues.map(i => i.message).join(', '),
          statusCode: 400,
          timestamp: new Date().toISOString(),
        } satisfies ErrorResponse,
        { status: 400 }
      )
    }

    const project = validation.data
    // ... process project

  } catch (error) {
    // Type-safe error handling (see section 6)
  }
}
```

---

## 6. ELIMINATE `any` TYPES

### Strategy: Progressive Replacement (273 instances → 0)

#### Phase 1: API Error Handling (90% of any usage)

**Current Pattern (67 files):**
```typescript
} catch (error: any) {
  console.error('Error:', error)
  return Response.json({ error: error.message })
}
```

**New Pattern: Type-Safe Error Handling**

```typescript
// lib/errors/types.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

// Type guard for error types
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function isError(error: unknown): error is Error {
  return error instanceof Error
}

// lib/errors/handler.ts
import type { ErrorResponse } from '@/lib/validations/api-responses'

export function handleApiError(error: unknown): {
  response: ErrorResponse
  status: number
} {
  if (isAppError(error)) {
    return {
      response: {
        error: error.name,
        message: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString(),
      },
      status: error.statusCode,
    }
  }

  if (isError(error)) {
    return {
      response: {
        error: 'Internal Server Error',
        message: error.message,
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      status: 500,
    }
  }

  // Unknown error type
  return {
    response: {
      error: 'Unknown Error',
      message: 'An unexpected error occurred',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
    status: 500,
  }
}

// Usage in API routes
export async function GET(request: Request) {
  try {
    // ... logic
  } catch (error) {
    const { response, status } = handleApiError(error)
    return Response.json(response, { status })
  }
}
```

**Migration Script:**
```typescript
// scripts/migrate-error-handling.ts
// Replace all `catch (error: any)` with proper error handling
```

#### Phase 2: Third-Party SDK Responses

```typescript
// lib/appwrite/types.ts
import { z } from 'zod'

// Define expected Appwrite response structures
export const appwriteDocumentSchema = z.object({
  $id: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()),
  $collectionId: z.string(),
  $databaseId: z.string(),
})

export const appwriteUserSchema = z.object({
  $id: z.string(),
  email: z.string().email(),
  name: z.string(),
  // ... other fields
})

// Wrapper function with type safety
export async function fetchAppwriteDocument<T extends z.ZodTypeAny>(
  documentId: string,
  schema: T
): Promise<z.infer<T>> {
  const response = await databases.getDocument(
    DATABASE_ID,
    COLLECTION_ID,
    documentId
  )

  // Validate with Zod
  return schema.parse(response)
}
```

#### Phase 3: Component Props

```typescript
// BEFORE
const ComponentA = (props: any) => { ... }

// AFTER
interface ComponentAProps {
  title: string
  count: number
  onAction: () => void
}

const ComponentA = ({ title, count, onAction }: ComponentAProps) => { ... }
```

---

## 7. GENERIC TYPE PATTERNS & ADVANCED TYPESCRIPT

### Pattern 1: Generic API Fetch Hook

```typescript
// hooks/useTypedFetch.ts
import { useState, useEffect } from 'react'
import type { z } from 'zod'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useTypedFetch<T extends z.ZodTypeAny>(
  url: string,
  schema: T,
  options?: RequestInit
): FetchState<z.infer<T>> {
  const [state, setState] = useState<FetchState<z.infer<T>>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url, options)
        const json = await response.json()

        // Runtime validation
        const validated = schema.parse(json)

        setState({ data: validated, loading: false, error: null })
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error')
        })
      }
    }

    fetchData()
  }, [url])

  return state
}

// Usage with full type safety
const { data, loading, error } = useTypedFetch(
  '/api/projects',
  projectListResponseSchema
)
// data is fully typed as ProjectListResponse
```

### Pattern 2: Conditional Types for Component Variants

```typescript
// lib/design-system/components/Button.tsx

type ButtonBaseProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

type ButtonWithHref = ButtonBaseProps & {
  href: string
  onClick?: never
  type?: never
}

type ButtonWithOnClick = ButtonBaseProps & {
  onClick: () => void | Promise<void>
  href?: never
  type?: 'button' | 'submit' | 'reset'
}

// Button must have either href OR onClick, not both
export type ButtonProps = ButtonWithHref | ButtonWithOnClick

export const Button = (props: ButtonProps) => {
  if ('href' in props) {
    return <a href={props.href} className={props.className}>{props.children}</a>
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
    >
      {props.children}
    </button>
  )
}
```

### Pattern 3: Template Literal Types for CSS Classes

```typescript
// lib/design-system/classnames.ts

type ColorName = 'primary' | 'secondary' | 'success' | 'error' | 'warning'
type ColorIntensity = '50' | '100' | '200' | '300' | '400' | '500'
type ColorPrefix = 'text' | 'bg' | 'border'

// Generate all possible Tailwind color classes
type ColorClass = `${ColorPrefix}-${ColorName}-${ColorIntensity}`

// Type-safe class name builder
export function buildColorClass(
  prefix: ColorPrefix,
  color: ColorName,
  intensity: ColorIntensity
): ColorClass {
  return `${prefix}-${color}-${intensity}`
}

// Autocomplete works perfectly
const textClass = buildColorClass('text', 'primary', '500')
//                                   ^        ^         ^
//                              autocomplete for all three
```

### Pattern 4: Branded Types for Domain Modeling

```typescript
// lib/types/branded.ts

// Prevent mixing different ID types
export type ProjectId = string & { readonly brand: unique symbol }
export type UserId = string & { readonly brand: unique symbol }
export type CampaignId = string & { readonly brand: unique symbol }

// Constructor functions
export function createProjectId(id: string): ProjectId {
  return id as ProjectId
}

export function createUserId(id: string): UserId {
  return id as UserId
}

// Type guard
export function isProjectId(id: string): id is ProjectId {
  // Could add validation logic here
  return id.startsWith('proj_')
}

// Usage
function getProject(id: ProjectId) { ... }
function getUser(id: UserId) { ... }

const projectId = createProjectId('proj_123')
const userId = createUserId('user_456')

getProject(projectId) // ✅ OK
getProject(userId)    // ❌ Type error - prevents bugs!
```

### Pattern 5: Utility Types for Common Patterns

```typescript
// lib/types/utils.ts

// Make specific properties optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Make specific properties required
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>

// Extract keys with specific value type
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

// Deep partial
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// Deep readonly
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// Example usage
interface User {
  id: string
  name: string
  email: string
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

// Create user form (id is auto-generated)
type UserForm = Optional<User, 'id'>

// Update preferences (everything else readonly)
type UpdatePreferences = DeepPartial<Pick<User, 'preferences'>>
```

---

## 8. TYPE EXPORTS & ORGANIZATION

### Current Structure (Good Foundation)
```
types/
├── campaign.ts
├── curve.ts
├── entities.ts
├── index.ts          # Main export
├── launch.ts
├── leaderboard.ts
├── network.ts
├── notification.ts
├── profile.ts
└── quest.ts
```

### Enhanced Organization

```typescript
// types/index.ts - Enhanced central export
export * from './campaign'
export * from './curve'
export * from './entities'
export * from './launch'
export * from './leaderboard'
export * from './network'
export * from './notification'
export * from './profile'
export * from './quest'

// Re-export design system types
export type {
  BadgeVariant,
  BadgeSize,
  ButtonVariant,
  ButtonSize,
  IconColorSemantic,
  ProjectStatus,
} from '@/lib/design-system/types'

// Re-export icon types
export type {
  IconProps,
  StandardIconSize,
  CustomDimensionIconProps,
  BadgeIconProps,
  ProgressIconProps,
} from '@/lib/icons/types'

// Component prop types (for external consumers)
export type { ProjectCardProps } from '@/components/ProjectCard'
export type { BadgeProps } from '@/lib/design-system/components/Badge'

// types/design-system.ts - NEW
/**
 * Design System Types
 * Centralized types for all design tokens and component variants
 */
export * from '@/lib/design-system/types'
export * from '@/lib/icons/types'

// JSDoc comments for better IntelliSense
/**
 * Status of a project in the platform
 * @example 'live' - Project is currently active and accepting contributions
 * @example 'frozen' - Project is frozen pending migration to DEX
 */
export type { ProjectStatus } from '@/lib/design-system/types'
```

### Type Documentation Pattern

```typescript
// types/campaign.ts - Enhanced with JSDoc

/**
 * Input data for creating a clip campaign
 *
 * @property title - Campaign title (1-80 characters)
 * @property platforms - Supported platforms (minimum 1 required)
 * @property prizePoolUsd - Total prize pool in USDC
 * @property payoutPerKUsd - Payout rate per 1000 views in USDC
 * @property endAt - Campaign end time (epoch milliseconds)
 * @property autoApprove - Whether to auto-approve submissions meeting criteria
 *
 * @example
 * ```typescript
 * const campaign: CreateClipCampaignInput = {
 *   title: "Launch Campaign Q4",
 *   platforms: ["youtube", "tiktok"],
 *   prizePoolUsd: 5000,
 *   payoutPerKUsd: 10,
 *   endAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
 *   socialLinks: ["https://twitter.com/project"],
 *   autoApprove: false
 * }
 * ```
 */
export type CreateClipCampaignInput = {
  title: string
  image?: File
  platforms: ("youtube" | "tiktok" | "twitch" | "x")[]
  videoLen?: { minSec?: number; maxSec?: number }
  prizePoolUsd: number
  payoutPerKUsd: number
  endAt: number
  driveLink?: string
  socialLinks: string[]
  description?: string
  conditions?: string
  minViewsRequired?: number
  autoApprove: boolean
}
```

---

## 9. MIGRATION STRATEGY

### Phase 1: Foundation (Week 1) - CRITICAL PATH

**Priority 1.1: Fix Compilation Errors**
- [ ] Create `lib/icons/types.ts` with centralized icon types
- [ ] Update all 52 icon components to use new types
- [ ] Fix missing `../types` imports in IconPriceDown, IconPriceUp, IconVerified, IconNotification
- [ ] Update `app/btdemo/page.tsx` to use correct icon sizes or update icon definitions
- [ ] Verify `tsc --noEmit` passes

**Priority 1.2: Design System Types**
- [ ] Create `lib/design-system/types.ts` with comprehensive type system
- [ ] Update `lib/design-system/tokens.ts` to use new types with `satisfies` keyword
- [ ] Add type-safe helper functions with generics
- [ ] Update `types/index.ts` to re-export design system types

**Priority 1.3: Error Handling**
- [ ] Create `lib/errors/types.ts` with AppError classes
- [ ] Create `lib/errors/handler.ts` with handleApiError function
- [ ] Update 5-10 API routes as proof of concept
- [ ] Validate pattern works before bulk migration

**Verification:**
```bash
npx tsc --noEmit           # Should show 0 errors
grep -r "any" app/api | wc -l  # Should decrease by ~20
```

### Phase 2: Validation Expansion (Week 1-2)

**Priority 2.1: Zod Schema Expansion**
- [ ] Create `lib/validations/project.ts` with discriminated unions
- [ ] Create `lib/validations/api-responses.ts` with standard response schemas
- [ ] Create `lib/validations/user.ts` for user data validation
- [ ] Update `lib/validations/index.ts` central export

**Priority 2.2: API Integration**
- [ ] Update API routes to use Zod validation
- [ ] Add runtime validation for all POST/PUT endpoints
- [ ] Add type-safe response helpers
- [ ] Test validation errors return proper formats

**Verification:**
```bash
# All API routes should use Zod validation
grep -r "safeParse\|parse" app/api | wc -l
```

### Phase 3: Eliminate `any` (Week 2)

**Priority 3.1: API Error Handling (90% of any usage)**
- [ ] Run migration script on remaining 60+ API routes
- [ ] Replace all `catch (error: any)` with type-safe error handling
- [ ] Add custom error classes where needed
- [ ] Verify error responses match ErrorResponse type

**Priority 3.2: Component Props**
- [ ] Audit components with `any` in props
- [ ] Define strict prop interfaces
- [ ] Add discriminated unions where needed
- [ ] Update all component usage

**Priority 3.3: Third-Party Integrations**
- [ ] Add Zod schemas for Appwrite responses
- [ ] Add type wrappers for Privy SDK
- [ ] Add types for Solana Web3.js responses
- [ ] Create type-safe wrapper functions

**Verification:**
```bash
grep -r "any" app components lib --include="*.ts" --include="*.tsx" | wc -l
# Target: 0
```

### Phase 4: Advanced Patterns (Week 2-3)

**Priority 4.1: Generic Hooks**
- [ ] Create `useTypedFetch` hook with Zod validation
- [ ] Create `useTypedMutation` hook
- [ ] Create `useTypedForm` hook with validation
- [ ] Document usage patterns

**Priority 4.2: Branded Types**
- [ ] Create branded types for IDs (ProjectId, UserId, etc.)
- [ ] Update database query functions
- [ ] Add type guards and constructors
- [ ] Migrate critical code paths

**Priority 4.3: Utility Types**
- [ ] Create `lib/types/utils.ts` with common utility types
- [ ] Document usage examples
- [ ] Apply to complex components
- [ ] Add JSDoc comments

### Phase 5: Documentation & Testing (Week 3)

**Priority 5.1: Type Documentation**
- [ ] Add JSDoc comments to all public types
- [ ] Add usage examples
- [ ] Create TypeScript best practices guide
- [ ] Document common patterns

**Priority 5.2: Testing**
- [ ] Create type tests (with `@ts-expect-error`)
- [ ] Test discriminated unions work correctly
- [ ] Test generic types infer properly
- [ ] Test branded types prevent misuse

**Priority 5.3: Team Training**
- [ ] Create migration guide
- [ ] Document new patterns
- [ ] Share examples
- [ ] Code review checklist

---

## 10. QUALITY GATES & VERIFICATION

### Compilation Gates

```bash
# Must pass before any commit
npx tsc --noEmit --pretty

# Must show 0 errors
echo $?  # Should be 0
```

### Type Coverage Metrics

```bash
# Count any usage (target: 0)
grep -r ": any\|<any>\|as any" app components lib --include="*.ts" --include="*.tsx" | wc -l

# Count @ts- suppressions (target: 0)
grep -r "@ts-ignore\|@ts-expect-error\|@ts-nocheck" app components lib --include="*.ts" --include="*.tsx" | wc -l

# Count ESLint disables (target: 0)
grep -r "eslint-disable" app components lib --include="*.ts" --include="*.tsx" | wc -l
```

### Pre-Commit Hook

```bash
# .husky/pre-commit
#!/bin/sh

echo "Running TypeScript type check..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found. Commit aborted."
  exit 1
fi

echo "Running any type check..."
ANY_COUNT=$(grep -r ": any\|<any>\|as any" app components lib --include="*.ts" --include="*.tsx" | wc -l)

if [ $ANY_COUNT -gt 0 ]; then
  echo "⚠️  Warning: $ANY_COUNT instances of 'any' type found"
  echo "Consider using proper types instead"
fi

echo "✅ Type checks passed"
```

### Code Review Checklist

**For Every PR:**
- [ ] `tsc --noEmit` passes with 0 errors
- [ ] No new `any` types introduced (check diff)
- [ ] No `@ts-ignore` or `@ts-expect-error` added without justification
- [ ] All API boundaries have Zod validation
- [ ] All component props have strict interfaces
- [ ] Complex logic has type guards
- [ ] Public functions have JSDoc comments

**For btdemo Rollout:**
- [ ] All design tokens are typed
- [ ] All icon components use centralized types
- [ ] All component variants use discriminated unions
- [ ] All color/size props use literal unions
- [ ] No hardcoded values without type constants

---

## 11. 12/10 EXCELLENCE FEATURES

### What Makes This EXCEPTIONAL?

#### 1. Zero Runtime Errors from Type Mismatches
- Every API boundary validated with Zod
- Every component prop strictly typed
- Every state transition type-checked
- Discriminated unions prevent impossible states

#### 2. Template Literal Types for CSS
```typescript
// Autocomplete for every possible Tailwind class
type SpacingClass = `${'' | 'm' | 'p'}${'' | 't' | 'b' | 'l' | 'r' | 'x' | 'y'}-${0 | 1 | 2 | 4 | 8 | 16}`

// Usage - full autocomplete in IDE
const className: SpacingClass = 'mt-4'
//                                 ^
//                          autocomplete shows all valid options
```

#### 3. Branded Types Prevent Category Errors
```typescript
// Impossible to mix up IDs
getProject(userId)  // ❌ Compile error
getProject(createProjectId(rawId))  // ✅ OK
```

#### 4. Type-Safe State Machines
```typescript
type ProjectState =
  | { status: 'draft'; data: DraftData }
  | { status: 'active'; data: ActiveData; startedAt: Date }
  | { status: 'frozen'; data: ActiveData; frozenAt: Date; reason: string }
  | { status: 'launched'; data: LaunchedData; launchedAt: Date }

// TypeScript narrows type based on status check
if (project.status === 'launched') {
  // TypeScript knows project.data is LaunchedData
  // and project.launchedAt exists
  console.log(project.launchedAt)
}
```

#### 5. Exhaustiveness Checking
```typescript
function getStatusColor(status: ProjectStatus): string {
  switch (status) {
    case 'live': return 'green'
    case 'active': return 'blue'
    case 'frozen': return 'orange'
    case 'ended': return 'gray'
    case 'launched': return 'purple'
    default:
      // TypeScript ensures we handle all cases
      const exhaustive: never = status
      throw new Error(`Unhandled status: ${exhaustive}`)
  }
}
```

#### 6. Generic Constraint Patterns
```typescript
// Only allow objects with 'id' property
function createIndexed<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map(item => [item.id, item]))
}

// TypeScript ensures type safety
const projectMap = createIndexed(projects)  // ✅ OK
const stringMap = createIndexed(['a', 'b']) // ❌ Error - strings don't have 'id'
```

#### 7. Inference from Usage
```typescript
// TypeScript infers return type from schema
function useQuery<T extends z.ZodTypeAny>(schema: T) {
  // Return type automatically inferred as z.infer<T>
  return { data: schema.parse(fetchedData) }
}

const { data } = useQuery(projectSchema)
// data is typed as Project without explicit annotation
```

#### 8. Const Assertions for Maximum Type Safety
```typescript
const STATUS_CONFIG = {
  live: { color: '#00FF00', label: 'Live' },
  frozen: { color: '#FFA500', label: 'Frozen' },
  ended: { color: '#808080', label: 'Ended' },
} as const

// Type is inferred as exact literal types
type StatusKey = keyof typeof STATUS_CONFIG  // 'live' | 'frozen' | 'ended'
type StatusColor = typeof STATUS_CONFIG[StatusKey]['color']  // '#00FF00' | '#FFA500' | '#808080'
```

---

## SUMMARY

### Current Metrics
- **TypeScript Errors:** 22
- **`any` Usage:** 273 instances
- **Type Suppressions:** 0
- **Compilation:** ❌ Failing

### Target Metrics (12/10 Excellence)
- **TypeScript Errors:** 0
- **`any` Usage:** 0 instances
- **Type Suppressions:** 0
- **Compilation:** ✅ Clean
- **Type Coverage:** 100% of public APIs
- **Runtime Validation:** All API boundaries
- **Type Safety Score:** 12/10

### Key Deliverables

1. **Icon Type System** - Centralized types for 52 icon components
2. **Design System Types** - Comprehensive type coverage for all tokens
3. **Zod Validation** - Runtime validation at all API boundaries
4. **Error Handling** - Type-safe error handling across 67 API routes
5. **Advanced Patterns** - Branded types, template literals, discriminated unions
6. **Documentation** - JSDoc comments and usage examples
7. **Quality Gates** - Pre-commit hooks and CI checks

### Files to Create/Modify

**New Files:**
- `lib/icons/types.ts`
- `lib/design-system/types.ts`
- `lib/errors/types.ts`
- `lib/errors/handler.ts`
- `lib/validations/project.ts`
- `lib/validations/api-responses.ts`
- `lib/types/utils.ts`
- `lib/types/branded.ts`

**Files to Update:**
- All 52 icon components in `lib/icons/custom/`
- `lib/design-system/tokens.ts`
- `types/index.ts`
- 67 API route files in `app/api/`
- `app/btdemo/page.tsx`

### Timeline
- **Week 1:** Foundation + Fix all compilation errors
- **Week 2:** Eliminate all `any` types
- **Week 3:** Advanced patterns + Documentation
- **Total:** 3 weeks to 12/10 type safety

---

**Next Steps:**
1. Approve this plan
2. Create feature branch: `feat/typescript-excellence`
3. Execute Phase 1.1 (fix compilation errors)
4. Verify with `tsc --noEmit`
5. Continue through migration phases

This plan achieves 12/10 type safety through:
- Zero compromise on type safety
- Advanced TypeScript patterns
- Runtime validation with Zod
- Comprehensive documentation
- Developer experience optimization
- Maintainability and scalability
