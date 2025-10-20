# ThicNThin Landing Page - Design System Guidelines

> **Purpose**: This document captures the design system, visual language, and styling patterns for the ThicNThin landing page. Reference this when making changes to maintain consistency.

---

## 🎨 Color Palette

### Primary Colors (Blue)
```css
Blue-600: #2563EB  /* Primary CTAs, accents, featured elements */
Blue-500: #3B82F6  /* Hover states, secondary elements */
Blue-400: #93C5FD  /* Pale accents (70% opacity overlays) */
Blue-300: #60A5FA  /* Decorative SVG underlining */
Blue-100: #E0E7FF  /* Light backgrounds */
```

### Neutral Palette (Slate)
```css
Slate-900: #0F172A  /* Primary text, headers, dark backgrounds */
Slate-700: #334155  /* Secondary text, navigation */
Slate-600: #475569  /* Muted text */
Slate-500: #64748B  /* Disabled/tertiary text */
Slate-400: #94A3B8  /* Light text */
Slate-300: #CBD5E1  /* Borders, dividers */
Slate-200: #E2E8F0  /* Light borders */
Slate-100: #F1F5F9  /* Light backgrounds */
Slate-50:  #F8FAFC  /* Lightest backgrounds */
```

### Utility Colors
```css
White:     #FFFFFF  /* Primary background */
Gray-50:   #F9FAFB  /* Form input backgrounds */
Gray-200:  #E5E7EB  /* Form input borders */
Gray-900:  #111827  /* Form input text */
```

### Color Usage Strategy
- **White sections**: Hero, Secondary Features, Footer
- **Light slate (Slate-50)**: Testimonials, FAQs
- **Dark slate (Slate-900)**: Pricing section for contrast
- **Blue sections**: Primary Features, CTA (high-engagement areas)

---

## 📝 Typography

### Font Families
- **Display Font**: `Lexend` - Headings (h1, h2, h3) for impact
- **Body Font**: `Inter` - Body text, UI labels for readability

### Type Scale
```css
text-xs:   0.75rem / 1rem      /* 12px / 16px line-height */
text-sm:   0.875rem / 1.5rem   /* 14px / 24px */
text-base: 1rem / 1.75rem      /* 16px / 28px */
text-lg:   1.125rem / 2rem     /* 18px / 32px */
text-xl:   1.25rem / 2rem      /* 20px / 32px */
text-2xl:  1.5rem / 2rem       /* 24px / 32px */
text-3xl:  2rem / 2.5rem       /* 32px / 40px */
text-4xl:  2.5rem / 3.5rem     /* 40px / 56px */
text-5xl:  3rem / 3.5rem       /* 48px / 56px */
text-6xl:  3.75rem / 1         /* 60px / tight */
text-7xl:  4.5rem / 1.1        /* 72px */
text-8xl:  6rem / 1            /* 96px / tight */
text-9xl:  8rem / 1            /* 128px / tight */
```

### Typography Hierarchy
**Hero Section**
- Main heading: `font-display text-5xl sm:text-7xl`
- Tagline: `text-lg tracking-tight`

**Section Headers**
- Primary: `font-display text-3xl sm:text-4xl md:text-5xl`
- Secondary: `font-display text-lg`

**Body Text**
- Primary: `text-base tracking-tight`
- Secondary: `text-lg tracking-tight`
- Small: `text-sm`

**Letter Spacing**
- Headings: `tracking-tight` (-0.025em)
- Body: `tracking-tight` or default

---

## 📏 Spacing System

### Container Widths
```css
max-w-7xl:  80rem    /* 1280px - Main container */
max-w-4xl:  56rem    /* 896px - Hero content */
max-w-2xl:  42rem    /* 672px - Text content */
```

### Section Padding (Vertical)
```css
Hero:              pt-20 pb-16 lg:pt-32        /* 80-128px top, 64px bottom */
Primary Features:  pt-20 pb-28 sm:py-32        /* 80-128px */
Secondary:         pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32
Testimonials:      py-20 sm:py-32              /* 80-128px */
Pricing:           py-20 sm:py-32              /* 80-128px */
FAQs:              py-20 sm:py-32              /* 80-128px */
CTA:               py-32                       /* 128px */
```

### Container Padding (Horizontal)
```css
Standard: px-4 sm:px-6 lg:px-8
```

### Common Gaps (Flexbox/Grid)
```css
Navigation:     gap-x-6 md:gap-x-12
Hero Buttons:   gap-x-6
Features:       gap-y-2 sm:gap-y-6 md:gap-y-10
Testimonials:   gap-6 sm:gap-8 lg:gap-8
Pricing:        gap-y-10 sm:gap-y-8 lg:gap-x-8
FAQs:           gap-8
```

### Key Margins
```css
Hero copy → buttons:      mt-10
Hero → logos:             mt-36 lg:mt-44
Section title → copy:     mt-6
Copy → CTAs:              mt-4
Between sections:         mt-16 md:mt-20 lg:mt-20
```

---

## 🔲 Border & Radius

### Border Radius
```css
rounded-md:    0.375rem  /* 6px - Form fields */
rounded-lg:    0.5rem    /* 8px - Feature icons */
rounded-xl:    0.75rem   /* 12px - Images */
rounded-2xl:   1rem      /* 16px - Cards, mobile nav */
rounded-3xl:   1.5rem    /* 24px - Pricing cards */
rounded-4xl:   2rem      /* 32px - Tab panels */
rounded-full:  9999px    /* Buttons (fully rounded) */
```

### Borders
```css
Form Fields:  border border-gray-200
Cards:        ring-1 ring-slate-900/5  OR  ring-1 ring-slate-500/10
Dividers:     border-t border-slate-300/40  OR  border-slate-100
Focus:        focus-visible:outline-2 focus-visible:outline-offset-2
```

---

## 🎯 Component Styles

### Button Variants
**Base Structure**: `group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2`

| Variant | Base | Hover | Active | Use Case |
|---------|------|-------|--------|----------|
| **Solid Blue** | `bg-blue-600 text-white` | `hover:bg-blue-500` | `active:bg-blue-800 text-blue-100` | Primary CTA |
| **Solid Slate** | `bg-slate-900 text-white` | `hover:bg-slate-700` | `active:bg-slate-800 text-slate-300` | Secondary |
| **Solid White** | `bg-white text-slate-900` | `hover:bg-blue-50` | `active:bg-blue-200 text-slate-600` | Contrast |
| **Outline Slate** | `ring-1 ring-slate-200 text-slate-700` | `text-slate-900 ring-slate-300` | `bg-slate-100 text-slate-600` | Ghost |
| **Outline White** | `ring-1 ring-slate-700 text-white` | `ring-slate-500` | `ring-slate-700 text-slate-400` | Dark overlay |

### Card Styling
```css
Testimonials:  rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10
Feature Cards: rounded-2xl bg-slate-200 px-14 py-16 xl:px-16
Pricing Plans: rounded-3xl px-6 sm:px-8 py-8
Featured Plan: bg-blue-600 (order-first on mobile)
```

### Shadows
```css
Standard:  shadow-xl shadow-slate-900/10
Images:    shadow-xl shadow-blue-900/20
Heavy:     shadow-2xl
```

### Form Fields
```css
Base:   block w-full appearance-none rounded-md border border-gray-200
        bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400

Focus:  focus:border-blue-500 focus:bg-white focus:outline-hidden
        focus:ring-blue-500

Label:  mb-3 block text-sm font-medium text-gray-700
Select: pr-8 (for dropdown arrow)
```

### Navigation
```css
Header Padding: py-10
Nav Links:      px-2 py-1 text-sm text-slate-700
                hover:bg-slate-100 hover:text-slate-900
Mobile Icon:    h-3.5 w-3.5 stroke-slate-700
```

---

## 📱 Layout Patterns

### Standard Section Structure
```
Container (max-w-7xl px-4 sm:px-6 lg:px-8)
  ├─ Optional Background Image (absolute)
  ├─ Relative Container (z-10)
  │  ├─ Section Header (max-w-2xl, center/left aligned)
  │  │  ├─ Eyebrow text (text-base font-semibold tracking-tight)
  │  │  ├─ Heading (font-display text-3xl-5xl)
  │  │  └─ Description (mt-4 text-lg tracking-tight)
  │  └─ Content Grid
  └─ Optional Overlay
```

### Hero Layout
- Center-aligned (`text-center`)
- Max-width constraint (`max-w-4xl`)
- Large heading with inline SVG underline highlight
- Paragraph below
- Flex row of CTA buttons (`flex justify-center gap-x-6`)
- Logo grid with responsive columns

### Grid Patterns
```css
Testimonials:  grid-cols-1 lg:grid-cols-3
Pricing:       grid-cols-1 lg:grid-cols-3
Logo Grid:     grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
Secondary:     grid-cols-1 lg:grid-cols-3
```

### Tab Patterns
- Horizontal on mobile, vertical on desktop (lg:)
- Tab selection: `bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10`
- Smooth transitions with `translate-X` transforms

---

## ✨ Animation & Interactions

### Transitions
```css
Mobile Nav:     transition duration-150 ease-in-out
                data-closed:opacity-0
Tab Panels:     transition duration-500 ease-in-out
Icons:          origin-center transition
```

### Hover Effects
```css
Buttons:     Color/background shifts
Nav Links:   hover:bg-slate-100 hover:text-slate-900
Icons:       group-hover:fill-slate-700
             opacity-75 hover:opacity-100
```

### State Management (Headless UI)
- `data-selected` - Active tabs
- `data-closed` - Popover/panel closed state
- `data-enter` / `data-leave` - Transition directions
- `data-focus` - Focus state

---

## 🎭 Visual Details

### Images & Decorations
```css
Screenshots:     w-full rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20
Background Imgs: absolute inset-0 positioned with transform centering
SVG Underlines:  fill-blue-300/70 positioned absolute
```

### Typography Decorations
```css
Highlighted:  relative whitespace-nowrap with decorative SVG underline
Quote Icons:  fill-slate-100 absolute top-left
Icons:        h-3 w-3 flex-none fill-blue-600 group-active:fill-current
```

### Overlays & Effects
```css
Semi-transparent: bg-white/10, bg-slate-300/50
Ring Insets:      ring-1 ring-white/10 ring-inset
Light Rings:      ring-1 ring-slate-900/5
```

---

## 📐 Responsive Breakpoints

```css
Mobile (default):  0px    - Single column, full width
sm:                640px  - Small optimizations
md:                768px  - Desktop start (show nav)
lg:                1024px - Large desktop (tabs vertical, 3-col grids)
xl:                1280px - Extra large screens
```

### Key Responsive Behaviors
- Hero: `text-5xl sm:text-7xl` (significant scale-up)
- Navigation: `hidden md:flex` (mobile menu → desktop nav)
- Tabs: Horizontal mobile → Vertical `lg:`
- Grids: 1 column → 3 columns `lg:`
- Padding: Increases with screen size

---

## 🎨 Design Philosophy

### Aesthetic
- **Modern & Professional**: Clean, minimalist SaaS appeal
- **Friendly & Approachable**: Rounded elements, generous spacing
- **High Contrast**: Clear visual hierarchy
- **Spacious**: Breathing room through padding/margins
- **Sophisticated**: Professional with playful touches

### Tone & Personality
- Humorous, self-aware copywriting
- Visual sophistication with friendly interactions
- Trust-building through testimonials and transparency
- Blue accent used strategically for guidance

### Accessibility
- High contrast text colors (WCAG AA+)
- Focus visible outlines with offset
- Semantic HTML + ARIA labels
- Keyboard navigation (Headless UI)
- Screen reader friendly

---

## 🛠️ Technical Stack

### Framework & Build
- **Next.js**: 15.1.6 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.8.3
- **Node**: >=18.17.0

### Styling
- **Tailwind CSS**: v4.1.11
- **Plugins**: @tailwindcss/forms, @tailwindcss/postcss
- **Fonts**: Google Fonts (Inter + Lexend, swap display)

### UI Components
- **Headless UI**: v2.2.6 (accessible components)
- **Icons**: Custom SVG components

---

## 📦 Component Inventory

| Component | Purpose | Key Styles |
|-----------|---------|-----------|
| `Button` | CTAs & actions | Rounded-full, color variants |
| `Container` | Layout wrapper | Max-width, responsive padding |
| `Header` | Navigation | Sticky, responsive menu |
| `Hero` | Main value prop | Large type, gradient underline |
| `PrimaryFeatures` | Feature showcase | Tabs, blue background |
| `SecondaryFeatures` | Additional features | Tab interface |
| `Testimonials` | Social proof | 3-col grid, cards |
| `Pricing` | Plans & pricing | Featured highlight, dark bg |
| `Faqs` | Questions | 3-col layout |
| `CallToAction` | Final CTA | Blue background, centered |
| `Footer` | Links & info | Light background |
| `Logo` | Brand mark | SVG, blue primary |
| `SlimLayout` | Auth pages | Split layout |
| `Fields` | Form inputs | Styled inputs/selects |

---

## 🎯 Design Principles for Changes

When making changes to this project, follow these principles:

1. **Maintain Visual Consistency**
   - Use the established color palette (don't introduce new colors)
   - Follow spacing patterns (use existing margin/padding values)
   - Keep border radius consistent (rounded-full for buttons, rounded-2xl for cards)

2. **Respect Typography Hierarchy**
   - Display font (Lexend) for headings only
   - Body font (Inter) for content
   - Maintain tracking-tight for modern feel

3. **Follow Layout Patterns**
   - Section padding: `py-20 sm:py-32`
   - Container structure with max-width constraints
   - Responsive grids: 1-col mobile → 3-col desktop

4. **Preserve Interactions**
   - Smooth transitions (150-500ms)
   - Hover states on interactive elements
   - Focus-visible outlines for accessibility

5. **Keep Accessibility First**
   - High contrast text
   - Semantic HTML
   - ARIA labels where needed
   - Keyboard navigation

6. **Use Established Components**
   - Prefer editing existing components over creating new ones
   - Follow existing component patterns
   - Maintain prop interfaces

---

## 📚 Quick Reference

**Primary CTA Button**
```tsx
<Button color="blue">Get started</Button>
```

**Section Header Pattern**
```tsx
<div className="max-w-2xl">
  <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
    Heading
  </h2>
  <p className="mt-4 text-lg tracking-tight text-slate-700">
    Description
  </p>
</div>
```

**Card Pattern**
```tsx
<div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
  {/* content */}
</div>
```

**Container Wrapper**
```tsx
<Container className="pt-20 pb-16 sm:py-32">
  {/* content */}
</Container>
```

---

*Last Updated: 2025-10-20*
*Template: Salient by Tailwind Plus*
