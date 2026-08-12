# Implementation Plan: Create Your Own Mocktail

## Overview

Replace the static FlavorProfiles section on the Mocktails page with an interactive four-step mocktail builder. Implementation proceeds bottom-up: create leaf components first (IngredientChip, LivePreview), then the composite BuilderStep, then the orchestrating parent MocktailBuilder (which owns state, step configuration, selection handlers, and the inline booking CTA), and finally integrate into the page. All new files go in `app/mocktails/components/`.

**Component architecture (4 files):**
```
app/mocktails/components/
  MocktailBuilder.tsx
  BuilderStep.tsx
  IngredientChip.tsx
  LivePreview.tsx
```

No `BuilderCTA.tsx` — the inline booking CTA lives directly in `MocktailBuilder.tsx`.

## Tasks

- [ ] 1. Create IngredientChip component
  - [ ] 1.1 Implement IngredientChip.tsx
    - Create `app/mocktails/components/IngredientChip.tsx`
    - Define `StepColorScheme` interface with `idle`, `hover`, `selected`, and `ring` string fields (Tailwind class names)
    - Define `IngredientChipProps` interface with `name: string`, `isSelected: boolean`, `onSelect: () => void`, `colorScheme: StepColorScheme`
    - Render a native `<button type="button">` element
    - Apply `aria-pressed={isSelected}` — `"true"` when selected, `"false"` when not
    - Apply pill shape: `rounded-full`
    - Apply minimum touch target: `min-h-[44px] min-w-[44px] px-5 py-2.5`
    - Apply typography: `font-body font-medium text-sm text-slate`
    - Apply `transition-colors duration-200`
    - Apply step-specific color classes from `colorScheme` prop:
      - Idle state: `colorScheme.idle` background
      - Hover state: `colorScheme.hover` background
      - Selected state: `colorScheme.selected` background
    - Do NOT render checkboxes, radio buttons, dropdowns, or hard borders
    - Enter and Space trigger selection via native `<button>` behavior (no custom key handlers needed)
    - Visible focus state via the global `focus-visible` ring already defined in `globals.css`
    - Export `StepColorScheme` interface for use in other components
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 2. Create LivePreview component
  - [ ] 2.1 Implement LivePreview.tsx
    - Create `app/mocktails/components/LivePreview.tsx`
    - Define props interface: `base: string | null`, `puree: string | null`, `syrup: string | null`, `garnishes: string[]`, `onReset: () => void`
    - Determine `hasSelections` — true when any of base/puree/syrup is non-null or garnishes is non-empty
    - **When no selections exist:** render nothing (return null) or display neutral placeholder guidance text
    - **When selections exist:** render an editorial recipe-card style composition:
      - Headline: "Your Mocktail" — `font-display text-xl lg:text-2xl text-slate`
      - Render each selected category as its own conditional line/segment:
        - Base line: render base name only if base is non-null
        - Purée line: render "+ [name] Purée" only if purée is non-null (omit "+" if this is the first visible segment)
        - Syrup line: render "+ [name] Syrup" only if syrup is non-null (omit "+" if this is the first visible segment)
        - Garnishes line: render "+ [garnish names]" only if garnishes is non-empty (omit "+" if this is the first visible segment)
      - Ingredient lines: `font-body text-base lg:text-lg text-slate/80`
      - Sparkling note: "Sparkling with club soda" — always rendered when hasSelections is true — `font-body text-sm text-slate/60 italic`
    - **Never render:** undefined, null, empty "+" separators, dangling punctuation, empty ingredient categories, placeholder tokens
    - **Garnish natural-language formatting:**
      - 1 garnish: `Fresh Fruit`
      - 2 garnishes: `Fresh Fruit & Flowers`
      - 3+ garnishes: `Fresh Fruit, Flowers & Candied Ginger`
    - **Start Over button:**
      - Render a semantic `<button type="button">` with text "Start Over"
      - Only visible when `hasSelections` is true
      - On click: call `onReset()`
      - Style: `font-body text-sm text-slate/50 underline hover:text-slate/75 transition-colors`
      - NOT styled as a primary CTA
      - Keyboard accessible (native button behavior)
      - Positioned within or immediately adjacent to the preview content
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 14.1, 14.2, 14.3, 14.4, 14.5, 15.4, 15.5_

- [ ] 3. Create BuilderStep component
  - [ ] 3.1 Implement BuilderStep.tsx
    - Create `app/mocktails/components/BuilderStep.tsx`
    - Define `BuilderStepProps` interface:
      - `stepNumber: string` — two-digit string ("01", "02", "03", "04")
      - `label: string` — step heading text
      - `options: string[]` — ingredient names
      - `selected: string | string[] | null` — current selection(s)
      - `onSelect: (name: string) => void` — click handler
      - `colorScheme: StepColorScheme` — imported from IngredientChip
      - `multiSelect: boolean` — whether multiple selections are allowed
    - **Render step number:** display `stepNumber` as a visually secondary element above the heading
      - Typography: `font-body text-sm font-semibold tracking-widest uppercase text-slate/40`
    - **Render step heading:** `<h3>` with `font-display text-2xl lg:text-3xl text-slate`
    - **Render chip grid:** `flex flex-wrap gap-3` container
    - Map over `options` to render `IngredientChip` components:
      - For single-select (`multiSelect: false`): `isSelected = selected === optionName`
      - For multi-select (`multiSelect: true`): `isSelected = Array.isArray(selected) && selected.includes(optionName)`
    - Example rendered output:
      ```
      01
      Choose Your Base
      [ Lemonade ]  [ Tea ]  [ Soda ]  [ Juice ]
      ```
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 11.3, 16.1_

- [ ] 4. Create MocktailBuilder — state, configuration, and selection handlers
  - [ ] 4.1 Implement MocktailBuilder.tsx with state and step configuration
    - Create `app/mocktails/components/MocktailBuilder.tsx` with `"use client"` directive
    - Import `BuilderStep`, `LivePreview`, `Button` (from `@/app/components/ui/Button`), `FadeIn` (from `@/app/components/ui/FadeIn`), and `StepColorScheme` from IngredientChip
    - Define `StepConfig` interface: `id: string`, `stepNumber: string`, `label: string`, `options: string[]`, `colorScheme: StepColorScheme`, `multiSelect: boolean`
    - Define static `STEPS` configuration array with exactly these values:
      - Step 1: id "base", stepNumber "01", label "Choose Your Base", options ["Lemonade", "Tea", "Soda", "Juice"], colorScheme { idle: "bg-frosted-mint/40", hover: "bg-frosted-mint/70", selected: "bg-lime-sorbet", ring: "ring-lime-sorbet" }, multiSelect false
      - Step 2: id "puree", stepNumber "02", label "Choose Your Purée", options ["Mango", "Strawberry", "Raspberry", "Banana", "Peach", "Passionfruit"], colorScheme { idle: "bg-lemon-zest/40", hover: "bg-lemon-zest/70", selected: "bg-peach-nectar", ring: "ring-peach-nectar" }, multiSelect false
      - Step 3: id "syrup", stepNumber "03", label "Choose Your Syrup", options ["Rose", "Lavender", "Mint", "Vanilla", "Dragonfruit"], colorScheme { idle: "bg-rose-petal/40", hover: "bg-rose-petal/70", selected: "bg-berry-crush", ring: "ring-berry-crush" }, multiSelect false
      - Step 4: id "garnishes", stepNumber "04", label "Choose Your Garnishes", options ["Dried Fruit", "Flowers", "Coconut Shreds", "Fresh Fruit", "Candied Ginger", "Herbs", "Glitter"], colorScheme { idle: "bg-blueberry-dew/40", hover: "bg-blueberry-dew/70", selected: "bg-soft-plum", ring: "ring-soft-plum" }, multiSelect true
    - Total ingredient count: exactly 22 chips (4 + 6 + 5 + 7)
    - Declare state: `base: string | null` (initial null), `puree: string | null` (initial null), `syrup: string | null` (initial null), `garnishes: string[]` (initial [])
    - Implement selection handlers:
      - **Single-select (Base, Purée, Syrup):** if clicked chip matches current value → set to null (deselect); otherwise → set to clicked chip name
      - **Multi-select (Garnishes):** if clicked chip is in array → remove it; if not in array → add it; never allow duplicate values
    - Implement `handleReset` function: sets base to null, puree to null, syrup to null, garnishes to []
    - State lives only in React component state — no localStorage, sessionStorage, cookies, URL parameters, analytics, or external persistence
    - _Requirements: 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 6.3, 6.4, 12.1, 12.2, 12.3, 15.1, 15.2, 15.3_

- [ ] 5. Compose MocktailBuilder layout, steps, preview, and inline CTA
  - [ ] 5.1 Implement MocktailBuilder.tsx layout and rendering
    - Render outer `<section>` with `bg-cool-white` and responsive padding: `px-6 py-16 lg:px-12 lg:py-32`
    - Render `max-w-6xl mx-auto` container
    - Render section introduction with `FadeIn`:
      - Headline: "Create Your Own Mocktail" — `font-display text-4xl lg:text-5xl xl:text-6xl text-slate`
      - Supporting copy: "Build a custom mocktail for your celebration by choosing your base, purée, syrup, and garnishes." — `font-body text-slate/75 text-base lg:text-lg`
      - Secondary note: "All drinks come sparkling with club soda unless otherwise requested." — `font-body text-slate/60 text-sm italic`
    - Render four `BuilderStep` instances by mapping over `STEPS` config:
      - Pass `stepNumber`, `label`, `options`, `colorScheme`, `multiSelect` from config
      - Pass appropriate state slice as `selected`: base for step "base", puree for "puree", syrup for "syrup", garnishes for "garnishes"
      - Pass appropriate handler as `onSelect`
      - Wrap each step or group of steps in `FadeIn` for entrance animation
    - **Desktop layout (≥ 768px):** Consistent two-column layout for each step:
      - Left column: step number + step heading (consistent left alignment across all steps)
      - Right column: chip grid
      - All four steps use the SAME alignment system — no alternating left/right
      - Visual rhythm created through: pastel background washes per step, step numbering, typography, spacing, color progression (greens → yellows → pinks → purples)
    - **Mobile layout (< 768px):** Stack all steps vertically with `space-y-12`, generous spacing, oversized headings
    - DOM order: Step 01 → Step 02 → Step 03 → Step 04 → LivePreview → inline CTA
    - Render `LivePreview` with: `base`, `puree`, `syrup`, `garnishes`, `onReset={handleReset}`
    - Render inline booking CTA block (NOT a separate component) with `FadeIn`:
      - Headline: "Have Something Special in Mind?" — `font-display text-2xl lg:text-3xl text-slate`
      - Copy: "We'd love to create a custom mocktail that complements your event, colors, or celebration." — `font-body text-slate/65 text-base lg:text-lg`
      - Button: `<Button href="mailto:lauren@mocknrollbar.com" hoverColor="rose-petal">Book Mock &amp; Roll</Button>`
      - Centered layout, generous top margin
    - _Requirements: 2.1, 2.2, 2.3, 9.1, 9.2, 9.3, 9.4, 11.1, 11.2, 11.4, 16.1, 16.2, 16.3, 17.1_

- [ ] 6. Integrate into page and remove FlavorProfiles
  - [ ] 6.1 Update page.tsx and remove FlavorProfiles
    - In `app/mocktails/page.tsx`:
      - Remove: `import FlavorProfiles from "@/app/mocktails/components/FlavorProfiles";`
      - Add: `import MocktailBuilder from "@/app/mocktails/components/MocktailBuilder";`
      - Replace `<FlavorProfiles />` with `<MocktailBuilder />`
    - Verify final page order: Header → MocktailsHero → SignatureMocktails → MocktailBuilder → MocktailsCTA → Footer
    - Verify these components are NOT modified: Header, MocktailsHero, SignatureMocktails, MocktailsCTA, Footer
    - Delete `app/mocktails/components/FlavorProfiles.tsx`
    - Confirm that the following old content no longer appears anywhere: "Bright & Citrusy", "Berry & Floral", "Crisp & Refreshing", "Peachy & Tropical", "Botanical & Herbal", "Custom Seasonal", "Build a Menu That Fits Your Event"
    - _Requirements: 1.1, 1.2, 13.1, 13.2, 13.3, 13.4, 17.1, 17.2, 17.3_

- [ ] 7. Final validation
  - [ ] 7.1 Run lint, TypeScript check, and production build
    - Run `npm run lint` — must pass with no errors
    - Run `npx tsc --noEmit` — must pass with no type errors
    - Run `npm run build` — must produce a successful production build
    - Verify exactly 22 ingredient chips exist across the four steps (4 + 6 + 5 + 7)
    - Verify FlavorProfiles is no longer imported or rendered anywhere
    - Verify old made-up flavor profile copy no longer appears in the codebase
    - Verify Start Over resets all four state categories (base, puree, syrup, garnishes)
    - Verify Live Preview handles partial selections correctly (no undefined, no empty separators, no dangling punctuation)
    - Verify all interactive chips render `aria-pressed` attribute
    - Verify booking CTA uses `mailto:lauren@mocknrollbar.com`
    - Verify page order: Header → MocktailsHero → SignatureMocktails → MocktailBuilder → MocktailsCTA → Footer
    - Verify responsive layout at 375px, 390px, 430px, 768px, 1024px, 1440px:
      - No horizontal page overflow from any chip
      - Long labels ("Coconut Shreds", "Candied Ginger") remain readable
      - Chips wrap naturally
      - Touch targets remain at least 44px high
      - Step headings do not collide with content
      - Live Preview remains readable on narrow screens
      - CTA remains properly spaced
      - Four steps remain in correct order (01 → 02 → 03 → 04)
    - _Requirements: 12.4, 11.4_

## Notes

- No `BuilderCTA.tsx` component is created — the inline CTA lives in `MocktailBuilder.tsx` per the approved design
- No property-based tests are included because the design states PBT is not applicable for this fixed-domain UI feature
- The project has no test framework configured — validation relies on TypeScript, ESLint, and production build
- All brand colors are confirmed to exist in `globals.css` via the `@theme` block — no Tailwind config changes needed
- The shared `Button` and `FadeIn` components from `app/components/ui/` are reused
- The existing `MocktailsCTA` at the bottom of the page is a separate page-level section and is NOT modified
- Static ingredient configuration is co-located in `MocktailBuilder.tsx` per the approved design

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["3.1"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["7.1"] }
  ]
}
```
