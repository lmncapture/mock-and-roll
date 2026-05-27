# Requirements Document

## Introduction

Mock & Roll is a premium editorial-style website for a boutique mocktail bar. The site conveys a vibrant, elegant, airy, lifestyle-driven brand identity through editorial layouts, custom typography, a curated pastel color palette, and refined animations. The tech stack is Next.js App Router with Tailwind CSS, Framer Motion, and TypeScript. No CMS or heavy component libraries are used.

## Design References

- **Desktop Layout Mockup**: `MRDesktop.png` — authoritative visual reference for desktop layout, spacing, typography scale, color usage, and section composition
- **Mobile Layout Mockup**: `MRMobile.png` — authoritative visual reference for mobile layout, stacking behavior, typography scale, and responsive adaptations

All implementation decisions regarding layout proportions, spacing, visual hierarchy, and section ordering should follow these mockups as the primary source of truth.

## Creative Direction Principles

The following principles govern all implementation decisions and take priority over conventional UI patterns:

### Layout Philosophy
- Intentional asymmetry throughout the page; avoid perfectly symmetrical layouts
- Sections may overlap slightly where appropriate
- Oversized spacing and breathing room between all elements
- Visual rhythm prioritized over rigid grid systems

### Editorial Design Identity
The website must feel closer to: a luxury magazine spread, a boutique hotel brand, an upscale café campaign, a fashion editorial. It must NOT feel like: a SaaS landing page, a restaurant template, an admin dashboard, a startup homepage.

### Image Treatment
- Images feel immersive and dominate sections
- Soft rounded corners or curved masks on imagery
- Images occasionally break outside strict grid boundaries
- No tiny thumbnails, boxed gallery cards, or overly uniform image sizing

### Spacing System
- Large vertical padding between sections
- Oversized margins within sections
- Relaxed text spacing and line-height
- Breathing room between all elements; the site should feel calm and elevated

### Button Style
- Elegant and tactile feel with subtle hover transitions
- Rounded pill or soft radius shape
- Slate background with Cool White text
- Pastel hover states with smooth transitions
- No harsh shadows or aggressive scaling on interaction

### Motion Philosophy
- Slow, cinematic, restrained, premium
- Animation supports atmosphere without distraction
- No spring-heavy animation, bouncing, flashy transitions, or exaggerated movement

### Typography as Visual Element
- Headlines are oversized and expressive, functioning as a primary visual element
- Typography does not shrink excessively on tablet or mobile
- Natural text wrapping preserved; dramatic hierarchy maintained
- Just Cosmic reserved for high-impact editorial moments only
- Outfit used for all utility text, navigation, supporting copy, and buttons

### Mobile Experience
- Mobile must NOT feel like a compressed desktop site
- Maintain editorial pacing, large imagery, and oversized typography
- Use stacked immersive layouts with strong visual hierarchy
- The mobile experience should feel premium and app-like

### Implementation Priority Order
1. Emotional atmosphere
2. Visual storytelling
3. Hospitality luxury
4. Editorial composition
5. Premium feel

Technical cleanliness supports the design — it does not flatten it.

## Glossary

- **Website**: The Mock & Roll Next.js application serving the homepage and all associated pages
- **Header**: The floating top navigation component containing logo, menu links, and reservation CTA
- **Hero_Section**: The large editorial hero area with oversized typography, drink photography, and abstract background shapes
- **Experience_Section**: The editorial split-layout section showcasing refined copy and boutique interior imagery
- **Mocktails_Section**: The horizontal colorful drink showcase displaying signature mocktails with pastel card backgrounds
- **Atmosphere_Section**: The editorial gallery layout with asymmetrical image grids and lifestyle imagery
- **Events_Section**: The soft pastel section highlighting private events, bridal showers, and community gatherings
- **Reservation_CTA**: The premium call-to-action section with large serif headline and reservation button
- **Footer**: The minimal footer with logo, navigation, social icons, and contact information
- **Brand_Palette**: The exact set of 12 approved colors (Slate, Cool White, and 10 pastel accents)
- **Just_Cosmic_Font**: The primary display typeface (.otf) used for hero headlines and editorial statement text
- **Outfit_Font**: The secondary variable font (.ttf) used for body copy, navigation, buttons, and supporting text
- **Animation_System**: The Framer Motion implementation providing smooth, restrained, premium motion effects
- **Mobile_Layout**: The responsive layout adapting all sections for mobile devices while preserving editorial quality

## Requirements

### Requirement 1: Project Foundation and Tech Stack

**User Story:** As a developer, I want the project scaffolded with Next.js App Router, Tailwind CSS, Framer Motion, and TypeScript, so that the codebase follows the specified tech stack without CMS or heavy component libraries.

#### Acceptance Criteria

1. THE Website SHALL use Next.js App Router with the `app/` directory structure as the routing and rendering framework
2. THE Website SHALL use Tailwind CSS for utility-first styling with Tailwind directives imported in the global stylesheet
3. THE Website SHALL use Framer Motion for all animated transitions, scroll-triggered effects, and interactive motion (simple CSS hover state transitions via Tailwind utilities are permitted)
4. THE Website SHALL use TypeScript with `.ts` and `.tsx` extensions for all application source files (configuration files such as next.config, tailwind.config, and postcss.config may use `.js` or `.ts`)
5. THE Website SHALL operate without any CMS integration, headless CMS packages, or dashboard UI systems in its dependencies
6. THE Website SHALL NOT include heavy third-party component libraries (such as Material UI, Chakra UI, Ant Design, or Bootstrap) in its dependencies

### Requirement 2: Brand Color Palette Implementation

**User Story:** As a brand designer, I want the exact brand color palette enforced across the entire site, so that the visual identity remains consistent and no unauthorized colors appear.

#### Acceptance Criteria

1. THE Website SHALL define the Brand_Palette in the Tailwind configuration with these exact values: Slate (#324648), Cool White (#FCF4E8), Lime Sorbet (#D2E8B2), Lemon Zest (#F7D656), Peach Nectar (#FFD4A8), Pink Lychee (#FDC6C1), Rose Petal (#FEE3EE), Berry Crush (#FCB2C7), Frosted Mint (#E0EFEC), Arctic Mist (#A2E9E7), Blueberry Dew (#D6DEFF), and Soft Plum (#CDB9E8)
2. THE Website SHALL use Cool White or a pastel accent color from the Brand_Palette as the background for every page section, with no section using a color outside the Brand_Palette
3. THE Website SHALL use Slate as the primary color for typography, buttons, and navigation
4. THE Website SHALL render buttons with a minimum border-radius of 20px, a Slate background, and Cool White text
5. WHEN a user hovers over a button, THE Website SHALL transition the button background to a pastel accent color from the Brand_Palette with Slate text, using a CSS transition duration between 150ms and 300ms with an ease or ease-in-out timing function
6. THE Website SHALL NOT use pure black (#000000) anywhere in the design
7. THE Website SHALL NOT use any background color with an HSL lightness value below 40%, ensuring all backgrounds remain light and airy
8. THE Website SHALL NOT apply box-shadows with opacity greater than 0.15 or blur less than 8px, and SHALL NOT apply scale transforms exceeding 1.05 on interactive elements
9. THE Website SHALL assign pastel accent colors from the Brand_Palette to page sections such that no two adjacent sections share the same primary accent color

### Requirement 3: Typography System

**User Story:** As a brand designer, I want custom fonts loaded and applied consistently, so that the site achieves a premium editorial typographic hierarchy.

#### Acceptance Criteria

1. THE Website SHALL load Just_Cosmic_Font via next/font/local and expose it as a CSS variable
2. THE Website SHALL load Outfit_Font as a variable font via next/font/local and expose it as a CSS variable
3. THE Website SHALL apply Just_Cosmic_Font to hero headlines, featured section titles, the Reservation_CTA headline, and the Atmosphere_Section statement text
4. THE Website SHALL apply Outfit_Font to body copy, navigation items, buttons, labels, drink descriptions, and footer text
5. THE Website SHALL render Just_Cosmic_Font headlines at a minimum of 48px on desktop viewports and a minimum of 36px on mobile viewports, with a line-height between 1.1 and 1.3
6. THE Website SHALL use Outfit font weight 500 (Medium) or 600 (Semibold) for navigation items and buttons, and weight 400 (Regular) for body copy
7. THE Website SHALL maintain a typographic size ratio of at least 3:1 between Just_Cosmic_Font headlines and Outfit_Font body text to ensure clear visual hierarchy
8. IF Just_Cosmic_Font or Outfit_Font fails to load, THEN THE Website SHALL render text using a sans-serif fallback font stack without causing layout shift

### Requirement 4: Header Navigation

**User Story:** As a visitor, I want a minimal floating navigation that provides access to all site sections, so that I can navigate the site without visual clutter.

#### Acceptance Criteria

1. THE Header SHALL display the Mock & Roll SVG logo on the left side
2. THE Header SHALL display navigation links (Home, Cocktails, Events, About, Reservations) aligned right of the logo
3. THE Header SHALL display a reservation CTA button styled as a pill-shaped Slate button with Cool White text, visually distinct from the navigation links
4. THE Header SHALL use a transparent or light background from the Brand_Palette that does not create a dark band across the page
5. WHEN the viewport width is 768px or below, THE Header SHALL hide the desktop navigation links and display a hamburger menu icon in their place
6. WHEN a user activates the mobile hamburger menu, THE Header SHALL reveal a full-screen slide-down navigation overlay containing all navigation links and the reservation CTA button within 400ms
7. WHEN a user selects a navigation link within the mobile overlay OR activates the close control, THE Header SHALL dismiss the overlay within 400ms
8. THE Header SHALL remain fixed at the top of the viewport and visible during vertical scrolling, floating above page content with no hard shadows or opaque background that obscures the editorial aesthetic

### Requirement 5: Hero Section

**User Story:** As a visitor, I want an impactful editorial hero that communicates the brand's premium identity immediately, so that I understand the bar's positioning within seconds.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the headline "Crafted mocktails. Unforgettable moments." using Just_Cosmic_Font at a minimum size of 56px on desktop viewports and 36px on mobile viewports
2. THE Hero_Section SHALL display the subtext "An elevated alcohol-free experience designed for connection, celebration, and feel-good nights." using Outfit_Font
3. THE Hero_Section SHALL display a "View Menu" CTA button with Slate background and Cool White text
4. WHEN the viewport width is above 768px, THE Hero_Section SHALL position oversized typography on the left and large drink photography on the right in a side-by-side editorial layout
5. THE Hero_Section SHALL include soft pastel abstract background shapes using colors from the Brand_Palette positioned behind the content
6. WHEN the viewport width is 768px or below, THE Hero_Section SHALL stack content vertically with the headline and subtext above the drink photography, maintaining oversized typography and image dominance
7. THE Hero_Section SHALL occupy a minimum height of 80vh on desktop viewports to create an immersive editorial entrance

### Requirement 6: Experience Section

**User Story:** As a visitor, I want to understand the bar's atmosphere and philosophy through editorial storytelling, so that I feel emotionally connected to the brand.

#### Acceptance Criteria

1. THE Experience_Section SHALL use an editorial split layout with typography on the left and imagery on the right, with each side occupying approximately half the section width on desktop viewports
2. THE Experience_Section SHALL display a section title using Just_Cosmic_Font and supporting body copy using Outfit_Font that communicates the bar's philosophy and atmosphere
3. THE Experience_Section SHALL display a large rounded-arch image of the boutique interior, sized to occupy at least 45% of the section width on desktop viewports
4. THE Experience_Section SHALL include botanical illustration accents positioned as decorative elements that do not overlap or obscure the primary text content or interior image
5. THE Experience_Section SHALL include a CTA element styled as a pill-shaped button with Slate background and Cool White text, consistent with the brand button style defined in the Brand_Palette
6. WHEN the viewport is mobile-sized, THE Experience_Section SHALL stack the typography above the imagery in a single-column vertical layout while preserving oversized typography and image dominance

### Requirement 7: Signature Mocktails Showcase

**User Story:** As a visitor, I want to see the signature drinks presented in a vibrant, premium way, so that I feel excited to visit and try them.

#### Acceptance Criteria

1. THE Mocktails_Section SHALL display between 3 and 6 drink cards in a horizontal scrollable or grid layout
2. THE Mocktails_Section SHALL assign a different pastel accent color from the Brand_Palette as the background for each drink card
3. THE Mocktails_Section SHALL display drink photography occupying at least 60% of each card's visual area as the primary element
4. THE Mocktails_Section SHALL display only the drink name and a single-line flavor description on each card, using Outfit_Font with generous padding between text and card edges
5. THE Mocktails_Section SHALL NOT include pricing, ratings, quantity selectors, or add-to-cart elements on drink cards
6. THE Mocktails_Section SHALL use rounded corners on cards and soft color transitions consistent with the Brand_Palette to reinforce a lifestyle editorial presentation rather than a product listing aesthetic

### Requirement 8: Atmosphere Gallery

**User Story:** As a visitor, I want to see the bar's interior, drinks, and lifestyle imagery in an editorial layout, so that I can envision the experience of being there.

#### Acceptance Criteria

1. THE Atmosphere_Section SHALL display at least 4 gallery images representing a minimum of 3 distinct categories from: interior photography, drink imagery, seating areas, and lifestyle shots
2. THE Atmosphere_Section SHALL use an asymmetrical image grid layout where images vary in size and no two adjacent images share the same dimensions
3. THE Atmosphere_Section SHALL display the typography "A space to unwind, celebrate, and be present." using Just_Cosmic_Font as an integrated element within or adjacent to the image grid
4. THE Atmosphere_Section SHALL apply a minimum border-radius of 12px or a curved mask shape to all gallery images
5. WHEN the viewport is mobile-sized, THE Atmosphere_Section SHALL stack gallery images into a single-column layout while preserving varied image heights and asymmetrical visual rhythm

### Requirement 9: Events Section

**User Story:** As a visitor, I want to learn about private event options, so that I can consider Mock & Roll for celebrations and gatherings.

#### Acceptance Criteria

1. THE Events_Section SHALL use a soft pastel background color from the Brand_Palette
2. THE Events_Section SHALL display each event type (bridal showers, birthdays, private events, networking, and community gatherings) as a visually distinct named item with a short descriptive text of no more than 2 sentences per event type
3. THE Events_Section SHALL use editorial layouts with curved image masks or rounded corners on all event imagery, consistent with the site-wide image treatment
4. THE Events_Section SHALL display event imagery paired with descriptive text in a side-by-side arrangement on desktop viewports and a stacked vertical arrangement on mobile viewports
5. THE Events_Section SHALL display the section title using Just_Cosmic_Font and all descriptive body text using Outfit_Font
6. WHEN a visitor views the Events_Section, THE Events_Section SHALL display a CTA button inviting the visitor to inquire about private events, styled with Slate background and Cool White text in a rounded pill shape

### Requirement 10: Reservation Call-to-Action

**User Story:** As a visitor, I want a clear and inviting reservation prompt, so that I can easily take action to book a visit.

#### Acceptance Criteria

1. THE Reservation_CTA SHALL display the headline "Join us for mocktails worth remembering." using Just_Cosmic_Font at oversized scale consistent with other section headlines
2. THE Reservation_CTA SHALL display a "Reserve Your Spot" button with Slate background and Cool White text, using Outfit_Font
3. THE Reservation_CTA SHALL use a center-aligned layout with vertical stacking of headline and button, separated by large vertical padding consistent with the site's spacing system
4. WHEN a user activates the "Reserve Your Spot" button, THE Reservation_CTA SHALL navigate the user to the Reservations page or designated reservation destination
5. THE Reservation_CTA SHALL display a Cool White or pastel accent background from the Brand_Palette to visually distinguish the section from adjacent content

### Requirement 11: Footer

**User Story:** As a visitor, I want to find contact information, social links, and site navigation in the footer, so that I can connect with the brand through multiple channels.

#### Acceptance Criteria

1. THE Footer SHALL display the Mock & Roll SVG logo
2. THE Footer SHALL display navigation links matching the header menu items (Home, Cocktails, Events, About, Reservations) using Outfit_Font
3. THE Footer SHALL display social media icons for at least Instagram, Facebook, and TikTok as recognizable SVG icons with a minimum tap target of 44×44px
4. THE Footer SHALL display contact information including at minimum an email address and physical location
5. THE Footer SHALL use a Cool White or light pastel background from the Brand_Palette with Slate text, maintaining the airy aesthetic consistent with the rest of the site

### Requirement 12: Animation System

**User Story:** As a visitor, I want smooth, elegant animations that enhance the premium feel without distracting from content, so that the browsing experience feels refined and intentional.

#### Acceptance Criteria

1. WHEN a section enters at least 20% of the viewport, THE Animation_System SHALL trigger a fade-in animation from opacity 0 to opacity 1 over a duration between 600ms and 1000ms
2. WHEN a user hovers over an image or an image scrolls into view, THE Animation_System SHALL apply a scale transform between 1.02 and 1.05 with a transition duration between 400ms and 800ms
3. THE Animation_System SHALL apply parallax vertical offset of no more than 30px to background shapes and section imagery during scroll
4. WHEN a headline enters the viewport, THE Animation_System SHALL reveal the text with a vertical translate of 20-30px combined with a fade-in over a duration between 600ms and 1000ms
5. THE Animation_System SHALL use ease-out or cubic-bezier easing curves with a minimum transition duration of 400ms for all animations
6. THE Animation_System SHALL NOT use spring-based easing, scale transforms exceeding 1.05, translate distances exceeding 50px, or animation durations shorter than 300ms
7. IF the user has enabled prefers-reduced-motion, THEN THE Animation_System SHALL disable all motion animations and display content in its final state without transition

### Requirement 13: Global Visual Style

**User Story:** As a brand designer, I want the site to maintain an editorial, cinematic, sophisticated aesthetic throughout, so that every section reinforces the premium brand positioning.

#### Acceptance Criteria

1. THE Website SHALL use intentional asymmetry in layouts — defined as unequal column widths, offset element positioning, or varied image sizes within a section — in at least half of all page sections rather than perfectly symmetrical compositions
2. THE Website SHALL allow sections to overlap by 16–48px where the design mockups indicate overlapping editorial composition
3. THE Website SHALL use oversized imagery — where at least one image per section occupies a minimum of 50% of the section's visual area — and at least one section SHALL contain an image that extends beyond the content grid boundary
4. THE Website SHALL use curved image masks and rounded corners with a minimum border-radius of 12px on images, and layered section compositions where elements visually overlap or stack at different depths
5. THE Website SHALL maintain generous whitespace with a minimum vertical padding of 80px between sections on desktop (48px on mobile), a minimum line-height of 1.5 for body text, and a minimum line-height of 1.2 for headlines
6. THE Website SHALL use soft shadows only — defined as a minimum blur radius of 16px and maximum opacity of 15% — with no hard drop shadows (blur radius below 4px) or harsh visual edges (borders above 2px in width using non-pastel colors)
7. THE Website SHALL use rounded pill (fully rounded, border-radius equal to half the element height) or soft-radius corners (minimum 8px border-radius) on all buttons and interactive elements
8. THE Website SHALL prioritize visual rhythm and editorial composition over rigid grid systems, as defined by the layout patterns shown in the MRDesktop.png and MRMobile.png design mockups
9. THE Website SHALL NOT use uniform equal-width card grids exceeding 3 identical cards in a row, images smaller than 120px in either dimension, border-radius of 0px on visible containers, or borders exceeding 2px in width
10. THE Website SHALL NOT use layout patterns characteristic of SaaS landing pages (feature grids with icons, pricing tables), restaurant templates (menu lists with prices in columns), admin dashboards (sidebar navigation with data tables), or startup homepages (centered hero with three feature columns below)

### Requirement 14: Mobile Responsiveness

**User Story:** As a mobile visitor, I want the same premium editorial experience on my phone, so that the brand quality is preserved regardless of device.

#### Acceptance Criteria

1. WHEN the viewport width is 768px or below, THE Website SHALL stack all multi-column layouts into single-column vertical compositions with vertical spacing between sections no less than 48px
2. WHEN the viewport width is 768px or below, THE Website SHALL render headlines using Just_Cosmic_Font at a minimum size of 28px and body text using Outfit_Font at a minimum size of 16px, ensuring mobile type sizes remain no smaller than 60% of their desktop equivalents
3. WHEN the viewport width is 768px or below, THE Website SHALL display section imagery at a minimum width of 80% of the viewport width, preserving rounded corners or curved masks consistent with the desktop treatment
4. WHEN the viewport width is 768px or below, THE Website SHALL render all interactive elements (buttons, links, menu icons) with a minimum tap target size of 44×44px and a minimum spacing of 12px between adjacent targets
5. WHEN the viewport width is 768px or below, THE Website SHALL continue rotating pastel accent background colors across sections in the same order as the desktop layout
6. WHEN the viewport width is 768px or below, THE Website SHALL use full-bleed imagery, smooth Framer Motion transitions, and generous vertical padding (minimum 32px within sections) to maintain the editorial atmosphere defined in the MRMobile.png mockup
7. THE Mobile_Layout SHALL NOT render content cards narrower than 280px, reduce any heading below 24px, or replicate the desktop multi-column grid without adaptation to single-column flow
