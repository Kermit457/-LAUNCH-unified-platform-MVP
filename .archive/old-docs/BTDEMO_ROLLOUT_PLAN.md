# BTDEMO Design Rollout Plan

## ✅ Design System Extracted from btdemo

### Colors
```css
--btdemo-primary: #D1FD0A        /* Lime green - main accent */
--btdemo-primary-hover: #B8E309  /* Darker lime for hover */
--btdemo-bg: #0a0a0a            /* Black background */
--btdemo-card: rgba(23,23,23,0.40) /* Glass card background */
--btdemo-border: #3B3B3B        /* Default border */
--btdemo-border-active: #D1FD0A /* Active/hover border */
```

### Typography
```css
/* Numbers - ALWAYS use LED font */
.font-led-dot {
  font-family: "LED Dot-Matrix", system-ui;
  color: #D1FD0A;
}

/* Labels */
.stat-label {
  text-sm text-zinc-400 font-medium
}

/* Card titles */
.card-title {
  font-bold text-white
}

.card-subtitle {
  text-xs text-zinc-500
}
```

### Components

#### 1. Cards
```tsx
// Main project/launch card
<article className="glass-premium p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/50 transition-all border-2 border-primary/50 hover:border-primary">

// Metric cards (nested inside)
<div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
```

#### 2. Buttons
```tsx
// Primary CTA (Buy, Quick Buy, Submit)
<button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2">
  <IconLightning size={20} className="text-black" />
  <span className="text-black">Quick Buy</span>
</button>

// Secondary (View Details, outlined)
<button className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center gap-2">
  <IconCollabExpand size={20} className="text-[#D1FD0A]" />
  <span className="text-[#D1FD0A]">View Details</span>
</button>
```

#### 3. Icons
```tsx
// Primary icons (main features)
<Icon className="icon-primary" size={20} />  // #D1FD0A

// Muted icons (secondary info)
<Icon className="icon-muted" size={16} />    // zinc-400

// Interactive icons (hover effects)
<Icon className="icon-interactive" size={20} />
<Icon className="icon-interactive-primary" size={20} />
```

#### 4. Numbers & Stats
```tsx
// ALL numbers MUST use LED font
<div className="font-led-dot text-xl text-primary">${price.toFixed(2)}</div>
<div className="font-led-dot text-xl text-primary">{volume}</div>
<span className="font-led-dot text-xl text-primary">{upvotes}</span>
```

#### 5. Badges
```tsx
// Success (green) - Launched, Active
<div className="badge-success flex items-center gap-1">
  <IconRocket size={12} />
  <span>Launched</span>
</div>

// Primary (lime) - Top Performer, Premium
<div className="badge-primary flex items-center gap-1">
  <IconTrophy size={12} />
  <span>Top 10</span>
</div>

// Warning (orange) - High Activity, Frozen
<div className="badge-warning flex items-center gap-1">
  <IconAttention size={12} />
  <span>High Activity</span>
</div>
```

---

## 📋 Rollout Checklist

### /launch Page Components

#### ✅ LaunchHeaderBTDemo
- [x] Already using btdemo styling

#### ✅ HeroMetricsBTDemo
- [x] Already using btdemo styling
- [x] LED fonts (font-led-32)
- [x] glass-interactive cards
- [x] border-[#D1FD0A]/30

#### 🔄 SpotlightCarouselBTDemo
- [ ] Verify LED fonts on numbers
- [ ] Verify icon-primary on all icons
- [ ] Verify button styling

#### 🔄 LeaderboardBTDemo
- [ ] Apply LED fonts to rankings
- [ ] Apply LED fonts to scores
- [ ] Verify badge styling

#### 🔄 ActivityStreamBTDemo
- [ ] LED fonts for values
- [ ] Icon colors
- [ ] Card borders

#### 🔄 PartnershipCardsBTDemo
- [ ] Glass card styling
- [ ] Button styling
- [ ] Icon colors

### /discover Page Components

#### 🔄 AdvancedTableView
- [ ] LED fonts for all numbers (price, volume, holders)
- [ ] icon-primary for table icons
- [ ] Hover effects with lime glow
- [ ] Button styling (Quick Buy lime, View Details outlined)

#### 🔄 UnifiedCard
- [ ] glass-premium base
- [ ] border-2 border-primary/50 hover:border-primary
- [ ] LED fonts for motion score, price, volume
- [ ] icon-primary for all icons
- [ ] Quick Buy button: bg-[#D1FD0A]
- [ ] View Details button: border-2 border-[#D1FD0A]
- [ ] Social icons row at bottom

#### 🔄 CoinListItem (mobile)
- [ ] LED fonts for price, holders
- [ ] icon-primary colors
- [ ] Touch-friendly button sizing

### Global Components

#### 🔄 CommentsDrawer
- [ ] glass-premium styling
- [ ] LED fonts for counts
- [ ] icon-primary

#### 🔄 BuySellModal
- [ ] glass-premium base
- [ ] LED fonts for price, balance
- [ ] Primary button: bg-[#D1FD0A]
- [ ] Secondary button: border-[#D1FD0A]

#### 🔄 LaunchDetailsModal
- [ ] glass-premium
- [ ] LED fonts throughout
- [ ] icon-primary

---

## 🎯 Priority Order

### Phase 1: Core Visual Identity (NOW)
1. **UnifiedCard** - Main project card on /discover
2. **AdvancedTableView** - Table view on /discover
3. **CoinListItem** - Mobile list view

### Phase 2: Launch Page (NEXT)
4. **SpotlightCarouselBTDemo**
5. **LeaderboardBTDemo**
6. **ActivityStreamBTDemo**

### Phase 3: Modals & Overlays (FINAL)
7. **CommentsDrawer**
8. **BuySellModal**
9. **LaunchDetailsModal**

---

## 🔍 Visual Audit Checklist

For each component, verify:

- [ ] **Numbers**: ALL use `font-led-dot` class
- [ ] **Icons**: ALL use `icon-primary` or `icon-muted` classes
- [ ] **Cards**: Use `glass-premium` or `glass-interactive`
- [ ] **Borders**: Use `border-2 border-primary/50 hover:border-primary`
- [ ] **Primary CTAs**: `bg-[#D1FD0A] hover:bg-[#B8E309] text-black`
- [ ] **Secondary buttons**: `border-2 border-[#D1FD0A] text-[#D1FD0A]`
- [ ] **Badges**: Use `badge-success`, `badge-primary`, `badge-warning`
- [ ] **Hover effects**: `hover:shadow-primary/50`

---

## 📝 Quick Reference

### Find & Replace Patterns

**Numbers:**
```tsx
// BEFORE
<div className="text-xl">{price}</div>

// AFTER
<div className="font-led-dot text-xl text-primary">{price}</div>
```

**Icons:**
```tsx
// BEFORE
<Icon size={20} className="text-green-500" />

// AFTER
<Icon size={20} className="icon-primary" />
```

**Buttons:**
```tsx
// BEFORE - Primary
<button className="bg-green-500 text-white px-4 py-2">Buy</button>

// AFTER - Primary
<button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/50">
  <IconLightning size={20} className="text-black" />
  <span className="text-black">Buy</span>
</button>
```

**Cards:**
```tsx
// BEFORE
<div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">

// AFTER
<div className="glass-premium p-6 rounded-3xl border-2 border-primary/50 hover:border-primary">
```

---

## ✨ Expected Result

After rollout, ALL pages should have:
- ✅ Consistent lime green (#D1FD0A) accent color
- ✅ LED dot-matrix font for all numbers
- ✅ Glass-morphism effects on cards
- ✅ Glowing lime borders on hover
- ✅ Unified button styling
- ✅ Consistent icon colors and sizes
- ✅ Professional, cohesive visual identity

**Match btdemo 100%!**
