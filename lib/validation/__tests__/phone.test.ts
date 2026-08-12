import { describe, it, expect } from 'vitest';
import { normalizePhone, normalizePhoneForSearch } from '../phone';

describe('normalizePhone', () => {
  it('converts valid US number to E.164', () => {
    const result = normalizePhone('(425) 555-1234');
    expect(result.phoneNumber).toBe('+14255551234');
    expect(result.phoneSearchDigits).toBe('14255551234');
  });

  it('converts plain 10-digit US number to E.164', () => {
    const result = normalizePhone('4255551234');
    expect(result.phoneNumber).toBe('+14255551234');
    expect(result.phoneSearchDigits).toBe('14255551234');
  });

  it('preserves international +44 number', () => {
    const result = normalizePhone('+44 20 7946 0958');
    expect(result.phoneNumber).toBe('+442079460958');
    expect(result.phoneSearchDigits).toBe('442079460958');
  });

  it('accepts ambiguous ≥10-digit number', () => {
    const result = normalizePhone('1234567890123');
    expect(result.phoneNumber).toBeTruthy();
    expect(result.phoneSearchDigits.length).toBeGreaterThanOrEqual(10);
  });

  it('rejects 7-digit value without E.164 validation', () => {
    expect(() => normalizePhone('5551234')).toThrow();
  });

  it('rejects clearly invalid input', () => {
    expect(() => normalizePhone('abc')).toThrow();
    expect(() => normalizePhone('12345')).toThrow();
    expect(() => normalizePhone('')).toThrow();
  });

  it('trims whitespace', () => {
    const result = normalizePhone('  (425) 555-1234  ');
    expect(result.phoneNumber).toBe('+14255551234');
  });
});

describe('normalizePhoneForSearch', () => {
  it('strips non-digits', () => {
    expect(normalizePhoneForSearch('(425) 555-1234')).toBe('4255551234');
    expect(normalizePhoneForSearch('+1-425-555-1234')).toBe('14255551234');
  });
});
