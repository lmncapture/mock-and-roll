# Implementation Plan — Remove Resend from the Mock & Roll inquiry workflow

## Context & decisions (from exploration — grounded in actual files)

- **Project:** Next.js 16.2.6 App Router, React 19, TypeScript, Vitest, ESLint (`eslint-config-next`). npm project with `package-lock.json`. Workspace path contains spaces and `&` — every shell command below quotes it.
- **AGENTS.md rule:** This is a modified Next.js with breaking changes; relevant guides live in `node_modules/next/dist/docs/`. These changes touch only a route handler, a server util, env config, package manifest, and docs — no new Next.js APIs are introduced — so no guide reading is required beyond confirming the existing `app/api/inquiries/route.ts` route-handler shape is unchanged (it is).
- **Dependency versioning:** runtime deps are pinned exactly (no caret). We only remove a dependency; nothing new is added.
- **Resend usage audit (verified by reading each file): Resend is used ONLY for inquiry notifications.** Found in: `app/api/inquiries/route.ts` (import + step-10 try/catch), `lib/email/send-inquiry-notification.ts` (the whole file), `lib/env/server.ts` (3 getters), `.env.example` (Resend section), `package.json` + `package-lock.json` (`resend@6.19.0`), the three spec docs, and `app/privacy/page.tsx` (service-provider list item). No other feature uses Resend.
- **Privacy page decision:** `app/privacy/page.tsx` lists Resend as a service provider "for internal inquiry notifications." That is user-facing documentation of the exact feature being removed. Leaving it would make the privacy policy inaccurate, and the task says to remove Resend from documentation when it is inquiry-only. So the Resend `<li>` is removed; Supabase/Vercel/Meta list items stay untouched. This is a content/doc edit, not a tracking/behavior change.
- **Client confirmation (read, NOT to be modified):** `app/inquiries/components/InquiryForm.tsx` `handleSubmit` keys everything off `res.ok` (the HTTP 200 from `{ success: true, reference }`). On success it calls `setAdvancedMatching` with in-memory `form.*` PII (never persisted), stores only non-PII `InquiryConversion` in sessionStorage, guards with `submittedRef` against duplicate Lead fires, then `router.push('/inquiries/thank-you')`. It has NO dependency on the email call (the email was server-side fire-and-forget inside try/catch and never influenced the response). **No client changes are needed and none will be made.**
- **Tests:** No test imports the notification helper or references Resend (the `email` matches in `lib/analytics/__tests__/meta.test.ts` are `normalizeEmail` for Meta, unrelated). Removing the helper breaks no test. There is no API-route test importing `route.ts`.
- **Review gate:** the implement-and-review loop reads `/Users/nikorichardson/Documents/Mock & Roll/M&R Website/.agents/tasks/review.json` (`jsonPath: verdict`) and stops at `APPROVED`. This plan does not restructure the workflow; the existing loop implements it.

HARD CONSTRAINTS (do not change): inquiry questions, Zod validation rules, phone normalization, date/eventType/package/drink validations, the `create_inquiry` RPC call/params, pricing/package logic, admin dashboard, thank-you page, all Meta analytics, the `InquiryForm` success handling, SEO/AIO. The API success response MUST stay exactly `{ success: true, reference }`. Do NOT add any replacement email/notification provider.

---

# Tasks

- [ ] 1. Remove the Resend notification call from the inquiry API route.
      In `app/api/inquiries/route.ts`: delete the import `import { sendInquiryNotification } from '@/lib/email/send-inquiry-notification';` (line ~8), and delete the ENTIRE step-10 block — the comment `// 10. Send notification email (await inside try/catch ...)` plus the `try { await sendInquiryNotification({...}) } catch (emailError) { console.error(\`[Resend] Notification failed...\`) }`. Renumber the trailing `// 11. Success response` to `// 10. Success response` (optional cosmetic; keep numbering consistent). The flow becomes: validate → honeypot → normalize → date/eventType/package/drink validations → build `drinksPayload` → call `create_inquiry` RPC → on `rpcError` return 500 → else return `NextResponse.json({ success: true, reference })`. Keep the outer `try/catch` (unexpected-error 500) and the `reference` extraction. Verify `pkg` is still used (it is — drink-count validation at step 7), and that `result?.id`, `pkg.name`, `pkg.priceDisplay`, `publicEnv`-derived values that were ONLY consumed by the removed payload do not leave any now-unused local in this file (none remain in route.ts; `result` is still read for `reference`). Do not touch validation, normalization, RPC params, or response shapes.
      Files: `app/api/inquiries/route.ts`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && npx tsc --noEmit` passes, and `npm run lint` reports no new unused-import/unused-var errors for this file.

- [ ] 2. Delete the Resend notification helper and clean up the empty directory.
      Delete `lib/email/send-inquiry-notification.ts` (it exists solely to send via Resend: `import { Resend } from 'resend'`, `new Resend(serverEnv.resendApiKey)`, `resend.emails.send(...)`). `lib/email/` contains only this file, so remove the now-empty `lib/email/` directory as well.
      Files: delete `lib/email/send-inquiry-notification.ts`; remove dir `lib/email/`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && ls lib/email 2>/dev/null; echo "exit=$?"` shows the directory is gone (non-zero exit), and `npx tsc --noEmit` still passes (no dangling import — handled in task 1).

- [ ] 3. Remove the Resend env getters from server env config.
      In `lib/env/server.ts`, remove the three getters `resendApiKey` (`RESEND_API_KEY`), `resendFromEmail` (`RESEND_FROM_EMAIL`), and `notificationEmail` (`INQUIRY_NOTIFICATION_EMAIL`). Keep `import 'server-only'`, the `requireEnv` helper, and the `supabaseSecretKey` getter. Final `serverEnv` exposes only `supabaseSecretKey`.
      Files: `lib/env/server.ts`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && npx tsc --noEmit` passes (nothing else imports those getters after task 2) and `npm run lint` is clean for this file.

- [ ] 4. Remove the Resend section from `.env.example`.
      Delete the `# Resend Email` comment line and the three variables under it: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `INQUIRY_NOTIFICATION_EMAIL`. Leave `NEXT_PUBLIC_SITE_URL` and the entire `# Supabase` section (including `SUPABASE_SECRET_KEY`) intact.
      Files: `.env.example`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -i resend .env.example; echo "exit=$?"` returns no matches (grep exit 1).

- [ ] 5. Remove the `resend` dependency from the manifest and regenerate the lockfile.
      In `package.json`, delete the line `"resend": "6.19.0",` from `dependencies` (keep JSON valid — no trailing-comma issues). Then run `npm install` to regenerate `package-lock.json` without resend. Do not add any other package. Keep all other pinned versions unchanged.
      Files: `package.json`, `package-lock.json`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -i '"resend"' package.json; echo "pkg=$?"` returns nothing (exit 1); `grep -c '"node_modules/resend"' package-lock.json` returns `0`; and `npm ls resend 2>&1 | grep -i resend; echo "ls=$?"` shows resend is not installed.

- [ ] 6. Update the privacy policy to drop Resend from the service-provider list.
      In `app/privacy/page.tsx` (Service Providers section, ~lines 136–140), remove the `<li>` for `Resend` ("transactional email infrastructure for internal inquiry notifications"). Keep the Supabase, Vercel, and Meta list items and all surrounding copy unchanged. Confirm the surrounding sentence ("these providers include:") still reads correctly with three providers.
      Files: `app/privacy/page.tsx`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -i resend app/privacy/page.tsx; echo "exit=$?"` returns no matches; `npx tsc --noEmit` passes.

- [ ] 7. Update the spec `design.md` to reflect no email notification.
      In `.kiro/specs/client-inquiry-system/design.md`: (a) Overview line (~5) — remove "Resend email notification" from the comma list; (b) flow diagram step 7 "await Resend notification (catch/log failure)" (~61) — remove that step (renumber the following "Return { success, reference }" as needed); (c) file-tree `email/ send-inquiry-notification.ts ← Resend notification builder` (~165–166) — remove those lines; (d) serverEnv example block (~552–557) — remove `resendApiKey`/`resendFromEmail`/`notificationEmail`, leave `supabaseSecretKey`; (e) route-handler pseudocode (~1329–1331) — remove the `// 11. await Resend notification inside try/catch` line and the "**Resend is awaited** ..." paragraph (~1334); (f) delete the entire `## Resend Notification` section (~1341–1373); (g) dependencies table row `| resend | Email notification | ~5KB |` (~1466) — remove it; (h) test-strategy bullets mentioning "Resend failure" (~1488) — remove or reword to drop the email reference. Add a one-line note in Overview or the API section stating an inquiry is considered successfully submitted once validated and persisted to Supabase, and the admin dashboard is the sole channel for receiving inquiries. Leave everything else intact.
      Files: `.kiro/specs/client-inquiry-system/design.md`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -in resend .kiro/specs/client-inquiry-system/design.md; echo "exit=$?"` returns no remaining Resend references (exit 1).

- [ ] 8. Update the spec `tasks.md` to mark the Resend work removed/obsolete.
      In `.kiro/specs/client-inquiry-system/tasks.md`: (a) Overview line (~5) — drop "Resend email notification"; (b) task 1.1 (~11) — remove `resend` from the install list; (c) task 1.5 (~32) — remove `RESEND_API_KEY, RESEND_FROM_EMAIL, INQUIRY_NOTIFICATION_EMAIL`, leaving `SUPABASE_SECRET_KEY`; (d) task 7.1 sequence (~175) — remove "→ await Resend notification (catch/log)"; (e) task 8 "Implement Resend notification" and 8.1 (~179–182+) — mark obsolete/removed (e.g., strike or annotate "REMOVED: inquiry notifications no longer sent; Supabase admin dashboard is the sole channel"). Keep all other tasks and requirement cross-references intact.
      Files: `.kiro/specs/client-inquiry-system/tasks.md`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -in resend .kiro/specs/client-inquiry-system/tasks.md` shows only intentional "REMOVED/obsolete" annotations (no live install/env/flow references); eyeball the output.

- [ ] 9. Update the spec `requirements.md` to reflect Supabase-only success.
      In `.kiro/specs/client-inquiry-system/requirements.md`: (a) Introduction (~5) — remove "and trigger a notification email via Resend"; (b) Requirement 18-area acceptance criteria (~202–204) — drop/replace criteria 4,5,6 that reference "Resend notification fails"/"notification email fails"/"log notification failures" with a statement that an inquiry is successfully submitted once validated and persisted to Supabase via the Transactional_RPC and the success message appears on that basis; (c) Requirement 19 user story + criteria (~276, 282, 284 step 11, 285 step 5) — remove the "attempt Resend notification" step and the "Resend occurs outside the transaction / if Resend fails inquiry is kept" criterion; renumber the sequence steps so persistence→reference→safe response is coherent; (d) Requirement 20 "Resend Notification" (~287–299) — remove the entire requirement (user story + all acceptance criteria); (e) Requirement 25-area (~397) — adjust "notification emails" mention to just admin-facing privacy; (f) shared-config criterion (~436) — drop "notification email" from the list of consumers; (g) Inquiry_Reference criterion (~451) — remove "included in the Resend notification subject and body"; (h) Requirement 33 Environment Variables (~460) — change the server-only var list to `SUPABASE_SECRET_KEY` only (remove the three RESEND vars); (i) testing criteria (~529–530) — remove the "Resend failure after persistence" and "verify Resend notification" items. Keep all other requirements, numbering context, and Supabase/admin requirements intact.
      Files: `.kiro/specs/client-inquiry-system/requirements.md`
      Verify: `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -in 'resend\|INQUIRY_NOTIFICATION\|RESEND_' .kiro/specs/client-inquiry-system/requirements.md; echo "exit=$?"` returns no matches (exit 1).

- [ ] 10. Full verification gate (run all, from workspace root, path quoted; no deploy, no dev/watch).
      Run the project's real commands in order and fix any failure before proceeding to the next. If `npm install` from task 5 has not been run, run it first so the lockfile and `node_modules` are consistent.
      Files: none (verification only)
      Verify, in order:
      - `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && npx tsc --noEmit` → no type errors.
      - `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && npm run lint` → no errors (no unused imports/vars introduced).
      - `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && npm run test` → all Vitest suites pass (unchanged count; nothing referenced Resend).
      - `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && npm run build` → production build succeeds (`next build`). Do NOT run `npm run start`, `next dev`, or deploy.

- [ ] 11. Final confirmation sweep (no code change).
      Confirm no Resend residue remains anywhere outside intentional "obsolete/removed" spec annotations, and that the API success contract is intact.
      Files: none
      Verify:
      - `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -rin --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git -e resend -e INQUIRY_NOTIFICATION .` → only the intentional spec annotations from tasks 7–9 remain (no live imports, deps, env getters, or `.env.example` entries).
      - `cd "/Users/nikorichardson/Documents/Mock & Roll/M&R Website" && grep -n 'success: true, reference' app/api/inquiries/route.ts` → confirms the response shape `{ success: true, reference }` is unchanged.
      - Confirm `app/inquiries/components/InquiryForm.tsx`, the thank-you page, `lib/analytics/**`, `app/admin/**`, `lib/config/packages`, and `lib/config/drinks` are untouched by this change (git diff shows no edits to those paths).

---

## Final report (compile after task 11 passes)

Produce a report covering: exactly what Resend functionality was removed (import + step-10 try/catch in route.ts; the `send-inquiry-notification.ts` helper + empty `lib/email/` dir; three env getters; `.env.example` section; the `resend` dependency + lockfile entry; spec-doc and privacy-page references); confirmation that Resend remains nowhere else in the project (audit was inquiry-only); the exact post-change inquiry flow (form → server validation → `create_inquiry` RPC persist → `{ success: true, reference }` → client Advanced Matching from in-memory PII → redirect to `/inquiries/thank-you` → guarded Lead); confirmation that a successful Supabase persist is now the submission-success point; confirmation the admin dashboard still receives inquiries (RPC/schema/admin untouched); confirmation the Meta thank-you/Lead flow is unchanged (InquiryForm + analytics + thank-you page untouched); and the TypeScript, ESLint, test, and build results. No deploy.

---

## Verification (run from the quoted workspace root; no deploy, no dev/watch)

Commands run and results:

- `npx tsc --noEmit` → **PASS** (exit 0, no type errors). Note: a first run surfaced 6 errors, but all were in stale duplicate generated files inside the untracked `.next/` build cache (`cache-life.d 2.ts`, `routes.d 2.ts`, `validator 2.ts` — macOS " 2" duplicate artifacts dated Aug 26/27, unrelated to this change). Clearing `.next/` (regenerable, not git-tracked) resolved them; the re-run passed clean.
- `npm run lint` (ESLint) → **PASS** (exit 0, no errors — no unused-import/unused-var introduced by the removal).
- `npm run test` (vitest run) → **PASS** — Test Files 6 passed (6), Tests 53 passed (53). (Pre-existing unrelated Vite `configLoader` warning only.)
- `npm run build` (next build) → **PASS** — compiled successfully, TypeScript checked, all 16 routes generated. `/api/inquiries` present as a dynamic function route.

Dependency proof:
- `grep -i '"resend"' package.json` → no match (exit 1).
- `grep -c '"node_modules/resend"' package-lock.json` → `0`.
- `npm ls resend` → resend not installed.

Residue sweep (`grep -rin` excluding node_modules/.next/.git/.agents, caches, and `.env.local`) → only the intentional "REMOVED/obsolete" annotations remain in `requirements.md`, `tasks.md`, and `design-addendum.md`. No live imports, deps, env getters, or `.env.example` entries.

Note on `.env.local`: the developer's local, git-ignored (`.env*.local`), untracked secrets file still contains RESEND_API_KEY / RESEND_FROM_EMAIL / INQUIRY_NOTIFICATION_EMAIL. It was intentionally left untouched (never committed; holds the developer's real values). The committed template `.env.example` no longer references Resend. The developer may remove those three lines from their local `.env.local` at their discretion.

API contract check: `grep -n 'success: true, reference' app/api/inquiries/route.ts` confirms `{ success: true, reference }` is unchanged. InquiryForm, thank-you page, `lib/analytics/**`, `app/admin/**`, `lib/config/**` were not edited by this change.
