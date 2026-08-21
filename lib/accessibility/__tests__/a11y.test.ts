/**
 * Accessibility-related configuration tests for Mock & Roll.
 *
 * NOTE: These verify that package configuration exposes the data needed
 * for accessible UI rendering (names, descriptions, prices for screen readers).
 * They do NOT test rendered ARIA attributes, focus management, or assistive
 * technology behavior — those require a DOM rendering environment (e.g. jsdom
 * with @testing-library/react) which is not currently configured in this project.
 *
 * Limitation: Component-level accessibility behavior tests (aria-invalid,
 * aria-pressed, aria-expanded, role="status", aria-sort, skip-link target)
 * are not automated here. Manual verification is required.
 */
import { describe, it, expect } from 'vitest';
import { PACKAGES } from '@/lib/config/packages';

describe('Package config: accessible content availability', () => {
  it('every package has a non-empty name for labeling', () => {
    for (const pkg of PACKAGES) {
      expect(pkg.name.length).toBeGreaterThan(0);
    }
  });

  it('every package has a non-empty shortDescription for SR context', () => {
    for (const pkg of PACKAGES) {
      expect(pkg.shortDescription.length).toBeGreaterThan(0);
    }
  });

  it('every package has a non-empty priceDisplay for pricing announcement', () => {
    for (const pkg of PACKAGES) {
      expect(pkg.priceDisplay.length).toBeGreaterThan(0);
    }
  });

  it('Signature has guestMax for eligibility messaging', () => {
    const sig = PACKAGES.find(p => p.id === 'signature-experience');
    expect(sig?.guestMax).toBe(35);
  });

  it('Celebration has guestMin for eligibility messaging', () => {
    const cel = PACKAGES.find(p => p.id === 'celebration-experience');
    expect(cel?.guestMin).toBe(36);
  });

  it('Premier and Reserve have null guest restrictions', () => {
    const premier = PACKAGES.find(p => p.id === 'premier-experience');
    const reserve = PACKAGES.find(p => p.id === 'reserve-experience');
    expect(premier?.guestMin).toBeNull();
    expect(premier?.guestMax).toBeNull();
    expect(reserve?.guestMin).toBeNull();
    expect(reserve?.guestMax).toBeNull();
  });
});
