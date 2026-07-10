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
| Vitest | ^4.1.10 |
| @testing-library/react | ^16 |
| jsdom | latest |
| Package Manager | pnpm |

## Quick Start

```bash
pnpm dev              # Start dev server
pnpm build            # Type-check (tsc -b) + production build
pnpm lint             # ESLint on all .ts/.tsx files
pnpm preview          # Preview production build locally
pnpm test             # Vitest watch mode (dev)
pnpm test:run         # Vitest single run (CI)
pnpm test:coverage    # Vitest run with v8 coverage report
```

## Project Structure

```
src/
├── assets/
│   ├── backgrounds/       # SVG wave/line patterns
│   ├── fonts/             # brown-beige/, nord/, poppins/ (33 TTF files)
│   └── logos/
│       ├── brands/        # 5 brand SVGs: achilles, coats, sauleda, sunbrella, ykk
│       ├── elmono/        # isotipo-elmono.png (the new logo)
│       └── icons/         # insumos, servicios, tiempos, trabajos logos
├── components/
│   ├── layout/
│   │   ├── Header.tsx     # Responsive nav with bubble effect, stitch indicator, mobile sidebar
│   │   ├── Hero.tsx       # Gradient hero with decorative circle, wave overlay, CTAs
│   │   └── Footer.tsx     # 12-col grid: brand(2) + 4 nav groups(8) + contact(2)
│   ├── ui/
│   │   ├── AboutSection/  # 2-col layout with image fallback, content, highlights, CTA
│   │   ├── Button/        # 4 variants, 3 sizes, Link-aware + ScrollToTop + tests
│   │   ├── Card/          # Full card (image/color header, badge, CTA) + ReviewCard + tests
│   │   ├── Carousel/      # Stacked cards carousel (not used in Home; available for future)
│   │   ├── HomeSection/   # Reusable section: eyebrow + title + icon + children + centerTitleOnMobile prop
│   │   ├── Marquee/       # Pure CSS marquee + BrandMarquee (5 brands)
│   │   ├── ServiceGrid/   # Responsive grid of service cards (not used in Home; available for future)
│   │   └── ServicesSection/  # Dark-blue section: eyebrow + title + icon + children
│   └── index.ts           # Barrel
├── hooks/                  # (empty)
├── mocks/
│   └── data.ts             # Mock sections (discriminated union) and services
├── pages/
│   ├── Home/              # Composes Hero + BrandMarquee + ServicesSection + Reviews + AboutSection
│   ├── Products/          # Stub
│   ├── Services/          # Stub
│   ├── AboutUs/           # Stub
│   ├── Faq/               # Stub
│   ├── Contact/           # Stub
│   └── index.ts            # Barrel
├── routes/
│   └── routes.ts           # PATHS constant
├── test/                   # Vitest setup (jest-dom matchers + polyfills)
├── App.tsx                 # Layout (Header, ScrollToTop, Routes, Footer) assembly
├── main.tsx                # Entry point (BrowserRouter wrapper)
├── index.css               # Tailwind v4 @import + @theme (colors, fonts)
└── fonts.css               # @font-face declarations (Brown Beige, Nord, Poppins)
```

## Design System

### Colors

Defined in `@theme` block in `src/index.css`:

| Token | Value | Usage |
|---|---|---|
| `pr-hero-blue` | `#344784` | Hero background end, section eyebrow text (on chalk) |
| `pr-aquamarine` | `#40F1E7` | Accent highlights, active link indicator, dots, ServicesSection eyebrow (on dark blue) |
| `sc-ocean-blue` | `#001051` | Header/Footer/ServicesSection background, text color, hero gradient start |
| `sc-sky-blue` | `#42B2EB` | — |
| `sc-chalk` | `#F4F4F4` | Section backgrounds (HomeSection, AboutSection) |
| `sc-sand` | `#EAD9C1` | Image fallback backgrounds |

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
- Custom max-width: `max-w-295` (295 * 0.25rem = ~1180px) for the centered content container
- Logo in Footer/Header: `h-12 w-12` (48px square isotipo)
- Logo in BrandMarquee: container `h-24` (96px), grayscale 50% → full color on hover

## Routing

| Path | Page Component | Status |
|---|---|---|
| `/` | Home | Implemented |
| `/productos` | Products | Stub |
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
| `Footer` | `components/layout/Footer.tsx` | (none) | 12-col grid: brand(2) + 4 grouped nav sections(8) + contact(2). Dark blue background, white text, 4 nav columns (Servicios, Productos, Nosotros, Ayuda), 3 contact items (phone, email, address) with `@tabler/icons-react` icons. |

### UI Components

| Component | File | Props | Description |
|---|---|---|---|
| `Button` | `ui/Button/Button.tsx` | `children`, `variant?`, `size?`, `href?`, `onClick?`, `className?` | 4 variants (primary/secondary/outline/ghost), 3 sizes, Link-aware, full keyboard focus styles |
| `ScrollToTop` | `ui/Button/ScrollToTop.tsx` | (none) | Floating button, visible past 200px scroll, "Volver al inicio" |
| `Card` | `ui/Card/Card.tsx` | `title`, `description`, `badge?`, `imageSrc?`, `ctaLabel?`, `onCtaClick?`, `className?`, `color?`, `badgeClassName?` | Full card with image/color header, badge, title, description, CTA button, dashed separator |
| `ReviewCard` | `ui/Card/ReviewCard.tsx` | `id`, `avatar?`, `title`, `author`, `stars`, `description` | Review card with avatar/initial, star rating, title, description. Mobile: `max-w-md mx-auto md:max-w-none md:mx-0` |
| `HomeSection` | `ui/HomeSection/HomeSection.tsx` | `eyebrow?`, `title`, `icon?`, `children`, `centerTitleOnMobile?` | Reusable section with chalk bg. When `centerTitleOnMobile=true`, icon centers above title on mobile (matches ServicesSection pattern) |
| `ServicesSection` | `ui/ServicesSection/ServicesSection.tsx` | `children`, `className?`, `icon?`, `eyebrow?`, `title` | Dark-blue section: eyebrow (`text-pr-aquamarine`) + title (`text-white`) + optional icon + children. Mirrors HomeSection pattern but with dark-bg color contract |
| `Marquee` | `ui/Marquee/Marquee.tsx` | `items`, `renderItem?`, `speed?`, `pauseOnHover?`, `direction?`, `className?` | Pure CSS marquee with ResizeObserver auto-fill, no dependencies |
| `BrandMarquee` | `ui/Marquee/BrandMarquee.tsx` | (none) | Pre-configured Marquee with 5 brand logos (Sauleda, Sunbrella, Achilles, Coats, YKK), grayscale to color on hover |
| `StackedCarousel` | `ui/Carousel/Carousel.tsx` | `items: StackedCard[]` | Stacked cards carousel (not used in Home; available for future) |
| `ServiceGrid` | `ui/ServiceGrid/ServiceGrid.tsx` | `services: Service[]` | Responsive grid of service cards (not used in Home; available for `/servicios` page) |

## Home Page Composition

The Home page (`src/pages/Home/Home.tsx`) composes these sections in order:

1. **Hero** — gradient hero with CTAs
2. **BrandMarquee** — 5 brand logos in grayscale → color
3. **ServicesSection** — dark-blue section with "¿Qué ofrecemos?" eyebrow + "Nuestros Servicios" title + isotipo icon + 2 category cards (Productos, Servicios) in a responsive grid
4. **Reviews** — `HomeSection` with `centerTitleOnMobile`, renders 3 of 5 review cards in a responsive grid (stacked on mobile, 3 columns on desktop)
5. **AboutSection** — data-driven from `data.Home.Sections` discriminated union (`kind: "aboutus"`)

The Footer is mounted globally in `App.tsx` (appears on every page).

## Data Flow

- Mock data in `src/mocks/data.ts` provides:
  - `data.Home.Sections[]` — discriminated union (`kind: "reviews" | "aboutus"`)
  - `data.Home.Services[]` — 3 services (Lonas, Capotas, Cubreautos)
  - `data.Home.Reviews[]` — 5 reviews
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
- Co-located tests: `.test.tsx` next to each component
- All test files use `@testing-library/react` with jsdom environment
- `vitest/globals` enabled (no need to import `describe`/`it`/`expect`)

## Testing

- **Stack**: Vitest 4 + @testing-library/react 16 + jsdom
- **48 tests passing** across 6 test files (Button, AboutSection, Footer, Home, ServicesSection, HomeSection)
- **Coverage** (v8 provider): ~76% statements, ~53% branches, ~84% functions, ~98% lines
- **Thresholds** (v1): 40% stmts / 35% branches / 35% functions / 40% lines
- **Excluded from coverage**: barrel files (`index.ts`), stub pages, Carousel, ScrollToTop, Header, App.tsx
- **Test wrapper**: components using `<Link>` need `MemoryRouter` wrapper
- **Globals**: `describe`/`it`/`expect`/`vi` available without imports (via `vitest/globals` in tsconfig)
- **Polyfills** in `src/test/setup.ts`: `ResizeObserver`, `IntersectionObserver`, `matchMedia`

## Build

```bash
pnpm build
# tsc -b (0 errors)
# vite build (~6226 modules to ~282 KB JS + ~39 KB CSS gzipped)
```

Current status: **passing** — 0 TypeScript errors, clean production build.

## Known Issues / TODO

- 4 stub pages (`/productos`, `/servicios`, `/nosotros`, `/faq`, `/contacto`) — to be implemented with real content
- Placeholder content in services section, reviews, about us, footer contact (all marked with `// TODO` in code)
- App.tsx has no smoke test (the "componente implementado pero no montado" bug pattern could recur)
- Coverage thresholds are v1 — should be raised as more components get tested
- No CI workflow (GitHub Actions) configured yet
- No PR template in `.github/PULL_REQUEST_TEMPLATE.md`
- Branch protection not configured on `dev` or `main`
