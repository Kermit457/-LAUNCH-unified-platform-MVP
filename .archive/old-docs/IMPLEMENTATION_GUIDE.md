# LaunchOS Design System - Implementation Guide

## ✅ What's Been Completed

### 1. Base Components Created
All core design system components are ready to use:

- ✅ **Card** (`components/ui/card.tsx`)
  - Updated with variants: default, gradient, glass
  - Glow and hover effects built-in
  - Rounded-2xl standard

- ✅ **Button** (`components/ui/button.tsx`)
  - Updated with new variants: default, boost, secondary, ghost, outline
  - Gradient backgrounds matching design system
  - Proper sizing (sm, default, lg)

- ✅ **StatusChip** (`components/ui/status-chip.tsx`)
  - NEW - For LIVE, UPCOMING, ICM, CCM badges
  - Auto-pulse animation for LIVE
  - Consistent pill styling

- ✅ **MetricPill** (`components/ui/metric-pill.tsx`)
  - NEW - For displaying metrics (price, volume, holders, etc.)
  - Supports change indicators (+/-)
  - Icon support

- ✅ **ConvictionBar** (`components/ui/conviction-bar.tsx`)
  - NEW - Standardized conviction/progress bars
  - Gradient fill (purple to pink)
  - Optional label and percentage display

- ✅ **AvatarGroup** (`components/ui/avatar-group.tsx`)
  - NEW - For contributor/team displays
  - Overflow indicator (+X)
  - Configurable size (sm, md, lg)

### 2. Tailwind Config Updated
- ✅ Added design tokens to `tailwind.config.ts`
- ✅ Base colors defined
- ✅ Existing animations preserved

---

## 🚀 How to Use the New Components

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Default card
<Card>
  <CardContent>Content here</CardContent>
</Card>

// Gradient card with glow
<Card variant="gradient" glow>
  <CardContent>Featured content</CardContent>
</Card>

// Glass effect card with hover
<Card variant="glass" hover>
  <CardContent>Interactive content</CardContent>
</Card>

// No hover effect (for static content)
<Card hover={false}>
  <CardContent>Static content</CardContent>
</Card>
```

### Button Component

```tsx
import { Button } from "@/components/ui/button"

// Primary gradient button
<Button variant="default">Click Me</Button>

// Boost button (with extra glow on hover)
<Button variant="boost">Boost Launch</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Ghost button
<Button variant="ghost">Learn More</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### StatusChip Component

```tsx
import { StatusChip } from "@/components/ui/status-chip"

<StatusChip type="live" />       // LIVE with pulse
<StatusChip type="upcoming" />   // UPCOMING
<StatusChip type="icm" />        // ICM
<StatusChip type="ccm" />        // CCM
```

### MetricPill Component

```tsx
import { MetricPill } from "@/components/ui/metric-pill"
import { DollarSign, Users, TrendingUp } from "lucide-react"

// Basic metric
<MetricPill label="Market Cap" value="$1.2M" />

// With change indicator
<MetricPill
  label="24H Volume"
  value="$456K"
  change={12.5}  // Shows +12.5% in green
/>

// With icon
<MetricPill
  label="Holders"
  value="12,453"
  icon={<Users className="w-4 h-4" />}
/>

// Colored variants
<MetricPill
  label="Price Change"
  value="+24.5%"
  variant="positive"
/>
```

### ConvictionBar Component

```tsx
import { ConvictionBar } from "@/components/ui/conviction-bar"

// Standard conviction bar
<ConvictionBar percentage={87} />

// Custom label
<ConvictionBar
  percentage={94}
  label="Community Conviction"
/>

// Hide percentage
<ConvictionBar
  percentage={76}
  showPercentage={false}
/>
```

### AvatarGroup Component

```tsx
import { AvatarGroup } from "@/components/ui/avatar-group"

const contributors = [
  { avatar: '/avatars/1.jpg', name: 'Alice' },
  { avatar: '/avatars/2.jpg', name: 'Bob' },
  // ... more
]

// Basic usage
<AvatarGroup contributors={contributors} />

// With label and max count
<AvatarGroup
  contributors={contributors}
  label="Team"
  max={3}
  size="lg"
/>
```

---

## 📋 Page-by-Page Migration Plan

### Priority 1: Already Good (Minor Tweaks Only)

#### ✅ Launch Detail Page (`app/launch/[id]/page.tsx`)
**Status:** 95% complete - already using design system
**Needed:**
- Replace action buttons with new Button component variants
- Ensure all cards use `Card` component

**Quick Fix:**
```tsx
// Replace this:
<button className="...">Boost</button>

// With this:
<Button variant="boost">Boost</Button>
```

#### ✅ Launches Demo Page (`app/launches-demo/page.tsx`)
**Status:** Already excellent - this is the reference
**Needed:** None - this is perfect!

---

### Priority 2: Easy Updates (Component Swaps)

#### Network Page (`app/network/page.tsx`)
**Current:** Mixed card styles
**Update:** Use unified Card component

**Before:**
```tsx
<div className="rounded-xl bg-white/5 border border-zinc-800 p-6">
  {/* profile content */}
</div>
```

**After:**
```tsx
<Card variant="default" hover>
  <CardContent className="p-6">
    {/* profile content */}
  </CardContent>
</Card>
```

**Social Icons:** Replace text links with icon-only chips
```tsx
// Before
<a href="#">Twitter: @username</a>

// After
<div className="flex gap-2">
  <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 flex items-center justify-center transition-all">
    <Twitter className="w-4 h-4" />
  </a>
  {/* Telegram, Discord, etc. */}
</div>
```

**Contributors:** Use AvatarGroup
```tsx
<AvatarGroup
  contributors={profile.contributions}
  label="Contributions"
  max={5}
/>
```

---

#### Earn Page (`app/earn/page.tsx`)
**Current:** Campaign list
**Update:** Grid of cards with badges

**Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {campaigns.map(campaign => (
    <Card key={campaign.id} variant="gradient" hover>
      <CardContent className="p-6">
        {/* Badge */}
        <StatusChip type={campaign.type} /> {/* Custom type: raid, bounty, clip */}

        {/* Title */}
        <h3 className="text-xl font-bold text-white mt-4 mb-2">
          {campaign.title}
        </h3>

        {/* Reward */}
        <div className="mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            ${campaign.reward}
          </span>
        </div>

        {/* Progress */}
        <ConvictionBar
          percentage={(campaign.completedTasks / campaign.totalTasks) * 100}
          label="Progress"
        />

        {/* Tasks */}
        <p className="text-sm text-zinc-400 mt-2">
          {campaign.completedTasks}/{campaign.totalTasks} tasks completed
        </p>

        {/* CTA */}
        <Button variant="boost" className="w-full mt-4">
          Join Campaign
        </Button>
      </CardContent>
    </Card>
  ))}
</div>
```

---

#### Tools Page (`app/tools/page.tsx`)
**Current:** List or basic grid
**Update:** Icon-first grid with hover expansion

**Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {tools.map(tool => (
    <Card key={tool.id} variant="glass" hover className="group">
      <CardContent className="p-8 text-center">
        {/* Large icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
          <tool.Icon className="w-8 h-8 text-purple-500" />
        </div>

        {/* Tool name */}
        <h3 className="text-lg font-bold text-white mb-2">
          {tool.name}
        </h3>

        {/* Description - shows on hover */}
        <p className="text-sm text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 mb-4">
          {tool.description}
        </p>

        {/* CTA - shows on hover */}
        <Button
          variant="secondary"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          Use Tool →
        </Button>
      </CardContent>
    </Card>
  ))}
</div>
```

---

### Priority 3: Full Redesigns (Need New Layout)

#### Home Page (`app/page.tsx`)
**Current:** Unknown structure
**Update:** Hero + Featured + How It Works

**Hero Section:**
```tsx
<section className="min-h-screen flex items-center justify-center px-4">
  <div className="max-w-4xl mx-auto text-center">
    {/* Gradient headline */}
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
      <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
        Launch Your Token
      </span>
      <br />
      <span className="text-white">
        The Right Way
      </span>
    </h1>

    {/* Subtitle */}
    <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
      Community-driven platform for ICM and CCM launches.
      Build conviction, earn rewards, grow your network.
    </p>

    {/* CTAs */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button variant="boost" size="lg">
        Explore Launches
      </Button>
      <Button variant="secondary" size="lg">
        Learn More
      </Button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
      <MetricPill label="Active Launches" value="124" />
      <MetricPill label="Total Volume" value="$12M" />
      <MetricPill label="Contributors" value="5,432" />
      <MetricPill label="Conviction" value="94%" />
    </div>
  </div>
</section>
```

---

## 🎨 Quick Reference: Class Patterns

### Standard Card
```tsx
className="rounded-2xl bg-white/5 border border-zinc-800 p-6 transition-all duration-150 hover:scale-[1.02] hover:border-white/20"
```

### Gradient Text
```tsx
className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
```

### Grid Layout
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### Text Hierarchy
```tsx
className="text-white"           // Primary
className="text-zinc-300"        // Secondary
className="text-zinc-400"        // Tertiary
className="text-zinc-500"        // Muted
```

### Interactive Element
```tsx
className="transition-all duration-150 hover:scale-105 active:scale-95"
```

### Glass Effect
```tsx
className="backdrop-blur-xl bg-white/5 border border-white/10"
```

---

## 📦 Component Import Reference

```tsx
// Base UI components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Design system components
import { StatusChip } from "@/components/ui/status-chip"
import { MetricPill } from "@/components/ui/metric-pill"
import { ConvictionBar } from "@/components/ui/conviction-bar"
import { AvatarGroup } from "@/components/ui/avatar-group"

// Launch-specific components (already exist)
import { LaunchHeaderCompact } from "@/components/launch/LaunchHeaderCompact"
import { LiveLaunchCard } from "@/components/launch/cards/LiveLaunchCard"
import { ChartTabs } from "@/components/launch/ChartTabs"
import { InsightChart } from "@/components/launch/InsightChart"
```

---

## ⚡ Quick Start: Update a Page in 5 Steps

1. **Import new components**
```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"
```

2. **Replace div cards with Card component**
```tsx
// Before
<div className="rounded-xl bg-white/5 border border-zinc-800 p-6">

// After
<Card>
  <CardContent className="p-6">
```

3. **Replace buttons with Button component**
```tsx
// Before
<button className="bg-gradient-to-r from-pink-500 to-purple-500 ...">

// After
<Button variant="boost">
```

4. **Add status badges**
```tsx
<StatusChip type="live" />
```

5. **Update grid layouts**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ Review this guide
2. ✅ Test new components on one page (start with Network or Earn)
3. ✅ Verify design system works as expected
4. 🔄 Roll out to remaining pages one by one

### Page Priority Order
1. **Launch Detail** - Quick tweaks (5 min)
2. **Network** - Component swaps (15 min)
3. **Earn** - Grid redesign (30 min)
4. **Tools** - Icon grid (20 min)
5. **Home** - Full redesign (1-2 hours)
6. **Profile** - Header update (30 min)
7. **Discover/Live** - Already good, minor tweaks

### Testing Checklist
- [ ] All cards have consistent rounded-2xl corners
- [ ] Buttons use gradient variants
- [ ] Status chips show properly
- [ ] Hover states work (scale, glow)
- [ ] Mobile responsive (grid collapses to 1-col)
- [ ] Dark theme consistent across pages
- [ ] Metrics display with proper formatting
- [ ] Avatar groups show overflow correctly

---

## 🐛 Troubleshooting

### Issue: Component not found
**Solution:** Ensure import path is correct
```tsx
// Correct
import { Card } from "@/components/ui/card"

// Incorrect
import { Card } from "@/components/card"
```

### Issue: Styling not applying
**Solution:** Check Tailwind config is updated and rebuild
```bash
# If styles don't apply, restart dev server
npm run dev
```

### Issue: TypeScript errors
**Solution:** Check component prop types
```tsx
// Correct
<Card variant="gradient" glow hover>

// Incorrect (invalid variant)
<Card variant="custom">
```

---

## 📞 Support

- Design System Doc: `DESIGN_SYSTEM.md`
- This Guide: `IMPLEMENTATION_GUIDE.md`
- Component Examples: See `app/launches-demo/page.tsx`

All components follow the same patterns - if you understand one, you understand them all!
