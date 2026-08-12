# Design Document: Create Your Own Mocktail

## Overview

Replace the static FlavorProfiles section on the Mocktails page with an interactive "Create Your Own Mocktail" builder. The builder walks visitors through four ingredient steps (Base, Purée, Syrup, Garnishes), renders selections as pastel pill-shaped chips, and displays a live editorial summary of the composed drink. The experience is purely demonstrative — no backend, no persistence, no ordering. A booking CTA follows the builder.

The component is a single client-side React component tree using `useState` for all selection state. It integrates into the existing page by replacing the `FlavorProfiles` import with the new `MocktailBuilder` import.

## Architecture

### Component Placement

Following project organization rules, all new components live in `app/mocktails/components/` since they are page-specific:

```
app/mocktails/components/
  MocktailBuilder.tsx       ← Top-level client component ("use client")
  BuilderStep.tsx           ← Renders one step: number, label, chip grid
  IngredientChip.tsx        ← Single pill-shaped button
  LivePreview.tsx           ← Editorial summary of selections + Start Over
```

`BuilderCTA` is NOT a separate component. The existing project pattern (see `MocktailsCTA.tsx`) shows that small CTA blocks are inlined or are full page-level sections. Since the builder's closing CTA is a small block within the `MocktailBuilder` section (not a standalone page section), it will be rendered directly inside `MocktailBuilder.tsx` using the shared `Button` and `FadeIn` components. This avoids unnecessary component proliferation for a simple static block.

### Integration Point

In `app/mocktails/page.tsx`:
- Remove: `import FlavorProfiles from "@/app/mocktails/components/FlavorProfiles";`
- Add: `import MocktailBuilder from "@/app/mocktails/components/MocktailBuilder";`
- Replace `<FlavorProfiles />` with `<MocktailBuilder />`

All other page sections (MocktailsHero, SignatureMocktails, MocktailsCTA, Header, Footer) remain untouched.

### Page Order (Final)

```
Header
MocktailsHero
SignatureMocktails
MocktailBuilder          ← replaces FlavorProfiles
MocktailsCTA
Footer
```

### Rendering Strategy

- `MocktailBuilder` is marked `"use client"` because it manages interactive state.
- The page itself (`page.tsx`) remains a Server Component with its `metadata` export intact.
- Shared UI (`Button`, `FadeIn`) is reused from `app/components/ui/`.

## Components and Interfaces

### MocktailBuilder

The top-level component that owns all selection state and composes the section.

**Responsibilities:**
- Declare and manage state for all four selection categories
- Render section headline and supporting copy
- Map over step configuration data to render `BuilderStep` instances
- Render `LivePreview` with current selections
- Render inline booking CTA at the bottom (reusing shared `Button` component)

**Props:** None (self-contained section component)

**State:**
- `base: string | null` — selected base name or null
- `puree: string | null` — selected purée name or null
- `syrup: string | null` — selected syrup name or null
- `garnishes: string[]` — array of selected garnish names

**Inline CTA block:**
- Headline: "Have Something Special in Mind?"
- Copy: "We'd love to create a custom mocktail that complements your event, colors, or celebration."
- Button: "Book Mock & Roll" → `mailto:lauren@mocknrollbar.com`
- Uses shared `Button` component with `hoverColor="rose-petal"` (differentiates from the page-level MocktailsCTA which uses `arctic-mist`)

### BuilderStep

Renders a single customization step: a step number, step label, and a grid of `IngredientChip` components.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `stepNumber` | `string` | Two-digit step number ("01", "02", "03", "04") |
| `label` | `string` | Step heading text (e.g. "Choose Your Base") |
| `options` | `string[]` | Ingredient names for this step |
| `selected` | `string \| string[] \| null` | Current selection(s) |
| `onSelect` | `(name: string) => void` | Callback when a chip is clicked |
| `colorScheme` | `StepColorScheme` | Step-specific color tokens |
| `multiSelect` | `boolean` | Whether multiple selections are allowed |

**Step Number Display:**
The step number renders as a visually secondary element above or beside the step heading. It communicates progression without competing with the heading.

```
01
Choose Your Base
[ Lemonade ]  [ Tea ]  [ Soda ]  [ Juice ]
```

Typography: `font-body text-sm font-semibold tracking-widest uppercase text-slate/40`

### IngredientChip

A single pill-shaped interactive button representing one ingredient option.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Ingredient display name |
| `isSelected` | `boolean` | Whether this chip is currently selected |
| `onSelect` | `() => void` | Click/press handler |
| `colorScheme` | `StepColorScheme` | Colors for idle, hover, and selected states |

**Rendered element:** `<button>` with `aria-pressed` attribute.

### LivePreview

Displays a formatted editorial summary of the current mocktail composition and a "Start Over" control.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `base` | `string \| null` | Selected base |
| `puree` | `string \| null` | Selected purée |
| `syrup` | `string \| null` | Selected syrup |
| `garnishes` | `string[]` | Selected garnishes |
| `onReset` | `() => void` | Callback to clear all selections |

**Behavior:**
- Hidden (or shows neutral placeholder) when all selections are null/empty
- Displays only the categories that have a selection — never shows undefined, null, empty separators, or dangling punctuation
- Includes "Sparkling with club soda" once at least one selection exists
- Shows "Start Over" button when at least one selection has been made

## Data Models

### Ingredient Data (Static Configuration)

All ingredient data is defined as a constant array in `MocktailBuilder.tsx` — no external data fetching.

```typescript
interface StepColorScheme {
  idle: string;       // Tailwind bg class for unselected state
  hover: string;      // Tailwind bg class for hover state
  selected: string;   // Tailwind bg class for selected state
  ring: string;       // Tailwind ring class for focus-visible
}

interface StepConfig {
  id: string;
  stepNumber: string;
  label: string;
  options: string[];
  colorScheme: StepColorScheme;
  multiSelect: boolean;
}
```

### Step Configuration

| Step | Number | Label | Options | Colors (idle / selected) | Multi-select |
|------|--------|-------|---------|--------------------------|--------------|
| 1 | "01" | "Choose Your Base" | Lemonade, Tea, Soda, Juice | frosted-mint / lime-sorbet | No |
| 2 | "02" | "Choose Your Purée" | Mango, Strawberry, Raspberry, Banana, Peach, Passionfruit | lemon-zest / peach-nectar | No |
| 3 | "03" | "Choose Your Syrup" | Rose, Lavender, Mint, Vanilla, Dragonfruit | rose-petal / berry-crush | No |
| 4 | "04" | "Choose Your Garnishes" | Dried Fruit, Flowers, Coconut Shreds, Fresh Fruit, Candied Ginger, Herbs, Glitter | blueberry-dew / soft-plum | Yes |

### Color Validation

All proposed color utilities are confirmed to exist in the project's `app/globals.css` `@theme` block:

| Color name | CSS variable | Hex |
|------------|-------------|-----|
| frosted-mint | `--color-frosted-mint` | #E0EFEC |
| lime-sorbet | `--color-lime-sorbet` | #D2E8B2 |
| lemon-zest | `--color-lemon-zest` | #F7D656 |
| peach-nectar | `--color-peach-nectar` | #FFD4A8 |
| rose-petal | `--color-rose-petal` | #FEE3EE |
| berry-crush | `--color-berry-crush` | #FCB2C7 |
| blueberry-dew | `--color-blueberry-dew` | #D6DEFF |
| soft-plum | `--color-soft-plum` | #CDB9E8 |
| cool-white | `--color-cool-white` | #FCF4E8 |
| slate | `--color-slate` | #324648 |

Tailwind v4 with the `@theme` directive automatically generates utility classes from these variables (e.g., `bg-frosted-mint`, `bg-frosted-mint/40`, `text-slate`). No new color definitions are needed.

### Selection State Shape

```typescript
interface BuilderState {
  base: string | null;
  puree: string | null;
  syrup: string | null;
  garnishes: string[];
}
```

Initial state: `{ base: null, puree: null, syrup: null, garnishes: [] }`

### Selection Logic

- **Single-select steps (Base, Purée, Syrup):** Clicking a chip sets state to that value. Clicking the already-selected chip deselects it (sets to null).
- **Multi-select step (Garnishes):** Clicking a chip toggles it in/out of the array.
- **Start Over:** Resets entire state to initial values.

### Live Preview Formatting

The preview is NOT a single concatenated string. It is built from individual segments, rendering only those categories that have a selection.

**Structure:**

```
Your Mocktail
─────────────
[Base]
+ [Purée] Purée
+ [Syrup] Syrup
+ [Garnish(es)]

Sparkling with club soda
```

**Rules:**
- Each line renders only if that category has a value
- The "+" separator only appears before a segment that has a preceding segment
- "Sparkling with club soda" always appears once at least one selection exists
- No undefined, null, empty separators, placeholder tokens, or dangling punctuation

**Garnish formatting — natural-language joining:**
- 1 garnish: `Fresh Fruit`
- 2 garnishes: `Fresh Fruit & Flowers`
- 3+ garnishes: `Fresh Fruit, Flowers & Candied Ginger`

**Example states:**

Only base selected:
```
Your Mocktail
Lemonade
Sparkling with club soda
```

Base + Purée + Syrup selected:
```
Your Mocktail
Lemonade
+ Raspberry Purée
+ Rose Syrup
Sparkling with club soda
```

All categories selected:
```
Your Mocktail
Lemonade
+ Raspberry Purée
+ Rose Syrup
+ Fresh Fruit & Flowers
Sparkling with club soda
```

The preview should feel like an editorial recipe card, not a technical configuration summary.

### Start Over Behavior

- A "Start Over" text button appears within or immediately adjacent to the Live Preview once at least one selection has been made
- Activating it clears: base → null, puree → null, syrup → null, garnishes → []
- Hidden when no selections exist
- Styled as a subtle text link/button — NOT a primary CTA
- Semantic `<button>` element
- Typography: `font-body text-sm text-slate/50 underline hover:text-slate/75`

## Styling Strategy

### Chip Design

- Fully rounded: `rounded-full` (maps to `border-radius: 9999px`)
- No borders, checkboxes, radio buttons, or dropdowns
- Minimum touch target: `min-h-[44px] min-w-[44px] px-5 py-2.5`
- Font: `font-body font-medium text-sm`
- Text color: `text-slate` in all states
- Transition: `transition-colors duration-200`

### Color Mapping Per Step

Each step uses two brand pastels — one for idle/hover, one for selected:

| Step | Idle bg | Hover bg | Selected bg |
|------|---------|----------|-------------|
| Base | `bg-frosted-mint/40` | `bg-frosted-mint/70` | `bg-lime-sorbet` |
| Purée | `bg-lemon-zest/40` | `bg-lemon-zest/70` | `bg-peach-nectar` |
| Syrup | `bg-rose-petal/40` | `bg-rose-petal/70` | `bg-berry-crush` |
| Garnishes | `bg-blueberry-dew/40` | `bg-blueberry-dew/70` | `bg-soft-plum` |

### Section Background

The builder section uses `bg-cool-white` to differentiate from the SignatureMocktails section above it and the MocktailsCTA section below.

### Typography

- Section headline: `font-display text-4xl lg:text-5xl xl:text-6xl text-slate`
- Supporting copy: `font-body text-slate/75 text-base lg:text-lg`
- Step numbers: `font-body text-sm font-semibold tracking-widest uppercase text-slate/40`
- Step labels: `font-display text-2xl lg:text-3xl text-slate`
- Chip text: `font-body font-medium text-sm text-slate`
- Live preview headline: `font-display text-xl lg:text-2xl text-slate`
- Live preview ingredients: `font-body text-base lg:text-lg text-slate/80`
- Live preview sparkling note: `font-body text-sm text-slate/60 italic`
- Start Over: `font-body text-sm text-slate/50 underline hover:text-slate/75`

## Responsive Layout

### Mobile (< 768px)

- All steps stack vertically in DOM order: Step 1 → Step 2 → Step 3 → Step 4
- Generous vertical spacing: `space-y-12` between steps
- Chips flow in a wrapping flex container: `flex flex-wrap gap-3`
- Oversized editorial headings per the requirement
- Full-width section padding: `px-6 py-16`
- Step numbers appear above headings
- Live Preview appears after all four steps
- Long chip labels (e.g., "Coconut Shreds", "Candied Ginger") wrap to a new line naturally without overflow

### Desktop (≥ 768px)

- **Consistent two-column layout** — NOT alternating left/right alignment:
  - Left column: Step number + step heading (consistent left alignment)
  - Right column: Chip grid
  - All four steps follow the same alignment system
- Visual rhythm is created through:
  - Distinct pastel background washes per step (subtle full-width color bands)
  - Step numbering (01, 02, 03, 04)
  - Typography scale and weight
  - Generous vertical spacing between steps
  - The color palette shifting from greens → yellows → pinks → purples as progression moves forward
- DOM order matches visual reading order: Step 1 → Step 2 → Step 3 → Step 4
- Section padding: `px-12 py-32`
- Max width container: `max-w-6xl mx-auto`
- Chips still use flex-wrap — no horizontal scrolling
- Live Preview appears after Step 4, spanning full width or right-aligned

**Important:** Do NOT create visual rhythm by arbitrarily alternating left/right alignment between steps. The progression must feel predictable and scannable.

### Breakpoint Validation

The layout must render without overflow or truncation at:
- **375px** — smallest common iPhone (SE)
- **390px** — iPhone 14/15
- **430px** — iPhone 14/15 Pro Max
- **768px+** — tablet/desktop

Verification checklist:
- No ingredient chip causes horizontal page overflow
- Long labels ("Coconut Shreds", "Candied Ginger") remain readable
- Chips wrap naturally (never `overflow-x-scroll`)
- Touch targets remain at least 44px high
- Step headings do not collide with content
- Live Preview remains readable on narrow screens
- Step numbers remain visible and properly spaced

## Accessibility

### Semantic Markup

- Each chip is a native `<button>` element
- `aria-pressed="true"` on selected chips, `aria-pressed="false"` on unselected
- Step labels use heading elements (`<h3>`) for screen reader navigation
- Section wrapped in `<section>` with an accessible label via the headline
- "Start Over" uses a `<button>` element

### Keyboard Interaction

- All chips are focusable via Tab
- Enter and Space toggle/select the chip (native button behavior)
- Visible focus ring using the global `focus-visible` styles already in `globals.css`
- "Start Over" is keyboard-accessible

### Touch Targets

- All chips meet 44×44px minimum via `min-h-[44px] min-w-[44px]` constraints
- Adequate spacing between chips (`gap-3`) prevents accidental taps

## CTA Reuse Strategy

The builder's inline CTA reuses the existing shared `Button` component from `app/components/ui/Button.tsx`:
- Same pill shape, slate background, pastel hover behavior
- Same `href` pattern: `mailto:lauren@mocknrollbar.com`
- Different `hoverColor` prop value (`rose-petal`) to visually differentiate from the page-level `MocktailsCTA` which uses `arctic-mist`
- The `FadeIn` component is also reused for the CTA block's entrance animation

No new button styles or components are created. The booking destination is identical to what is already used site-wide.

## Error Handling

Since this feature has no backend, API calls, or persistence, error handling is minimal:

- **No selections:** The Live Preview gracefully hides or shows placeholder text. No error state needed.
- **Invalid state:** Not possible given the constrained UI — users can only click predefined chips.
- **JavaScript disabled:** The page will render without interactivity. The section will be present in the DOM but chips won't respond to clicks. This is acceptable for an exploratory/demonstrative feature.

## Correctness Properties

Given the purely UI-driven, fixed-domain nature of this component, the following invariants apply:

### Property 1: Single-Select Exclusivity

For each single-select step (Base, Purée, Syrup), at most one chip may be in the selected state at any time. Selecting a new chip in a single-select step must deselect the previously selected chip in that same step.

**Validates: Requirements 3.3, 3.4, 4.3, 4.4, 5.3, 5.4**

### Property 2: State Completeness

The Live Preview must display exactly those categories that have a non-null selection — no more, no fewer. No undefined values, empty separators, or placeholder tokens may appear.

**Validates: Requirements 14.1, 14.2, 14.4**

### Property 3: Garnish Set Integrity

The garnishes array never contains duplicate values. Toggling a garnish that is already selected removes it; toggling one that is not selected adds it.

**Validates: Requirements 6.3, 6.4**

### Property 4: Reset Totality

After a "Start Over" action, the state must equal the initial state (`{ base: null, puree: null, syrup: null, garnishes: [] }`). The Live Preview must return to its hidden/placeholder state.

**Validates: Requirements 15.4, 15.5**

### Property 5: DOM Order Equals Reading Order

Step elements appear in the DOM in order 1, 2, 3, 4 regardless of viewport width. No CSS or layout technique may reorder steps visually relative to their DOM position.

**Validates: Requirements 16.1, 16.2**

### Property 6: Ingredient Fidelity

The rendered chip labels must exactly match the source-of-truth ingredient lists — no invented, omitted, or modified names. The total chip count across all steps must equal exactly 22 (4 + 6 + 5 + 7).

**Validates: Requirements 3.2, 4.2, 5.2, 6.2**

## Testing Strategy

### Unit Tests (Example-Based)

- Verify the correct number of chips renders per step (4, 6, 5, 7)
- Verify single-select behavior: selecting one chip deselects the previous
- Verify multi-select behavior: garnish chips toggle independently
- Verify `aria-pressed` attribute toggles correctly
- Verify Live Preview shows only selected categories
- Verify Live Preview hidden state when no selections exist
- Verify garnish natural-language formatting (1, 2, 3+ items)
- Verify Start Over clears all state

### Integration Tests

- Render `MocktailBuilder` and simulate a full selection flow across all four steps
- Verify the Live Preview renders the expected composition
- Verify the CTA button has the correct mailto href
- Verify Start Over returns to initial state

### Accessibility Tests

- Automated axe/jest-axe scan of the rendered component
- Verify all chips are `<button>` elements with `aria-pressed`
- Verify keyboard interaction (Enter/Space toggles selection)

### Visual/Responsive Tests

- Manual verification at 375px, 390px, 430px, and 768px+ breakpoints
- Verify no horizontal overflow at narrow widths
- Verify chip wrap behavior
- Verify step numbers display correctly
- Verify Live Preview readability on narrow screens

### Preservation Tests

- Verify MocktailsHero, SignatureMocktails, MocktailsCTA, Header, Footer are unchanged
- Verify FlavorProfiles component and content no longer appear
