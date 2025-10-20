# ICM Motion Color System

**Status:** ✅ Implemented
**Date:** October 20, 2025
**Version:** 1.0

---

## Overview

The ICM Motion color palette features vibrant, modern colors with gradient combinations designed for maximum visual impact and clarity.

## Primary Colors

### Cyan (#00FFFF)
- **Use Case:** Primary brand color, highlights
- **CSS Variable:** `--primary-cyan`
- **Tailwind:** `primary-cyan` or `text-primary-cyan` / `bg-primary-cyan`
- **Example:** Main brand elements, CTAs, primary actions

### Green (#00FF88)
- **Use Case:** Success states, positive actions
- **CSS Variable:** `--primary-green`
- **Tailwind:** `primary-green`
- **Example:** Successful transactions, positive metrics, growth indicators

### Yellow (#FFD700)
- **Use Case:** Attention, warnings, energy
- **CSS Variable:** `--primary-yellow`
- **Tailwind:** `primary-yellow`
- **Example:** Important notifications, highlights, featured content

---

## Accent Colors

### Red (#FF0040)
- **Use Case:** Errors, urgent actions
- **CSS Variable:** `--accent-red`
- **Tailwind:** `accent-red`
- **Example:** Error messages, destructive actions, critical alerts

### Orange (#FF8800)
- **Use Case:** Secondary highlights
- **CSS Variable:** `--accent-orange`
- **Tailwind:** `accent-orange`
- **Example:** Secondary CTAs, trending indicators, warmth

### Blue (#0088FF)
- **Use Case:** Links, information
- **CSS Variable:** `--accent-blue`
- **Tailwind:** `accent-blue`
- **Example:** Hyperlinks, informational messages, trust elements

### Purple (#8800FF)
- **Use Case:** Premium features
- **CSS Variable:** `--accent-purple`
- **Tailwind:** `accent-purple`
- **Example:** Premium badges, exclusive features, luxury elements

---

## Gradient Combinations

### Primary Gradients

**Cyan → Green**
```css
background: linear-gradient(135deg, #00FFFF, #00FF88);
/* Tailwind: bg-gradient-cyan-green */
```
Use for: Fresh, energetic sections

**Green → Yellow**
```css
background: linear-gradient(135deg, #00FF88, #FFD700);
/* Tailwind: bg-gradient-green-yellow */
```
Use for: Success flows, positive growth indicators
**Used in:** Net Worth card

**Cyan → Yellow**
```css
background: linear-gradient(135deg, #00FFFF, #FFD700);
/* Tailwind: bg-gradient-cyan-yellow */
```
Use for: High-energy hero sections

### Accent Gradients

**Red → Orange**
```css
background: linear-gradient(135deg, #FF0040, #FF8800);
/* Tailwind: bg-gradient-red-orange */
```
Use for: Urgent actions, hot deals

**Orange → Yellow**
```css
background: linear-gradient(135deg, #FF8800, #FFD700);
/* Tailwind: bg-gradient-orange-yellow */
```
Use for: Warm, energetic CTAs

**Blue → Cyan**
```css
background: linear-gradient(135deg, #0088FF, #00FFFF);
/* Tailwind: bg-gradient-blue-cyan */
```
Use for: Cool, trustworthy sections
**Used in:** Network card

**Purple → Blue**
```css
background: linear-gradient(135deg, #8800FF, #0088FF);
/* Tailwind: bg-gradient-purple-blue */
```
Use for: Premium features, exclusive content

**Purple → Pink**
```css
background: linear-gradient(135deg, #8800FF, #FF0040);
/* Tailwind: bg-gradient-purple-pink */
```
Use for: Luxury, premium experiences

### Special Gradients

**Rainbow**
```css
background: linear-gradient(135deg, #00FFFF, #00FF88, #FFD700, #FF8800, #FF0040);
/* Tailwind: bg-gradient-rainbow */
```
Use for: Celebrations, special events, maximum impact

**Premium (Cyan → Purple)**
```css
background: linear-gradient(135deg, #00FFFF, #8800FF);
/* Tailwind: bg-gradient-premium */
```
Use for: Premium subscriptions, VIP features

---

## Usage Examples

### In React Components

```tsx
// Using Tailwind classes
<div className="bg-gradient-cyan-green text-white">
  Vibrant background
</div>

// Using direct color references
<div className="text-primary-cyan border-accent-purple">
  Styled element
</div>

// Text gradient
<h1 className="text-6xl font-bold bg-gradient-to-r from-primary-green via-primary-yellow to-accent-orange bg-clip-text text-transparent">
  Gradient Text
</h1>
```

### In CSS

```css
/* Using CSS variables */
.custom-element {
  background: var(--gradient-cyan-green);
  color: var(--primary-cyan);
  border: 2px solid var(--accent-purple);
}

/* Direct colors */
.another-element {
  background: linear-gradient(135deg, #00FFFF, #8800FF);
}
```

---

## Component Examples

### Net Worth Card
- **Background:** Green/Yellow gradient (#00FF88 → #FFD700)
- **Icon:** Green → Yellow gradient
- **Text:** Green → Yellow → Orange gradient
- **Success indicator:** Green (#00FF88)
- **Error indicator:** Red (#FF0040)

### Network Card
- **Background:** Cyan/Blue gradient (#00FFFF → #0088FF)
- **Icon:** Cyan → Blue gradient
- **Text:** Cyan → Blue → Purple gradient
- **Stats:** Cyan and Blue accents

### Buy Keys Button
- **ICM Type:** Green (#00FF88) → Emerald
- **CCM Type:** Purple (#8800FF) → Violet
- **Meme Type:** Orange (#FF8800) → Red (#FF0040)

---

## Contextual Colors

### Success
- Color: `#00FF88` (Green)
- Background: `rgba(0, 255, 136, 0.1)`
- Border: `rgba(0, 255, 136, 0.3)`

### Warning
- Color: `#FFD700` (Yellow)
- Background: `rgba(255, 215, 0, 0.1)`
- Border: `rgba(255, 215, 0, 0.3)`

### Error
- Color: `#FF0040` (Red)
- Background: `rgba(255, 0, 64, 0.1)`
- Border: `rgba(255, 0, 64, 0.3)`

### Info
- Color: `#0088FF` (Blue)
- Background: `rgba(0, 136, 255, 0.1)`
- Border: `rgba(0, 136, 255, 0.3)`

### Premium
- Color: `#8800FF` (Purple)
- Background: `rgba(136, 0, 255, 0.1)`
- Border: `rgba(136, 0, 255, 0.3)`

---

## Files Reference

- **Color Definitions:** `/styles/colors.css`
- **Tailwind Config:** `/tailwind.config.ts`
- **Global Import:** `/app/globals.css`

---

## Migration Notes

### Legacy Colors (Kept for Compatibility)
- `launchos-fuchsia`: #E700FF
- `launchos-violet`: #5A00FF
- `launchos-cyan`: #00F0FF

These are maintained for backward compatibility but new components should use the ICM Motion palette.

---

## Best Practices

1. **Use gradients for large surfaces** - Cards, hero sections, backgrounds
2. **Use solid colors for text and icons** - Better readability
3. **Maintain contrast ratios** - Ensure text is readable on colored backgrounds
4. **Consistent usage** - Same colors for same purposes across the app
5. **Test on dark backgrounds** - All colors are optimized for dark mode

---

## Migration Status

### ✅ Completed
- [NetWorthHero.tsx](components/dashboard/NetWorthHero.tsx) - Net Worth card (Green/Yellow gradient), Network card (Cyan/Blue gradient)
- [CounterCard.tsx](components/landing/CounterCard.tsx) - Stats counters with Cyan/Green/Yellow gradient
- [AdvancedTableView.tsx](components/AdvancedTableView.tsx) - Buy Keys buttons, Belief Score bars, Collaborate button

### 🔄 In Progress
- Landing page components (HeroSection, features, etc.)
- Dashboard widgets
- Launch cards and modals

### ⏳ Pending (116 files)
- Most component library still using legacy fuchsia/purple/violet colors
- See grep results for complete list

---

**Updated:** October 20, 2025
**Author:** Claude Code
**Status:** Production Ready ✅ (Partial Migration in Progress)
