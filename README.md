# El Mono — Loneria Naval

Landing page for a marine canvas and awning workshop ("lonería naval"). Built with React 19, TypeScript 6, Vite 8, and Tailwind CSS v4.

## Tech Stack

| Tool | Version |
|---|---|
| React | ^19.2.6 |
| TypeScript | ~6.0.2 |
| Vite | ^8.0.16 |
| Tailwind CSS | ^4.3.0 |
| react-router-dom | ^7.18.1 |
| @tabler/icons-react | ^3.44.0 |
| React Compiler | via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` |
| Package Manager | pnpm |

## Quick Start

```bash
pnpm dev       # Start dev server
pnpm build     # Type-check (tsc -b) + production build
pnpm lint      # ESLint on all .ts/.tsx files
pnpm preview   # Preview production build locally
```

## Project Structure

```
src/
├── assets/
│   ├── backgrounds/       # SVG wave/line patterns
│   ├── fonts/             # brown-beige/, nord/, poppins/ (33 TTF files)
│   ├── img/               # (empty)
│   └── logos/
│       ├── brands/        # sauleda-logo.svg, sunbrella-logo.svg
│       └── elmono/        # isotipo-elmono-01.png, isotype-mono-color.svg, logo-elmono-horizontal.png
├── components/
│   ├── layout/
│   │   ├── Footer.tsx     # Stub
│   │   ├── Header.tsx     # Responsive nav with bubble effect, stitch indicator, mobile sidebar
│   │   ├── Hero.tsx       # Gradient hero with decorative circle, wave overlay, CTAs
│   │   └── Reviews.tsx    # Stub
│   ├── ui/
│   │   ├── Button/
│   │   │   ├── Button.tsx         # Stub
│   │   │   └── ScrollToTop.tsx    # Floating scroll-to-top button
│   │   ├── Card/
│   │   │   └── Card.tsx           # Stub
│   │   ├── Carousel/
│   │   │   ├── Carousel.tsx       # Stacked cards carousel (StackedCarousel)
│   │   │   ├── useCarousel.ts     # Carousel state hook (activeIndex, next, prev, getCardClasses)
│   │   │   └── Carousel.types.ts  # StackedCard, StackedCarouselProps
│   │   ├── HomeSection/
│   │   │   ├── HomeSection.tsx    # Reusable section wrapper (eyebrow + title + icon + children)
│   │   │   └── HomeSection.types.ts
│   │   ├── Marquee/
│   │   │   ├── Marquee.tsx        # Pure CSS marquee with ResizeObserver auto-fill
│   │   │   ├── Marquee.css        # @keyframes marquee-scroll
│   │   │   ├── Marquee.types.ts
│   │   │   └── BrandMarquee.tsx   # Brand logos (Sauleda, Sunbrella) grayscale to color on hover
│   │   ├── ServiceGrid/
│   │   │   ├── ServiceGrid.tsx    # Responsive grid of ServiceCard
│   │   │   └── ServiceGrid.types.ts
│   │   └── index.ts               # Barrel
│   └── index.ts                   # Barrel
├── hooks/                  # (empty)
├── mocks/
│   └── data.ts             # Mock sections and services
├── pages/
│   ├── Home/
│   │   └── Home.tsx        # Composes Hero + BrandMarquee + mapped sections
│   ├── Services/
│   │   └── Services.tsx    # Stub
│   ├── AboutUs/
│   │   └── AboutUs.tsx     # Stub
│   ├── Faq/
│   │   └── Faq.tsx         # Stub
│   ├── Contact/
│   │   └── Contact.tsx     # Stub
│   └── index.ts            # Barrel (has duplicated exports)
├── routes/
│   └── routes.ts           # PATHS constant
├── App.tsx                 # Layout + Routes assembly
├── main.tsx                # Entry point (BrowserRouter wrapper)
├── index.css               # Tailwind v4 @import + @theme (colors, fonts)
└── fonts.css               # @font-face declarations (Brown Beige, Nord, Poppins)
```

## Design System

### Colors

Defined in `@theme` block in `src/index.css`:

| Token | Value | Usage |
|---|---|---|
| `pr-hero-blue` | `#344784` | Hero background end, section eyebrow text |
| `pr-aquamarine` | `#40F1E7` | Accent highlights, active link indicator, dots |
| `sc-ocean-blue` | `#001051` | Header background, text color, hero gradient start |
| `sc-sky-blue` | `#42B2EB` | — |
| `sc-chalk` | `#F4F4F4` | Section backgrounds |
| `sc-sand` | `#EAD9C1` | — |

### Fonts

| Family | CSS Token | Variants |
|---|---|---|
| Brown Beige | `font-brown` | normal (1) |
| Nord | `font-nord` | 14 variants (thin to black, all with italics) |
| Poppins | `font-poppins` | 18 variants (thin to black, all with italics) |

No external font CDN — all fonts are self-hosted TTF files in `src/assets/fonts/`.

### Responsive Approach

- Fluid sizing via `clamp()` instead of breakpoint jumps (e.g. `text-[clamp(1.8rem,3.5vw,2.8rem)]`)
- Minimal breakpoints: mobile sidebar at 800px, service grid at `md:grid-cols-2` / `lg:grid-cols-3`
- Logo fixed at `w-24` (no md breakpoint)

## Routing

| Path | Page Component | Status |
|---|---|---|
| `/` | Home | Implemented |
| `/servicios` | Services | Stub |
| `/nosotros` | AboutUs | Stub |
| `/faq` | Faq | Stub |
| `/contacto` | Contact | Stub |
| `*` | 404 (inline `h1`) | Basic |

Routes defined in `src/routes/routes.ts` via `PATHS` constant.

## Component Architecture

### Layout Components

| Component | File | Props | Description |
|---|---|---|---|
| `Header` | `components/layout/Header.tsx` | (none) | Unified header: logo + nav links (bubble gradient on hover/active) + aquamarine stitch indicator + "Cotizar" CTA + mobile sidebar |
| `Hero` | `components/layout/Hero.tsx` | `eyebrow?`, `titlePrefix?`, `titleHighlight?`, `description?`, `primaryCta?`, `secondaryCta?` | Gradient section with decorative circle, wave overlay, H1 (with highlight span), 2 CTAs |
| `Footer` | `components/layout/Footer.tsx` | (none) | Stub |
| `Reviews` | `components/layout/Reviews.tsx` | (none) | Stub |

### UI Components

| Component | File | Props | Description |
|---|---|---|---|
| `StackedCarousel` | `ui/Carousel/Carousel.tsx` | `items: StackedCard[]` | Stacked cards carousel, circular offset, inverted z-index, `overflow-x-clip`, nav buttons, dot indicators |
| `HomeSection` | `ui/HomeSection/HomeSection.tsx` | `eyebrow`, `title`, `icon?`, `children` | Section with chalk bg, optional icon, eyebrow + title heading |
| `ServiceGrid` | `ui/ServiceGrid/ServiceGrid.tsx` | `services: Service[]` | Responsive grid of ServiceCard (white card with shadow) |
| `Marquee` | `ui/Marquee/Marquee.tsx` | `items`, `renderItem?`, `speed?`, `pauseOnHover?`, `direction?`, `className?` | Pure CSS marquee with ResizeObserver auto-fill, no dependencies |
| `BrandMarquee` | `ui/Marquee/BrandMarquee.tsx` | (none) | Pre-configured Marquee with brand logos, grayscale to color on hover |
| `ScrollToTop` | `ui/Button/ScrollToTop.tsx` | (none) | Floating button, visible past 200px scroll, "Volver al inicio" |

## Data Flow

- Mock data in `src/mocks/data.ts` provides `data.Home.Sections` (3 sections) and `data.Home.Services` (3 services)
- `src/data/` directory is gitignored for future local data storage
- `.env` holds `VITE_WHATSAPP_URL` for the WhatsApp CTA link
- Hero component has default props ready for future copy extraction (i18n/editing)

## Code Conventions

- **TypeScript strict**: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`
- `import type` required for type-only imports (`verbatimModuleSyntax`)
- No `any` — strict interfaces for all props
- Component props and identifiers in English; content text in Spanish (matching brand language)
- No inline `style` props unless unavoidable (prefer Tailwind classes)
- No third-party animation libraries — all animations are pure CSS or hand-rolled React hooks
- React Compiler enabled via `@rolldown/plugin-babel` — write idiomatic React, let the compiler optimize

## Known Issues

- `pages/index.ts` and `components/index.ts` contain duplicated `export *` lines — avoid adding more
- `src/hooks/` and `src/data/` directories exist but are empty
- `sass` and `patches/react-fast-marquee@1.6.5.patch` are present but unused (Marquee is custom)

## Build

```bash
pnpm build
# tsc -b (0 errors)
# vite build (6216 modules to ~258 KB JS + ~33 KB CSS gzipped)
```

Current status: **passing** — 0 TypeScript errors, clean production build.
