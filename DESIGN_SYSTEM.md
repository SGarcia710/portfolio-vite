# Design system

The source of truth is code: `src/styles/tokens.css` (theme tokens, fonts) and
`src/styles/base.css` (utilities and component classes). This document explains the rules
behind them. If the two disagree, fix one of them.

## Principles

- **Dark only.** `color-scheme: dark`. There is no light theme and no toggle.
- **Editorial, not decorative.** Big type, hairline rules and generous space carry the
  layout. Panels are used for grouped content, not as default wrappers.
- **One moving object.** The Macintosh is the only persistent 3D element; everything else
  animates in on entry and then stays still.
- **Motion is optional.** Every animation has a reduced-motion path that shows the final state.

## Color

Tailwind exposes every token as a utility (`bg-surface`, `text-fg-muted`, `border-line`...).

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `ink-950` `#0a0c0e` | Page background |
| `--color-surface` | `ink-900` `#121519` | Panels, controls |
| `--color-surface-raised` | `ink-850` `#1a1d21` | Raised surfaces, hovers |
| `--color-fg` | `ink-50` `#f8f9fa` | Primary text |
| `--color-fg-soft` | `ink-300` `#ced4da` | Secondary text, tags |
| `--color-fg-muted` | `ink-500` `#868e96` | Body copy on long pages, meta |
| `--color-line` | `fg` at 8% | Hairlines, panel borders |
| `--color-line-strong` | `fg` at 16% | Control borders |
| `--color-accent` | `#4dabf7` | Interactive: links, focus ring, selection, hover fills |
| `--color-brand` | `#ff5b2b` | Brand / "now": logo, loader, current role, live dots |
| `--color-beige` | `#d9d0bc` | The Macintosh plastic, used sparingly to echo it |

Rules:

- Blue means "you can act on this". Orange means "this is me / this is live". Don't swap them.
- Neutrals come from the `ink-*` scale only. No new grays.
- Side projects keep their own identity through a single accent: the `tint` in
  `content/side-projects.ts`, and on a product page one page-scoped variable
  (`--ktc-accent` in `ktcodex.css`). Everything else on that page uses the site tokens.

## Typography

Fonts are self-hosted variable files in `public/fonts/`, preloaded from `index.html`.

- **Geist** (`font-sans`): everything by default.
- **Geist Mono** (`font-mono`): meta, labels, dates, tags.
- **Geist Pixel** (`font-pixel`): small retro accents that echo the Mac screen.

Use the type utilities instead of raw sizes:

| Utility | Size | Use |
| --- | --- | --- |
| `text-display` | `clamp(3.25rem → 10.5rem)` | Hero name only |
| `text-headline` | `clamp(2.5rem → 7rem)` | Section and page titles (h1/h2) |
| `text-title` | `clamp(1.75rem → 3rem)` | Card and sub-section titles (h3) |
| `text-lede` | `clamp(1.0625rem → 1.375rem)` | Intro paragraphs |
| `text-meta` | `0.75rem` mono | Labels, dates, breadcrumbs |
| `text-pixel` | (family only) | Pixel accents, combine with a size |

Headings are weight 600 with tight negative tracking (built into the utilities). Body text
stays at the browser default size with `line-height: 1.6`.

## Shape

- **Interactive controls are pills** (`border-radius: 999px`): buttons, icon buttons,
  toggles, store links.
- **Containers use `--radius-panel`** (`1.5rem`).
- **Inline tags use `--radius-tag`** (`0.375rem`).
- Device mockups (phone, Mac) follow the device, not this scale.

## Layout

- `shell` utility: max width `--content-max` (90rem), side padding `--gutter`
  (`clamp(1.25rem → 3rem)`).
- `--header-height` (4.5rem) is reserved at the top of every page.
- Breakpoints: Tailwind defaults plus `xs` (30rem). Below `lg` (1024px) the 3D scene switches
  to the compact layout: Mac above the hero copy, then a still backdrop.
- Layering uses named z-index tokens: `--z-scene`, `--z-content`, `--z-header`,
  `--z-overlay`, `--z-loader`, `--z-grain`. Don't use raw numbers.

## Motion

- Easing: `--ease-out-expo` for entrances and hovers, `--ease-in-out-quart` for exits and
  scrubbed moves.
- Durations: 0.2s for press feedback, 0.3–0.5s for hovers, 0.7–1.2s for entrances.
- Press feedback: `scale(0.97)` on buttons, `scale(0.94)` on icon buttons.
- Text reveals use GSAP SplitText with `.split-line-mask` so descenders and accents aren't
  clipped.
- Scroll-linked motion runs on the GSAP ticker (shared with Lenis). Never read scroll position
  in React state.
- Under `prefers-reduced-motion`: no smooth scroll, no split reveals, no pinning; the loader
  shows the finished logo and fades out; the Mac stays in its hero pose and scrolls away with the page.

## Components

Defined in `base.css`:

| Class | What it is |
| --- | --- |
| `.btn` + `.btn-primary` | Solid light pill; blue fill wipes up on hover |
| `.btn` + `.btn-ghost` | Outlined pill; border brightens on hover |
| `.icon-btn` | 44px round icon button; inverts on hover |
| `tag` | Mono chip for stacks and skills |
| `.panel` | Bordered container with `--radius-panel` and a subtle top highlight |
| `.link-draw` | Text link whose underline draws in on hover |
| `.skip-link` | Keyboard "skip to content" link |
| `.grain` | Fixed film-grain overlay (one per app) |

React building blocks in `src/components/`: `SiteHeader`, `SiteFooter`, `PageLayout` (+
`Breadcrumbs`) for every non-home page, `Logo`, `LanguageToggle`, `SectionLink`.

Icons: Phosphor, regular weight by default, `fill` only for brand marks (store logos).

Cursor: everything clickable (`a[href]`, enabled buttons, `[role=button]`, tabs, labels,
selects) shows the classic 1-bit pointing hand from `public/cursors/` (1x + 2x, hotspot at the
fingertip). The art lives in `tools/cursors/hand.py`; edit the grid there and re-run it rather
than touching the PNGs. Everything else keeps the system arrow.

## The Macintosh

- Each home section has a pose (`features/macintosh/poses.ts`): position, rotation, scale,
  blueprint amount, explode amount and opacity. Desktop and compact layouts have separate maps.
- Small screens: the hero reserves a `[data-mac-anchor]` box above the copy and the Mac fits
  inside it, so it never covers text. Past the hero it moves to the center at 28% opacity
  behind the content and stays still; sections animate over it.
- The screen types the active section name in 1-bit at 512×342, and the matching keys press
  on the keyboard. The mouse scrollbar on screen tracks page scroll.
- Blueprint mode (manifesto) recolors materials to `#0f1418` / accent blue and shows edges.

## Accessibility

- Focus: a 2px `--color-accent` ring on `:focus-visible`, globally. Don't override it per page.
- Hit areas of at least 44px for every control.
- Contrast: `fg-muted` on `bg` is above 4.5:1; don't put muted text on raised surfaces at
  small sizes.
- Respect `prefers-reduced-motion` and `prefers-reduced-transparency` (blurred panels fall
  back to solid `--color-surface`).
- Decorative 3D and canvases are `aria-hidden`; the section content never depends on them.
