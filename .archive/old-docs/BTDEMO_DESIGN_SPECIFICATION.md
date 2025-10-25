# BTDEMO Design System Specification

**Complete Design Language for ICM Motion Platform**

---

## 1. COLOR PALETTE

### Primary Colors
```css
--primary: #D1FD0A          /* Neon lime - main brand color */
--primary-hover: #B8E309    /* Darker lime for hover states */
--primary-rgb: 209, 253, 10 /* RGB for opacity variations */
```

### Semantic Colors
```css
/* Success / Positive */
--success: #00FF88          /* Bright mint green */
--success-dark: #00CC6A

/* Warning / Attention */
--warning-red: #FF005C      /* Hot pink/red */
--warning-yellow: rgb(234, 179, 8)  /* Amber */
--warning-orange: rgb(249, 115, 22) /* Orange */

/* Info / Secondary */
--info-cyan: rgb(34, 211, 238)   /* Bright cyan */
--info-lime: rgb(163, 230, 53)   /* Lime green */

/* Price Movement */
--price-up: rgb(74, 222, 128)    /* Green-400 */
--price-down: #FF005C            /* Same as warning-red */

/* Motion Score Colors (Score-based) */
--motion-1-low: #FF005C          /* 0-20: Hot pink */
--motion-2-medium-low: rgb(249, 115, 22)  /* 21-40: Orange */
--motion-3-medium: rgb(234, 179, 8)       /* 41-60: Yellow */
--motion-4-high: rgb(163, 230, 53)        /* 61-80: Lime */
--motion-5-extreme: #D1FD0A               /* 81-100: Primary lime */
```

### Neutral Scale (Black-based)
```css
--black: #000000
--zinc-950: rgb(9, 9, 11)      /* Near black backgrounds */
--zinc-900: rgb(24, 24, 27)    /* Dark backgrounds */
--zinc-800: rgb(39, 39, 42)    /* Card backgrounds */
--zinc-700: rgb(63, 63, 70)    /* Borders */
--zinc-600: rgb(82, 82, 91)    /* Muted borders */
--zinc-500: rgb(113, 113, 122) /* Disabled text */
--zinc-400: rgb(161, 161, 170) /* Secondary text */
--zinc-300: rgb(212, 212, 216) /* Body text */
--white: #FFFFFF               /* Primary text */
```

### Usage Guidelines
- **Backgrounds**: Always pure black (#000000) for main bg
- **Cards**: zinc-900/90 to zinc-800/90 gradients with transparency
- **Text hierarchy**: white > zinc-300 > zinc-400 > zinc-500
- **Accents**: Primary lime for CTAs, success green for positive states
- **Borders**: zinc-800 (subtle), zinc-700 (medium), primary/30 (highlighted)

---

## 2. TYPOGRAPHY SYSTEM

### Font Families
```css
/* Primary System Font */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;

/* LED Display Fonts (Special) */
font-family: 'DSEG14ClassicMini-Regular', monospace;     /* font-led */
font-family: 'LEDDotMatrixRegular', monospace;           /* font-led-dot */
```

### Type Scale & Usage

#### Display / Hero
```css
.hero-title {
  font-size: 48px;      /* 3xl on mobile, 4xl on desktop */
  font-weight: 900;     /* Black */
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: white;
}
```

#### Section Headings
```css
.section-heading {
  font-size: 32px;      /* 2xl */
  font-weight: 700;     /* Bold */
  line-height: 1.2;
  color: #D1FD0A;       /* Primary */
}
```

#### Card Titles
```css
.card-title {
  font-size: 18px;      /* lg */
  font-weight: 600;     /* Semibold */
  line-height: 1.4;
  color: white;
}
```

#### Card Subtitles
```css
.card-subtitle {
  font-size: 14px;      /* sm */
  font-weight: 400;     /* Normal */
  line-height: 1.5;
  color: rgb(161, 161, 170);  /* zinc-400 */
}
```

#### Stat Labels
```css
.stat-label {
  font-size: 12px;      /* xs */
  font-weight: 600;     /* Semibold */
  line-height: 1.4;
  color: rgb(161, 161, 170);  /* zinc-400 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### LED Font Usage (Numbers Only)
```css
/* Motion scores, prices, balances */
.font-led {
  font-family: 'DSEG14ClassicMini-Regular', monospace;
  font-size: 24px;      /* Base size */
  color: #D1FD0A;       /* Primary or context color */
  letter-spacing: 0.05em;
}

/* Dot-matrix variant */
.font-led-dot {
  font-family: 'LEDDotMatrixRegular', monospace;
  font-size: 24px;
  color: #D1FD0A;
  letter-spacing: 0.03em;
}
```

#### Body Text
```css
.text-body {
  font-size: 14px;      /* sm */
  font-weight: 400;
  line-height: 1.6;
  color: rgb(212, 212, 216);  /* zinc-300 */
}

.text-small {
  font-size: 12px;      /* xs */
  font-weight: 400;
  line-height: 1.5;
  color: rgb(161, 161, 170);  /* zinc-400 */
}
```

### Font Weight Scale
- **900 (Black)**: Hero titles, large numbers
- **700 (Bold)**: Section headings, important labels
- **600 (Semibold)**: Card titles, button text, stat labels
- **500 (Medium)**: Not used (skipped for clarity)
- **400 (Normal)**: Body text, descriptions

---

## 3. SPACING SYSTEM

### Base Scale (Tailwind)
```
0    = 0px
1    = 4px
2    = 8px
3    = 12px
4    = 16px
5    = 20px
6    = 24px
8    = 32px
10   = 40px
12   = 48px
16   = 64px
20   = 80px
24   = 96px
```

### Component-Specific Spacing

#### Card Padding
```css
.card-padding-sm: 16px (p-4)
.card-padding-md: 24px (p-6)
.card-padding-lg: 32px (p-8)
```

#### Gaps
```css
.gap-icons:     8px (gap-2)   /* Icon to text */
.gap-elements:  12px (gap-3)  /* Related elements */
.gap-sections:  24px (gap-6)  /* Card sections */
.gap-cards:     24px (gap-6)  /* Between cards */
```

#### Margins
```css
.mb-title:      12px (mb-3)   /* After card title */
.mb-section:    24px (mb-6)   /* After section heading */
.mb-subsection: 16px (mb-4)   /* After subsection */
```

---

## 4. BORDER RADIUS SYSTEM

```css
.rounded-sm:    4px     /* Small elements, badges */
.rounded-lg:    8px     /* Input fields, small buttons */
.rounded-xl:    12px    /* Standard buttons, small cards */
.rounded-2xl:   16px    /* Medium cards, containers */
.rounded-3xl:   24px    /* Large cards, main containers */
.rounded-full:  9999px  /* Pills, avatars, dots */
```

### Usage
- **Icons/Avatars**: rounded-2xl (16px) for square icons, rounded-full for avatars
- **Buttons**: rounded-xl (12px)
- **Cards**: rounded-3xl (24px) for main cards, rounded-2xl for nested
- **Input fields**: rounded-xl (12px)
- **Badges/Pills**: rounded-full

---

## 5. GLASS MORPHISM EFFECTS

### Primary Glass Effects (Defined in CSS)

#### Glass Premium
```css
.glass-premium {
  background: linear-gradient(135deg,
    rgba(24, 24, 27, 0.9) 0%,     /* zinc-900/90 */
    rgba(39, 39, 42, 0.9) 100%    /* zinc-800/90 */
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(63, 63, 70, 0.5);  /* zinc-700/50 */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

#### Glass Interactive
```css
.glass-interactive {
  background: linear-gradient(135deg,
    rgba(39, 39, 42, 0.5) 0%,     /* zinc-800/50 */
    rgba(63, 63, 70, 0.3) 100%    /* zinc-700/30 */
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(63, 63, 70, 0.3);  /* zinc-700/30 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-interactive:hover {
  background: linear-gradient(135deg,
    rgba(39, 39, 42, 0.7) 0%,
    rgba(63, 63, 70, 0.5) 100%
  );
  border-color: rgba(63, 63, 70, 0.6);
  transform: translateY(-2px);
}
```

### Implementation Pattern
```jsx
<div className="glass-premium p-6 rounded-3xl border-2 border-primary/50">
  {/* Content */}
</div>

<div className="glass-interactive p-4 rounded-xl hover:border-primary transition-all">
  {/* Interactive content */}
</div>
```

---

## 6. SHADOW SYSTEM

### Shadow Scales
```css
/* Subtle elevation */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Card elevation */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Prominent elevation */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dramatic elevation */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Glow Effects (Primary Color)
```css
/* Button hover glow */
.shadow-primary-lg {
  box-shadow: 0 10px 15px -3px rgba(209, 253, 10, 0.5),
              0 4px 6px -2px rgba(209, 253, 10, 0.3);
}

/* Icon/token glow */
.token-logo-glow {
  box-shadow: 0 0 20px rgba(209, 253, 10, 0.3),
              0 0 40px rgba(209, 253, 10, 0.1);
}

/* Extreme motion score glow */
.motion-extreme-glow {
  box-shadow: 0 0 30px rgba(209, 253, 10, 0.6),
              0 0 60px rgba(209, 253, 10, 0.3);
}
```

---

## 7. ANIMATION SYSTEM

### Timing Functions
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);       /* Default */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);
--bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration Scale
```css
--duration-fast: 150ms;      /* Micro-interactions */
--duration-base: 300ms;      /* Standard transitions */
--duration-slow: 500ms;      /* Large movements */
```

### Standard Transitions
```css
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

### Hover Animations
```css
/* Scale up (buttons, cards) */
.hover\:scale-110:hover {
  transform: scale(1.1);
}

.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Translate (cards) */
.hover\:translateY\(-2px\):hover {
  transform: translateY(-2px);
}

/* Rotate (icons) */
.hover\:rotate-12:hover {
  transform: rotate(12deg);
}
```

### Pulse Animation (Status Indicators)
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Framer Motion Patterns
```jsx
// Card entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
>
  {/* Content */}
</motion.div>

// Staggered list
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {/* Item */}
  </motion.div>
))}

// Button interaction
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Button content */}
</motion.button>

// Expand/collapse
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 8. COMPONENT PATTERNS

### 8.1 Button System

#### Primary Button (CTA)
```jsx
<button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2">
  <IconLightning size={20} className="text-black" />
  <span className="text-black">Quick Buy</span>
</button>
```

**Specifications:**
- Background: #D1FD0A → #B8E309 on hover
- Text: Black, bold (600)
- Padding: 24px horizontal, 12px vertical (px-6 py-3)
- Border radius: 12px (rounded-xl)
- Transition: 300ms all properties
- Hover: Shadow-lg with primary/50 glow
- Icon: 20px, black color

#### Secondary Button (Outlined)
```jsx
<button className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center gap-2">
  <IconCollabExpand size={20} className="text-[#D1FD0A]" />
  <span className="text-[#D1FD0A]">View Details</span>
</button>
```

**Specifications:**
- Background: zinc-800 → zinc-700 on hover
- Text: Primary color (#D1FD0A), semibold (600)
- Border: 2px solid primary
- Padding: 24px horizontal, 12px vertical
- Border radius: 12px

#### Icon Button (Interactive)
```css
/* Primary variant */
.icon-interactive-primary {
  padding: 8px;                  /* p-2 */
  border-radius: 12px;           /* rounded-xl */
  background: rgba(209, 253, 10, 0.1);
  color: #D1FD0A;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-interactive-primary:hover {
  background: rgba(209, 253, 10, 0.2);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(209, 253, 10, 0.3);
}

/* Secondary variant */
.icon-interactive {
  padding: 8px;
  border-radius: 12px;
  background: rgba(63, 63, 70, 0.3);
  color: rgb(161, 161, 170);     /* zinc-400 */
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-interactive:hover {
  background: rgba(63, 63, 70, 0.5);
  color: white;
  transform: scale(1.05);
}
```

### 8.2 Badge System

#### Success Badge
```jsx
<div className="badge-success flex items-center gap-1">
  <IconRocket size={12} />
  <span>Launched</span>
</div>
```

```css
.badge-success {
  padding: 6px 12px;              /* px-3 py-1.5 */
  border-radius: 9999px;          /* rounded-full */
  background: rgba(0, 255, 136, 0.1);  /* success/10 */
  color: #00FF88;
  font-size: 12px;                /* text-xs */
  font-weight: 600;               /* font-semibold */
  border: 1px solid rgba(0, 255, 136, 0.3);
}
```

#### Primary Badge
```css
.badge-primary {
  padding: 6px 12px;
  border-radius: 9999px;
  background: rgba(209, 253, 10, 0.1);
  color: #D1FD0A;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(209, 253, 10, 0.3);
}
```

#### Warning Badge
```css
.badge-warning {
  padding: 6px 12px;
  border-radius: 9999px;
  background: rgba(234, 179, 8, 0.1);  /* yellow-500/10 */
  color: rgb(234, 179, 8);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(234, 179, 8, 0.3);
}
```

### 8.3 Card Patterns

#### Premium Card (Main Content)
```jsx
<article className="glass-premium p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/50 transition-all border-2 border-primary/50 hover:border-primary">
  {/* Card content */}
</article>
```

**Specifications:**
- Background: Glass-premium gradient (zinc-900/90 → zinc-800/90)
- Padding: 24px (p-6)
- Border radius: 24px (rounded-3xl)
- Border: 2px primary/50 → primary on hover
- Backdrop blur: 20px
- Shadow: xl → xl with primary glow on hover
- Transition: 300ms all

#### Interactive Card (Nested)
```jsx
<div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
  {/* Content */}
</div>
```

**Specifications:**
- Background: Glass-interactive (zinc-800/50 → zinc-700/30)
- Padding: 12px (p-3)
- Border radius: 12px (rounded-xl)
- Border: 2px primary/50 → primary on hover
- Backdrop blur: 12px
- Transition: 300ms all
- Hover: Slight translateY(-2px)

#### Stat Card (Metrics)
```jsx
<div className="glass-interactive p-6 rounded-2xl group hover:border-primary transition-all border border-zinc-800/50">
  <div className="flex items-center justify-between mb-3">
    <IconMotion className="icon-primary group-hover:scale-110 transition-transform" size={32} />
    <IconNavArrowUp className="icon-muted" size={16} />
  </div>
  <div className="font-led-dot text-5xl text-primary">847</div>
  <div className="stat-label">Total Projects</div>
  <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
    <IconPriceUp size={12} />
    <span>+12.5%</span>
  </div>
</div>
```

### 8.4 Input Fields

#### Premium Input
```css
.input-premium {
  padding: 12px 16px;            /* px-4 py-3 */
  border-radius: 12px;           /* rounded-xl */
  background: rgba(39, 39, 42, 0.5);  /* zinc-800/50 */
  border: 2px solid rgba(63, 63, 70, 0.5);  /* zinc-700/50 */
  color: white;
  font-size: 14px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
}

.input-premium:focus {
  outline: none;
  border-color: #D1FD0A;
  background: rgba(39, 39, 42, 0.7);
  box-shadow: 0 0 0 3px rgba(209, 253, 10, 0.1);
}

.input-premium::placeholder {
  color: rgb(113, 113, 122);     /* zinc-500 */
}
```

### 8.5 List Items

```css
.list-item {
  padding: 12px 16px;            /* px-4 py-3 */
  border-radius: 12px;           /* rounded-xl */
  background: rgba(39, 39, 42, 0.3);  /* zinc-800/30 */
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.list-item:hover {
  background: rgba(39, 39, 42, 0.6);
  transform: translateX(4px);
}
```

---

## 9. ICON SYSTEM

### Icon Sizing
```css
.icon-xs:   12px    /* Inline badges */
.icon-sm:   16px    /* Labels, small UI */
.icon-base: 20px    /* Buttons, standard UI */
.icon-lg:   24px    /* Headers, prominent UI */
.icon-xl:   32px    /* Hero sections, main icons */
```

### Icon Color Classes
```css
.icon-primary {
  color: #D1FD0A;
}

.icon-muted {
  color: rgb(161, 161, 170);     /* zinc-400 */
}

.icon-interactive-primary {
  /* See button section above */
}

.icon-interactive {
  /* See button section above */
}
```

### Icon Usage Patterns
```jsx
// With text (standard gap)
<div className="flex items-center gap-2">
  <IconCash size={16} className="icon-muted" />
  <span className="stat-label">24h Volume</span>
</div>

// Interactive icon button
<button className="icon-interactive-primary">
  <IconLightning size={20} />
</button>

// Icon with glow (logo/token)
<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center token-logo-glow">
  <IconMotion className="icon-primary" size={32} />
</div>
```

---

## 10. LAYOUT PATTERNS

### Container Widths
```css
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 24px;               /* px-6 */
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;           /* max-w-7xl */
  }
}
```

### Grid Systems

#### Overview Stats (4-column)
```jsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {/* 4 stat cards */}
</div>
```

#### Project Cards (Responsive)
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
  {/* Project cards */}
</div>
```

#### Metrics Grid (2x2)
```jsx
<div className="grid grid-cols-2 gap-3">
  {/* 4 metric cards */}
</div>
```

### Sticky Navigation
```jsx
<nav className="fixed top-0 w-full glass-premium border-b border-zinc-800 z-50">
  <div className="flex items-center justify-between px-6 py-4">
    {/* Nav content */}
  </div>
</nav>

<main className="container mx-auto px-6 pt-24 pb-12">
  {/* pt-24 to account for fixed nav */}
</main>
```

---

## 11. BACKGROUND EFFECTS

### Blob Background
```jsx
<div className="fixed inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-1/4 left-1/4 w-[325px] h-[325px] rounded-full bg-primary/20 blur-[125px]" />
  <div className="absolute bottom-1/3 right-1/3 w-[325px] h-[325px] rounded-full bg-primary/15 blur-[125px]" />
</div>
```

**Specifications:**
- Position: fixed, inset-0, overflow-hidden
- Pointer events: none (non-interactive)
- Blob 1: 325px × 325px, primary/20, blur-[125px], positioned top-1/4 left-1/4
- Blob 2: 325px × 325px, primary/15, blur-[125px], positioned bottom-1/3 right-1/3
- Both blobs use rounded-full

### Gradient Backgrounds (Cards)
```css
/* Premium cards */
background: linear-gradient(135deg,
  rgba(24, 24, 27, 0.9) 0%,
  rgba(39, 39, 42, 0.9) 100%
);

/* Accent cards (info banners) */
background: linear-gradient(to bottom right,
  rgba(34, 211, 238, 0.05) 0%,    /* cyan-500/5 */
  rgba(168, 85, 247, 0.05) 100%   /* purple-500/5 */
);
```

---

## 12. MOTION SCORE COMPONENT

### Visual Design
```jsx
<div className="p-4 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
  <div className="flex items-center gap-3">
    {/* Motion Icon (dynamic based on score) */}
    <Icon className={colorClass} size={32} />

    {/* Progress Bar */}
    <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>

    {/* Score Number */}
    <div className="font-led-dot text-3xl text-primary">{score}</div>
  </div>
</div>
```

### Score Ranges & Colors
```javascript
const getMotionLevel = (score) => {
  if (score <= 20) return {
    Icon: IconMotion1,
    color: 'text-[#FF005C]',      // Hot pink
    label: 'Low'
  }
  if (score <= 40) return {
    Icon: IconMotion2,
    color: 'text-orange-500',     // Orange
    label: 'Medium-Low'
  }
  if (score <= 60) return {
    Icon: IconMotion,
    color: 'text-yellow-500',     // Yellow
    label: 'Medium'
  }
  if (score <= 80) return {
    Icon: IconMotion4,
    color: 'text-lime-500',       // Lime
    label: 'High'
  }
  return {
    Icon: IconMotion5,
    color: 'text-[#D1FD0A]',      // Primary
    label: 'Extreme',
    glow: true
  }
}
```

---

## 13. RESPONSIVE BREAKPOINTS

### Tailwind Breakpoints
```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Mobile-First Patterns
```jsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

// Hide on mobile, show on desktop
<div className="hidden xl:block">

// Full width on mobile, fixed width on desktop
<div className="w-full lg:w-80">

// Adjust padding responsively
<div className="px-4 sm:px-6 lg:px-8">

// Font size scaling
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
```

---

## 14. ACCESSIBILITY PATTERNS

### Focus States
```css
/* Button focus */
button:focus-visible {
  outline: 2px solid #D1FD0A;
  outline-offset: 2px;
}

/* Input focus */
input:focus {
  outline: none;
  border-color: #D1FD0A;
  box-shadow: 0 0 0 3px rgba(209, 253, 10, 0.1);
}
```

### Color Contrast
- **White on black**: 21:1 (AAA)
- **Primary (#D1FD0A) on black**: High contrast
- **Zinc-300 on black**: 7:1 (AA+)
- **Zinc-400 on black**: 4.5:1 (AA)

### Semantic HTML
```jsx
// Use semantic elements
<nav>          // For navigation
<main>         // For main content
<article>      // For cards/posts
<button>       // For interactive elements (not divs)
<input>        // For form inputs

// Proper heading hierarchy
<h1>           // Page title
<h2>           // Section headings
<h3>           // Subsection headings
```

---

## 15. PERFORMANCE OPTIMIZATIONS

### Blur Optimization
```css
/* Use will-change for elements with backdrop-filter */
.glass-premium,
.glass-interactive {
  will-change: backdrop-filter;
}

/* Or remove will-change after transition */
.glass-premium:hover {
  will-change: auto;
}
```

### Transform Optimization
```css
/* Use transform instead of top/left for animations */
.hover\:translate-y-\[-2px\]:hover {
  transform: translateY(-2px);
  /* Better than: margin-top: -2px; */
}
```

### Lazy Loading
```jsx
// Use React.lazy for code splitting
const ProjectCard = React.lazy(() => import('./ProjectCard'))

// Use loading states
<Suspense fallback={<CardSkeleton />}>
  <ProjectCard />
</Suspense>
```

---

## 16. VISUAL HIERARCHY PRINCIPLES

### What Makes btdemo Feel Premium

1. **Layered Depth**
   - Multiple levels of glass effects
   - Subtle shadows create elevation
   - Borders distinguish interactive elements
   - Hover states enhance depth perception

2. **Controlled Color**
   - Primarily monochrome (black/zinc scale)
   - Strategic accent use (primary lime)
   - Semantic colors for meaning (green = positive)
   - Never more than 3 colors per element

3. **Generous Spacing**
   - 24px gaps between major sections
   - 12px gaps within components
   - Breathing room around text
   - Never cramped or cluttered

4. **Consistent Shapes**
   - Rounded corners everywhere (12px-24px)
   - No sharp edges except icons
   - Circular elements for status (dots, avatars)
   - Pill shapes for badges

5. **Motion Enhancement**
   - Subtle hover effects (scale, translate)
   - 300ms standard transitions
   - Ease-out timing for naturalness
   - Never instant (always animated)

6. **Typography Clarity**
   - Clear hierarchy (900 → 700 → 600 → 400)
   - LED fonts only for numbers
   - Adequate line height (1.5-1.6 for body)
   - Uppercase for labels (with letter-spacing)

---

## 17. IMPLEMENTATION CHECKLIST

### Starting a New Component

- [ ] Use `glass-premium` or `glass-interactive` for backgrounds
- [ ] Set border-radius: `rounded-xl` (12px) or `rounded-3xl` (24px)
- [ ] Add border: `border-2 border-primary/50 hover:border-primary`
- [ ] Include transition: `transition-all duration-300`
- [ ] Use primary color (#D1FD0A) for CTAs and accents
- [ ] Apply proper text hierarchy (white → zinc-300 → zinc-400)
- [ ] Add icon with correct size and color class
- [ ] Include hover states (scale, translateY, shadow)
- [ ] Test on mobile (stack vertically if needed)
- [ ] Verify color contrast for accessibility

### Quick Reference

**Colors**: Black bg, zinc gradients, primary accents
**Fonts**: System font (UI), LED fonts (numbers only)
**Spacing**: 24px gaps, 12px internal, 6px tight
**Borders**: 12-24px radius, primary/50 → primary
**Shadows**: xl for cards, lg + glow for CTAs
**Transitions**: 300ms ease-out for all
**Icons**: 16-32px, primary or muted colors
**Motion**: Scale 1.02-1.1, translateY -2px

---

## 18. CODE SNIPPETS LIBRARY

### Full Project Card Example
```jsx
<article className="glass-premium p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/50 transition-all border-2 border-primary/50 hover:border-primary">
  {/* Header */}
  <div className="flex items-start justify-between mb-4">
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

  {/* Motion Score */}
  <div className="p-4 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary mb-4">
    <div className="flex items-center gap-3">
      <IconMotion5 className="text-[#D1FD0A]" size={32} />
      <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
          style={{ width: '95%' }}
        />
      </div>
      <div className="font-led-dot text-3xl text-primary">95</div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="grid grid-cols-2 gap-3">
    <button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2">
      <IconLightning size={20} className="text-black" />
      <span className="text-black">Quick Buy</span>
    </button>
    <button className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center gap-2">
      <IconCollabExpand size={20} className="text-[#D1FD0A]" />
      <span className="text-[#D1FD0A]">View Details</span>
    </button>
  </div>
</article>
```

### Full Navigation Bar Example
```jsx
<nav className="fixed top-0 w-full glass-premium border-b border-zinc-800 z-50">
  <div className="flex items-center justify-between px-6 py-4">
    <button className="icon-interactive-primary">
      <IconMenu size={24} />
    </button>

    <div className="flex items-center gap-2">
      <IconMotion className="icon-primary" size={24} />
      <span className="font-led-dot text-3xl text-primary">ICM MOTION</span>
    </div>

    <div className="flex-1 max-w-md mx-8 relative">
      <IconSearch className="icon-muted absolute left-3 top-1/2 -translate-y-1/2" size={20} />
      <input
        type="text"
        placeholder="Search projects..."
        className="input-premium pl-10 w-full"
      />
    </div>

    <div className="flex items-center gap-4">
      <button className="icon-interactive-primary relative">
        <IconNotification size={24} className="text-[#D1FD0A]" />
        <span className="bg-[#D1FD0A] text-black absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
      </button>

      <button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center gap-2">
        <IconWallet size={20} className="text-black" />
        <span>Connect Wallet</span>
      </button>
    </div>
  </div>
</nav>
```

---

## 19. DESIGN DIFFERENCES: btdemo vs BLAST Test

### Current Issues in BLAST Test Page

1. **Color Palette**
   - BLAST uses: #00FF88 (mint green) as primary
   - btdemo uses: #D1FD0A (neon lime) as primary
   - **Fix**: Replace all #00FF88 with #D1FD0A

2. **Typography**
   - BLAST: Standard system fonts only
   - btdemo: LED fonts (font-led-dot) for numbers
   - **Fix**: Use `font-led-dot` for all numeric displays

3. **Glass Effects**
   - BLAST: Simpler gradients (from-zinc-900/90 to-zinc-800/90)
   - btdemo: Same but with additional borders and shadows
   - **Fix**: Add `border-2 border-primary/50 hover:border-primary`

4. **Border Radius**
   - BLAST: Mostly rounded-2xl (16px)
   - btdemo: Larger rounded-3xl (24px) for main cards
   - **Fix**: Increase main card radius to 24px

5. **Spacing**
   - BLAST: Tighter gaps (gap-3, gap-4)
   - btdemo: More generous (gap-6 for cards)
   - **Fix**: Increase gap between cards to gap-6

6. **Hover Effects**
   - BLAST: Minimal hover states
   - btdemo: Scale, shadow, border transitions
   - **Fix**: Add `hover:shadow-xl hover:shadow-primary/50 transition-all`

7. **Icon Treatment**
   - BLAST: Basic icon usage
   - btdemo: Icon wrappers with backgrounds and glows
   - **Fix**: Wrap icons in glass containers with token-logo-glow

8. **Background Blobs**
   - BLAST: Uses #00FF88 blobs
   - btdemo: Uses #D1FD0A blobs
   - **Fix**: Change blob colors to match primary

---

## 20. FINAL NOTES

### Design Philosophy
- **Minimalist**: Use color sparingly, rely on shapes and depth
- **Functional**: Every visual element serves a purpose
- **Futuristic**: LED fonts, neon glows, tech aesthetic
- **Premium**: High-quality glass effects, smooth animations
- **Accessible**: High contrast, clear hierarchy, semantic HTML

### When in Doubt
1. Use **#D1FD0A** for primary accents
2. Use **glass-premium** for containers
3. Use **rounded-3xl** for main cards
4. Add **transition-all duration-300** to interactive elements
5. Include **hover states** (scale, shadow, border)
6. Keep spacing **generous** (gap-6 for sections)
7. Use **LED fonts** only for numbers
8. Test on **mobile first**, then scale up

---

**Last Updated**: 2025-10-25
**Version**: 1.0
**Based on**: `/btdemo` reference design
**For**: BLAST redesign alignment
