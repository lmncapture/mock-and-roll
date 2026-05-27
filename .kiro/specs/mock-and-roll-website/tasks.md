# Tasks

## Task 1: Project Scaffolding and Configuration

- [x] 1.1 Initialize Next.js project with App Router, TypeScript, and Tailwind CSS using `create-next-app`
- [x] 1.2 Install Framer Motion as a dependency
- [x] 1.3 Copy font files (Just Cosmic .otf and Outfit variable .ttf) into `public/fonts/` directory
- [x] 1.4 Copy the Mock & Roll SVG logo into `public/` directory
- [x] 1.5 Configure `next/font/local` in `app/layout.tsx` to load both fonts with CSS variables (`--font-just-cosmic`, `--font-outfit`)
- [x] 1.6 Configure `tailwind.config.ts` with the complete Brand Palette (all 12 colors), custom font families (`font-display`, `font-body`), and custom border-radius values
- [x] 1.7 Set up `app/globals.css` with Tailwind directives, CSS variable declarations, base body styles (Cool White background, Slate text, Outfit font default)
- [x] 1.8 Create the component directory structure (`app/components/` and `app/components/ui/`)
- [x] 1.9 Verify the project builds and runs without errors

## Task 2: Shared UI Components

- [x] 2.1 Create `Button.tsx` — reusable pill-shaped button with Slate background, Cool White text, pastel hover state, smooth transition, and optional `href` prop for link behavior
- [x] 2.2 Create `FadeIn.tsx` — Framer Motion wrapper component using `whileInView` with slow fade-up animation (opacity + translateY), `once: true`, and configurable delay
- [x] 2.3 Create `ParallaxImage.tsx` — next/image wrapper with Framer Motion `useScroll`/`useTransform` for subtle vertical parallax offset on scroll
- [x] 2.4 Create `CurvedImage.tsx` — next/image wrapper with configurable border-radius or clip-path for arch and curved mask shapes

## Task 3: Header Navigation

- [x] 3.1 Create `Header.tsx` component with fixed/floating positioning, transparent background, and minimal visual weight
- [x] 3.2 Implement logo display (SVG) on the left side
- [x] 3.3 Implement desktop navigation links (Home, Cocktails, Events, About, Reservations) with Outfit Medium/Semibold weight
- [x] 3.4 Implement reservation CTA button in the header using the shared Button component
- [x] 3.5 Implement mobile hamburger menu icon that appears below 768px viewport
- [x] 3.6 Implement full-screen slide-down mobile navigation overlay with Framer Motion animation
- [x] 3.7 Ensure header floats above content with appropriate z-index and does not create a dark band

## Task 4: Hero Section

- [x] 4.1 Create `Hero.tsx` component with editorial split layout (typography left, image right on desktop)
- [x] 4.2 Implement oversized headline "Crafted mocktails. Unforgettable moments." using Just Cosmic font with generous line-height
- [x] 4.3 Implement subtext paragraph using Outfit font
- [x] 4.4 Implement "View Menu" CTA button
- [x] 4.5 Add soft pastel abstract background shapes (CSS/SVG decorative elements using brand palette colors)
- [x] 4.6 Add placeholder hero drink photography with next/image
- [x] 4.7 Implement mobile stacking behavior preserving oversized typography and image dominance
- [x] 4.8 Add FadeIn animation to hero content elements with staggered delays

## Task 5: Experience Section

- [x] 5.1 Create `Experience.tsx` component with editorial split layout (copy left, image right)
- [x] 5.2 Implement section title using Just Cosmic font with refined brand copy
- [x] 5.3 Implement large rounded-arch image using CurvedImage component
- [x] 5.4 Add subtle botanical illustration accents (SVG or CSS decorative elements)
- [x] 5.5 Add minimalist CTA element
- [x] 5.6 Wrap section in FadeIn animation

## Task 6: Signature Mocktails Section

- [x] 6.1 Create `Mocktails.tsx` component with horizontal scrollable or grid layout
- [x] 6.2 Implement individual drink cards with distinct pastel background colors from the Brand Palette
- [x] 6.3 Add large drink photography placeholders using next/image as the primary visual element
- [x] 6.4 Add minimal typography (drink name, brief description) with elegant spacing
- [x] 6.5 Style cards to feel playful, premium, and vibrant — not like e-commerce product cards
- [x] 6.6 Implement responsive behavior (horizontal scroll on mobile, grid on desktop)
- [x] 6.7 Add FadeIn animation to the section and subtle hover effects on cards

## Task 7: Atmosphere Gallery Section

- [x] 7.1 Create `Atmosphere.tsx` component with asymmetrical image grid layout
- [x] 7.2 Implement mixed-size image grid with varied aspect ratios and curved masks
- [x] 7.3 Add editorial typography "A space to unwind, celebrate, and be present." using Just Cosmic font
- [x] 7.4 Add placeholder lifestyle/interior photography
- [x] 7.5 Implement images that occasionally break grid boundaries for editorial effect
- [x] 7.6 Add FadeIn and subtle scale animations on images

## Task 8: Events Section

- [x] 8.1 Create `Events.tsx` component with soft pastel background (Rose Petal or similar)
- [x] 8.2 Implement editorial layout highlighting event types (bridal showers, birthdays, private events, networking, community gatherings)
- [x] 8.3 Add curved image framing for event imagery
- [x] 8.4 Add descriptive text alongside event imagery
- [x] 8.5 Wrap section in FadeIn animation

## Task 9: Reservation CTA Section

- [x] 9.1 Create `ReservationCTA.tsx` component with generous whitespace and simple premium layout
- [x] 9.2 Implement headline "Join us for mocktails worth remembering." using Just Cosmic font at large scale
- [x] 9.3 Implement "Reserve Your Spot" button using shared Button component
- [x] 9.4 Add FadeIn animation to the section

## Task 10: Footer

- [x] 10.1 Create `Footer.tsx` component with light, airy styling
- [x] 10.2 Display Mock & Roll logo
- [x] 10.3 Implement navigation links matching header menu
- [x] 10.4 Add social media icon placeholders
- [x] 10.5 Add contact information display
- [x] 10.6 Style footer with Slate background and Cool White text (or light airy alternative per mockup)

## Task 11: Homepage Assembly and Final Polish

- [x] 11.1 Compose all section components in `app/page.tsx` in correct order (Hero → Experience → Mocktails → Atmosphere → Events → Reservation CTA)
- [x] 11.2 Ensure pastel color rotation across sections creates visual rhythm
- [x] 11.3 Verify generous spacing between all sections (large vertical padding)
- [x] 11.4 Test all animations trigger correctly on scroll
- [x] 11.5 Verify responsive behavior at mobile (375px), tablet (768px), and desktop (1440px) viewports
- [x] 11.6 Confirm no pure black, no dark moody sections, no unauthorized colors appear
- [x] 11.7 Verify the site builds successfully with no TypeScript or lint errors
