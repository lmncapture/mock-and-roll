# Implementation Plan

## Technical Design

### Architecture Overview

The Mock & Roll website is a single-page Next.js App Router application with a component-based architecture. The homepage is composed of 8 distinct section components rendered sequentially, wrapped in a shared layout that provides typography CSS variables, global styles, and the brand color palette via Tailwind configuration.

```
app/
├── layout.tsx          # Root layout with font loading, CSS variables, global styles
├── page.tsx            # Homepage composing all section components
├── globals.css         # Tailwind directives, CSS variables, base styles
└── components/
    ├── Header.tsx      # Floating navigation with mobile menu
    ├── Hero.tsx        # Editorial hero section
    ├── Experience.tsx  # Split-layout experience section
    ├── Mocktails.tsx   # Signature drinks showcase
    ├── Atmosphere.tsx  # Editorial gallery section
    ├── Events.tsx      # Events section with pastel background
    ├── ReservationCTA.tsx  # Premium CTA section
    ├── Footer.tsx      # Minimal footer
    └── ui/
        ├── Button.tsx          # Reusable pill button component
        ├── FadeIn.tsx          # Framer Motion fade-in wrapper
        ├── ParallaxImage.tsx   # Image with subtle parallax effect
        └── CurvedImage.tsx     # Image with curved mask/arch shape
```

### Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ App Router | Server components by default, optimized image handling, local font loading |
| Styling | Tailwind CSS v3+ | Utility-first approach, custom color palette in config, responsive design |
| Animation | Framer Motion | Declarative animations, viewport-triggered reveals, smooth easing control |
| Language | TypeScript | Type safety, better DX, component prop validation |
| Font Loading | next/font/local | Zero layout shift, CSS variable exposure, optimal performance |
| Images | next/image | Automatic optimization, lazy loading, responsive sizing |
| Package Manager | npm | Standard, no additional tooling required |

### Font Loading Strategy

```typescript
// app/layout.tsx
import localFont from 'next/font/local'

const justCosmic = localFont({
  src: '../public/fonts/JustCosmic.otf',
  variable: '--font-just-cosmic',
  display: 'swap',
})

const outfit = localFont({
  src: '../public/fonts/Outfit-VariableFont_wght.ttf',
  variable: '--font-outfit',
  display: 'swap',
  weight: '100 900',
})
```

Fonts are exposed as CSS variables and mapped in Tailwind config:
- `font-display` → Just Cosmic (headlines, editorial moments)
- `font-body` → Outfit (everything else)

### Tailwind Configuration

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        slate: '#324648',
        'cool-white': '#FCF4E8',
        'lime-sorbet': '#D2E8B2',
        'lemon-zest': '#F7D656',
        'peach-nectar': '#FFD4A8',
        'pink-lychee': '#FDC6C1',
        'rose-petal': '#FEE3EE',
        'berry-crush': '#FCB2C7',
        'frosted-mint': '#E0EFEC',
        'arctic-mist': '#A2E9E7',
        'blueberry-dew': '#D6DEFF',
        'soft-plum': '#CDB9E8',
      },
      fontFamily: {
        display: ['var(--font-just-cosmic)', 'serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
        'arch': '50% 50% 0 0',
      },
    },
  },
}
```

### Animation System Design

All animations use Framer Motion with consistent, slow easing:

```typescript
// Shared animation config
const EASE_PREMIUM = [0.25, 0.1, 0.25, 1.0] // cubic-bezier for slow, elegant motion
const DURATION_SLOW = 0.8
const DURATION_MEDIUM = 0.6

// FadeIn component pattern
const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: DURATION_SLOW, ease: EASE_PREMIUM }
  }
}

// Image scale on scroll
const imageScaleVariants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 1.2, ease: EASE_PREMIUM }
  }
}
```

Viewport detection uses `whileInView` with `once: true` for single-trigger reveals.

### Component Design Patterns

**Section Components**: Each section is a self-contained component receiving no props (content is hardcoded per the editorial nature). Each section wraps its content in the `FadeIn` animation component.

**Button Component**: Reusable pill button with Slate/Cool White default state and configurable pastel hover color:

```typescript
interface ButtonProps {
  children: React.ReactNode
  href?: string
  hoverColor?: string // pastel accent for hover state
  className?: string
}
```

**CurvedImage Component**: Wraps next/image with CSS clip-path or border-radius for arch/curved mask shapes. Accepts aspect ratio and mask variant props.

**ParallaxImage Component**: Uses Framer Motion `useScroll` and `useTransform` for subtle vertical parallax offset on scroll.

### Responsive Strategy

- **Desktop (1280px+)**: Full editorial layouts with asymmetric positioning, side-by-side compositions
- **Tablet (768px–1279px)**: Slightly condensed but maintaining editorial proportions, typography stays large
- **Mobile (<768px)**: Stacked immersive layouts, full-width imagery, oversized typography preserved

Breakpoints use Tailwind's responsive prefixes (`md:`, `lg:`, `xl:`). Typography scales use `clamp()` for fluid sizing that never shrinks below editorial minimums.

### Image Strategy

- All images use `next/image` with `placeholder="blur"` where possible
- Placeholder images from Unsplash or similar during development (bright, airy, lifestyle photography)
- Images sized generously: hero image at minimum 600px height, gallery images at 400px+
- Curved masks achieved via CSS `border-radius` and `clip-path` properties

### File and Asset Organization

```
public/
├── fonts/
│   ├── JustCosmic.otf
│   └── Outfit-VariableFont_wght.ttf
├── images/
│   ├── hero-drink.jpg
│   ├── interior-arch.jpg
│   ├── mocktail-1.jpg through mocktail-5.jpg
│   ├── atmosphere/ (gallery images)
│   └── events/ (event imagery)
└── logo.svg (Mock & Roll wide logo)
```

### Performance Considerations

- Server Components by default; only interactive components (Header mobile menu, animations) use `"use client"`
- Font files loaded locally (no external requests)
- Images optimized via next/image with appropriate `sizes` attributes
- Framer Motion animations use `will-change` hints for GPU acceleration
- Minimal JavaScript bundle: no CMS, no heavy libraries

### Section Color Mapping

Each section uses a distinct background to create visual rhythm:

| Section | Background | Accent Usage |
|---------|-----------|--------------|
| Header | Transparent / Cool White | — |
| Hero | Cool White | Pastel abstract shapes (Lime Sorbet, Peach Nectar) |
| Experience | Cool White | Frosted Mint botanical accents |
| Mocktails | Cool White | Each card: different pastel (Pink Lychee, Lemon Zest, Arctic Mist, Soft Plum, Lime Sorbet) |
| Atmosphere | Cool White | — |
| Events | Rose Petal | Berry Crush accents |
| Reservation CTA | Frosted Mint | — |
| Footer | Slate | Cool White text |

## Correctness Properties

### Property 1: Color Palette Integrity
- **What**: Every color value used in the Tailwind config and rendered CSS matches exactly one of the 12 Brand_Palette colors
- **How to verify**: Grep all color hex values in tailwind.config.ts and globals.css; confirm no #000000, no #FFFFFF (unless absolutely necessary), and no colors outside the defined palette

### Property 2: Font Loading Correctness
- **What**: Both custom fonts load without layout shift and are available as CSS variables
- **How to verify**: Build the project and confirm `--font-just-cosmic` and `--font-outfit` CSS variables are present on the HTML element; verify no FOUT in production build

### Property 3: Responsive Layout Integrity
- **What**: All sections render correctly at mobile (375px), tablet (768px), and desktop (1440px) viewports without overflow, clipping, or broken layouts
- **How to verify**: Visual inspection at each breakpoint; no horizontal scrollbar appears; typography remains legible and oversized

### Property 4: Animation Performance
- **What**: All Framer Motion animations run at 60fps without jank
- **How to verify**: Chrome DevTools Performance panel shows no dropped frames during scroll animations; no layout thrashing

### Property 5: Accessibility Baseline
- **What**: All interactive elements are keyboard-accessible and have sufficient color contrast
- **How to verify**: Slate (#324648) on Cool White (#FCF4E8) passes WCAG AA contrast ratio; all buttons and links are focusable; mobile menu is keyboard-navigable

### Property 6: No Unauthorized Dependencies
- **What**: package.json contains only Next.js, React, Tailwind CSS, Framer Motion, TypeScript, and their required peer/dev dependencies
- **How to verify**: Audit package.json; no CMS packages, no UI component libraries (Chakra, MUI, shadcn, etc.), no Sanity
