# BTDEMO Overlays

Complete overlay system (modals, drawers, dropdowns) with BTDEMO styling, LED numerals, and full accessibility.

## Components

### 1. SubmitLaunchDrawer (Right Slide Drawer)
**File:** `SubmitLaunchDrawer.tsx`

Full-height drawer that slides in from the right for token launch submissions.

**Features:**
- Form validation with real-time error messages
- Character counters on all text inputs
- Drag-and-drop logo upload
- Social links input (Twitter, Discord, Telegram, Website)
- Auto-focus on first input
- Escape key to close
- Backdrop click to dismiss

**Usage:**
```tsx
import { SubmitLaunchDrawer } from '@/components/btdemo/overlays/SubmitLaunchDrawer'

const [submitDrawerOpen, setSubmitDrawerOpen] = useState(false)

<SubmitLaunchDrawer
  isOpen={submitDrawerOpen}
  onClose={() => setSubmitDrawerOpen(false)}
  onSubmit={(data) => {
    console.log('Launch data:', data)
    // Handle submission
  }}
/>
```

### 2. TradeModal (Centered Modal)
**File:** `TradeModal.tsx`

Buy/sell modal with LED price breakdown and live calculation.

**Features:**
- Buy/Sell toggle tabs
- LED numeral display for all amounts
- Live calculation of fees and totals
- Quick amount buttons (0.1, 0.5, 1, 5 SOL)
- MAX button for full balance
- Auto-focus on amount input
- Escape key and backdrop click to close

**Usage:**
```tsx
import { TradeModal } from '@/components/btdemo/overlays/TradeModal'

const [tradeModalOpen, setTradeModalOpen] = useState(false)
const [selectedProject, setSelectedProject] = useState(null)

<TradeModal
  isOpen={tradeModalOpen}
  onClose={() => setTradeModalOpen(false)}
  project={{
    id: '1',
    name: 'LaunchOS Platform',
    ticker: 'LOS',
    logo: 'https://example.com/logo.png',
    motionScore: 847
  }}
  mode="buy" // or "sell"
/>
```

### 3. CommentsDrawer (Right Slide Drawer)
**File:** `CommentsDrawer.tsx`

Real-time comments with upvote functionality.

**Features:**
- Comment list with avatars and timestamps
- Upvote buttons with LED counters
- New comment textarea
- Character counter (500 max)
- Auto-focus on textarea
- Real-time timestamp formatting
- Escape key to close

**Usage:**
```tsx
import { CommentsDrawer } from '@/components/btdemo/overlays/CommentsDrawer'

const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false)

<CommentsDrawer
  isOpen={commentsDrawerOpen}
  onClose={() => setCommentsDrawerOpen(false)}
  project={{
    id: '1',
    name: 'LaunchOS Platform',
    ticker: 'LOS'
  }}
/>
```

### 4. CollaborateModal (Centered Modal)
**File:** `CollaborateModal.tsx`

Partnership proposal form with multiple collaboration types.

**Features:**
- Collaboration type selector (Marketing, Technical, Funding, Partnership)
- Long-form description textarea
- Budget and timeline inputs
- Form validation
- Info box with response time
- Auto-focus on description
- Escape key to close

**Usage:**
```tsx
import { CollaborateModal } from '@/components/btdemo/overlays/CollaborateModal'

const [collaborateModalOpen, setCollaborateModalOpen] = useState(false)

<CollaborateModal
  isOpen={collaborateModalOpen}
  onClose={() => setCollaborateModalOpen(false)}
  project={{
    id: '1',
    name: 'LaunchOS Platform',
    ticker: 'LOS',
    logo: 'https://example.com/logo.png'
  }}
/>
```

### 5. NotificationDropdown (Absolute Positioned Dropdown)
**File:** `NotificationDropdown.tsx`

Dropdown notification center with type-colored badges.

**Features:**
- Type-colored notification badges (buy, comment, follow, launch)
- Unread count badge
- Mark all as read
- Individual notification click to mark as read
- Auto-close on click outside
- Escape key to close
- LED numeral for unread count

**Usage:**
```tsx
import { NotificationDropdown } from '@/components/btdemo/overlays/NotificationDropdown'

const [notificationsOpen, setNotificationsOpen] = useState(false)
const bellButtonRef = useRef<HTMLButtonElement>(null)

<button ref={bellButtonRef} onClick={() => setNotificationsOpen(!notificationsOpen)}>
  <Bell />
</button>

<NotificationDropdown
  isOpen={notificationsOpen}
  onClose={() => setNotificationsOpen(false)}
  anchorRef={bellButtonRef}
/>
```

## Design System Features

### BTDEMO Styling
- `glass-premium` - Premium glass cards with zinc-900/60 background
- `glass-interactive` - Interactive glass with hover effects
- LED numerals via `font-led-16`, `font-led-32` classes
- Icon colors via `icon-interactive`, `icon-primary` utilities

### Animations (Framer Motion)
- **Drawers:** Slide from right with spring physics (damping: 25, stiffness: 300)
- **Modals:** Fade + scale (0.9 to 1.0) over 300ms
- **Dropdowns:** Fade + slide up over 200ms

### Accessibility
- ARIA labels on all icon-only buttons
- ARIA live regions for error messages
- Focus traps within overlays
- Escape key handlers
- Keyboard navigation support
- Role attributes (dialog, tablist, tabpanel)

### Focus Management
- Auto-focus on first input/textarea when overlay opens
- Focus restored to trigger element on close
- Tab cycles through form fields

### Body Scroll Lock
All overlays set `document.body.style.overflow = 'hidden'` when open and restore on close.

## Integration Example

Complete integration with all overlays on a page:

```tsx
'use client'

import { useState } from 'react'
import { SubmitLaunchDrawer } from '@/components/btdemo/overlays/SubmitLaunchDrawer'
import { TradeModal } from '@/components/btdemo/overlays/TradeModal'
import { CommentsDrawer } from '@/components/btdemo/overlays/CommentsDrawer'
import { CollaborateModal } from '@/components/btdemo/overlays/CollaborateModal'
import { NotificationDropdown } from '@/components/btdemo/overlays/NotificationDropdown'

export default function LaunchPage() {
  // Overlay states
  const [submitDrawerOpen, setSubmitDrawerOpen] = useState(false)
  const [tradeModalOpen, setTradeModalOpen] = useState(false)
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false)
  const [collaborateModalOpen, setCollaborateModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<any>(null)

  return (
    <div className="min-h-screen">
      {/* Your page content */}

      {/* Trigger buttons */}
      <button onClick={() => setSubmitDrawerOpen(true)}>Launch Token</button>
      <button onClick={() => setTradeModalOpen(true)}>Trade Keys</button>
      <button onClick={() => setCommentsDrawerOpen(true)}>View Comments</button>
      <button onClick={() => setCollaborateModalOpen(true)}>Collaborate</button>
      <button onClick={() => setNotificationsOpen(!notificationsOpen)}>Notifications</button>

      {/* Overlays */}
      <SubmitLaunchDrawer
        isOpen={submitDrawerOpen}
        onClose={() => setSubmitDrawerOpen(false)}
        onSubmit={(data) => console.log('Launch:', data)}
      />

      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        project={selectedProject}
        mode="buy"
      />

      <CommentsDrawer
        isOpen={commentsDrawerOpen}
        onClose={() => setCommentsDrawerOpen(false)}
        project={selectedProject}
      />

      <CollaborateModal
        isOpen={collaborateModalOpen}
        onClose={() => setCollaborateModalOpen(false)}
        project={selectedProject}
      />

      <NotificationDropdown
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        anchorRef={bellButtonRef}
      />
    </div>
  )
}
```

## TypeScript Types

All components export their prop interfaces:

```typescript
interface SubmitLaunchDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LaunchFormData) => void
}

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    name: string
    ticker: string
    logo: string
    motionScore: number
  }
  mode: 'buy' | 'sell'
}

interface CommentsDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    name: string
    ticker: string
  }
}

interface CollaborateModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    name: string
    ticker: string
    logo: string
  }
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement>
}
```

## Performance Considerations

1. **Lazy Loading:** All overlays only render when `isOpen={true}`
2. **AnimatePresence:** Framer Motion's exit animations handled properly
3. **Event Listeners:** Cleaned up in useEffect return functions
4. **Body Scroll:** Restored on unmount
5. **Click Outside:** Optimized with refs to prevent unnecessary renders

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with `-webkit-backdrop-filter`)
- Mobile: Tested on iOS Safari and Android Chrome

## Testing

All overlays include:
- Escape key handler
- Click outside to close
- Focus trap within overlay
- Auto-focus on first interactive element
- Keyboard navigation
- ARIA attributes for screen readers
