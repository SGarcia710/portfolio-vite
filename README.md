# sebastian-garcia.dev

Personal portfolio of Sebastián García, Senior Mobile Engineer. A single-page home with a
scroll-driven 3D Macintosh 128K, a career timeline, a client work index, a lab of side
projects and a contact section, plus product pages for those side projects.

Dark only. English and Spanish.

## Stack

| Area | Choice |
| --- | --- |
| UI | React 18, TypeScript, Vite 6 |
| Styling | Tailwind CSS v4 (CSS-first, tokens in `src/styles/tokens.css`) |
| Motion | GSAP (ScrollTrigger, SplitText, DrawSVG), Lenis smooth scroll |
| 3D | three.js, React Three Fiber, drei |
| Routing / i18n | React Router 7, i18next |
| Icons | Phosphor |
| Hosting | Vercel (+ Vercel Analytics) |

## Getting started

Requires Node 24 (`.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/
npm run typecheck
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: hero, manifesto, experience, work, lab, contact |
| `/projects` | Side projects index |
| `/projects/ktcodex` | KTCodex product page |
| `/projects/ktcodex/privacy` | KTCodex privacy policy (linked from the stores) |
| `*` | 404 (`noindex`) |

Every route except home is lazy-loaded. Vercel rewrites unknown paths to `index.html`
(`vercel.json`), which also sets immutable caching for hashed assets and fonts.

## Project structure

```
src/
  app/            App shell: routes, preloader, header/footer, smooth scroll
  components/     Shared UI: header, footer, page layout, logo, language toggle, hand cursor
  content/        Typed data: site info, home sections, experience, projects, side projects
  features/
    home/         Home sections (hero, manifesto, experience timeline, work index, lab, contact)
    macintosh/    The 3D scene: model, CRT shader, screen renderer, poses, blueprint mode
    preloader/    SVG + GSAP boot loader
    ktcodex/      KTCodex page pieces (3D phone, scroll story, store links)
    side-projects/
  i18n/           i18next setup + locales/{en,es}/<namespace>.json
  lib/            Boot tasks, GSAP registration, Lenis, section tracker, media queries, meta tags
  pages/          Route components
  styles/         tokens.css (theme), base.css (utilities + components), ktcodex.css
public/
  models/         macintosh-128k.glb (optimized, meshopt)
  fonts/          Self-hosted Geist, Geist Mono, Geist Pixel (variable woff2)
  brand/          Logo, OG image, app icons
  cursors/        Pointing-hand cursor (generated, 1x + 2x)
tools/macintosh/  Blender script that builds the GLB from the Sketchfab source
tools/cursors/    Pixel grid for the pointing-hand cursor (python3 tools/cursors/hand.py)
assets/           Social teaser videos (not part of the site build)
```

## How it works

**Boot.** `lib/boot.ts` keeps a list of boot tasks (fonts, the WebGL scene) with their
progress. The preloader draws the SG logo with DrawSVG, shows the real aggregated progress,
then calls `startIntro()`. Components that animate on entry wait for `useIntroStarted()`.

**Scroll.** `lib/smooth-scroll.tsx` runs Lenis on the GSAP ticker so ScrollTrigger and smooth
scroll share one clock. `lib/section-tracker.ts` measures the home sections and exposes the
active section and a continuous scroll position without React re-renders; React only
re-renders when the active section changes (`useSyncExternalStore`).

**Home sections** are declared once in `content/site.ts` (`homeSections`). The header and
footer nav read that list, and each section registers itself with the tracker
(`useTrackedSection(id)`), which is what the Macintosh follows. Adding a section is one entry,
its component and, if the Mac should move, a pose in `poses.ts`.

**The Macintosh.** `features/macintosh/`:

- `macintosh-model.tsx` loads the GLB, swaps the screen material for the CRT shader, maps the
  58 named keycaps, and animates the mouse and its cable.
- `poses.ts` defines a pose per section (`desktopPoses`, `compactPoses`). On small screens the
  Mac fits inside the hero's `[data-mac-anchor]` box, then settles as a dimmed, still backdrop
  for every other section. `poseAt()` interpolates between poses from the scroll position.
- `screen-renderer.ts` draws a 512×342 1-bit canvas (the real 128K resolution): the section
  name is typed on screen while the matching keys press on the 3D keyboard.
- `crt-material.ts` is the screen shader: power-on, scanlines, vignette, raster border.
- `blueprint.ts` is the x-ray mode used by the manifesto (edges + exploded keys).

The scene is skipped when WebGL is unavailable, and motion is reduced under
`prefers-reduced-motion`.

## Editing content

All copy lives in `src/i18n/locales/{en,es}/`. Structured data lives in `src/content/` and
references copy by id.

- **New role:** add an entry to `content/experience.ts` (`start`/`end` as `YYYY-MM`,
  `end: null` while ongoing) and its text under `timeline.json → experiences.<id>` in both
  languages.
- **New client project:** add it to `content/projects.ts` and its text under
  `projects.json → items.<id>`.
- **New side project:** add it to `content/side-projects.ts` (with its own `tint`) and its
  text under `lab.json → items.<id>`. Product pages go in `src/pages/` and get a route in
  `src/app/App.tsx`.

## 3D model pipeline

The model is "Macintosh 128K" by [kreems](https://sketchfab.com/kreems) (CC BY 4.0, see
`ATTRIBUTIONS.md`). To rebuild `public/models/macintosh-128k.glb` from the Sketchfab
"GLB, 2k textures" download:

```bash
blender -b -P tools/macintosh/build.py -- <source.glb> /tmp/mac-raw.glb
npx @gltf-transform/cli optimize /tmp/mac-raw.glb public/models/macintosh-128k.glb \
  --compress meshopt --texture-compress webp --texture-size 1024 --simplify false \
  --join false --flatten false --instance false --palette false --prune-attributes false
```

The script keeps only the computer, keyboard and mouse, regroups the keycap fragments into
one object per key, gives the CRT a clean UV, re-orients the scene and rests the mouse cable on
the desk. The flags keep those named objects and the screen UVs intact; don't drop them.

## SEO and accessibility

- Per-route title, description, canonical, Open Graph and Twitter tags via
  `lib/use-document-meta.ts`; JSON-LD `Person` schema in `index.html`; `robots.txt`,
  `sitemap.xml` and `site.webmanifest` in `public/`.
- Skip link, landmark roles, visible focus ring, 44px minimum hit areas, reduced motion and
  reduced transparency respected.

## Docs

- `DESIGN_SYSTEM.md`: tokens, type, shape, motion and component rules.
- `ATTRIBUTIONS.md`: third-party assets and licenses.
