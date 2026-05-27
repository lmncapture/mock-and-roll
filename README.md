# Mock & Roll

A premium editorial-style website for Mock & Roll — a boutique mocktail bar offering elevated alcohol-free experiences.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Brand Fonts

- **Just Cosmic** — Display/headline font (editorial moments)
- **Outfit** — Body/UI font (navigation, copy, buttons)

Fonts are loaded locally via `next/font/local` from `public/fonts/`.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Slate | #324648 | Primary text, buttons, navigation |
| Cool White | #FCF4E8 | Background, canvas |
| Lime Sorbet | #D2E8B2 | Accent |
| Lemon Zest | #F7D656 | Accent |
| Peach Nectar | #FFD4A8 | Accent |
| Pink Lychee | #FDC6C1 | Accent |
| Rose Petal | #FEE3EE | Accent |
| Berry Crush | #FCB2C7 | Accent |
| Frosted Mint | #E0EFEC | Accent |
| Arctic Mist | #A2E9E7 | Accent |
| Blueberry Dew | #D6DEFF | Accent |
| Soft Plum | #CDB9E8 | Accent |

## Project Structure

```
app/
├── layout.tsx              # Root layout, font loading
├── page.tsx                # Homepage composition
├── globals.css             # Tailwind theme, brand palette
└── components/
    ├── Header.tsx          # Floating navigation
    ├── Hero.tsx            # Editorial hero section
    ├── Experience.tsx      # Brand philosophy section
    ├── Mocktails.tsx       # Signature drinks showcase
    ├── Atmosphere.tsx      # Gallery section
    ├── Events.tsx          # Private events section
    ├── ReservationCTA.tsx  # Reservation call-to-action
    ├── Footer.tsx          # Site footer
    └── ui/
        ├── Button.tsx      # Reusable pill button
        ├── FadeIn.tsx      # Scroll-triggered animation
        ├── ParallaxImage.tsx
        └── CurvedImage.tsx
```

## Build

```bash
npm run build
```

## Deploy

Optimized for Vercel deployment. Push to main and connect the repo.
