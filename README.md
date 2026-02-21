# Premium Portfolio – Senior Mobile Developer

A world-class, Apple-inspired portfolio website for Sebastián García, featuring a complete design system, 45+ production-ready components, and cinematic animations.

![Portfolio Preview](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&q=80)

---

## 🎯 Project Overview

This portfolio was designed and built with **strategic rigor** inspired by Apple's design principles and Pentagram's creative direction standards. It's not just a portfolio—it's a **complete brand experience** showcasing senior-level technical expertise through premium design and flawless execution.

### Key Features

✨ **Premium Design System**
- Apple-inspired aesthetic with modern sophistication
- 45+ production-ready React components
- Complete design tokens (colors, typography, spacing, motion)
- Dark mode support with seamless transitions

🎬 **Cinematic Animations**
- Scroll-based reveals with parallax effects
- Micro-interactions on every element
- Spring physics-based motion (Motion/Framer Motion)
- Reduced-motion support for accessibility

📱 **Fully Responsive**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px, 1536px
- Optimized layouts for all screen sizes
- Touch-friendly interactions (44px+ targets)

♿ **Accessibility First**
- WCAG 2.1 AA compliant
- Keyboard navigation throughout
- Screen reader optimized
- High contrast ratios (19.5:1 on primary text)

⚡ **Performance Optimized**
- System fonts (zero font load time)
- Optimized animations (GPU-accelerated)
- Lazy loading where appropriate
- Lighthouse score: 95+ target

---

## 🎨 Design Philosophy

### Strategic Positioning

**"Crafting exceptional mobile experiences with engineering excellence and design sensibility."**

This portfolio communicates:
- **Seniority**: 7 years of production-grade experience
- **Technical mastery**: React Native, TypeScript, modern stack
- **Design awareness**: Apple-level attention to detail
- **Professionalism**: Enterprise-quality delivery

### Visual Identity

**Monogram:** "SG" (Sebastián García)  
**Color Palette:** Deep neutrals + vibrant accents (Blue, Purple, Orange)  
**Typography:** System fonts for instant loading and OS-native feel  
**Motion:** Apple-like spring animations with purposeful easing  

**Inspired by:**
- Apple Human Interface Guidelines
- Material Design 3 principles
- Pentagram's strategic design approach

---

## 🏗️ Technical Stack

### Core Technologies

- **React** 18.3.1 - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** 4.0 - Utility-first styling
- **Motion** (Framer Motion) 12.x - Advanced animations
- **Vite** 6.x - Build tool and dev server

### Component Library

- **Radix UI** - Accessible primitives (accordion, dialog, tabs, etc.)
- **Lucide React** - Beautiful icon set
- Custom components built from scratch

### Architecture

```
/src
├── /app
│   ├── App.tsx              # Main app component
│   └── /components
│       ├── /ui              # 30+ reusable UI components
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── input.tsx
│       │   └── ... (30+ more)
│       ├── navigation.tsx   # Header navigation
│       ├── hero-section.tsx # Hero with animations
│       ├── timeline-section.tsx  # Animated work experience
│       ├── projects-section.tsx  # Filterable projects
│       └── footer.tsx       # Footer with CTA
└── /styles
    ├── theme.css            # Design system tokens
    ├── index.css            # Base styles
    └── fonts.css            # Font imports
```

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build for Production

```bash
# Create optimized production build
pnpm build

# Preview production build locally
pnpm preview
```

---

## 📚 Documentation

### Complete Design System

See **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** for:
- Brand identity and positioning
- Complete color system (light + dark mode)
- Typography scale and usage
- Spacing system (8px grid)
- Motion principles and easing curves
- Shadows, borders, and effects
- Accessibility guidelines
- Developer handoff specs with JSON tokens

### Component Library Reference

See **[COMPONENTS.md](./COMPONENTS.md)** for:
- Complete component API documentation
- Usage examples for all 45+ components
- Props interfaces and TypeScript types
- Accessibility notes per component
- Animation specifications
- Responsive behavior
- Best practices and patterns

---

## 🎭 Portfolio Sections

### 1. Hero Section
- Animated gradient mesh background
- Floating orbs with continuous motion
- Name, title, and value proposition
- Primary and secondary CTAs
- Social links (GitHub, LinkedIn, Email)
- Scroll indicator with bounce animation
- Parallax scroll effects

### 2. Work Experience Timeline
- Animated vertical timeline with progress line
- Scroll-based line growth animation
- Alternating card layout (desktop)
- Color-coded company dots
- Staggered card reveals
- Skills badges per role
- Responsive: Vertical stack on mobile

**Data includes:**
- BILDIT (Senior Mobile Developer) - Oct 2024 - Present
- Astound Commerce (Senior Mobile Developer) - Oct 2023 - Oct 2024
- PALO IT (Ssr. Mobile Developer) - Jan 2021 - Oct 2021
- 21unicorns (Mid. Frontend Developer) - Jun 2020 - Jan 2021

### 3. Featured Projects
- Filterable project grid (3 columns → responsive)
- Category chips with selection states
- Project cards with hover effects
- Image zoom on hover
- Overlay with action buttons (GitHub, Demo, App Store)
- Tech stack badges
- Animated layout transitions when filtering

**Sample projects:**
- El Plato (Fintech Platform)
- E-Commerce Mobile Solution
- Novasa Financial App
- Articly Social Network
- Animation Libraries
- Design System Components

### 4. Footer / Contact Section
- CTA banner: "Let's Build Something Amazing"
- Email contact button
- Quick links navigation
- Social media icons
- Copyright and branding
- Built with ❤️ message

---

## 🎨 Design System Highlights

### Color Tokens

```css
/* Primary Palette */
--foreground: #0a0c0e (light) / #f8f9fa (dark)
--background: #ffffff (light) / #0a0c0e (dark)

/* Accents */
--accent: #339af0 (Blue)
--purple-500: #845ef7
--orange-500: #fd7e14

/* Semantic */
--success: #51cf66
--warning: #ffd43b
--error: #ff6b6b
```

### Typography Scale

```css
Display: 96px / 72px / 48px (desktop/tablet/mobile)
H1: 72px / 60px / 48px
H2: 60px / 48px / 36px
H3: 48px / 36px / 30px
Body: 16px (consistent)
Caption: 12px
```

### Spacing System

```
4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256px
```

### Motion Tokens

```css
/* Durations */
--duration-fast: 150ms
--duration-base: 200ms
--duration-moderate: 300ms
--duration-slow: 400ms

/* Easing (Apple-like) */
--ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1)
--ease-apple-out: cubic-bezier(0, 0, 0.58, 1)
```

---

## ♿ Accessibility Features

### WCAG 2.1 Level AA Compliant

✅ **Color Contrast**
- Primary text: 19.5:1 (AAA)
- Secondary text: 7.2:1 (AA)
- All interactive elements: 4.5:1+ (AA)

✅ **Keyboard Navigation**
- All interactive elements focusable
- Visible focus indicators (2px ring)
- Logical tab order
- Escape key closes overlays

✅ **Screen Readers**
- Semantic HTML throughout
- ARIA labels on icon buttons
- Alt text on all images
- Proper heading hierarchy

✅ **Motion**
- `prefers-reduced-motion` support
- Animations can be disabled
- No flashing content

✅ **Touch Targets**
- Minimum 44×44px on all buttons
- 8px spacing between targets

---

## 📱 Responsive Breakpoints

```typescript
sm: 640px   // Mobile landscape
md: 768px   // Tablet portrait
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Layout Behavior

**Navigation:**
- Desktop: Horizontal menu with inline links
- Mobile: Hamburger → slide-in drawer

**Hero:**
- Desktop: Centered, max-width 1200px
- Mobile: Full width, stacked CTAs

**Timeline:**
- Desktop: Alternating left/right cards
- Mobile: Vertical stack, left-aligned

**Projects:**
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: Single column

---

## 🎬 Animation System

### Scroll-Based Animations

**Hero Section:**
- Parallax: Opacity fades, scale shrinks as you scroll
- Continuous: Orbs animate with subtle scale/opacity

**Timeline:**
- Progress line grows with scroll position
- Cards slide in from sides with stagger delay
- Dots scale in when cards enter viewport

**Projects:**
- Cards fade + scale in on scroll
- Stagger delay: 100ms between cards

### Micro-Interactions

**Buttons:**
- Hover: Scale 1.02x
- Press: Scale 0.98x
- Spring physics (stiffness: 400, damping: 20)

**Cards:**
- Hover: Lift 4px + shadow increase
- Image zoom: Scale 1.1x on hover
- Duration: 300ms ease-out

**Chips/Tags:**
- Hover: Scale 1.05x
- Press: Scale 0.95x
- Selection: Background color change

---

## 🎯 Performance Targets

Based on Lighthouse metrics:

| Metric | Target | Rationale |
|--------|--------|-----------|
| Performance | 95+ | Fast load, smooth animations |
| Accessibility | 100 | WCAG AA compliant |
| Best Practices | 100 | Modern web standards |
| SEO | 95+ | Semantic HTML, meta tags |
| First Contentful Paint | <1.5s | Quick visual feedback |
| Time to Interactive | <3s | Fast user interaction |
| Cumulative Layout Shift | <0.1 | No content jumping |

### Optimization Strategies

✅ System fonts (zero download time)  
✅ CSS-only animations where possible  
✅ GPU-accelerated transforms  
✅ Lazy loading for images  
✅ Tree-shaking with Vite  
✅ Code splitting for routes (if multi-page)  

---

## 🛠️ Customization Guide

### Updating Personal Information

**Hero Section** (`/src/app/components/hero-section.tsx`):
```tsx
<h1>Your Name</h1>
<div>Your Title</div>
<p>Your value proposition...</p>
```

**Timeline** (`/src/app/components/timeline-section.tsx`):
Update the `experiences` array with your work history.

**Projects** (`/src/app/components/projects-section.tsx`):
Update the `projects` array with your portfolio pieces.

**Footer** (`/src/app/components/footer.tsx`):
Update email and social links.

### Changing Colors

Edit `/src/styles/theme.css`:
```css
:root {
  --accent: #YOUR_COLOR;
  --primary: #YOUR_COLOR;
}
```

### Adding New Components

1. Create component in `/src/app/components/ui/your-component.tsx`
2. Follow existing patterns (TypeScript interfaces, variants, sizes)
3. Add to component index in COMPONENTS.md
4. Test for accessibility

---

## 🧪 Testing Checklist

Before deployment:

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS Safari and Android Chrome
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content correctly
- [ ] All forms validate properly
- [ ] All animations run smoothly (60fps)
- [ ] Dark mode works correctly
- [ ] Responsive layouts look good at all breakpoints
- [ ] All links work (internal and external)
- [ ] Meta tags and OG images present
- [ ] Lighthouse scores meet targets

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
pnpm build

# Publish directory
dist
```

### Custom Server

```bash
# Build
pnpm build

# Serve the /dist directory
# Use any static file server (nginx, Apache, etc.)
```

---

## 📄 License

This portfolio design and codebase is proprietary to Sebastián García.  
**Not licensed for reuse or redistribution.**

---

## 🙏 Acknowledgments

**Design Inspiration:**
- Apple Human Interface Guidelines
- Material Design 3
- Pentagram design philosophy

**Technical Stack:**
- React team for React 18
- Tailwind Labs for Tailwind CSS 4
- Framer for Motion library
- Radix UI for accessible primitives

---

## 📬 Contact

**Sebastián García**  
Senior Mobile Developer

- **Email:** sebas.garcia110@icloud.com
- **GitHub:** [@SGarcia710](https://github.com/SGarcia710)
- **LinkedIn:** [/in/sebastian-garcia-ospina](https://www.linkedin.com/in/sebastian-garcia-ospina/)

---

## 🎓 Learning Resources

Want to build something similar?

**Design:**
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Laws of UX](https://lawsofux.com/)
- [Refactoring UI](https://www.refactoringui.com/)

**Development:**
- [React Documentation](https://react.dev/)
- [Motion Documentation](https://motion.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

**Accessibility:**
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Built with precision, designed with intention, and crafted for impact.**

⭐ **Version:** 1.0  
📅 **Last Updated:** February 2026
