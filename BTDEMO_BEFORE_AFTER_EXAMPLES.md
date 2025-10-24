# BTDEMO Migration - Before & After Code Examples

**Visual reference for developers during migration**

---

## Example 1: Project Card Header

### BEFORE (Old Style)
```tsx
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
      <TrendingUp className="w-6 h-6 text-cyan-400" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white">Project Nebula</h3>
      <p className="text-sm text-zinc-400">DeFi Yield Optimizer</p>
    </div>
  </div>
  <div className="flex items-center gap-2">
    <Heart className="w-5 h-5 text-zinc-400 hover:text-pink-500 cursor-pointer" />
    <MessageCircle className="w-5 h-5 text-zinc-400 hover:text-blue-400 cursor-pointer" />
  </div>
</div>
```

### AFTER (btdemo Style)
```tsx
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="relative">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center token-logo-glow">
        <IconMotion className="icon-primary" size={32} />
      </div>
      <IconMotionScoreBadge
        score={95}
        size={30}
        className="absolute -bottom-2 -right-2"
      />
    </div>
    <div>
      <div className="flex items-center gap-2">
        <h3 className="card-title">Project Nebula</h3>
        <IconLab className="text-[#D1FD0A]" size={16} />
      </div>
      <p className="card-subtitle">DeFi Yield Optimizer</p>
    </div>
  </div>
  <div className="flex items-center gap-2">
    <button className="icon-interactive">
      <IconCollabExpand size={20} />
    </button>
    <button className="icon-interactive-primary">
      <IconLightning size={20} />
    </button>
  </div>
</div>
```

**Changes**:
- ✅ Lucide icons → btdemo icons
- ✅ Cyan gradient → Primary color
- ✅ Added motion score badge
- ✅ Added verification icon
- ✅ Standardized spacing (gap-2 → gap-3)
- ✅ Utility classes for typography

---

## Example 2: Stat Card

### BEFORE
```tsx
<div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
  <div className="flex items-center gap-2 mb-2">
    <DollarSign className="w-4 h-4 text-zinc-400" />
    <span className="text-xs text-zinc-500 uppercase">Price</span>
  </div>
  <div className="text-2xl font-bold text-white">$0.42</div>
  <div className="flex items-center gap-1 text-xs">
    <TrendingUp className="w-3 h-3 text-green-400" />
    <span className="text-green-400">+15.3%</span>
  </div>
</div>
```

### AFTER
```tsx
<div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
  <div className="flex items-center gap-2 mb-1">
    <IconUsdc size={16} className="icon-muted" />
    <span className="stat-label">Price</span>
  </div>
  <div className="font-led-dot text-xl text-primary">${price.toFixed(2)}</div>
  <div className="flex items-center gap-1 text-xs">
    {priceChange > 0 ? (
      <>
        <IconPriceUp size={10} className="text-green-400" />
        <span className="text-green-400">+{priceChange}%</span>
      </>
    ) : (
      <span className="text-[#FF005C]">{priceChange}%</span>
    )}
  </div>
</div>
```

**Changes**:
- ✅ Glass effect utility class
- ✅ LED font for numbers
- ✅ btdemo icons (IconUsdc, IconPriceUp)
- ✅ stat-label utility class
- ✅ Primary color accent
- ✅ Hover state on border
- ✅ Dynamic price change logic

---

## Example 3: Filter Bar

### BEFORE
```tsx
<div className="flex items-center gap-3">
  <button
    onClick={() => setFilter('all')}
    className={cn(
      "px-4 py-2 rounded-lg font-medium transition-all",
      filter === 'all'
        ? "bg-zinc-800 text-white"
        : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50"
    )}
  >
    All
  </button>
  <button
    onClick={() => setFilter('icm')}
    className={cn(
      "px-4 py-2 rounded-lg font-medium transition-all",
      filter === 'icm'
        ? "bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500 text-white"
        : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50"
    )}
  >
    ICM
  </button>
</div>
```

### AFTER
```tsx
<div className="flex items-center gap-3">
  <FilterPill
    active={typeFilter === 'all'}
    onClick={() => setTypeFilter('all')}
    className="data-[active]:bg-zinc-800/50 data-[active]:border-zinc-700 data-[active]:text-white"
  >
    All
  </FilterPill>
  <FilterPill
    active={typeFilter === 'icm'}
    onClick={() => setTypeFilter('icm')}
    className="data-[active]:bg-[#00FF88]/20 data-[active]:border-[#00FF88] data-[active]:text-white"
  >
    ICM
  </FilterPill>
</div>
```

**Changes**:
- ✅ Reusable FilterPill component
- ✅ data-[active] pattern for active state
- ✅ Cleaner API (no manual cn() calls)
- ✅ Consistent styling across app

---

## Example 4: Search Input

### BEFORE
```tsx
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
  <input
    type="text"
    placeholder="Search projects..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
  />
</div>
```

### AFTER
```tsx
<div className="relative">
  <IconSearch className="icon-muted absolute left-3 md:left-5 top-1/2 -translate-y-1/2" size={20} />
  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="input-premium pl-10 md:pl-14 w-full"
  />
</div>
```

**Changes**:
- ✅ btdemo icon (IconSearch)
- ✅ input-premium utility class
- ✅ Responsive spacing (md: breakpoint)
- ✅ icon-muted for consistent coloring

---

## Example 5: Motion Score Display

### BEFORE
```tsx
<div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50">
  <div className="flex flex-col items-center">
    <TrendingUp className="w-8 h-8 text-lime-500" />
    <span className="text-xs text-zinc-400">Motion</span>
  </div>
  <div className="flex-1">
    <div className="h-2 rounded-full bg-zinc-800">
      <div
        className="h-full bg-lime-500 rounded-full"
        style={{ width: '85%' }}
      />
    </div>
  </div>
  <div className="text-3xl font-bold text-white">85</div>
</div>
```

### AFTER
```tsx
<MotionScoreDisplay score={85} />

{/* Or expanded: */}
<div className="p-4 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
  <div className="flex items-center gap-3">
    <IconMotion5 className="text-[#D1FD0A]" size={32} />
    <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
    <div className="font-led-dot text-3xl text-primary">{score}</div>
  </div>
</div>
```

**Changes**:
- ✅ Reusable component
- ✅ Dynamic icon based on score level
- ✅ LED font for number
- ✅ Primary color gradient
- ✅ Glass effect
- ✅ Border animation on hover

---

## Example 6: Badge

### BEFORE
```tsx
<div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold">
  <Rocket className="w-3 h-3" />
  <span>Launched</span>
</div>
```

### AFTER
```tsx
<div className="badge-success flex items-center gap-1">
  <IconRocket size={12} />
  <span>Launched</span>
</div>
```

**Changes**:
- ✅ badge-success utility class
- ✅ btdemo icon
- ✅ Consistent styling

---

## Example 7: Button (Primary CTA)

### BEFORE
```tsx
<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold transition-all shadow-lg shadow-violet-500/20">
  <Zap className="w-5 h-5 inline mr-2" />
  Quick Buy
</button>
```

### AFTER
```tsx
<button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2">
  <IconLightning size={20} className="text-black" />
  <span className="text-black">Quick Buy</span>
</button>
```

**Changes**:
- ✅ Primary color (no gradient)
- ✅ Black text for contrast
- ✅ btdemo icon
- ✅ Explicit text color
- ✅ Shadow on hover

---

## Example 8: Table Cell (Numeric)

### BEFORE
```tsx
<td className="px-4 py-3 text-right">
  <div className="text-sm font-medium text-white">
    ${price.toFixed(2)}
  </div>
  <div className="text-xs text-zinc-400">
    {priceChange > 0 ? '+' : ''}{priceChange}%
  </div>
</td>
```

### AFTER
```tsx
<td className="px-4 py-3 text-right">
  <div className="font-led-dot text-base text-primary">
    ${price.toFixed(2)}
  </div>
  <div className="flex items-center justify-end gap-1 text-xs">
    {priceChange > 0 ? (
      <>
        <IconPriceUp size={10} className="text-green-400" />
        <span className="text-green-400">+{priceChange}%</span>
      </>
    ) : (
      <>
        <IconPriceDown size={10} className="text-red-400" />
        <span className="text-red-400">{priceChange}%</span>
      </>
    )}
  </div>
</td>
```

**Changes**:
- ✅ LED font for price
- ✅ Primary color
- ✅ btdemo icons (IconPriceUp/Down)
- ✅ Visual indicators with icons

---

## Example 9: Modal Header

### BEFORE
```tsx
<div className="flex items-center justify-between p-6 border-b border-zinc-800">
  <h2 className="text-xl font-bold text-white">Project Details</h2>
  <button
    onClick={onClose}
    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
  >
    <X className="w-5 h-5 text-zinc-400" />
  </button>
</div>
```

### AFTER
```tsx
<div className="flex items-center justify-between p-6 border-b border-zinc-800">
  <h2 className="card-title">Project Details</h2>
  <button
    onClick={onClose}
    className="icon-interactive p-2 rounded-lg"
    aria-label="Close modal"
  >
    <IconClose size={20} />
  </button>
</div>
```

**Changes**:
- ✅ card-title utility
- ✅ btdemo icon
- ✅ icon-interactive class
- ✅ Accessibility (aria-label)

---

## Example 10: Social Links

### BEFORE
```tsx
<div className="flex items-center gap-4">
  <a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">
    <Twitter className="w-5 h-5" />
  </a>
  <a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">
    <MessageCircle className="w-5 h-5" />
  </a>
  <a href="#" className="text-zinc-400 hover:text-violet-400 transition-colors">
    <Share2 className="w-5 h-5" />
  </a>
</div>
```

### AFTER
```tsx
<div className="flex items-center gap-4">
  <a href="#" className="icon-interactive-primary">
    <IconTwitter size={20} />
  </a>
  <a href="#" className="icon-interactive">
    <IconTelegram size={20} />
  </a>
  <a href="#" className="icon-interactive">
    <IconDiscord size={20} />
  </a>
  <a href="#" className="icon-interactive">
    <IconWeb size={20} />
  </a>
</div>
```

**Changes**:
- ✅ btdemo icons
- ✅ Consistent hover states
- ✅ icon-interactive utilities

---

## Example 11: Loading Skeleton

### BEFORE
```tsx
<div className="animate-pulse">
  <div className="h-12 w-12 rounded-xl bg-zinc-800" />
  <div className="h-4 w-32 mt-3 rounded bg-zinc-800" />
  <div className="h-3 w-24 mt-2 rounded bg-zinc-800" />
</div>
```

### AFTER
```tsx
<div className="glass-interactive p-6 rounded-3xl animate-pulse">
  <div className="flex items-center gap-3">
    <div className="w-16 h-16 rounded-2xl bg-zinc-800" />
    <div className="flex-1">
      <div className="h-5 w-40 rounded bg-zinc-800 mb-2" />
      <div className="h-4 w-32 rounded bg-zinc-800" />
    </div>
  </div>
</div>
```

**Changes**:
- ✅ Glass effect wrapper
- ✅ Matches btdemo card structure
- ✅ Better visual hierarchy

---

## Example 12: Mobile List Item

### BEFORE
```tsx
<div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
  <div className="flex items-center gap-3">
    <img src={logoUrl} className="w-10 h-10 rounded-lg" />
    <div>
      <h3 className="text-sm font-bold text-white">{name}</h3>
      <p className="text-xs text-zinc-400">{type}</p>
    </div>
  </div>
  <div className="text-right">
    <div className="text-sm font-medium text-white">${price}</div>
    <div className="text-xs text-green-400">+{change}%</div>
  </div>
</div>
```

### AFTER
```tsx
<div className="glass-interactive p-3 rounded-2xl border-2 border-primary/30 hover:border-primary transition-all">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="relative">
        <img src={logoUrl} className="w-12 h-12 rounded-xl token-logo-glow" />
        <IconMotionScoreBadge score={motion} size={24} className="absolute -bottom-1 -right-1" />
      </div>
      <div>
        <h3 className="card-title text-sm">{name}</h3>
        <p className="card-subtitle text-xs">{type}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="font-led-dot text-sm text-primary">${price}</div>
      <div className="flex items-center justify-end gap-1 text-xs">
        <IconPriceUp size={8} className="text-green-400" />
        <span className="text-green-400">+{change}%</span>
      </div>
    </div>
  </div>
</div>
```

**Changes**:
- ✅ Glass effect
- ✅ Motion score badge
- ✅ LED font for price
- ✅ btdemo icons
- ✅ Border hover effect
- ✅ Token logo glow

---

## Migration Checklist

Use this checklist when migrating each component:

### Colors
- [ ] Replace cyan colors with primary
- [ ] Replace old hex colors (#00FFFF, #00FF88)
- [ ] Use utility classes instead of inline colors
- [ ] Verify dark mode compatibility

### Icons
- [ ] Replace Lucide icons with btdemo icons
- [ ] Use icon utility classes (icon-primary, icon-muted, etc.)
- [ ] Ensure consistent sizing (multiples of 4)
- [ ] Add aria-labels to icon-only buttons

### Typography
- [ ] Apply LED font to all numeric displays
- [ ] Use utility classes (card-title, card-subtitle, stat-label)
- [ ] Ensure proper hierarchy
- [ ] Test font loading

### Layout
- [ ] Use glass effect utilities
- [ ] Apply consistent spacing (gap-2, gap-3, gap-4)
- [ ] Responsive breakpoints (md:, lg:)
- [ ] Test on mobile

### Interactions
- [ ] Hover states on interactive elements
- [ ] Transition-all for smooth animations
- [ ] Active states (data-[active])
- [ ] Loading states

### Accessibility
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Focus states
- [ ] Screen reader support

---

**Pro Tip**: Use the migration scripts first, then manually review and refine. Don't migrate everything at once - do it component by component, testing as you go.

**Visual QA**: Always compare with `app/btdemo/page.tsx` to ensure consistency.

---

**Last Updated**: 2025-10-23
**Version**: 1.0
