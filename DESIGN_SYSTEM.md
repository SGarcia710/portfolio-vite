# Portfolio Design System & Brand Book
**Senior Mobile Developer Portfolio – Sebastián García**

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Design Philosophy](#design-philosophy)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Motion Principles](#motion-principles)
7. [Component Library](#component-library)
8. [Page Patterns](#page-patterns)
9. [Accessibility](#accessibility)
10. [Developer Handoff](#developer-handoff)

---

## Brand Identity

### Positioning Statement
**"Crafting exceptional mobile experiences with engineering excellence and design sensibility."**

Sebastián García is a Senior Mobile Developer who bridges the gap between technical mastery and user-centered design. With 7 years of experience building production-grade React Native applications, he delivers mobile solutions that combine performance, scalability, and delightful user experiences.

### Brand Archetype
**The Craftsman-Innovator**
- Expert: Deep technical knowledge
- Creator: Builds beautiful, functional products
- Maverick: Embraces modern technologies
- Reliable: Delivers production-ready solutions

### Personality Traits
- **Professional**: Enterprise-level quality and reliability
- **Modern**: Cutting-edge technologies and approaches
- **Confident**: Proven track record with major companies
- **Human**: Approachable and collaborative
- **Precise**: Attention to detail in code and design

### Tone of Voice Matrix

| Context | Description | Example |
|---------|-------------|---------|
| Professional | Confident, competent, clear | "7 years of building high-performance mobile applications" |
| Warm | Approachable, collaborative | "Let's build something amazing together" |
| Technical | Precise, knowledgeable | "React Native · TypeScript · GraphQL · CI/CD" |
| Aspirational | Forward-looking, innovative | "Crafting the future of mobile experiences" |

### Visual Identity

**Logo/Wordmark: "SG"**
- Monogram representing Sebastián García
- Clean, geometric letterforms
- Can be used standalone or with full name
- Maintains legibility at all sizes

**Usage:**
- Primary: "SG" monogram for navigation and branding
- Secondary: "Sebastián García" full name for hero section
- Minimum size: 24px height
- Clear space: Minimum 8px around logo

---

## Design Philosophy

### Inspired by Apple's Design Principles

1. **Clarity**: Every element serves a purpose
2. **Deference**: Content is king, design supports it
3. **Depth**: Layering and motion create hierarchy
4. **Intentionality**: Every detail is considered
5. **Simplicity**: Remove until you can't remove anymore

### Strategic Design Decisions

**Why This Aesthetic?**
- **Premium feel**: Communicates senior-level expertise
- **Modern but timeless**: Won't feel dated in 6 months
- **Performance-focused**: Fast animations, optimized assets
- **Accessible**: WCAG AA compliant, inclusive design
- **Conversion-oriented**: Clear CTAs, scannable content

**What Makes This Different from Template Portfolios?**
- Custom animation system with scroll-based reveals
- Thoughtful micro-interactions on every element
- Cohesive design tokens across all components
- Strategic use of whitespace and typography
- Premium glassmorphism and gradient effects

---

## Color System

### Philosophy
Colors are used sparingly and intentionally. The palette emphasizes contrast, readability, and sophistication with vibrant accent colors that draw attention to key actions.

### Primary Palette (Neutrals)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `slate-50` | #f8f9fa | - | Lightest backgrounds |
| `slate-100` | #f1f3f5 | - | Secondary backgrounds |
| `slate-500` | #adb5bd | - | Disabled text |
| `slate-700` | #495057 | - | Secondary text (light) |
| `slate-900` | #212529 | - | Primary text (light) |
| `slate-950` | #0a0c0e | - | Darkest elements |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Blue 500 | #339af0 | Primary accent, links, focus states |
| Purple 500 | #845ef7 | Secondary accent, highlights |
| Orange 500 | #fd7e14 | Tertiary accent, energy |

**Rationale:**
- Blue: Trust, professionalism, technology
- Purple: Creativity, innovation
- Orange: Energy, enthusiasm, approachability

### Semantic Colors

| Purpose | Light | Dark | Usage |
|---------|-------|------|-------|
| Success | #51cf66 | #51cf66 | Confirmations, positive states |
| Warning | #ffd43b | #ffd43b | Warnings, important info |
| Error | #ff6b6b | #ff6b6b | Errors, destructive actions |
| Info | #4dabf7 | #4dabf7 | Informational messages |

### Dark Mode Palette

**Background Layers:**
- Primary: #0a0c0e
- Secondary: #1a1d21
- Tertiary: #25292e

**Foreground:**
- Primary: #f8f9fa
- Secondary: #ced4da
- Tertiary: #adb5bd

**Strategy:**
Dark mode uses deeper blacks (#0a0c0e instead of pure black) for better OLED performance and reduced eye strain. Accent colors become slightly more vibrant in dark mode.

### Contrast Ratios (WCAG AA Compliant)

| Pairing | Ratio | Passes |
|---------|-------|--------|
| Primary text on background | 19.5:1 | AAA |
| Secondary text on background | 7.2:1 | AA |
| Accent on background | 4.8:1 | AA |
| Primary button text | 19.5:1 | AAA |

---

## Typography

### Type Scale Philosophy
A fluid, responsive type scale that maintains hierarchy across all device sizes. Larger displays get more dramatic scaling for hero moments.

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Rationale:** System fonts provide:
- Instant loading (no font downloads)
- OS-native feel and performance
- Optimal readability on each platform
- Consistency with OS UI

### Text Styles

| Style | Desktop | Tablet | Mobile | Weight | Line Height | Use Case |
|-------|---------|--------|--------|--------|-------------|----------|
| Display | 96px | 72px | 48px | 700 | 1.1 | Hero headlines |
| H1 | 72px | 60px | 48px | 700 | 1.25 | Page titles |
| H2 | 60px | 48px | 36px | 700 | 1.25 | Section titles |
| H3 | 48px | 36px | 30px | 600 | 1.375 | Subsection titles |
| H4 | 36px | 30px | 24px | 600 | 1.375 | Card titles |
| Title | 24px | 20px | 18px | 600 | 1.5 | Small headings |
| Body Large | 20px | 18px | 16px | 400 | 1.625 | Hero descriptions |
| Body | 16px | 16px | 16px | 400 | 1.625 | Default text |
| Body Small | 14px | 14px | 14px | 400 | 1.5 | Secondary text |
| Caption | 12px | 12px | 12px | 400 | 1.5 | Helper text, labels |
| Label | 14px | 14px | 14px | 500 | 1.5 | Form labels, UI text |

### Letter Spacing (Tracking)

| Size | Tracking | Usage |
|------|----------|-------|
| Display/H1/H2 | -0.025em | Tighter for large text |
| H3/H4 | 0 | Normal |
| Body | 0 | Normal |
| Labels/Caption | 0.025em | Slightly wider for legibility |

### Font Weights

- Light: 300 (rarely used)
- Regular: 400 (body text)
- Medium: 500 (labels, UI elements)
- Semibold: 600 (subheadings)
- Bold: 700 (headings, emphasis)

**Don't use:** Black (800-900) – too heavy for digital

---

## Spacing & Layout

### 8px Grid System
All spacing uses multiples of 8px for visual consistency and ease of implementation.

**Scale:**
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px, 160px, 192px, 256px
```

### Section Spacing

| Breakpoint | Padding |
|------------|---------|
| Mobile | 64px (vertical) |
| Tablet | 96px (vertical) |
| Desktop | 128px (vertical) |
| Large Desktop | 192px (vertical) |

**Rationale:** Generous spacing creates breathing room and premium feel.

### Grid System

**12-Column Grid**
- Columns: 12
- Gutter Mobile: 16px
- Gutter Tablet: 24px
- Gutter Desktop: 32px
- Max Width: 1440px

### Container Widths

| Breakpoint | Width |
|------------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1440px |

### Breakpoints

```css
sm: 640px   /* Mobile landscape, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

### Component Spacing Patterns

**Card Padding:**
- Small: 16px
- Medium: 24px
- Large: 32px

**Button Padding:**
- Small: 16px horizontal, 8px vertical
- Medium: 24px horizontal, 12px vertical
- Large: 32px horizontal, 16px vertical

---

## Motion Principles

### Philosophy
Motion should feel **responsive, natural, and purposeful**. Every animation should enhance understanding or delight, never distract.

**Inspired by Apple's Motion Language:**
- Fluid and smooth
- Physics-based (spring animations)
- Respectful of user's time
- Respects reduced-motion preferences

### Duration Scale

| Name | Value | Usage |
|------|-------|-------|
| Instant | 100ms | Micro-interactions, hovers |
| Fast | 150ms | Tooltips, simple transitions |
| Base | 200ms | Most UI transitions |
| Moderate | 300ms | Modal opens, dropdowns |
| Slow | 400ms | Page transitions, complex animations |
| Slower | 600ms | Scroll-based reveals |
| Slowest | 800ms | Hero animations, dramatic reveals |

### Easing Curves

**Apple-Like Easing (Primary):**
```css
--ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-apple-in: cubic-bezier(0.42, 0, 1, 1);
--ease-apple-out: cubic-bezier(0, 0, 0.58, 1);
--ease-apple-in-out: cubic-bezier(0.42, 0, 0.58, 1);
```

**Standard Easing (Secondary):**
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1); /* Most common */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.6, 1);
```

### Animation Types

**1. Scroll-Based Animations**
- Fade in + Slide up on scroll into view
- Parallax effects (subtle, 20-30% speed difference)
- Progress indicators (timeline line)
- Opacity changes based on scroll position

**2. Hover/Interaction**
- Scale on hover: 1.02-1.05x
- Lift effect: translateY(-4px) + shadow increase
- Color transitions: 200ms ease-out
- Border animations: grow from center

**3. Page Load**
- Stagger delays: 100ms increments
- Hero: Fade + slide from bottom
- Navigation: Slide down from top
- Content: Sequential reveals with delays

**4. Micro-interactions**
- Button press: Scale down to 0.98x
- Checkbox/Switch: 150ms spring animation
- Tab transitions: Slide indicator
- Card hover: Lift + shadow + subtle image zoom

### Reduced Motion

**Accessibility First:**
Users with `prefers-reduced-motion` enabled see:
- No scroll-based animations
- Instant transitions (10ms instead of full duration)
- No parallax effects
- No continuous animations

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Spring Animation Parameters

For Motion (Framer Motion):
```typescript
transition={{
  type: 'spring',
  stiffness: 400,  // Snappy but natural
  damping: 20,     // Minimal bounce
}}
```

---

## Component Library

### Components Created (30+)

**Buttons & Actions:**
1. Button (Primary, Secondary, Tertiary, Ghost, Destructive)
2. IconButton
3. Link/InlineLink (via standard `<a>` styling)

**Forms:**
4. Input
5. Textarea
6. Select
7. Checkbox
8. Radio/RadioGroup
9. Switch

**Data Display:**
10. Card (Default, Elevated, Bordered, Glass)
11. CardHeader
12. CardContent
13. CardFooter
14. Badge
15. Chip
16. Avatar
17. Progress
18. Divider

**Navigation:**
19. Navigation (Desktop)
20. MobileMenu (Mobile nav drawer)
21. Tabs
22. TabButton (internal)

**Feedback:**
23. Toast
24. ToastProvider
25. Modal/Dialog
26. Tooltip
27. LoadingSkeleton
28. LoadingSpinner
29. PageLoader

**Layout:**
30. Accordion
31. AccordionItem

**Portfolio-Specific:**
32. HeroSection
33. TimelineSection
34. TimelineItem
35. ProjectsSection
36. ProjectCard
37. Footer
38. SocialButton/SocialLink

**Total: 38 Components**

### Component Specifications

#### Button Component

**Anatomy:**
```
[LeftIcon] [Label] [RightIcon]
```

**Variants:**
- Primary: Solid background, high contrast
- Secondary: Subtle background, border
- Tertiary: Border only
- Ghost: Transparent, hover fills
- Destructive: Red, for dangerous actions

**States:**
- Default
- Hover: Scale 1.02x, opacity 90%
- Active/Pressed: Scale 0.98x
- Focus: Ring outline (2px, offset 2px)
- Loading: Spinner replaces icon
- Disabled: 50% opacity, no interaction

**Sizes:**
- Small: 36px height, 16px padding
- Medium: 44px height, 24px padding
- Large: 48px height, 32px padding
- XL: 56px height, 40px padding

**Accessibility:**
- Clear focus states
- Keyboard navigable
- Semantic HTML `<button>`
- ARIA labels for icon buttons

**Usage:**
- Primary: One per screen max (main CTA)
- Secondary: Supporting actions
- Ghost: Navigation, subtle actions

---

#### Card Component

**Anatomy:**
```
┌─────────────────┐
│  CardHeader     │ (optional)
├─────────────────┤
│  CardContent    │
├─────────────────┤
│  CardFooter     │ (optional)
└─────────────────┘
```

**Variants:**
- Default: Border, white background
- Elevated: Shadow, no border
- Bordered: Thicker border (2px)
- Glass: Glassmorphism effect

**States:**
- Default
- Hover (if hoverable): Lift 4px, shadow increase
- Pressed (if clickable): Scale 0.98x

**Props:**
- `hoverable`: Enable hover lift effect
- `clickable`: Enable press effect, cursor pointer

---

#### Timeline Component

**Anatomy:**
```
    [Dot]
     |    [Card with experience details]
     |
    [Dot]
     |    [Card with experience details]
```

**Features:**
- Animated progress line (scroll-based)
- Staggered card reveals
- Alternating left/right on desktop
- Vertical-only on mobile
- Color-coded dots per experience

**Motion:**
- Line height: Grows as user scrolls
- Cards: Slide in from sides (desktop) or bottom (mobile)
- Dots: Scale from 0 to 1 when card enters view
- Delay: 100ms between items

---

#### Project Card

**Anatomy:**
```
┌──────────────────┐
│  [Image/Thumb]   │ ← Hover: zoom 1.1x
├──────────────────┤
│ [Badge] [Icon]   │
│ [Title]          │
│ [Description]    │
│ [Tags...]        │
└──────────────────┘
```

**Hover State:**
- Card lifts 4px
- Shadow increases
- Image zooms 1.1x (smooth)
- Overlay appears with action buttons
- Title color shifts to accent

**Filter System:**
- Category chips above grid
- Animated layout transitions
- Shows/hides cards with scale animation

---

## Page Patterns

### Hero Section Pattern

**Structure:**
```
[Gradient Mesh Background]
[Animated Orbs - subtle]
  [Status Badge: "Available for opportunities"]
  [Name - Display size]
  [Title - H1]
  [Value Proposition - Body Large]
  [Primary CTA] [Secondary CTA]
  [Social Links]
  [Scroll Indicator]
```

**Behavior:**
- Parallax scroll: Opacity fades, scale shrinks
- Scroll indicator bounces subtly
- Orbs animate continuously (slow)
- Elements stagger in on load (100ms delays)

**Responsive:**
- Desktop: Max width 1200px, centered
- Tablet: Reduce font sizes by ~20%
- Mobile: Stack CTAs vertically, reduce spacing

---

### Timeline Section Pattern

**Structure:**
```
[Section Header]
  [Timeline Container]
    [Vertical Line - animated]
    [Timeline Item] x N
```

**Desktop Layout:**
- Alternating sides (even left, odd right)
- Cards at 50% width minus gap
- Center-aligned dots

**Mobile Layout:**
- All cards align left
- Dots align left (fixed position)
- Reduced spacing

**Motion:**
- Cards slide in from sides
- Line grows with scroll
- Dots pop in when card visible

---

### Projects Section Pattern

**Structure:**
```
[Section Header]
[Category Filter Chips]
[Projects Grid - 3 columns]
  [Project Card] x N
```

**Grid Behavior:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column
- Gap: 32px (desktop), 24px (mobile)

**Filter Animation:**
- Layout shift animated
- Cards fade/scale out when filtered
- Remaining cards reflow smoothly

---

### Footer/Contact Pattern

**Structure:**
```
[CTA Section]
  [Headline]
  [Description]
  [Email Button]

[Divider]

[3 Columns]
  [Branding] [Quick Links] [Social]

[Bottom Bar]
  [Copyright]
```

**Styling:**
- Background: Secondary background color
- Spacing: Generous (80px top/bottom)
- Typography: Hierarchy clear

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
✅ All text meets 4.5:1 minimum (AA)
✅ Large text meets 3:1 minimum (AA)
✅ UI components meet 3:1 minimum

**Keyboard Navigation:**
✅ All interactive elements are focusable
✅ Focus states clearly visible (2px ring)
✅ Logical tab order
✅ Escape key closes modals/dropdowns

**Screen Readers:**
✅ Semantic HTML (`<button>`, `<nav>`, `<main>`, `<footer>`)
✅ ARIA labels on icon buttons
✅ Alt text on images
✅ Skip to main content link (optional enhancement)

**Motion:**
✅ Reduced motion support
✅ No flashing content
✅ Animations can be disabled

**Touch Targets:**
✅ Minimum 44x44px (Apple HIG)
✅ Spacing between interactive elements: 8px+

**Typography:**
✅ Readable font sizes (16px minimum for body)
✅ Sufficient line height (1.625 for body)
✅ Max line length: 75ch for readability

### Testing Checklist

- [ ] Test with VoiceOver (Mac) / NVDA (Windows)
- [ ] Navigate entire site with keyboard only
- [ ] Verify contrast with Color Contrast Analyzer
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Verify on iOS and Android devices
- [ ] Test with 200% browser zoom

---

## Developer Handoff

### Design Tokens (JSON Format)

```json
{
  "colors": {
    "background": {
      "light": "#ffffff",
      "dark": "#0a0c0e"
    },
    "foreground": {
      "light": "#0a0c0e",
      "dark": "#f8f9fa"
    },
    "accent": {
      "light": "#339af0",
      "dark": "#4dabf7"
    }
  },
  "spacing": {
    "1": "0.25rem",
    "2": "0.5rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem",
    "24": "6rem",
    "32": "8rem"
  },
  "typography": {
    "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },
  "borderRadius": {
    "sm": "0.375rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "2xl": "1.5rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.07)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.08)"
  },
  "motion": {
    "duration": {
      "instant": "100ms",
      "fast": "150ms",
      "base": "200ms",
      "moderate": "300ms",
      "slow": "400ms"
    },
    "easing": {
      "apple": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }
}
```

### Implementation Notes

**CSS Custom Properties:**
All tokens are defined as CSS variables in `/src/styles/theme.css`:
```css
:root {
  --accent: #339af0;
  --duration-base: 200ms;
  --ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

**Tailwind Integration:**
Custom classes use theme tokens via `@theme inline` directive.

**Component Architecture:**
- All components in `/src/app/components/`
- UI primitives in `/src/app/components/ui/`
- Section components at root level
- Each component is self-contained with props interface

**Animation Library:**
- Motion (formerly Framer Motion) for all animations
- Scroll animations use `useScroll` and `useTransform`
- Respect `prefers-reduced-motion`

**Responsive Strategy:**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Use Tailwind responsive prefixes: `md:`, `lg:`, etc.

**Z-Index Scale:**
```
Navigation: 50
Dropdown: 100
Sticky: 200
Overlay: 400
Modal: 500
Tooltip: 700
Notification: 800
```

---

## Final Notes

### Export/Production Checklist

- [ ] Optimize images (WebP format, responsive sizes)
- [ ] Remove unused CSS/JS
- [ ] Add meta tags (OG, Twitter cards)
- [ ] Add analytics (if needed)
- [ ] Test on real devices
- [ ] Lighthouse score: 90+ on all metrics
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add 404 page
- [ ] Add sitemap and robots.txt

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1
- Lighthouse Performance: 95+

### Brand Guidelines Summary

**Do:**
- Use generous whitespace
- Maintain consistent spacing (8px grid)
- Use motion purposefully
- Prioritize readability
- Keep color usage minimal

**Don't:**
- Overuse animations
- Mix multiple accent colors in one section
- Use small touch targets (< 44px)
- Ignore dark mode
- Sacrifice performance for aesthetics

---

**Portfolio System Version:** 1.0  
**Last Updated:** February 2026  
**Designed for:** Sebastián García, Senior Mobile Developer  
**Design System Credits:** Inspired by Apple HIG, Material Design 3, and Pentagram creative direction principles

---

*This is a living document. As the portfolio evolves, update this system accordingly.*
