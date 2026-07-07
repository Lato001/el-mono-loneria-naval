# AGENTS.md — loneria-web

Landing page for "El Mono" lonería naval (marine canvas workshop).

## Commands
- `pnpm dev` — dev server
- `pnpm build` — `tsc -b && vite build` (typecheck first, then bundle)
- `pnpm lint` — `eslint .`
- `pnpm preview` — preview production build
- No test framework is configured.

## Stack
- React 19, TypeScript ~6.0, Vite 8, react-router-dom 7, Tailwind CSS v4
- React Compiler enabled (`@rolldown/plugin-babel` + `reactCompilerPreset`)
- @tabler/icons-react ^3.44.0
- Package manager: **pnpm** (lockfile: `pnpm-lock.yaml`)

## Project Structure (exact)
```
src/
├── assets/
│   ├── backgrounds/   # formas-canales.svg, formas-lineas-onduladas.svg, formas-olas*.svg (5 SVGs)
│   ├── fonts/         # brown-beige/ (1), nord/ (14), poppins/ (18) = 33 TTF files total
│   ├── img/           # (empty)
│   └── logos/
│       ├── brands/    # sauleda-logo.svg, sunbrella-logo.svg
│       └── elmono/    # isotipo-elmono-01.png (Header), isotype-mono-color.svg (HomeSection icon), logo-elmono-horizontal.png
├── components/
│   ├── layout/
│   │   ├── index.ts   # barrel: Footer, Header, Hero, Reviews
│   │   ├── Footer.tsx            # Stub
│   │   ├── Header.tsx            # Unified nav + CTA + mobile sidebar
│   │   ├── Hero.tsx              # Gradient hero with props for extractable copy
│   │   └── Reviews.tsx           # Stub
│   ├── ui/
│   │   ├── index.ts   # barrel: Button, Card, Carousel, Marquee, HomeSection, ServiceGrid
│   │   ├── Button/
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx        # Stub
│   │   │   └── ScrollToTop.tsx   # Floating "Volver al inicio" button
│   │   ├── Card/
│   │   │   ├── index.ts
│   │   │   └── Card.tsx          # Stub
│   │   ├── Carousel/
│   │   │   ├── index.ts          # exports StackedCarousel + types
│   │   │   ├── Carousel.tsx      # StackedCarousel component
│   │   │   ├── useCarousel.ts    # Custom hook
│   │   │   └── Carousel.types.ts # StackedCard, StackedCarouselProps
│   │   ├── HomeSection/
│   │   │   ├── index.ts
│   │   │   ├── HomeSection.tsx   # Section wrapper
│   │   │   └── HomeSection.types.ts
│   │   ├── Marquee/
│   │   │   ├── index.ts          # re-exports Marquee + BrandMarquee
│   │   │   ├── Marquee.tsx       # Pure CSS marquee component
│   │   │   ├── Marquee.css       # @keyframes marquee-scroll
│   │   │   ├── Marquee.types.ts
│   │   │   └── BrandMarquee.tsx  # Brand logos marquee
│   │   └── ServiceGrid/
│   │       ├── index.ts
│   │       ├── ServiceGrid.tsx   # Responsive grid of ServiceCard
│   │       └── ServiceGrid.types.ts
│   └── index.ts       # barrel (duplicated exports)
├── hooks/              # (empty)
├── mocks/
│   └── data.ts         # data.Home.Sections[] + data.Home.Services[]
├── pages/
│   ├── index.ts        # barrel (HAS DUPLICATED exports, 4x '../components/layout')
│   ├── Home/
│   │   ├── index.ts
│   │   └── Home.tsx    # Composes Hero + BrandMarquee + iterates sections
│   ├── Services/
│   │   ├── index.ts
│   │   └── Services.tsx  # Stub
│   ├── AboutUs/
│   │   ├── index.ts
│   │   └── AboutUs.tsx   # Stub
│   ├── Faq/
│   │   ├── index.ts
│   │   └── Faq.tsx       # Stub
│   └── Contact/
│       ├── index.ts
│       └── Contact.tsx   # Stub
├── routes/
│   └── routes.ts       # PATHS constant (HOME, SERVICES, ABOUT_US, FAQ, CONTACT, NOT_FOUND)
├── App.tsx             # Header (sticky) + ScrollToTop + Routes
├── main.tsx            # createRoot + BrowserRouter + StrictMode
├── index.css           # @import "tailwindcss" + @theme (colors + fonts)
└── fonts.css           # @font-face for all 3 font families
```

## Design System

### Colors (from `@theme` in `src/index.css`)
| Class prefix | Hex | Usage |
|---|---|---|
| `pr-hero-blue` | `#344784` | Hero gradient end, eyebrow text |
| `pr-aquamarine` | `#40F1E7` | Accent, link active, carousel dots |
| `sc-ocean-blue` | `#001051` | Header bg, text, hero gradient start |
| `sc-sky-blue` | `#42B2EB` | Unused |
| `sc-chalk` | `#F4F4F4` | Section backgrounds |
| `sc-sand` | `#EAD9C1` | Unused |

### Fonts
- `font-brown` → "Brown Beige" (1 weight)
- `font-nord` → "Nord" (14 variants)
- `font-poppins` → "Poppins" (18 variants)
- All self-hosted TTF in `src/assets/fonts/`

### Responsive strategy
- Fluid `clamp()` sizing over breakpoint jumps
- One explicit breakpoint: 800px (mobile sidebar)
- Grid breakpoints: `md:grid-cols-2`, `lg:grid-cols-3`

## Routing (Spanish slugs)
| Path | Component | Status |
|---|---|---|
| `/` | Home | Implemented |
| `/servicios` | Services | Stub |
| `/nosotros` | AboutUs | Stub |
| `/faq` | Faq | Stub |
| `/contacto` | Contact | Stub |
| `*` | 404 h1 | Basic |

## Component Details

### Header (`src/components/layout/Header.tsx`)
- Desktop: logo (left) + 4 nav links with bubble gradient + aquamarine stitch indicator + "Cotizar" CTA (right)
- Mobile: hamburger menu → sidebar with same links stacked + CTA at bottom
- Bubble effect: `::before` pseudo with `radial-gradient(ellipse_at_30%_25%, rgba(255,255,255,0.35), rgba(64,241,231,0.2), rgba(64,241,231,0.06))`
- Stitch indicator: 3 dashed aquamarine lines via `<span>` elements
- Active link: `useLocation()` pathname match
- `min-h-14` prevents height jump on resize

### Hero (`src/components/layout/Hero.tsx`)
- Props (all optional, Spanish defaults): `eyebrow`, `titlePrefix`, `titleHighlight`, `description`, `primaryCta`, `secondaryCta`
- Gradient: `from-sc-ocean-blue to-pr-hero-blue`
- Decorative: aquamarine circle (`rounded-full bg-pr-aquamarine/20`), olas SVG overlay at 40% opacity
- 2 CTAs: primary → `/contacto` (white bg), secondary → `/servicios` (outlined)

### StackedCarousel (`src/components/ui/Carousel/`)
- **useCarousel.ts**: `activeIndex` state (unbounded), `next()`/`prev()` increment/decrement, `getCardClasses(index, total)` returns Tailwind classes based on offset from active
  - offset 0: `translate-x-0 scale-100 z-30 opacity-100`
  - offset 1: `translate-x-[75%] scale-[0.95] z-20 opacity-100`
  - offset 2: `translate-x-[100%] scale-[0.9] z-10 opacity-100`
  - else: `translate-x-[150%] ... opacity-0 pointer-events-none`
- **Carousel.tsx**: 580px tall, `overflow-x-clip` (shadows not clipped), cards `absolute inset-y-0 left-0 w-[80%]`, nav buttons `z-40`, dot indicators below
- **Props**: `items: StackedCard[]` where `StackedCard = { id, title, description, color? }`

### HomeSection (`src/components/ui/HomeSection/`)
- Chalk background, `py-20`, `max-w-295` centered
- Optional `icon` (SVG path) → `<img>` with `rounded-full h-16 w-16 shrink-0`
- `eyebrow` → `font-poppins text-xs uppercase tracking-[0.2em] text-pr-hero-blue`
- `title` → `font-poppins font-bold uppercase text-[clamp(1.8rem,3.5vw,2.8rem)] text-sc-ocean-blue`
- `children` rendered below title

### Marquee / BrandMarquee (`src/components/ui/Marquee/`)
- Pure CSS animation: `@keyframes marquee-scroll` animates `translateX(0)` to `translateX(var(--marquee-scroll-dist))`
- `ResizeObserver` measures content vs container → calculates `multiplier` (duplicate count) for seamless loop
- `speed` (seconds), `direction` (left/right), `pauseOnHover` (sets `animationPlayState`)
- `BrandMarquee` uses grayscale + low opacity, full color on group hover

### ServiceGrid (`src/components/ui/ServiceGrid/`)
- Responsive: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
- `ServiceCard` internal component: white bg, `rounded-lg`, `shadow-lg`, `p-6`

### ScrollToTop (`src/components/ui/Button/ScrollToTop.tsx`)
- Fixed bottom-right, visible when `scrollY > 200`
- Rounded-full with backdrop blur and shadow

## TypeScript quirks
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `noUnusedLocals` and `noUnusedParameters` are both `true`
- `erasableSyntaxOnly: true` — no enums, no namespaces, no constructor parameter properties
- Target `es2023`, JSX `react-jsx`, noEmit (bundled by Vite)
- Module resolution: `bundler`

## Data & env
- `src/mocks/data.ts` — mock data for Home sections and services
- `src/data/*` is gitignored — local data stays off-disk
- `.env` and `.env.dev` are gitignored
- `.env` contains `VITE_WHATSAPP_URL` (WhatsApp deep link with preset message)

## Build status
- `pnpm build`: 0 TypeScript errors, 6216 Vite modules
- Output: ~258 KB JS + ~33 KB CSS (gzipped)
- React Compiler active in production

## Quirks & gotchas
- `pages/index.ts` has 4x `export * from '../components/layout'` — avoid adding more
- `components/index.ts` has 2x `export * from './layout'` — same issue
- `sass` 1.101.0 + `patches/react-fast-marquee@1.6.5.patch` present but **unused** (custom Marquee replaces fast-marquee)
- `src/hooks/` and `src/data/` directories exist but are empty
- No `.vscode/extensions.json` or useful `.vscode/settings.json`
- Avoid adding `style` inline props unless unavoidable
- Fluid/clamp sizing over breakpoint jumps
- Component props and identifiers in English, content in Spanish
- No external UI dependencies — all components custom
