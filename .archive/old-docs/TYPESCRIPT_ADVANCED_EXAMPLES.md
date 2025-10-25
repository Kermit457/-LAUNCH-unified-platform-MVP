# TypeScript Advanced Patterns - Code Examples

**12/10 Excellence Examples**

---

## 1. Discriminated Union for Project States

```typescript
// types/project-states.ts

type DraftProject = {
  status: 'draft'
  id: string
  title: string
  description: string
  createdBy: string
}

type ActiveProject = {
  status: 'active' | 'live'
  id: string
  title: string
  description: string
  createdBy: string
  launchedAt: Date
  metrics: {
    holders: number
    volume24h: number
    priceChange: number
  }
}

type FrozenProject = {
  status: 'frozen'
  id: string
  title: string
  description: string
  createdBy: string
  launchedAt: Date
  frozenAt: Date
  reason: string
  metrics: {
    holders: number
    volume24h: number
    priceChange: number | null
  }
}

type LaunchedProject = {
  status: 'launched'
  id: string
  title: string
  description: string
  createdBy: string
  launchedAt: Date
  dexMigratedAt: Date
  dexPair: string
  metrics: {
    fdv: number
    poolValue: number
    priceChange: number
  }
}

// Discriminated union
export type Project = DraftProject | ActiveProject | FrozenProject | LaunchedProject

// Type guard functions
export function isDraft(project: Project): project is DraftProject {
  return project.status === 'draft'
}

export function isActive(project: Project): project is ActiveProject {
  return project.status === 'active' || project.status === 'live'
}

export function isFrozen(project: Project): project is FrozenProject {
  return project.status === 'frozen'
}

export function isLaunched(project: Project): project is LaunchedProject {
  return project.status === 'launched'
}

// Usage example with automatic type narrowing
function getProjectDisplay(project: Project): React.ReactNode {
  switch (project.status) {
    case 'draft':
      // TypeScript knows project is DraftProject
      return <DraftCard createdBy={project.createdBy} />

    case 'active':
    case 'live':
      // TypeScript knows project is ActiveProject
      return <ActiveCard
        launchedAt={project.launchedAt}
        holders={project.metrics.holders}
      />

    case 'frozen':
      // TypeScript knows project is FrozenProject
      return <FrozenCard
        reason={project.reason}
        frozenAt={project.frozenAt}
      />

    case 'launched':
      // TypeScript knows project is LaunchedProject
      return <LaunchedCard
        dexPair={project.dexPair}
        fdv={project.metrics.fdv}
      />

    default:
      // Exhaustiveness check - compile error if we miss a case
      const exhaustive: never = project
      throw new Error(`Unhandled project status: ${exhaustive}`)
  }
}
```

---

## 2. Branded Types for ID Safety

```typescript
// lib/types/branded.ts

declare const brand: unique symbol

export type Brand<T, TBrand> = T & { readonly [brand]: TBrand }

// ID types
export type ProjectId = Brand<string, 'ProjectId'>
export type UserId = Brand<string, 'UserId'>
export type CampaignId = Brand<string, 'CampaignId'>
export type ClipId = Brand<string, 'ClipId'>
export type WalletAddress = Brand<string, 'WalletAddress'>

// Constructor functions with validation
export function createProjectId(id: string): ProjectId {
  if (!id.startsWith('proj_')) {
    throw new Error('Invalid project ID format')
  }
  return id as ProjectId
}

export function createUserId(id: string): UserId {
  if (!id.startsWith('user_')) {
    throw new Error('Invalid user ID format')
  }
  return id as UserId
}

export function createWalletAddress(address: string): WalletAddress {
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    throw new Error('Invalid Solana wallet address')
  }
  return address as WalletAddress
}

// Type guards
export function isProjectId(id: string): id is ProjectId {
  return id.startsWith('proj_')
}

export function isUserId(id: string): id is UserId {
  return id.startsWith('user_')
}

// Usage - prevents mixing IDs
function getProject(projectId: ProjectId): Promise<Project> {
  return fetch(`/api/projects/${projectId}`)
}

function getUser(userId: UserId): Promise<User> {
  return fetch(`/api/users/${userId}`)
}

// Example usage
const rawProjectId = 'proj_abc123'
const rawUserId = 'user_xyz789'

const projectId = createProjectId(rawProjectId)
const userId = createUserId(rawUserId)

getProject(projectId)  // ✅ OK
getProject(userId)     // ❌ Compile error - type safety!

// Database layer example
class ProjectRepository {
  async findById(id: ProjectId): Promise<Project | null> {
    // Implementation
  }

  async findByUserId(userId: UserId): Promise<Project[]> {
    // Implementation
  }
}

// This prevents bugs like:
// repo.findById(userId)  // ❌ Compile error
```

---

## 3. Template Literal Types for Design System

```typescript
// lib/design-system/classnames.ts

// Base types
type ColorName = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
type Intensity = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
type Prefix = 'text' | 'bg' | 'border'

// Generate all possible color classes
type ColorClass = `${Prefix}-${ColorName}-${Intensity}`

// Spacing
type SpacingValue = 0 | 1 | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64
type SpacingDirection = '' | 't' | 'b' | 'l' | 'r' | 'x' | 'y'
type SpacingPrefix = 'm' | 'p'
type SpacingClass = `${SpacingPrefix}${SpacingDirection}-${SpacingValue}`

// Border radius
type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
type RadiusClass = `rounded-${RadiusValue}`

// Combine all design system classes
type DesignSystemClass = ColorClass | SpacingClass | RadiusClass

// Type-safe class builder
export function buildClass<T extends DesignSystemClass>(className: T): T {
  return className
}

// Usage with full autocomplete
const textClass = buildClass('text-primary-500')
//                             ^
//                      IDE shows all valid options

const spacing = buildClass('mt-16')
//                          ^
//                   IDE shows all valid spacing classes

// Runtime validation (optional)
export function validateClass(className: string): className is DesignSystemClass {
  const colorRegex = /^(text|bg|border)-(primary|secondary|success|error|warning|info)-(50|100|200|300|400|500|600|700|800|900)$/
  const spacingRegex = /^(m|p)(t|b|l|r|x|y)?-(0|1|2|4|8|12|16|20|24|32|40|48|64)$/
  const radiusRegex = /^rounded-(none|sm|md|lg|xl|full)$/

  return colorRegex.test(className) ||
         spacingRegex.test(className) ||
         radiusRegex.test(className)
}

// Advanced: Icon size with literal types
type IconSizePixels = `${number}px`
type IconSize = 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 128

export function iconSizeToPixels(size: IconSize): IconSizePixels {
  return `${size}px` as IconSizePixels
}

// Usage
const sizeInPx = iconSizeToPixels(24)  // Type is '24px'
```

---

## 4. Generic Type-Safe API Hooks

```typescript
// hooks/useTypedApi.ts

import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'

// Generic fetch state
interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

// Generic mutation state
interface MutationState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  mutate: (input: unknown) => Promise<void>
  reset: () => void
}

// Type-safe fetch hook
export function useTypedFetch<T extends z.ZodTypeAny>(
  url: string,
  schema: T,
  options?: RequestInit
): FetchState<z.infer<T>> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<z.infer<T>>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      const validated = schema.parse(json)

      setState({ data: validated, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      })
    }
  }, [url, schema])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}

// Type-safe mutation hook
export function useTypedMutation<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  url: string,
  inputSchema: TInput,
  outputSchema: TOutput,
  options?: Omit<RequestInit, 'body'>
): MutationState<z.infer<TOutput>> {
  const [state, setState] = useState<MutationState<z.infer<TOutput>>>({
    data: null,
    loading: false,
    error: null,
    mutate: async () => {},
    reset: () => {},
  })

  const mutate = useCallback(async (input: unknown) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Validate input
      const validatedInput = inputSchema.parse(input)

      const response = await fetch(url, {
        ...options,
        method: options?.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(validatedInput),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      const validated = outputSchema.parse(json)

      setState(prev => ({ ...prev, data: validated, loading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }))
    }
  }, [url, inputSchema, outputSchema])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      mutate,
      reset: () => {},
    })
  }, [mutate])

  return { ...state, mutate, reset }
}

// Usage example
import { projectSchema, createProjectSchema } from '@/lib/validations/project'

function ProjectList() {
  const { data: projects, loading, error, refetch } = useTypedFetch(
    '/api/projects',
    z.object({ projects: z.array(projectSchema) })
  )

  const createMutation = useTypedMutation(
    '/api/projects',
    createProjectSchema,
    projectSchema
  )

  async function handleCreate(formData: unknown) {
    await createMutation.mutate(formData)
    if (!createMutation.error) {
      await refetch()
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error.message} />

  // projects is fully typed as Project[]
  return (
    <div>
      {projects?.projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  )
}
```

---

## 5. Conditional Props Pattern

```typescript
// components/Button.tsx

type ButtonBaseProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

// Button must be either a link OR a button, not both
type ButtonAsLink = ButtonBaseProps & {
  href: string
  target?: '_blank' | '_self'
  onClick?: never
  type?: never
}

type ButtonAsButton = ButtonBaseProps & {
  onClick: () => void | Promise<void>
  type?: 'button' | 'submit' | 'reset'
  href?: never
  target?: never
}

export type ButtonProps = ButtonAsLink | ButtonAsButton

export function Button(props: ButtonProps) {
  const baseClassName = cn(
    'rounded-lg px-4 py-2 font-medium transition-colors',
    props.variant === 'primary' && 'bg-primary text-black hover:bg-primary-hover',
    props.variant === 'secondary' && 'bg-white/10 text-white hover:bg-white/20',
    props.variant === 'ghost' && 'text-white hover:bg-white/10',
    props.size === 'sm' && 'px-3 py-1.5 text-sm',
    props.size === 'lg' && 'px-6 py-3 text-lg',
    props.disabled && 'opacity-50 cursor-not-allowed',
    props.className
  )

  if ('href' in props) {
    return (
      <a
        href={props.href}
        target={props.target}
        className={baseClassName}
      >
        {props.children}
      </a>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={baseClassName}
    >
      {props.children}
    </button>
  )
}

// Usage - TypeScript enforces correct props
<Button href="/projects">View Projects</Button>  // ✅ OK
<Button onClick={handleClick}>Submit</Button>    // ✅ OK
<Button href="/projects" onClick={handleClick}>  // ❌ Error - can't have both!
```

---

## 6. Type-Safe State Machine

```typescript
// lib/state-machines/project.ts

type State<TStatus extends string, TContext = {}> = {
  status: TStatus
} & TContext

// Define all possible states
type DraftState = State<'draft', {
  canPublish: boolean
  validationErrors: string[]
}>

type ActiveState = State<'active', {
  startedAt: Date
  participants: number
}>

type FrozenState = State<'frozen', {
  startedAt: Date
  frozenAt: Date
  reason: string
  canUnfreeze: boolean
}>

type LaunchedState = State<'launched', {
  startedAt: Date
  launchedAt: Date
  dexUrl: string
}>

// State machine type
type ProjectState = DraftState | ActiveState | FrozenState | LaunchedState

// Define valid transitions
type Transitions = {
  draft: {
    publish: ActiveState
  }
  active: {
    freeze: FrozenState
    launch: LaunchedState
  }
  frozen: {
    unfreeze: ActiveState
    launch: LaunchedState
  }
  launched: {}  // Terminal state
}

// Type-safe transition function
function transition<
  TCurrentStatus extends keyof Transitions,
  TNextStatus extends keyof Transitions[TCurrentStatus]
>(
  currentState: Extract<ProjectState, { status: TCurrentStatus }>,
  action: TNextStatus,
  context: Omit<Transitions[TCurrentStatus][TNextStatus], 'status'>
): Transitions[TCurrentStatus][TNextStatus] {
  return {
    status: action,
    ...context,
  } as Transitions[TCurrentStatus][TNextStatus]
}

// Usage with type safety
const draftState: DraftState = {
  status: 'draft',
  canPublish: true,
  validationErrors: []
}

// TypeScript knows only 'publish' is valid here
const activeState = transition(draftState, 'publish', {
  startedAt: new Date(),
  participants: 0
})

// This would be a compile error
// const invalid = transition(draftState, 'freeze', { ... })  // ❌ Error
```

---

## 7. Generic Collection Type

```typescript
// lib/types/collection.ts

interface Collection<T extends { id: string }> {
  items: T[]
  byId: Map<string, T>
  add(item: T): void
  remove(id: string): void
  update(id: string, updates: Partial<T>): void
  find(predicate: (item: T) => boolean): T | undefined
  filter(predicate: (item: T) => boolean): T[]
}

export function createCollection<T extends { id: string }>(
  initialItems: T[] = []
): Collection<T> {
  const items = [...initialItems]
  const byId = new Map(items.map(item => [item.id, item]))

  return {
    items,
    byId,

    add(item: T) {
      if (!byId.has(item.id)) {
        items.push(item)
        byId.set(item.id, item)
      }
    },

    remove(id: string) {
      const index = items.findIndex(item => item.id === id)
      if (index !== -1) {
        items.splice(index, 1)
        byId.delete(id)
      }
    },

    update(id: string, updates: Partial<T>) {
      const item = byId.get(id)
      if (item) {
        const updated = { ...item, ...updates }
        const index = items.findIndex(i => i.id === id)
        items[index] = updated
        byId.set(id, updated)
      }
    },

    find(predicate: (item: T) => boolean) {
      return items.find(predicate)
    },

    filter(predicate: (item: T) => boolean) {
      return items.filter(predicate)
    },
  }
}

// Usage
interface Project {
  id: string
  title: string
  status: 'active' | 'frozen'
}

const projects = createCollection<Project>([
  { id: '1', title: 'Project A', status: 'active' },
  { id: '2', title: 'Project B', status: 'frozen' },
])

// All methods are type-safe
projects.add({ id: '3', title: 'Project C', status: 'active' })
projects.update('1', { status: 'frozen' })
const activeProjects = projects.filter(p => p.status === 'active')
```

---

## 8. Exhaustiveness Checking

```typescript
// lib/utils/exhaustive.ts

export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`)
}

// Usage in switch statements
type Status = 'draft' | 'active' | 'frozen' | 'launched'

function getStatusColor(status: Status): string {
  switch (status) {
    case 'draft':
      return 'gray'
    case 'active':
      return 'green'
    case 'frozen':
      return 'orange'
    case 'launched':
      return 'purple'
    default:
      // If we add a new status and forget to handle it,
      // TypeScript will show an error here
      return assertNever(status)
  }
}

// If we add a new status:
// type Status = 'draft' | 'active' | 'frozen' | 'launched' | 'pending'
// TypeScript will error at assertNever(status) because status could be 'pending'
```

---

## Summary

These patterns achieve 12/10 type safety by:

1. **Discriminated Unions** - Prevent impossible states
2. **Branded Types** - Prevent ID mixing at compile time
3. **Template Literals** - Type-safe class name generation
4. **Generic Hooks** - Reusable with full type safety
5. **Conditional Props** - Enforce mutually exclusive props
6. **State Machines** - Type-safe state transitions
7. **Generic Collections** - Reusable data structures
8. **Exhaustiveness** - Catch missing cases at compile time

All patterns provide:
- **Compile-time safety**
- **Runtime validation** (with Zod)
- **IDE autocomplete**
- **Refactoring confidence**
- **Self-documenting code**
