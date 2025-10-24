# FeaturedCard Visual Test Guide

## Quick Visual Test

### Test URL
```
http://localhost:3000/
```

### Responsive Testing Tools

#### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Test these viewports:

```
Mobile:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPhone 14 Pro Max (430px)

Tablet:
- iPad Mini (768px)
- iPad Air (820px)
- iPad Pro 11" (834px)

Desktop:
- 1024px (Small laptop)
- 1280px (Standard laptop)
- 1440px (Large laptop)
- 1920px (Desktop monitor)
```

## Visual Inspection Checklist

### Mobile (375px)

**Expected Layout:**
```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │   Featured Projects   │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   [80px Logo]         │  │
│  │   Project Alpha       │  │
│  │   $ALPHA              │  │
│  │   [LIVE] [ICM]        │  │
│  │   ┌─────┬─────┬─────┐ │  │
│  │   │ MC  │ HLD │ PRC │ │  │
│  │   └─────┴─────┴─────┘ │  │
│  │   [Motion Bar]        │  │
│  │   [Buy Keys Button]   │  │
│  │   [Clips] [Details]   │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   Card 2...           │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   Card 3...           │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Check:**
- [ ] Cards stack vertically (1 column)
- [ ] Full width with 16px padding
- [ ] Logo is 80px × 80px
- [ ] Text is readable (not too small)
- [ ] Buttons are minimum 44px height
- [ ] Gap between cards is 16px
- [ ] No horizontal scroll

### Tablet (768px)

**Expected Layout:**
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │    Featured Projects          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   Card 1     │  │   Card 2     │ │
│  │              │  │              │ │
│  │   [Logo]     │  │   [Logo]     │ │
│  │   Title      │  │   Title      │ │
│  │   [Metrics]  │  │   [Metrics]  │ │
│  │   [Actions]  │  │   [Actions]  │ │
│  └──────────────┘  └──────────────┘ │
│                                     │
│  ┌──────────────┐                   │
│  │   Card 3     │                   │
│  └──────────────┘                   │
└─────────────────────────────────────┘
```

**Check:**
- [ ] 2 columns on first row
- [ ] Card 3 spans full width (or left column)
- [ ] Equal card heights in same row
- [ ] 20px gap between cards
- [ ] 24px container padding
- [ ] Cards align perfectly

### Desktop (1280px)

**Expected Layout:**
```
┌─────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐    │
│  │         Featured Projects                   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Card 1    │  │   Card 2    │  │   Card 3    │ │
│  │             │  │             │  │             │ │
│  │   [Logo]    │  │   [Logo]    │  │   [Logo]    │ │
│  │   Title     │  │   Title     │  │   Title     │ │
│  │   [Metrics] │  │   [Metrics] │  │   [Metrics] │ │
│  │   [Motion]  │  │   [Motion]  │  │   [Motion]  │ │
│  │   [Actions] │  │   [Actions] │  │   [Actions] │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Check:**
- [ ] 3 columns perfectly aligned
- [ ] All cards same height
- [ ] 24px gap between cards
- [ ] 32px container padding
- [ ] Centered layout (max-width 1400px)
- [ ] Equal white space on sides

## Interactive Testing

### Hover States

**Desktop Hover:**
1. Hover over card
   - [ ] Border brightens to full lime (#D1FD0A)
   - [ ] Shadow appears (lime glow)
   - [ ] Smooth transition (500ms)

2. Hover over logo
   - [ ] Scales to 1.05
   - [ ] Spring animation

3. Hover over buttons
   - [ ] BUY KEYS: Background darkens, shadow intensifies
   - [ ] Secondary buttons: Border brightens

### Click Actions

1. **Buy Keys Button**
   - [ ] Fires `onBuyKeys` callback
   - [ ] Scale animation (whileTap)

2. **Clips Button**
   - [ ] Fires `onClipClick` callback
   - [ ] Visual feedback

3. **Details Button**
   - [ ] Routes to `/launch/[id]`

4. **Notification Bell**
   - [ ] Toggles notification state
   - [ ] Border color changes
   - [ ] Icon color changes

### Animation Testing

**Entrance Animations:**
1. Scroll to section
   - [ ] Cards fade in from bottom (y: 20 → 0)
   - [ ] Staggered delay (0ms, 100ms, 200ms)
   - [ ] Smooth 400ms duration

2. Motion bar
   - [ ] Animates from 0% to actual percentage
   - [ ] 1s duration
   - [ ] Eased animation

**Performance:**
- [ ] Animations run at 60fps
- [ ] No jank or stuttering
- [ ] Smooth on mobile devices

## Accessibility Testing

### Keyboard Navigation

1. Tab through cards
   - [ ] Focus visible on all interactive elements
   - [ ] Tab order: Notification → Buy Keys → Clips → Details
   - [ ] Skip to next card works

2. Enter/Space on buttons
   - [ ] Activates button action
   - [ ] Same as click

### Screen Reader Testing

**NVDA/JAWS:**
1. Navigate to section
   - [ ] Announces "Featured Projects" heading
   - [ ] Announces "Featured project: [Title]" for each card

2. Focus on elements
   - [ ] Button labels are descriptive
   - [ ] Progress bar announces percentage
   - [ ] Images have alt text

### Color Contrast

Using WCAG Contrast Checker:
- [ ] Title text (white on dark): AAA
- [ ] Button text (black on lime): AAA
- [ ] Small text (zinc-400 on dark): AA minimum

## Performance Testing

### Load Time

**Chrome DevTools Performance Tab:**
1. Record page load
2. Check metrics:
   - [ ] First Contentful Paint < 1.5s
   - [ ] Largest Contentful Paint < 2.5s
   - [ ] Time to Interactive < 3s

### Layout Shift

**Chrome DevTools Lighthouse:**
1. Run audit
2. Check:
   - [ ] Cumulative Layout Shift < 0.1
   - [ ] No visible content jumps

### Image Loading

**Network Tab:**
1. Throttle to "Fast 3G"
2. Reload page
3. Check:
   - [ ] Images load lazily (not all at once)
   - [ ] Skeleton loaders appear
   - [ ] Images fade in on load

## Browser Compatibility

### Chrome
- [ ] Layout correct
- [ ] Animations smooth
- [ ] All features work

### Firefox
- [ ] Layout correct
- [ ] Animations smooth
- [ ] All features work

### Safari
- [ ] Layout correct
- [ ] Animations smooth
- [ ] All features work
- [ ] iOS Safari touch works

### Edge
- [ ] Layout correct
- [ ] Animations smooth
- [ ] All features work

## Touch Testing (Mobile)

### iOS Safari / Chrome

1. **Tap targets**
   - [ ] All buttons easy to tap (44px minimum)
   - [ ] No accidental taps

2. **Scroll performance**
   - [ ] Smooth scrolling
   - [ ] No lag
   - [ ] Inertia scrolling works

3. **Gestures**
   - [ ] Pinch zoom works (if enabled)
   - [ ] Swipe left/right (if carousel added)

### Android Chrome

1. **Tap feedback**
   - [ ] Visual feedback on tap
   - [ ] No delay

2. **Performance**
   - [ ] 60fps scrolling
   - [ ] No jank

## Edge Cases

### Long Content

1. **Long project name**
   - [ ] Truncates properly (line-clamp-1)
   - [ ] No overflow

2. **Missing data**
   - [ ] Handles missing logo (shows initials)
   - [ ] Handles missing metrics gracefully
   - [ ] No undefined errors

3. **Zero projects**
   - [ ] Component returns null
   - [ ] No error shown

### Extreme Viewports

1. **Very small (320px)**
   - [ ] Still usable
   - [ ] Text readable
   - [ ] Buttons accessible

2. **Very large (2560px)**
   - [ ] Max-width constraint works
   - [ ] Centered layout
   - [ ] Not stretched

## Screenshot Checklist

Take screenshots at these breakpoints:

```bash
Mobile (375px):
- Full view with all 3 cards stacked
- Single card detail view

Tablet (768px):
- Full view with 2+1 layout
- Hover state on card

Desktop (1280px):
- Full view with 3-column layout
- Hover states on all elements

Desktop (1920px):
- Centered max-width layout
- Show side margins
```

## Common Issues & Fixes

### Issue: Cards different heights
**Fix:** Check `flex flex-col h-full` on card wrapper

### Issue: Images not lazy loading
**Fix:** Verify `loading="lazy"` attribute

### Issue: Animations janky
**Fix:** Add `transform-gpu` class

### Issue: Text overflows on mobile
**Fix:** Use `line-clamp-*` and `break-words`

### Issue: Buttons too small on mobile
**Fix:** Ensure `min-h-[44px]` on all buttons

### Issue: Gap inconsistent
**Fix:** Verify grid gap classes: `gap-4 sm:gap-5 md:gap-6`

---

**Test Status**: Ready for QA

**Next Steps:**
1. Run through this checklist
2. Fix any issues found
3. Deploy to staging
4. Final production check
