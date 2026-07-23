# Project Organization Rules

These rules apply to all work on the Mock & Roll website. Enforce them automatically whenever files are created, moved, or added.

## Directory Structure

```
app/                    Next.js App Router — all application code lives here
  components/           Shared components used across multiple pages
    ui/                 Primitive UI components (Button, FadeIn, etc.)
  [page]/               Page-specific directories (/about, /mocktails, /packages)
    components/         Components used only by that page
    page.tsx            Page entry point
  layout.tsx            Root layout
  globals.css           Global styles and Tailwind theme
  not-found.tsx         404 page

public/                 Static assets served directly by Next.js
  fonts/                Font files loaded via next/font/local
  images/               All photography used by the site
    events/             Event-specific photography
  logo.svg              Primary logo
  og-image.png          Open Graph social sharing image
  sitemap.xml           
  robots.txt            
  favicon.ico           
  apple-touch-icon.png  

_design/                Design reference assets — NOT served by the app
  Fonts/                Original font source files
  MRDesktop.png         Desktop design mockup
  MRMobile.png          Mobile design mockup
  Mock & Roll Site Pictures/   Original photography archive

.kiro/                  Kiro configuration
  specs/                Feature specs
  steering/             Steering rules (this file)
```

## Rules

### New components
- Shared across pages → `app/components/`
- Used by one page only → `app/[page]/components/`
- Primitive UI elements → `app/components/ui/`
- Never create components at the root or inside `public/`

### New images
- All photography used by the site → `public/images/`
- Event photography → `public/images/events/`
- Never hotlink remote images — always copy to `public/images/` first
- Never place images at the project root

### New fonts
- Fonts used by the app → `public/fonts/`
- Original/source font files → `_design/Fonts/`

### New pages
- Follow Next.js App Router conventions: `app/[route]/page.tsx`
- Always include a `metadata` export with unique title and description
- Always include Header and Footer

### Design references
- Mockups, wireframes, brand docs, logo source files → `_design/`
- Never commit design files to `public/` or the project root

### Root directory
- Only config files belong at root: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.example`, `.gitignore`, `README.md`, `AGENTS.md`, `eslint.config.mjs`, `postcss.config.mjs`
- If a new file doesn't belong to one of those categories, put it in the appropriate subdirectory above
- Never leave photography, SVGs, mockups, or one-off assets at root

### Environment variables
- Never commit `.env` or `.env.local`
- Document all variables in `.env.example` with placeholder values
- Current required variable: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

### Commits
- Stage specific files — avoid `git add .` for unrelated changes
- Write clear commit messages describing what changed and why
- Never push directly to main without a passing build
