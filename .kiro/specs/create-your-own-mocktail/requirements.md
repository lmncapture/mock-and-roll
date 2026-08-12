# Requirements Document

## Introduction

Replace the existing "Build a Menu That Fits Your Event" / FlavorProfiles section on the Mock & Roll Mocktails page with a new "Create Your Own Mocktail" interactive builder section. The builder provides a four-step editorial experience where visitors explore custom mocktail combinations by selecting a base, purée, syrup, and garnishes. The feature is purely exploratory and demonstrative — no pricing, ordering, or database persistence is involved. The section concludes with a booking CTA that links to the existing email destination.

## Glossary

- **Builder**: The interactive "Create Your Own Mocktail" client component that manages selection state across four customization steps
- **Step**: One of four sequential customization categories (Base, Purée, Syrup, Garnishes) presented within the Builder
- **Chip**: A pill-shaped, interactive button element representing a single ingredient option within a Step
- **Live_Preview**: An editorial summary block that dynamically displays the user's current mocktail composition as selections are made
- **Booking_CTA**: The section-ending call-to-action that directs users to book Mock & Roll via email
- **Mocktails_Page**: The existing Next.js page at `app/mocktails/page.tsx` that hosts the Builder
- **FlavorProfiles_Section**: The existing section component to be removed and replaced by the Builder

## Requirements

### Requirement 1: Remove FlavorProfiles Section

**User Story:** As a site maintainer, I want the old FlavorProfiles section completely removed, so that the Mocktails page reflects the new Create Your Own Mocktail experience.

#### Acceptance Criteria

1. WHEN the Mocktails_Page renders, THE Mocktails_Page SHALL NOT include the FlavorProfiles_Section component or any of its content
2. WHEN the Mocktails_Page renders, THE Mocktails_Page SHALL display the Builder in the position previously occupied by the FlavorProfiles_Section

### Requirement 2: Section Headline and Introductory Copy

**User Story:** As a visitor, I want to see a clear headline and description for the builder, so that I understand the purpose of the interactive section.

#### Acceptance Criteria

1. THE Builder SHALL display the headline "Create Your Own Mocktail" using the display font family
2. THE Builder SHALL display the supporting copy "Build a custom mocktail for your celebration by choosing your base, purée, syrup, and garnishes."
3. THE Builder SHALL display a secondary note stating "All drinks come sparkling with club soda unless otherwise requested."

### Requirement 3: Step 1 — Base Selection

**User Story:** As a visitor, I want to choose a drink base, so that I can start building my custom mocktail.

#### Acceptance Criteria

1. THE Builder SHALL present Step 1 with the label "Choose Your Base"
2. THE Builder SHALL display exactly four base options: Lemonade, Tea, Soda, Juice
3. WHEN a visitor selects a base Chip, THE Builder SHALL mark that Chip as selected and deselect any previously selected base Chip
4. THE Builder SHALL allow exactly one base selection at a time

### Requirement 4: Step 2 — Purée Selection

**User Story:** As a visitor, I want to choose a purée flavor, so that I can customize the fruit profile of my mocktail.

#### Acceptance Criteria

1. THE Builder SHALL present Step 2 with the label "Choose Your Purée"
2. THE Builder SHALL display exactly six purée options: Mango, Strawberry, Raspberry, Banana, Peach, Passionfruit
3. WHEN a visitor selects a purée Chip, THE Builder SHALL mark that Chip as selected and deselect any previously selected purée Chip
4. THE Builder SHALL allow exactly one purée selection at a time

### Requirement 5: Step 3 — Syrup Selection

**User Story:** As a visitor, I want to choose a syrup flavor, so that I can add a signature sweetness to my mocktail.

#### Acceptance Criteria

1. THE Builder SHALL present Step 3 with the label "Choose Your Syrup"
2. THE Builder SHALL display exactly five syrup options: Rose, Lavender, Mint, Vanilla, Dragonfruit
3. WHEN a visitor selects a syrup Chip, THE Builder SHALL mark that Chip as selected and deselect any previously selected syrup Chip
4. THE Builder SHALL allow exactly one syrup selection at a time

### Requirement 6: Step 4 — Garnish Selection

**User Story:** As a visitor, I want to choose one or more garnishes, so that I can personalize the presentation of my mocktail.

#### Acceptance Criteria

1. THE Builder SHALL present Step 4 with the label "Choose Your Garnishes"
2. THE Builder SHALL display exactly seven garnish options: Dried Fruit, Flowers, Coconut Shreds, Fresh Fruit, Candied Ginger, Herbs, Glitter
3. WHEN a visitor selects a garnish Chip, THE Builder SHALL toggle that Chip between selected and unselected states
4. THE Builder SHALL allow multiple simultaneous garnish selections

### Requirement 7: Chip Visual Design

**User Story:** As a visitor, I want ingredient options to appear as soft pill-shaped elements with pastel colors, so that the experience feels premium and editorial.

#### Acceptance Criteria

1. THE Builder SHALL render each ingredient option as a pill-shaped Chip with fully rounded corners
2. THE Builder SHALL apply step-specific brand pastel color palettes: Step 1 uses Lime Sorbet and Frosted Mint, Step 2 uses Peach Nectar and Lemon Zest, Step 3 uses Rose Petal and Berry Crush, Step 4 uses Blueberry Dew and Soft Plum
3. WHEN a visitor hovers over a Chip, THE Builder SHALL display a subtle hover state using the step color palette
4. WHEN a Chip is in the selected state, THE Builder SHALL display a visually distinct selected state using the step color palette
5. THE Builder SHALL NOT render checkboxes, radio buttons, dropdowns, or hard borders on any Chip

### Requirement 8: Live Preview

**User Story:** As a visitor, I want to see a live summary of my selections, so that I can review my custom mocktail composition as I build it.

#### Acceptance Criteria

1. WHILE at least one selection has been made, THE Live_Preview SHALL display an editorial summary of the current mocktail composition
2. WHEN selections change, THE Live_Preview SHALL update immediately to reflect the current state
3. THE Live_Preview SHALL format the summary as "[Base] + [Purée] Purée + [Syrup] Syrup + [Garnish(es)] — Sparkling with club soda"
4. WHILE no selections have been made, THE Live_Preview SHALL remain hidden or display placeholder guidance text

### Requirement 9: Booking CTA

**User Story:** As a visitor, I want a clear call-to-action after the builder, so that I can inquire about booking Mock & Roll for my event.

#### Acceptance Criteria

1. THE Booking_CTA SHALL display the headline "Have Something Special in Mind?"
2. THE Booking_CTA SHALL display the copy "We'd love to create a custom mocktail that complements your event, colors, or celebration."
3. THE Booking_CTA SHALL display a "Book Mock & Roll" button that links to mailto:lauren@mocknrollbar.com
4. THE Booking_CTA SHALL appear after the Builder steps and Live_Preview within the same section

### Requirement 10: Accessibility

**User Story:** As a visitor using assistive technology, I want the builder to be fully accessible, so that I can use the customization experience with a keyboard and screen reader.

#### Acceptance Criteria

1. THE Builder SHALL render each Chip as a semantic `<button>` element
2. THE Builder SHALL apply `aria-pressed="true"` to selected Chips and `aria-pressed="false"` to unselected Chips
3. WHEN a visitor navigates via keyboard, THE Builder SHALL display a visible focus indicator on the focused Chip
4. THE Builder SHALL render each Chip with a minimum touch target size of 44px by 44px
5. WHEN a visitor presses Enter or Space on a focused Chip, THE Builder SHALL toggle or select that Chip identically to a click interaction

### Requirement 11: Responsive Layout

**User Story:** As a visitor on any device, I want the builder to adapt gracefully to my screen size, so that the experience remains usable and editorial on both mobile and desktop.

#### Acceptance Criteria

1. WHILE the viewport width is below 768px, THE Builder SHALL stack all Steps vertically with generous spacing and oversized editorial headings
2. WHILE the viewport width is 768px or greater, THE Builder SHALL present Steps in an editorial two-column or staggered layout with visual rhythm
3. THE Builder SHALL allow Chips to wrap naturally within their container without triggering horizontal scrolling
4. THE Builder SHALL render correctly at viewport widths of 375px, 390px, and 430px without layout overflow or content truncation

### Requirement 12: Non-functional Constraints

**User Story:** As a site maintainer, I want the builder to have no backend dependencies or ordering functionality, so that the feature remains lightweight and exploratory.

#### Acceptance Criteria

1. THE Builder SHALL NOT include any pricing, cart, checkout, or ordering functionality
2. THE Builder SHALL NOT persist selections to any database or external service
3. THE Builder SHALL be implemented as a client component using React state management only
4. THE Builder SHALL pass TypeScript type checking, ESLint linting, and produce a successful production build

### Requirement 13: Preservation of Existing Page Sections

**User Story:** As a site maintainer, I want all other Mocktails page sections unchanged, so that only the FlavorProfiles section is replaced.

#### Acceptance Criteria

1. THE Mocktails_Page SHALL continue to render the MocktailsHero component without modification
2. THE Mocktails_Page SHALL continue to render the SignatureMocktails component without modification
3. THE Mocktails_Page SHALL continue to render the existing MocktailsCTA component without modification
4. THE Mocktails_Page SHALL continue to render the Header and Footer components without modification

### Requirement 14: Partial Selection Behavior

**User Story:** As a visitor, I want the live preview to remain understandable while I am still building my mocktail, so that incomplete selections do not create awkward or confusing copy.

#### Acceptance Criteria

1. WHEN only some categories have selections, THE Live_Preview SHALL display only the categories that have been selected
2. THE Live_Preview SHALL NOT display empty separators, undefined values, placeholder tokens, or incomplete ingredient labels
3. WHEN multiple garnishes are selected, THE Live_Preview SHALL join garnish names using natural readable punctuation
4. WHEN no selections have been made, THE Live_Preview SHALL display neutral guidance or remain visually hidden
5. THE Live_Preview SHALL always include "Sparkling with club soda" once at least one selection has been made

### Requirement 15: Selection State and Reset Behavior

**User Story:** As a visitor, I want the builder to behave predictably during my session, so that selections are easy to understand and temporary.

#### Acceptance Criteria

1. THE Builder SHALL maintain selections only in local React component state
2. THE Builder SHALL reset all selections when the page is refreshed or revisited in a new session
3. THE Builder SHALL NOT write selections to localStorage, sessionStorage, cookies, URL parameters, analytics payloads, or external services
4. THE Builder MAY provide a subtle "Start Over" control if it fits the existing editorial design
5. IF a "Start Over" control is included, activating it SHALL clear Base, Purée, Syrup, and all Garnish selections

### Requirement 16: Desktop Reading Order

**User Story:** As a desktop visitor, I want the editorial layout to remain visually interesting without making the customization sequence confusing.

#### Acceptance Criteria

1. THE Builder SHALL preserve the logical reading order Step 1 → Step 2 → Step 3 → Step 4 in both DOM order and visual presentation
2. THE Builder MAY use staggered or asymmetrical positioning, but it SHALL NOT visually imply that steps should be completed out of order
3. THE Live_Preview SHALL appear after or alongside the steps in a way that does not interrupt the Step 1 → Step 4 sequence

### Requirement 17: Page Order Preservation

**User Story:** As a site maintainer, I want the Mocktails page structure preserved, so that the new builder replaces only the obsolete section.

#### Acceptance Criteria

1. THE Mocktails_Page SHALL render sections in this order: Header, MocktailsHero, SignatureMocktails, Create Your Own Mocktail Builder, MocktailsCTA, Footer
2. THE Builder SHALL occupy the same page position previously occupied by FlavorProfiles
3. THE implementation SHALL NOT introduce additional sections before or after the Builder
