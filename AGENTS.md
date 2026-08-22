# AGENTS.md — el-mono-loneria-naval

Landing page for "El Mono" lonería naval (marine canvas workshop).

**Recent changes (preproduction refactor):** SEO meta tags (commit 5d7268b), lint fixes, types extracted into per-component `.types.ts` + barrels, 15 co-located tests added, product images compressed to 480px thumbs (9x smaller load), eyebrowDash prop removed from SectionWrapper, route-level lazy loading for Works/Products/Contact/Faq, coverage thresholds raised to 75/65/75/80, Cloudflare Pages deploy workflow (pnpm + Node 22). **353 tests passing, 0 TS errors, 0 lint warnings.**

## Commands
- `pnpm dev` — dev server
- `pnpm build` — `tsc -b && vite build` (typecheck first, then bundle)
- `pnpm lint` — `eslint .`
- `pnpm preview` — preview production build
- `pnpm test` — vitest watch mode (dev)
- `pnpm test:run` — vitest single run (CI)
- `pnpm test:coverage` — vitest run with v8 coverage report

## Testing
- Stack: Vitest 4 + @testing-library/react 16 + jsdom
- Test file convention: co-located `.test.tsx` next to the component file
- Setup file: `src/test/setup.ts` (jest-dom matchers, ResizeObserver/IntersectionObserver/matchMedia polyfills)
- Coverage: v8 provider, thresholds at 75% stmts / 65% branches / 75% functions / 80% lines (actual ~82.7/72.7/82.2/89.1)
- Excluded from coverage: barrel files (`index.ts`), stub pages, Carousel, ScrollToTop, Header, App.tsx
- Test wrapper: components using `<Link>` need `MemoryRouter` wrapper
- Globals: `describe`/`it`/`expect`/`vi` available without imports (via `vitest/globals` in tsconfig)
- TypeScript: test files follow same strict rules (`import type`, `noUnusedLocals`, `erasableSyntaxOnly`)

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
│   ├── img/           # services/ (8 webp), works/ (5 webp)
│   └── logos/
│       ├── brands/    # sauleda-logo.svg, sunbrella-logo.svg
│       ├── elmono/    # isotipo-elmono-01.png (Header), isotype-mono-color.svg (HomeSection icon), logo-elmono-horizontal.png
│       └── icons/     # faq category icons (insumos, servicios, tiempos, trabajos)
├── components/
│   ├── layout/
│   │   ├── index.ts   # barrel: Footer, Header, Hero
│   │   ├── Footer.tsx            # 3-column footer: brand + nav + contact
│   │   ├── Header.tsx            # Unified nav + CTA + mobile sidebar
│   │   └── Hero.tsx              # Gradient hero with props for extractable copy
│   ├── ui/
│   │   ├── index.ts   # barrel: Button, Card, Carousel, Marquee, HomeSection, WorksGrid, AboutSection
│   │   ├── AboutSection/
│   │   │   ├── index.ts
│   │   │   ├── AboutSection.tsx   # 2-col: image + content/highlights/CTA
│   │   │   └── AboutSection.types.ts
│   │   ├── Button/
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx         # Variants: primary/secondary/outline/ghost, sizes: sm/md/lg, Link-aware
│   │   │   ├── Button.types.ts
│   │   │   └── ScrollToTop.tsx    # Floating "Volver al inicio" button
│   │   ├── Card/
│   │   │   ├── index.ts
│   │   │   ├── Card.tsx           # Full card: image/color header, badge, title, description, CTA, dashed separator
│   │   │   ├── ReviewCard.tsx     # Review card: avatar/initial, stars, title, description
│   │   │   └── SplitCardsSection.tsx  # 2-col grid wrapper for Cards
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
│   │   ├── WorksGrid/
│   │   │   ├── index.ts
│   │   │   ├── WorksGrid.tsx   # Responsive grid of WorkCard
│   │   │   └── WorksGrid.types.ts
│   └── index.ts       # barrel: layout + ui
├── hooks/              # (empty)
├── mocks/
│   └── data.ts         # data.Home.Sections[] + Works[] + Reviews[] (typed)
├── pages/
│   ├── index.ts        # barrel: AboutUs, Contact, Faq, Home, Products, Works
│   ├── Home/
│   │   ├── index.ts
│   │   └── Home.tsx    # Composes Hero + BrandMarquee + SplitCards + WorksGrid + Reviews + AboutSection
│   ├── Products/
│   │   ├── index.ts
│   │   └── Products.tsx  # Stub
│   ├── Works/
│   │   ├── index.ts
│   │   ├── Works.tsx     # Masonry album of work photos
│   │   └── Works.test.tsx
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
│   └── routes.ts       # PATHS constant (HOME, PRODUCTS, WORKS, ABOUT_US, FAQ, CONTACT, NOT_FOUND)
├── types/
│   └── review.ts       # Review interface
├── App.tsx             # Header (sticky) + ScrollToTop + Routes + Footer (global)
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
| `/productos` | Products | Stub |
| `/trabajos` | Works | Implemented |
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

### Footer (`src/components/layout/Footer.tsx`)
- 3-column grid on `lg:grid-cols-3`, stacked on mobile
- Col 1: horizontal logo, tagline placeholder, social icons (Facebook, Instagram, WhatsApp)
- Col 2: navigation links (Servicios, Nosotros, Productos, FAQ, Contacto) with hover underline
- Col 3: contact info with icons (phone, email, address) — all placeholder text marked TODO
- Bottom row: copyright text with thin top border

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

### Button (`src/components/ui/Button/`)
- Variants: `primary` (white bg), `secondary` (aquamarine), `outline` (bordered white), `ghost` (text only)
- Sizes: `sm`, `md` (default), `lg`
- If `href` is provided, renders as `Link` from react-router-dom; otherwise renders `<button>`
- Props: `children`, `variant`, `size`, `href`, `onClick`, `className`, `type`, `disabled`, `ariaLabel`

### Card (`src/components/ui/Card/`)
- Full card component with image/color header, badge, title, description, CTA button
- Dashed separator between image and content sections
- Hover effect: `-translate-y-1.5` + `shadow-xl`
- Props: `title`, `description`, `badge`, `imageSrc`, `ctaLabel`, `onCtaClick`, `className`, `color`, `badgeClassName`

### ReviewCard (`src/components/ui/Card/ReviewCard.tsx`)
- Review card with avatar (image or initial), star rating, title, description
- Uses `Review` type from `src/types/review.ts`
- Hover effect: `-translate-y-1.5` + `shadow-xl`

### SplitCardsSection (`src/components/ui/Card/SplitCardsSection.tsx`)
- 2-column grid wrapper for Cards: `grid grid-cols-1 md:grid-cols-2`
- Props: `children`, `className`

### AboutSection (`src/components/ui/AboutSection/`)
- 2-column layout on `lg:grid-cols-2`, stacked on mobile
- Left: image with `rounded-2xl overflow-hidden shadow-xl aspect-[4/3]`, fallback background on error
- Right: eyebrow, title, content paragraphs, highlights grid (3 cols), CTA button
- Props: `image`, `imageAlt`, `content`, `highlights`, `cta`, `eyebrow`, `title`

### Marquee / BrandMarquee (`src/components/ui/Marquee/`)
- Pure CSS animation: `@keyframes marquee-scroll` animates `translateX(0)` to `translateX(var(--marquee-scroll-dist))`
- `ResizeObserver` measures content vs container → calculates `multiplier` (duplicate count) for seamless loop
- `speed` (seconds), `direction` (left/right), `pauseOnHover` (sets `animationPlayState`)
- `BrandMarquee` uses grayscale + low opacity, full color on group hover

### WorksGrid (`src/components/ui/WorksGrid/`)
- Responsive: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
- `WorkCard` internal component: white bg, `rounded-lg`, `shadow-lg`, `p-6`
- Props: `works: Work[]` where `Work = { id, title, description }`

### Masonry (`src/components/ui/Masonry/`)
- Used by Works page to display a photo album
- GSAP-powered animation with configurable `ease`, `duration`, `stagger`, `animateFrom`
- `scaleOnHover` + `hoverScale` + `colorShiftOnHover` options

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
- `src/mocks/data.ts` — mock data for Home sections and works
- `data.Home.Sections[]` — typed as `Section` with optional `content`, `image`, `imageAlt`, `highlights`, `cta` fields (aboutus section uses all of them)
- `data.Home.Works[]` — typed as `Work[]` (3 works)
- `data.Home.Reviews[]` — typed as `Review[]` (5 reviews, imported from `src/types/review.ts`)
- `src/data/*` is gitignored — local data stays off-disk
- `.env` and `.env.dev` are gitignored
- `.env` contains `VITE_WHATSAPP_URL` (WhatsApp deep link with preset message)

## Build status
- `pnpm build`: 0 TypeScript errors, 7576 Vite modules
- Output: ~191 KB JS entry + ~23 KB CSS (gzipped) — heavy libs (maplibre-gl, dashjs/hls, GSAP) split into lazy route chunks
- React Compiler active in production

## Quirks & gotchas
- Thumbnails (480px, q70) de las imágenes del álbum, generados manualmente con ffmpeg y commiteados; el carousel y la galería los usan, el ImgCard usa la full-res: `ffmpeg -i <full.webp> -vf "scale=480:-1" -q:v 70 src/assets/img/works/<categoria>/thumbs/<nombre>.webp`
- `sass` and `react-fast-marquee` are **not** in package.json anymore (custom Marquee replaced fast-marquee; the old note about them being unused was stale)
- `src/hooks/` has `useFadeInOnView.ts` and `useSessionSelection.ts` (each with co-located tests); `src/data/` is empty and gitignored — local data stays off-disk
- No `.vscode/extensions.json` or useful `.vscode/settings.json`
- Avoid adding `style` inline props unless unavoidable
- Fluid/clamp sizing over breakpoint jumps
- Component props and identifiers in English, content in Spanish
- No external UI dependencies — all components custom
