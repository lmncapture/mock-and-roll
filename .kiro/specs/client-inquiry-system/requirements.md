# Requirements Document

## Introduction

The Mock & Roll Client Inquiry System is a full-stack feature that enables prospective clients to submit event inquiries through a public form at `/inquiries`. The system captures client contact details (including phone number), event information, package selection with eligibility validation, package-dependent drink choices (signature mocktails or custom mocktail configurations), and additional notes. Submissions are validated and normalized server-side, persisted atomically to Supabase via a transactional RPC, and trigger a notification email via Resend. A private admin dashboard allows authorized team members to review, search, filter, sort, and manage inquiries using URL-driven state.

The interactive "Create Your Own Mocktail" builder is one component within this system — it appears conditionally inside individual drink selection slots when a visitor chooses "Create Your Own" rather than a signature mocktail. The public `/mocktails` page remains a static showcase.

## Glossary

- **Inquiry**: A complete event inquiry submission from a prospective client, stored in Supabase
- **Inquiry_Reference**: A human-friendly unique identifier (e.g., MR-2026-XXXXXX) for internal staff communication, distinct from the database UUID
- **Inquiry_Form**: The public-facing form at `/inquiries` that collects all client, event, package, and drink information
- **Package**: One of the official Mock & Roll service tiers (Signature Experience, Celebration Experience, Premier Experience, Reserve Experience)
- **Package_Eligibility**: The business rule governing which packages are valid for a given guest count
- **Drink_Slot**: A single drink selection position within an inquiry, determined by the selected package's allowed drink count
- **Signature_Mocktail**: An official pre-designed Mock & Roll drink (Hibiscus Blossom, Ginger Dragon, Garden Sparkler, Pineapple Sunrise)
- **Custom_Mocktail**: A visitor-configured drink composed of one base, one purée, one syrup, and optional garnishes
- **Create_Your_Own_Builder**: The interactive four-step ingredient selector that appears within a Drink_Slot when "Create Your Own" is chosen
- **Admin_Dashboard**: The private interface at `/admin` for managing inquiries, accessible only to authenticated admin users
- **Admin_User**: A Supabase-authenticated user with a corresponding record in the admin_users table
- **Privileged_Client**: The server-only Supabase client using SUPABASE_SECRET_KEY for bypassing RLS
- **Transactional_RPC**: A PostgreSQL function that creates an inquiry and all related records within a single database transaction

## Requirements

### Requirement 1: Public Inquiry Route

**User Story:** As a prospective client, I want a dedicated page where I can submit an event inquiry, so that I can request Mock & Roll's services for my celebration.

#### Acceptance Criteria

1. THE system SHALL serve the Inquiry_Form at the route `/inquiries`
2. THE Inquiry_Form page SHALL display the headline "Tell Us About Your Event" using the display font family (Just Cosmic)
3. THE Inquiry_Form page SHALL include the site Header and Footer components
4. THE Inquiry_Form page SHALL export page metadata with a unique title and description
5. THE navigation item labeled "Inquiries" SHALL link to `/inquiries` instead of `mailto:lauren@mocknrollbar.com`
6. WHERE a "Book Mock & Roll" CTA clearly represents starting an event inquiry, THE CTA SHALL link to `/inquiries`
7. THE Inquiry_Form page SHALL match the Mock & Roll visual system: premium, bright, airy, editorial, generous spacing, official pastel palette, Slate typography, Just Cosmic headings, Outfit body/form text, rounded input styling
8. THE Inquiry_Form SHALL NOT resemble SaaS onboarding, CRM software, a generic contact form, or a dense enterprise form

### Requirement 2: About You Section

**User Story:** As a prospective client, I want to provide my contact information, so that the Mock & Roll team can reach me about my inquiry.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL present Section 01 labeled "About You"
2. THE Inquiry_Form SHALL collect a first name field (field: first_name) that is required, accepts text input, and enforces a reasonable maximum length
3. THE Inquiry_Form SHALL collect a last name field (field: last_name) that is required, accepts text input, and enforces a reasonable maximum length
4. THE Inquiry_Form SHALL collect an email field (field: email) that is required and validates as a properly formatted email address
5. THE Inquiry_Form SHALL collect a phone number field (field: phone_number) that is required, uses `<input type="tel">` with `autocomplete="tel"`, and accepts common phone formats including: 4255551234, 425-555-1234, (425) 555-1234, +1 425 555 1234
6. THE phone number field SHALL NOT force visitors into one visual format while typing
7. THE phone number field SHALL have a visible associated label, communicate that it is required, and expose validation errors accessibly
8. WHEN a required field in Section 01 is empty at submission, THE Inquiry_Form SHALL display a validation error for that field

### Requirement 3: Your Event Section

**User Story:** As a prospective client, I want to describe my event details, so that Mock & Roll understands the occasion, size, and logistics.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL present Section 02 labeled "Your Event"
2. THE Inquiry_Form SHALL collect an event date (field: event_date) using a date input that is required
3. THE event date SHALL NOT accept dates in the past; the server SHALL validate that event_date >= the current local business date
4. THE Inquiry_Form SHALL collect an event type (field: event_type) from these options: Wedding, Bridal Shower, Baby Shower, Birthday, Corporate Event, Networking Event, Community Event, Private Party, Family Event, Other
5. WHEN "Other" is selected as event type, THE Inquiry_Form SHALL reveal an additional text field (field: event_type_other) for specifying the event type, and that field SHALL be required
6. WHEN event type is not "Other," THE additional event type field SHALL be hidden and not required
7. THE Inquiry_Form SHALL collect an estimated guest count (field: estimated_guest_count) that is required and must be a positive integer greater than zero
8. THE Inquiry_Form SHALL collect an event location (field: event_location) as a text field that is required, allows venue name, city, or general address, and enforces a reasonable maximum length
9. THE Inquiry_Form SHALL collect an event start time (field: event_time) using a time input that is required

### Requirement 4: Package Selection and Eligibility

**User Story:** As a prospective client, I want to choose a service package that fits my event size, so that Mock & Roll knows the tier of service I'm interested in and can validate my selection.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL present Section 03 labeled "Package"
2. THE Inquiry_Form SHALL display the current official Mock & Roll packages as selection options: Signature Experience, Celebration Experience, Premier Experience, Reserve Experience
3. EACH package option SHALL display concise guidance sourced from the canonical package configuration including: package name, guest rule, included drink count, and base price or per-person rate
4. THE Inquiry_Form SHALL display helper text stating "Your package can be changed later."
5. THE Inquiry_Form SHALL require a package selection before submission
6. THE system SHALL store both a stable package identifier (package_id) and the package display name at time of submission (package_name_snapshot)
7. THE package options SHALL be sourced from a shared canonical package configuration used across the application
8. THE server SHALL validate package eligibility against guest count: Signature Experience requires estimated_guest_count <= 30; Celebration Experience requires estimated_guest_count > 30
9. WHEN the visitor's guest count makes a selected package ineligible, THE Inquiry_Form SHALL clearly explain the invalid combination and prevent submission
10. WHEN the visitor changes guest count, THE system SHALL re-evaluate package eligibility without silently deleting existing drink selections
11. THE server SHALL independently reject submissions where the package/guest-count combination violates eligibility rules regardless of client-side validation

### Requirement 5: Package-Dependent Drink Count

**User Story:** As a prospective client, I want the form to show me exactly how many drink choices my package includes, so that I can configure the right number of mocktails.

#### Acceptance Criteria

1. WHEN a package is selected, THE Inquiry_Form SHALL display the number of drink selection slots allowed by that package: Signature Experience allows 2, Celebration Experience allows 2, Premier Experience allows 3, Reserve Experience allows 4
2. THE Inquiry_Form SHALL display helper text explaining how many drink selections are allowed for the chosen package
3. WHEN the selected package changes and the current number of configured drinks exceeds the new package's allowed count, THE Inquiry_Form SHALL clearly inform the visitor that adjustments are needed and SHALL prevent submission until the configuration is valid
4. WHEN the selected package changes and the current number of configured drinks is within the new package's allowed count, THE Inquiry_Form SHALL preserve existing drink selections
5. THE server SHALL independently validate that the submitted drink count matches the selected package's allowed count and SHALL reject submissions that violate this rule
6. THE server SHALL NOT trust client-provided drink-count information

### Requirement 6: Drink Choice Structure

**User Story:** As a prospective client, I want to configure each drink for my event individually, so that I can mix signature and custom mocktails.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL present Section 04 labeled "Drink Choices"
2. FOR each drink slot allowed by the selected package, THE Inquiry_Form SHALL display a choice between "Signature Mocktail" and "Create Your Own"
3. THE two options SHALL be mutually exclusive for each individual drink slot
4. EACH drink slot SHALL maintain completely independent state from all other drink slots
5. WHEN a visitor changes a slot from "Create Your Own" to "Signature Mocktail," THE form SHALL NOT include stale custom mocktail configuration in the submitted payload
6. WHEN a visitor changes a slot from "Signature Mocktail" to "Create Your Own," THE form SHALL NOT include the previous signature selection in the submitted payload
7. THE server SHALL normalize submitted data to enforce the selected choice type, removing any stale values from inactive choice types

### Requirement 7: Signature Mocktail Selection

**User Story:** As a prospective client, I want to choose from Mock & Roll's official signature drinks, so that I can select proven favorites for my event.

#### Acceptance Criteria

1. WHEN "Signature Mocktail" is chosen for a drink slot, THE Inquiry_Form SHALL display the official Mock & Roll signature drinks: Hibiscus Blossom, Ginger Dragon, Garden Sparkler, Pineapple Sunrise
2. THE visitor SHALL select exactly one signature drink per slot configured as "Signature Mocktail"
3. THE signature drink options SHALL be sourced from a shared canonical configuration used across the application
4. THE system SHALL store the selected signature drink's identifier and a name snapshot at time of submission
5. THE server SHALL validate that submitted signature drink identifiers belong to the canonical set of allowed values

### Requirement 8: Create Your Own Mocktail Builder

**User Story:** As a prospective client, I want to build a custom mocktail by choosing a base, purée, syrup, and garnishes, so that I can personalize drinks for my celebration.

#### Acceptance Criteria

1. WHEN "Create Your Own" is chosen for a drink slot, THE Inquiry_Form SHALL reveal the Create_Your_Own_Builder for that specific slot
2. THE Create_Your_Own_Builder SHALL present Step 01 "Choose Your Base" with exactly four options: Lemonade, Tea, Soda, Juice — single select, required
3. THE Create_Your_Own_Builder SHALL present Step 02 "Choose Your Purée" with exactly six options: Mango, Strawberry, Raspberry, Banana, Peach, Passionfruit — single select, required
4. THE Create_Your_Own_Builder SHALL present Step 03 "Choose Your Syrup" with exactly five options: Rose, Lavender, Mint, Vanilla, Dragonfruit — single select, required
5. THE Create_Your_Own_Builder SHALL present Step 04 "Choose Your Garnishes" with exactly seven options: Dried Fruit, Flowers, Coconut Shreds, Fresh Fruit, Candied Ginger, Herbs, Glitter — multi-select, optional
6. THE Create_Your_Own_Builder SHALL display the note "All drinks come sparkling with club soda unless otherwise requested."
7. FOR single-select steps, selecting a new option SHALL deselect the previous option in that same step
8. FOR the garnishes step, selecting an active garnish SHALL deselect it, and selecting an inactive garnish SHALL add it; duplicate values SHALL be impossible
9. THE ingredient options SHALL be sourced from a shared canonical configuration

### Requirement 9: Create Your Own Visual Design

**User Story:** As a prospective client, I want the custom drink builder to feel premium and editorial, consistent with the Mock & Roll brand.

#### Acceptance Criteria

1. THE Create_Your_Own_Builder SHALL render each ingredient option as a pill-shaped interactive element with fully rounded corners
2. THE Create_Your_Own_Builder SHALL apply step-specific brand pastel color palettes: Base uses Frosted Mint / Lime Sorbet, Purée uses Lemon Zest / Peach Nectar, Syrup uses Rose Petal / Berry Crush, Garnishes uses Blueberry Dew / Soft Plum
3. EACH ingredient option SHALL be rendered as a semantic `<button type="button">` with `aria-pressed` reflecting its selection state
4. EACH ingredient option SHALL have a minimum touch target of 44px by 44px
5. THE Create_Your_Own_Builder SHALL NOT render visible browser-default radio buttons or checkboxes for ingredient selection
6. EACH ingredient option SHALL display hover feedback, a visible keyboard focus state, and respond to Enter, Space, click, and touch

### Requirement 10: Live Custom Drink Preview

**User Story:** As a prospective client, I want to see a live summary of my custom drink as I build it, so that I can review my creation before submitting.

#### Acceptance Criteria

1. EACH Create_Your_Own_Builder instance SHALL display a live preview of that specific drink slot's current selections
2. THE live preview SHALL render only categories that have values — never undefined, null, empty separators, or dangling punctuation
3. THE live preview SHALL format garnishes using natural language: one garnish as-is, two joined with "&", three or more with commas and "&" before the last
4. THE live preview SHALL include "Sparkling with club soda" once at least one selection has been made
5. WHEN no selections exist for that slot, THE live preview SHALL be hidden or display neutral guidance text

### Requirement 11: Multiple Independent Drink Slots

**User Story:** As a prospective client, I want each drink slot to operate independently, so that configuring one drink never affects another.

#### Acceptance Criteria

1. EACH drink slot SHALL maintain its own independent state for choice type, signature selection, and custom mocktail configuration
2. WHEN a visitor modifies selections in one drink slot, no other drink slot's state SHALL change
3. THE system SHALL support mixed configurations where some slots use signature drinks and others use custom builds within the same inquiry
4. THE server SHALL validate each drink slot independently

### Requirement 12: Additional Notes Section

**User Story:** As a prospective client, I want to share extra context about my event, so that Mock & Roll can better understand my needs.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL present Section 05 labeled "Anything Else?"
2. THE Inquiry_Form SHALL display a textarea field labeled "Anything Else You Want Us to Know?" that is optional
3. THE field SHALL have a reasonable maximum character limit enforced both client-side and server-side
4. THE database SHALL store this field as nullable

### Requirement 13: Form Submission and Success

**User Story:** As a prospective client, I want clear feedback after submitting my inquiry, so that I know my request was received.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL display a submit button labeled "Send Inquiry" (or another polished equivalent that does not imply a confirmed booking)
2. WHEN the form is submitted successfully, THE Inquiry_Form SHALL display the message "Thanks for your inquiry — someone from our team will be in touch within 1 business day."
3. THE success message SHALL NOT appear until the inquiry has been safely persisted to Supabase via the Transactional_RPC
4. IF the inquiry is stored successfully but the Resend notification fails, THE system SHALL still display the success message to the visitor
5. THE system SHALL NOT require the visitor to resubmit if only the notification email fails
6. THE system SHALL log notification failures server-side without exposing internal details to the visitor
7. THE system SHALL NOT create duplicate inquiries under any failure scenario

### Requirement 14: Server-Side Validation and Normalization

**User Story:** As a system operator, I want all inquiry data validated and normalized on the server, so that invalid or malicious data cannot enter the database.

#### Acceptance Criteria

1. THE server SHALL validate: first name required with maximum length, last name required with maximum length, email is valid format, phone number is required and is not clearly invalid, event date is valid and not in the past, event type is an allowed value, event_type_other is required when event_type is "Other", guest count is a positive integer, location is required with maximum length, time is valid, package is a valid canonical identifier
2. THE server SHALL validate package eligibility against the submitted guest count
3. THE server SHALL validate that the number of submitted drink choices matches the selected package's allowed count
4. THE server SHALL validate that each signature drink identifier belongs to the canonical allowed set
5. THE server SHALL validate that each custom mocktail base, purée, and syrup belong to their respective canonical allowed sets
6. THE server SHALL validate that each custom mocktail garnish value belongs to the canonical garnish set
7. THE server SHALL reject submissions containing unexpected, malformed, or out-of-range values
8. THE server SHALL NOT trust client-provided package limits or option lists
9. THE server SHALL normalize inputs before persistence: trim first_name, last_name, event_location, event_type_other, additional_notes; trim and lowercase email; trim and normalize phone_number formatting where practical; preserve intentional line breaks in additional_notes

### Requirement 15: Anti-Spam Protection

**User Story:** As a system operator, I want the public form protected against automated spam submissions, so that the inquiry database remains clean.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL include a hidden honeypot field that is not visible to human visitors
2. THE server SHALL reject submissions where the honeypot field contains a value
3. THE system SHALL enforce strict server-side validation as a spam defense layer
4. THE system SHALL implement a reasonable rate-limiting strategy where practical
5. THE system SHALL NOT expose service keys to the browser
6. THE system SHALL NOT add a paid CAPTCHA product unless justified

### Requirement 16: Supabase Database Schema

**User Story:** As a system operator, I want inquiry data stored in a normalized relational schema, so that data is maintainable, queryable, and consistent.

#### Acceptance Criteria

1. THE system SHALL create a `contact_inquiries` table with fields for: id (uuid), reference (text, unique, not null — human-friendly inquiry reference), created_at (timestamptz), updated_at (timestamptz), first_name (text, not null), last_name (text, not null), email (text, not null), phone_number (text, not null), event_date (date, not null), event_type (text, not null), event_type_other (text, nullable), estimated_guest_count (integer, not null, check > 0), event_location (text, not null), event_time (time, not null), package_id (text, not null), package_name_snapshot (text, not null), additional_notes (text, nullable), status (text, not null, default 'new'), admin_notes (text, nullable)
2. THE system SHALL create an `inquiry_drink_choices` table with fields for: id (uuid), inquiry_id (uuid, foreign key), position (integer), choice_type (text, constrained to 'signature' or 'custom'), signature_drink_id (text, nullable), signature_drink_name_snapshot (text, nullable), created_at (timestamptz), with a unique constraint on (inquiry_id, position)
3. THE system SHALL create an `inquiry_custom_mocktails` table with fields for: id (uuid), drink_choice_id (uuid, foreign key), base (text, not null), puree (text, not null), syrup (text, not null), garnishes (text[], nullable), created_at (timestamptz)
4. THE system SHALL create an `admin_users` table with fields for: id (uuid), user_id (uuid, referencing Supabase auth.users, unique), created_at (timestamptz), display_name (text, nullable)
5. THE system SHALL NOT model variable drinks as individual columns (drink_1, drink_2, etc.)
6. THE system SHALL use appropriate foreign key relationships with intentional delete behavior
7. THE updated_at field SHALL automatically update via a database trigger whenever the inquiry's status or admin_notes changes

### Requirement 17: Row Level Security

**User Story:** As a system operator, I want all inquiry and admin tables protected by Row Level Security, so that unauthorized access is impossible through direct database queries.

#### Acceptance Criteria

1. THE system SHALL enable Row Level Security on all inquiry-related and admin tables
2. PUBLIC visitors SHALL NOT be able to directly read, list, update, or delete inquiry records through Supabase client queries
3. PUBLIC visitors SHALL NOT be able to directly read drink choices, custom mocktail configurations, or admin user records
4. PUBLIC form submissions SHALL be processed exclusively through the Next.js server API using the Privileged_Client
5. ADMIN read and write access SHALL be enforced through RLS policies requiring authenticated session with matching admin_users membership

### Requirement 18: Supabase Client Architecture

**User Story:** As a developer, I want clearly separated Supabase clients for different security contexts, so that privileged operations cannot be triggered from the browser.

#### Acceptance Criteria

1. THE system SHALL create a browser-safe Auth client for authentication flows
2. THE system SHALL create a server-side authenticated session client using @supabase/ssr for admin operations that respect RLS
3. THE system SHALL create a privileged server-only client using @supabase/supabase-js with SUPABASE_SECRET_KEY for public form submission processing
4. THE privileged client SHALL never be imported or referenced in browser-bundled code
5. SUPABASE_SECRET_KEY SHALL never be prefixed with NEXT_PUBLIC_

### Requirement 19: Public Submission API and Transactional Persistence

**User Story:** As a system operator, I want inquiry submissions processed through a server-side API route with atomic persistence, so that validation, storage, and notification happen securely and no partial records are left behind.

#### Acceptance Criteria

1. THE system SHALL create an API route at `app/api/inquiries/route.ts` accepting POST requests
2. THE API route SHALL execute this sequence: (1) receive POST request, (2) check anti-spam controls, (3) validate all fields server-side, (4) normalize inputs, (5) validate package business rules and eligibility, (6) validate drink-slot count against package, (7) validate each drink configuration, (8) remove stale/inactive choice data, (9) call Transactional_RPC using the Privileged_Client, (10) receive the created inquiry ID and reference, (11) attempt Resend notification, (12) return safe response
3. THE Transactional_RPC SHALL be a PostgreSQL function (represented in a migration) that creates the inquiry and ALL required related records (drink choices, custom mocktails) within a single database transaction
4. THE database operation SHALL either successfully create the complete inquiry with all child records OR roll back the entire operation — no partial records
5. THE Resend notification SHALL occur OUTSIDE the database transaction; if persistence succeeds but Resend fails, the inquiry is kept and success is returned to the visitor
6. THE system SHALL generate the Inquiry_Reference server-side or database-side as part of the transactional creation

### Requirement 20: Resend Notification

**User Story:** As a team member, I want to receive an email notification when a new inquiry arrives, so that I can respond promptly.

#### Acceptance Criteria

1. THE system SHALL send a notification email using Resend after an inquiry is successfully stored
2. THE notification SHALL set replyTo to the visitor's submitted email address
3. THE notification SHALL never use the visitor's email as the From address
4. THE notification SHALL be sent to the recipient specified in the INQUIRY_NOTIFICATION_EMAIL environment variable
5. THE notification subject SHALL include the Inquiry_Reference and client name, e.g., "New Mock & Roll Inquiry MR-2026-XXXXXX — Jane Smith"
6. THE notification body SHALL include: contact details (first name, last name, email, phone number), event details (date, time, type, guest count, location), package name, Inquiry_Reference, all drink choices with full details — signature drink names for signature choices; base, purée, syrup, garnishes, and "Sparkling with club soda" preparation note for custom choices — and additional notes
7. IF NEXT_PUBLIC_SITE_URL is configured, THE notification SHALL include a direct link to the inquiry's admin detail page

### Requirement 21: Admin Authentication

**User Story:** As an admin, I want to log in securely using a magic link, so that I can access the inquiry dashboard without managing passwords.

#### Acceptance Criteria

1. THE system SHALL create an admin login page at `/admin/login`
2. THE system SHALL use Supabase Auth with magic-link authentication
3. THE system SHALL create an auth callback route at `/auth/callback`
4. WHEN an unauthenticated visitor accesses `/admin`, THE system SHALL redirect to `/admin/login`
5. WHEN a magic link is clicked, THE system SHALL establish a Supabase session and redirect to the admin dashboard
6. THE system SHALL handle expired magic links, invalid magic links, and session refresh using current @supabase/ssr patterns
7. THE system SHALL provide a logout mechanism

### Requirement 22: Admin Authorization

**User Story:** As a system operator, I want admin access restricted to explicitly approved users, so that authenticated non-admin users cannot view inquiries.

#### Acceptance Criteria

1. THE system SHALL create a `requireAdmin()` server helper that verifies both a valid Supabase authenticated session AND a matching record in the admin_users table
2. EVERY protected page, server action, API route, query, and mutation SHALL independently call `requireAdmin()` before proceeding
3. AUTHENTICATED users who are NOT in admin_users SHALL be denied access to all inquiry data
4. THE system SHALL NOT assume that every authenticated user is an administrator
5. THE system SHALL NOT protect the dashboard solely by hiding navigation links

### Requirement 23: Admin Dashboard Inquiry List

**User Story:** As an admin, I want to see all inquiries in a sortable list with URL-driven state, so that I can quickly find and manage client requests without losing my place on refresh.

#### Acceptance Criteria

1. THE admin dashboard at `/admin` SHALL display a list of inquiries showing: client name, email, event date, event type, guest count, package, status, Inquiry_Reference, and submitted date
2. THE list SHALL be ordered by created_at descending (newest first) by default
3. THE inquiry data SHALL be fetched server-side using the authenticated session client with RLS enforcement
4. THE list SHALL support pagination appropriate for a growing inquiry list
5. THE list SHALL support server-side sorting by at minimum: submitted date (ascending/descending) and event date (ascending/descending)
6. SEARCH, filtering, sorting, and pagination state SHALL be represented in URL search parameters where practical (e.g., `/admin?status=new&sort=event_date&direction=asc&page=2`)
7. THE system SHALL validate URL parameters before using them in queries

### Requirement 24: Admin Search

**User Story:** As an admin, I want to search inquiries by client name, email, phone, or location, so that I can quickly find specific submissions.

#### Acceptance Criteria

1. THE admin dashboard SHALL support search across first name, last name, email, phone number, and event location
2. THE search SHALL be performed server-side rather than loading all records into the browser for client-side filtering
3. PHONE number search SHALL normalize input where practical so that searches work despite common formatting differences

### Requirement 25: Admin Filters

**User Story:** As an admin, I want to filter inquiries by status, event type, package, or date, so that I can focus on relevant subsets of submissions.

#### Acceptance Criteria

1. THE admin dashboard SHALL support filtering by inquiry status
2. THE admin dashboard SHALL support filtering by event type
3. THE admin dashboard SHALL support filtering by package
4. THE admin dashboard SHALL support filtering by event date
5. FILTERS SHALL be applied server-side where practical

### Requirement 26: Inquiry Detail Page

**User Story:** As an admin, I want to view complete inquiry details on a dedicated page, so that I can review all information a client submitted.

#### Acceptance Criteria

1. THE admin dashboard SHALL provide a detail page for each inquiry
2. THE detail page SHALL display the Inquiry_Reference prominently
3. THE detail page SHALL display contact information: first name, last name, email, phone number (as an actionable `tel:` link where appropriate)
4. THE detail page SHALL display event information: date, time, type (including other if applicable), estimated guest count, location
5. THE detail page SHALL display the selected package
6. THE detail page SHALL display each drink choice with its position, type (signature or custom), and full configuration — signature drink name for signature choices; base, purée, syrup, garnishes, and "Sparkling with club soda" preparation note for custom choices
7. THE detail page SHALL display the full additional notes response
8. THE detail page SHALL display the current inquiry status, private admin notes, and submitted date/time

### Requirement 27: Status Management

**User Story:** As an admin, I want to update an inquiry's status, so that I can track where each client is in the booking workflow.

#### Acceptance Criteria

1. THE system SHALL support these inquiry statuses: New, Contacted, In Discussion, Booked, Closed
2. THE admin detail page SHALL allow changing the inquiry status
3. STATUS changes SHALL persist to Supabase immediately
4. THE default status for new inquiries SHALL be "New"
5. STATUS changes SHALL trigger the updated_at timestamp to update automatically

### Requirement 28: Admin Notes

**User Story:** As an admin, I want to add private notes to an inquiry, so that I can record internal context that clients never see.

#### Acceptance Criteria

1. THE admin detail page SHALL allow adding or updating private admin notes
2. ADMIN notes SHALL never appear publicly, in client-facing messages, or in notification emails
3. ADMIN notes SHALL persist safely with a clear save confirmation
4. SAVING admin notes SHALL NOT overwrite other inquiry fields
5. SAVING admin notes SHALL trigger the updated_at timestamp to update automatically

### Requirement 29: Responsive Design

**User Story:** As a visitor on any device, I want the inquiry form to work well at all screen sizes, so that I can submit an inquiry from my phone, tablet, or desktop.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL render correctly at viewport widths of 375px, 390px, 430px, 768px, and 1024px+ without horizontal overflow or content truncation
2. THE Create_Your_Own_Builder ingredient chips SHALL wrap naturally within their container without triggering horizontal scrolling
3. THE admin dashboard SHALL be usable on tablet and desktop viewports

### Requirement 30: Accessibility

**User Story:** As a visitor using assistive technology, I want the inquiry form to be fully accessible, so that I can complete and submit an inquiry with a keyboard and screen reader.

#### Acceptance Criteria

1. ALL form fields SHALL have associated labels
2. REQUIRED fields SHALL be indicated to assistive technology
3. VALIDATION errors SHALL be associated with their respective fields using appropriate ARIA attributes
4. THE Create_Your_Own_Builder ingredient buttons SHALL use `aria-pressed` to indicate selection state
5. THE Inquiry_Form SHALL be navigable and operable using only a keyboard
6. FOCUS management SHALL be logical throughout the form
7. THE phone number field SHALL use `type="tel"` and `autocomplete="tel"`
8. THE phone number field SHALL remain in logical keyboard/tab order within the About You section

### Requirement 31: Shared Domain Configuration

**User Story:** As a developer, I want package, signature drink, and custom mocktail ingredient data defined in one canonical location, so that values are consistent everywhere they appear.

#### Acceptance Criteria

1. THE system SHALL define a shared canonical configuration for packages including: stable identifier, display name, pricing mode, price/base price/per-person rate, guest-count eligibility rules (min/max), and allowed drink count
2. THE system SHALL define a shared canonical configuration for signature mocktails including: stable identifier and display name
3. THE system SHALL define a shared canonical configuration for custom mocktail ingredients including bases, purées, syrups, and garnishes
4. THE Inquiry_Form, API validation, notification email, and admin dashboard SHALL all reference the same shared configuration
5. THE static `/mocktails` page SHOULD render from the same ingredient configuration where feasible without unnecessary redesign
6. THE canonical package configuration SHALL contain structured values sufficient to determine eligibility — business logic SHALL NOT be derived by parsing display strings

### Requirement 32: Human-Friendly Inquiry Reference

**User Story:** As a team member, I want a readable inquiry reference number for each submission, so that I can easily refer to specific inquiries in conversation and email.

#### Acceptance Criteria

1. THE system SHALL generate a unique, human-friendly Inquiry_Reference for each inquiry (e.g., MR-2026-XXXXXX)
2. THE Inquiry_Reference SHALL be generated server-side or database-side during transactional creation
3. THE Inquiry_Reference SHALL be collision-safe and unique
4. THE Inquiry_Reference SHALL NOT replace the internal UUID primary key
5. THE Inquiry_Reference SHALL be visible in the admin inquiry list and detail page
6. THE Inquiry_Reference SHALL be included in the Resend notification subject and body

### Requirement 33: Environment Variables

**User Story:** As a developer, I want all required environment variables documented, so that local development and deployment are straightforward.

#### Acceptance Criteria

1. THE system SHALL use these public environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SITE_URL
2. THE system SHALL use these server-only environment variables: SUPABASE_SECRET_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, INQUIRY_NOTIFICATION_EMAIL
3. THE `.env.example` file SHALL be updated with all variable names and safe placeholder descriptions
4. SERVER-ONLY variables SHALL NOT be prefixed with NEXT_PUBLIC_
5. THE system SHALL validate required environment variables at startup and name missing variables in error messages without exposing values

### Requirement 34: Database Migrations

**User Story:** As a developer, I want every database change represented in migration files, so that schema changes are reproducible and auditable.

#### Acceptance Criteria

1. THE system SHALL create Supabase migration files for all tables, constraints, indexes, RLS policies, grants, functions/RPCs (including the Transactional_RPC), triggers (including updated_at), and the inquiry reference generation logic
2. THE system SHALL NOT rely on undocumented SQL Editor changes
3. IF the project uses generated Supabase TypeScript database types, THE system SHALL regenerate them after migrations

### Requirement 35: Security

**User Story:** As a system operator, I want the inquiry system to follow security best practices, so that sensitive data and service credentials are protected.

#### Acceptance Criteria

1. SUPABASE_SECRET_KEY SHALL never appear in browser-bundled code
2. THE system SHALL NOT commit real credentials to version control
3. DIRECT public reads and writes to inquiry tables SHALL be blocked by RLS
4. THE admin dashboard SHALL fetch inquiry data server-side using the authenticated session client, not the browser-safe public client
5. THE API route SHALL use the Privileged_Client (service key) for writes, not the browser-safe client
6. CLIENT phone numbers SHALL NOT be exposed through public routes or unauthenticated queries

### Requirement 36: Static Mocktails Page Preservation

**User Story:** As a site maintainer, I want the public `/mocktails` page to remain a static showcase without interactive builder functionality, so that the interactive experience is reserved for the inquiry form.

#### Acceptance Criteria

1. THE `/mocktails` page SHALL remain a static page displaying signature mocktails and the existing Create Your Own Mocktail section as non-interactive content
2. THE interactive Create_Your_Own_Builder with functional state management SHALL exist only within the `/inquiries` form
3. THE `/mocktails` page SHALL NOT gain or retain interactive ingredient selection functionality

### Requirement 37: Production Configuration

**User Story:** As a developer, I want production deployment requirements documented, so that Vercel and Supabase configuration is complete.

#### Acceptance Criteria

1. THE production domain SHALL be `https://mocknrolbar.com`
2. THE Supabase Auth Site URL SHALL be configured as `https://mocknrolbar.com`
3. THE system SHALL document required callback URLs for local development, Vercel previews, and production (`https://mocknrolbar.com/auth/callback`)
4. THE system SHALL confirm all server-only variables are not NEXT_PUBLIC_ prefixed in Vercel configuration

### Requirement 38: Cross-Client Safety

**User Story:** As a site maintainer, I want the implementation free of data from other projects, so that Mock & Roll's inquiry system is entirely its own.

#### Acceptance Criteria

1. THE implementation SHALL NOT contain names, emails, domains, package values, statuses, sender addresses, recipients, test data, comments, or environment values from another client or project
2. THE implementation SHALL use only Mock & Roll-specific data: packages (Signature Experience, Celebration Experience, Premier Experience, Reserve Experience), signature drinks (Hibiscus Blossom, Ginger Dragon, Garden Sparkler, Pineapple Sunrise), the domain mocknrolbar.com, and the contact email lauren@mocknrollbar.com
3. BEFORE implementation, the repository SHALL be searched for foreign client/project information and any found SHALL be removed

### Requirement 39: Testing

**User Story:** As a developer, I want the system verified end-to-end, so that all components work correctly together.

#### Acceptance Criteria

1. THE system SHALL verify the complete About You section: first name required, last name required, email validation, phone number required, common valid phone formats accepted, clearly invalid phone values rejected, phone normalization correct
2. THE system SHALL verify the complete Your Event section: event date required and not in the past, event type selection, Other conditional field, guest count positive integer, location required, time required
3. THE system SHALL verify Package selection: required, correct values, package eligibility against guest count (Signature ≤30, Celebration >30), package-dependent drink count enforcement, server rejects manipulated combinations
4. THE system SHALL verify Drink choices: signature selection, custom selection, multiple independent slots, base/purée/syrup single-select, garnish multi-select, type switching behavior (no stale data), server validation of all drink configurations
5. THE system SHALL verify transactional persistence: complete inquiry persists, all drink choices persist, custom mocktail children persist, signature choices do not create custom rows, simulated child-write failure rolls back entire inquiry, no orphaned records, Resend failure after persistence does NOT remove inquiry
6. THE system SHALL verify Resend notification: generated, correct recipients, replyTo correct, From correct, all fields including phone number and Inquiry_Reference included, failure handled safely
7. THE system SHALL verify Admin: authentication, authorization (non-admin denied), list, search (including phone), filters, sorting, pagination, detail view (including phone as tel: link), status update, notes update, URL state persistence
8. THE system SHALL verify Security: RLS enabled, direct public reads blocked, direct public writes blocked, service secret absent from client bundle, phone numbers not exposed publicly
