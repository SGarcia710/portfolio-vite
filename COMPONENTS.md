# Component Library Reference

**Premium Portfolio Design System Components**

This document provides a complete reference for all 40+ components in the portfolio design system.

---

## Component Index

### Buttons & Actions (3)
1. [Button](#button)
2. [IconButton](#iconbutton)
3. [Link](#link)

### Forms (9)
4. [Input](#input)
5. [Textarea](#textarea)
6. [Select](#select)
7. [Checkbox](#checkbox)
8. [Radio](#radio)
9. [RadioGroup](#radiogroup)
10. [Switch](#switch)
11. [SearchField](#searchfield)

### Data Display (12)
12. [Card](#card)
13. [CardHeader](#cardheader)
14. [CardContent](#cardcontent)
15. [CardFooter](#cardfooter)
16. [Badge](#badge)
17. [Chip](#chip)
18. [Avatar](#avatar)
19. [Progress](#progress)
20. [Divider](#divider)
21. [StatCard](#statcard)
22. [Breadcrumb](#breadcrumb)
23. [EmptyState](#emptystate)

### Navigation (7)
24. [Navigation](#navigation)
25. [MobileMenu](#mobilemenu)
26. [Tabs](#tabs)
27. [TabButton](#tabbutton)
28. [Footer](#footer)
29. [SocialButton](#socialbutton)
30. [SocialLink](#sociallink)

### Feedback (10)
31. [Toast](#toast)
32. [ToastProvider](#toastprovider)
33. [Modal](#modal)
34. [Tooltip](#tooltip)
35. [LoadingSkeleton](#loadingskeleton)
36. [LoadingSpinner](#loadingspinner)
37. [PageLoader](#pageloader)
38. [CTABanner](#ctabanner)

### Layout (3)
39. [Accordion](#accordion)
40. [AccordionItem](#accordionitem)

### Portfolio-Specific (7)
41. [HeroSection](#herosection)
42. [TimelineSection](#timelinesection)
43. [TimelineItem](#timelineitem)
44. [ProjectsSection](#projectssection)
45. [ProjectCard](#projectcard)

**Total: 45+ Components**

---

## Component Specifications

### Button

**File:** `/src/app/components/ui/button.tsx`

**Purpose:** Primary interactive element for user actions

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Variants:**
- `primary`: Solid background, high contrast (main CTAs)
- `secondary`: Subtle background with border
- `tertiary`: Border only, transparent background
- `ghost`: Transparent, fills on hover
- `destructive`: Red styling for dangerous actions

**Usage Example:**
```tsx
<Button 
  variant="primary" 
  size="lg"
  leftIcon={<Mail className="w-5 h-5" />}
  onClick={handleClick}
>
  Get in touch
</Button>
```

**Animation:**
- Hover: Scale 1.02x
- Press: Scale 0.98x
- Duration: 200ms with spring physics

**Accessibility:**
- Semantic `<button>` element
- Focus ring (2px offset)
- Disabled state (50% opacity)
- ARIA labels supported

---

### IconButton

**File:** `/src/app/components/ui/button.tsx`

**Purpose:** Square button for icon-only actions

**Props:**
```typescript
interface IconButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  children: React.ReactNode; // Icon element
  'aria-label': string; // Required for accessibility
}
```

**Sizes:**
- `sm`: 32px × 32px
- `md`: 40px × 40px
- `lg`: 48px × 48px
- `xl`: 56px × 56px

**Usage Example:**
```tsx
<IconButton 
  variant="ghost" 
  size="md"
  aria-label="Toggle theme"
  onClick={toggleTheme}
>
  <Moon className="w-5 h-5" />
</IconButton>
```

---

### Card

**File:** `/src/app/components/ui/card.tsx`

**Purpose:** Container for grouped content

**Props:**
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Variants:**
- `default`: White background with border
- `elevated`: Elevated with shadow, no border
- `bordered`: Thicker 2px border
- `glass`: Glassmorphism effect with blur

**Compound Components:**
- `CardHeader`: Top section with padding
- `CardContent`: Main content area
- `CardFooter`: Bottom section with padding

**Usage Example:**
```tsx
<Card variant="elevated" hoverable>
  <CardHeader>
    <h3>Project Title</h3>
  </CardHeader>
  <CardContent>
    <p>Project description...</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Learn more</Button>
  </CardFooter>
</Card>
```

**Animation (if hoverable):**
- Hover: translateY(-4px), shadow increases
- Duration: 300ms ease-out

---

### Input

**File:** `/src/app/components/ui/input.tsx`

**Purpose:** Text input field with label and validation

**Props:**
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent) => void;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
}
```

**Features:**
- Optional label above field
- Icon support (left/right)
- Error state with message
- Helper text for guidance
- Full keyboard accessibility

**Usage Example:**
```tsx
<Input
  label="Email address"
  type="email"
  placeholder="you@example.com"
  leftIcon={<Mail className="w-5 h-5" />}
  error={emailError}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**States:**
- Default
- Focus: Ring outline (2px)
- Error: Red border and message
- Disabled: 50% opacity

---

### Badge

**File:** `/src/app/components/ui/badge.tsx`

**Purpose:** Small label for status or categorization

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Variants:**
- `default`: Muted background
- `primary`: Primary color
- `secondary`: Secondary color
- `success`: Green
- `warning`: Yellow
- `error`: Red
- `outline`: Border only

**Usage Example:**
```tsx
<Badge variant="success" size="sm">
  Completed
</Badge>
```

---

### Chip

**File:** `/src/app/components/ui/chip.tsx`

**Purpose:** Interactive filter or selection pill

**Props:**
```typescript
interface ChipProps {
  label: string;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
```

**Features:**
- Toggleable selection state
- Optional remove button (X icon)
- Click handler for filter logic
- Hover and press animations

**Usage Example:**
```tsx
<Chip
  label="React Native"
  selected={selectedTags.includes('React Native')}
  onClick={() => toggleTag('React Native')}
  variant="primary"
/>
```

**Animation:**
- Hover: Scale 1.05x
- Press: Scale 0.95x

---

### Modal

**File:** `/src/app/components/ui/modal.tsx`

**Purpose:** Dialog overlay for focused content

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}
```

**Sizes:**
- `sm`: 448px max-width
- `md`: 512px max-width
- `lg`: 672px max-width
- `xl`: 896px max-width
- `full`: Full width with margin

**Features:**
- Backdrop blur overlay
- Close button (X icon)
- Optional header with title
- Click outside to close
- Escape key to close

**Usage Example:**
```tsx
<Modal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)}
  title="Contact Form"
  size="md"
>
  <form>
    {/* Form content */}
  </form>
</Modal>
```

**Animation:**
- Backdrop fade in
- Modal: Fade + scale + slide up
- Duration: 300ms

---

### Tabs

**File:** `/src/app/components/ui/tabs.tsx`

**Purpose:** Organize content into switchable views

**Props:**
```typescript
interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  onChange?: (tabId: string) => void;
}

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}
```

**Variants:**
- `default`: Solid background for active tab
- `pills`: Rounded pill shape
- `underline`: Bottom border indicator

**Usage Example:**
```tsx
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: <OverviewPanel /> },
    { id: 'details', label: 'Details', content: <DetailsPanel /> },
  ]}
  variant="underline"
  onChange={(tabId) => console.log('Active tab:', tabId)}
/>
```

**Animation:**
- Tab content: Fade + slide on change
- Duration: 200ms

---

### Accordion

**File:** `/src/app/components/ui/accordion.tsx`

**Purpose:** Expandable content sections

**Props:**
```typescript
interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}
```

**Features:**
- Single or multiple open items
- Smooth height animation
- Chevron rotation indicator
- Keyboard navigable

**Usage Example:**
```tsx
<Accordion
  items={[
    { 
      id: '1', 
      title: 'What technologies do you use?', 
      content: <p>React Native, TypeScript, GraphQL...</p> 
    },
    { 
      id: '2', 
      title: 'Are you available for projects?', 
      content: <p>Yes! I'm currently accepting...</p> 
    },
  ]}
  allowMultiple={false}
/>
```

---

### Toast

**File:** `/src/app/components/ui/toast.tsx`

**Purpose:** Temporary notification messages

**Provider:**
```tsx
<ToastProvider>
  <App />
</ToastProvider>
```

**Hook:**
```typescript
const { addToast } = useToast();

addToast({
  type: 'success',
  title: 'Message sent!',
  description: 'We\'ll get back to you soon.',
  duration: 5000,
});
```

**Types:**
- `success`: Green with check icon
- `error`: Red with error icon
- `warning`: Yellow with warning icon
- `info`: Blue with info icon

**Features:**
- Auto-dismiss after duration
- Manual close button
- Stacks multiple toasts
- Slide in from bottom-right

**Animation:**
- Entry: Fade + slide up + scale
- Exit: Fade + scale down
- Duration: 200ms

---

### Navigation

**File:** `/src/app/components/navigation.tsx`

**Purpose:** Main site navigation bar

**Props:**
```typescript
interface NavigationProps {
  logo?: string;
  isDark?: boolean;
  onThemeToggle?: () => void;
}
```

**Features:**
- Fixed position, sticky header
- Blur background on scroll
- Desktop horizontal layout
- Mobile hamburger menu
- Theme toggle button
- Smooth scroll to sections

**Responsive:**
- Desktop: Full horizontal menu
- Mobile: Hamburger → drawer menu

---

### Timeline Components

**File:** `/src/app/components/timeline-section.tsx`

**TimelineSection:**
Main container for work experience timeline.

**TimelineItem:**
Individual experience card with:
- Company and role
- Date range and location
- Description
- Skills badges
- Color-coded dot

**Features:**
- Animated progress line (scroll-based)
- Alternating left/right on desktop
- Staggered card reveals
- Parallax dot animations

**Layout:**
- Desktop: 50/50 split alternating
- Mobile: Vertical stack, left-aligned

---

### Project Components

**File:** `/src/app/components/projects-section.tsx`

**ProjectsSection:**
Main container with filter chips and grid.

**ProjectCard:**
Individual project card with:
- Hover image zoom
- Overlay with action buttons
- Category badge
- Tech stack tags
- Links to GitHub/demo

**Features:**
- Filterable by category
- Animated layout transitions
- Hover lift effect
- Responsive grid (3→2→1 columns)

---

### Loading States

**File:** `/src/app/components/ui/loading.tsx`

**Components:**
1. `LoadingSkeleton`: Gray placeholder boxes with pulse animation
2. `LoadingSpinner`: Rotating circle spinner
3. `PageLoader`: Full-page loader with spinner

**Usage:**
```tsx
// Skeleton for content placeholders
<LoadingSkeleton className="w-full h-32 mb-4" />

// Spinner for buttons or inline loading
<LoadingSpinner size="md" />

// Full page loader
{isLoading && <PageLoader />}
```

---

### StatCard

**File:** `/src/app/components/ui/stat-card.tsx`

**Purpose:** Display key metrics or statistics

**Props:**
```typescript
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'accent' | 'gradient';
}
```

**Usage:**
```tsx
<StatCard
  value="7+"
  label="Years Experience"
  icon={<Briefcase className="w-6 h-6" />}
  trend={{ value: 15, isPositive: true }}
  variant="gradient"
/>
```

---

### EmptyState

**File:** `/src/app/components/ui/empty-state.tsx`

**Purpose:** Placeholder when no content is available

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```tsx
<EmptyState
  icon={<FolderOpen className="w-8 h-8" />}
  title="No projects found"
  description="Try adjusting your filters or search query."
  action={{
    label: 'Clear filters',
    onClick: clearFilters,
  }}
/>
```

---

### CTABanner

**File:** `/src/app/components/ui/cta-banner.tsx`

**Purpose:** Prominent call-to-action section

**Props:**
```typescript
interface CTABannerProps {
  title: string;
  description?: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  variant?: 'default' | 'accent' | 'gradient';
}
```

**Usage:**
```tsx
<CTABanner
  title="Ready to collaborate?"
  description="Let's build something amazing together."
  primaryAction={{
    label: 'Get in touch',
    onClick: () => navigate('/contact'),
  }}
  variant="gradient"
/>
```

---

## Component Patterns

### Composition Pattern
Many components support composition:

```tsx
<Card variant="elevated">
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3>Title</h3>
      <Badge variant="success">New</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <p>Content here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>
```

### Controlled vs Uncontrolled
Form components support both patterns:

```tsx
// Controlled
<Input value={email} onChange={(e) => setEmail(e.target.value)} />

// Uncontrolled
<Input defaultValue="initial" />
```

### Render Props
Some components use render props for flexibility:

```tsx
<Tabs
  tabs={[
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <CustomComponent data={data} />,
    },
  ]}
/>
```

---

## Styling Conventions

### Class Naming
- Use Tailwind utility classes
- Custom utilities in theme.css (`.glass`, `.gradient-mesh`)
- BEM-like structure for complex components (rare)

### Responsive Design
- Mobile-first approach
- Breakpoint prefixes: `md:`, `lg:`, `xl:`
- Example: `text-base md:text-lg lg:text-xl`

### Dark Mode
- Automatic via `dark:` prefix
- Toggle via `document.documentElement.classList.toggle('dark')`
- All components support dark mode

---

## Animation Guidelines

### Micro-interactions
- Buttons: Scale on hover/press
- Cards: Lift on hover
- Icons: Subtle rotation or scale

### Page Transitions
- Scroll-based reveals: Fade + slide
- Stagger delays: 100ms increments
- Duration: 300-600ms for major elements

### Motion Tokens
Use CSS variables:
```css
transition: all var(--duration-base) var(--ease-apple);
```

---

## Accessibility Checklist

For each component:
- ✅ Semantic HTML
- ✅ Keyboard navigable
- ✅ Focus states visible
- ✅ ARIA labels where needed
- ✅ Color contrast (AA minimum)
- ✅ Touch targets 44px+
- ✅ Reduced motion support

---

## File Structure

```
/src/app/components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── chip.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio.tsx
│   ├── switch.tsx
│   ├── modal.tsx
│   ├── tooltip.tsx
│   ├── toast.tsx
│   ├── tabs.tsx
│   ├── accordion.tsx
│   ├── progress.tsx
│   ├── divider.tsx
│   ├── avatar.tsx
│   ├── loading.tsx
│   ├── stat-card.tsx
│   ├── empty-state.tsx
│   ├── breadcrumb.tsx
│   ├── search-field.tsx
│   └── cta-banner.tsx
├── navigation.tsx
├── hero-section.tsx
├── timeline-section.tsx
├── projects-section.tsx
└── footer.tsx
```

---

## Best Practices

### Do:
✅ Use semantic HTML elements  
✅ Provide ARIA labels for icon buttons  
✅ Test with keyboard navigation  
✅ Support dark mode  
✅ Use motion tokens from theme  
✅ Keep components focused (single responsibility)  
✅ Compose complex UIs from simple components  

### Don't:
❌ Override system fonts  
❌ Use animations longer than 800ms  
❌ Ignore accessibility  
❌ Hardcode colors (use theme tokens)  
❌ Create overly complex components  
❌ Skip error states  

---

## Version History

**v1.0** - February 2026
- Initial release
- 45+ components
- Full dark mode support
- Accessibility compliant
- Motion system implemented

---

**For implementation details and design rationale, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**
