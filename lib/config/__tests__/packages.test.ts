import { describe, it, expect } from 'vitest';
import { isPackageEligible, getPackageById, PACKAGES } from '../packages';

describe('isPackageEligible', () => {
  it('Signature accepts ≤35 guests', () => {
    expect(isPackageEligible('signature-experience', 1)).toBe(true);
    expect(isPackageEligible('signature-experience', 35)).toBe(true);
  });

  it('Signature rejects >35 guests', () => {
    expect(isPackageEligible('signature-experience', 36)).toBe(false);
    expect(isPackageEligible('signature-experience', 100)).toBe(false);
  });

  it('Celebration accepts ≥36 guests', () => {
    expect(isPackageEligible('celebration-experience', 36)).toBe(true);
    expect(isPackageEligible('celebration-experience', 200)).toBe(true);
  });

  it('Celebration rejects <36 guests', () => {
    expect(isPackageEligible('celebration-experience', 35)).toBe(false);
    expect(isPackageEligible('celebration-experience', 1)).toBe(false);
  });

  it('Premier has no guest-count restriction', () => {
    expect(isPackageEligible('premier-experience', 1)).toBe(true);
    expect(isPackageEligible('premier-experience', 500)).toBe(true);
  });

  it('Reserve has no guest-count restriction', () => {
    expect(isPackageEligible('reserve-experience', 1)).toBe(true);
    expect(isPackageEligible('reserve-experience', 500)).toBe(true);
  });

  it('invalid package returns false', () => {
    expect(isPackageEligible('nonexistent', 10)).toBe(false);
  });
});

describe('getPackageById', () => {
  it('returns correct package', () => {
    const pkg = getPackageById('signature-experience');
    expect(pkg?.name).toBe('Signature Experience');
    expect(pkg?.allowedDrinkCount).toBe(2);
  });

  it('returns undefined for invalid id', () => {
    expect(getPackageById('fake')).toBeUndefined();
  });
});

describe('PACKAGES', () => {
  it('has exactly 4 packages', () => {
    expect(PACKAGES).toHaveLength(4);
  });
});
