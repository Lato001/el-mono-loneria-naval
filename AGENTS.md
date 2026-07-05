# AGENTS.md — loneria-web

## Commands
- `pnpm dev` — dev server
- `pnpm build` — `tsc -b && vite build` (typecheck first, then bundle)
- `pnpm lint` — `eslint .`
- `pnpm preview` — preview production build
- No test framework is configured.

## Stack
- React 19, TypeScript ~6.0, Vite 8, react-router-dom 7, Tailwind CSS v4
- React Compiler enabled (`@rolldown/plugin-babel` + `reactCompilerPreset`)
- Package manager: **pnpm** (lockfile: `pnpm-lock.yaml`)

## Project structure
```
src/
├── components/
│   ├── layout/        # Header, Navbar, Hero, Reviews, Footer
│   ├── ui/            # Button, Card, Carousel
│   └── index.ts       # barrel
├── pages/
│   ├── Home/          # Home.tsx
│   ├── Services/      # Services.tsx
│   ├── AboutUs/
│   ├── Faq/
│   ├── Contact/
│   └── index.ts       # barrel
├── routes/routes.ts   # PATHS constant
├── App.tsx            # assembles layout + routes
├── main.tsx           # entry point (BrowserRouter wrapper)
├── index.css          # Tailwind v4 @import + @theme (colors, fonts)
└── fonts.css          # @font-face (Brown Beige, Nord, Poppins)
```

## TypeScript quirks
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `noUnusedLocals` and `noUnusedParameters` are both `true`
- Target `es2023`, JSX `react-jsx`, noEmit (bundled by Vite)

## Tailwind v4
- No config file — `@theme` block in `src/index.css` defines custom values
- Custom colors: `bg-sc-ocean-blue`, `text-pr-hero-blue`, `bg-sc-chalk`, `bg-sc-sand`, etc.
- Custom fonts: `font-brown`, `font-poppins`, `font-nord`

## Routing (Spanish slugs)
| Path          | Page     |
|---------------|----------|
| `/`           | Home     |
| `/servicios`  | Services |
| `/nosotros`   | AboutUs  |
| `/faq`        | Faq      |
| `/contacto`   | Contact  |
| `*`           | 404      |

## Data & env
- `src/data/*` is gitignored — local data stays off-disk
- `.env` and `.env.dev` are gitignored

## Quirks
- Barrel files (`components/index.ts`, `pages/index.ts`) have duplicated `export * from './layout'` (4x each). Avoid adding more.
- `src/hooks/` and `src/data/` directories exist but are empty
