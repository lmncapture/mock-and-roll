/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  normalizeEmail,
  normalizeName,
  normalizePhone,
  setAdvancedMatching,
  trackLead,
  META_PIXEL_ID,
} from '../meta';

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

describe('normalizeEmail', () => {
  it('trims whitespace and lowercases', () => {
    expect(normalizeEmail('  JSmith@Example.COM  ')).toBe('jsmith@example.com');
  });

  it('handles already-normalized input', () => {
    expect(normalizeEmail('user@test.com')).toBe('user@test.com');
  });

  it('handles empty string', () => {
    expect(normalizeEmail('')).toBe('');
  });
});

describe('normalizeName', () => {
  it('trims, lowercases, and strips non-alpha characters', () => {
    expect(normalizeName('  John  ')).toBe('john');
  });

  it('removes hyphens and apostrophes', () => {
    expect(normalizeName("O'Brien-Smith")).toBe('obriensmith');
  });

  it('removes digits', () => {
    expect(normalizeName('Jane2')).toBe('jane');
  });

  it('handles accented characters by removing them', () => {
    // Meta docs specify lowercase letters only (a-z)
    expect(normalizeName('José')).toBe('jos');
  });

  it('handles empty string', () => {
    expect(normalizeName('')).toBe('');
  });
});

describe('normalizePhone', () => {
  it('strips non-digit characters', () => {
    expect(normalizePhone('+1 (650) 555-4444')).toBe('16505554444');
  });

  it('prepends US country code for 10-digit numbers', () => {
    expect(normalizePhone('6505554444')).toBe('16505554444');
  });

  it('does not modify 11-digit numbers starting with 1', () => {
    expect(normalizePhone('16505554444')).toBe('16505554444');
  });

  it('handles formatted US numbers', () => {
    expect(normalizePhone('(425) 555-1234')).toBe('14255551234');
  });

  it('preserves international numbers with more than 10 digits', () => {
    expect(normalizePhone('+44 7911 123456')).toBe('447911123456');
  });

  it('handles empty string', () => {
    expect(normalizePhone('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// setAdvancedMatching
// ---------------------------------------------------------------------------

describe('setAdvancedMatching', () => {
  let mockFbq: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFbq = vi.fn();
    (window as unknown as Record<string, unknown>).fbq = mockFbq;
  });

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).fbq;
  });

  it('calls fbq init with normalized user data', () => {
    setAdvancedMatching({
      email: '  Lauren@MockNRoll.com ',
      firstName: 'Lauren',
      lastName: 'Smith',
      phone: '(425) 555-0199',
    });

    expect(mockFbq).toHaveBeenCalledWith('init', META_PIXEL_ID, {
      em: 'lauren@mocknroll.com',
      fn: 'lauren',
      ln: 'smith',
      ph: '14255550199',
    });
  });

  it('only includes populated fields', () => {
    setAdvancedMatching({
      email: 'test@example.com',
      firstName: '',
      lastName: '',
      phone: '',
    });

    expect(mockFbq).toHaveBeenCalledWith('init', META_PIXEL_ID, {
      em: 'test@example.com',
    });
  });

  it('does not call fbq if all fields are empty', () => {
    setAdvancedMatching({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
    });

    expect(mockFbq).not.toHaveBeenCalled();
  });

  it('no-ops when fbq is not available', () => {
    delete (window as unknown as Record<string, unknown>).fbq;

    // Should not throw
    expect(() =>
      setAdvancedMatching({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '5551234567',
      })
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// trackLead — confirm no PII in event params
// ---------------------------------------------------------------------------

describe('trackLead', () => {
  let mockFbq: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFbq = vi.fn();
    (window as unknown as Record<string, unknown>).fbq = mockFbq;
  });

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).fbq;
  });

  it('fires Lead event with non-PII params only', () => {
    trackLead({
      content_name: 'Crowd Pleaser',
      content_category: 'crowd-pleaser',
      guest_count: 75,
    });

    expect(mockFbq).toHaveBeenCalledWith('track', 'Lead', {
      content_name: 'Crowd Pleaser',
      content_category: 'crowd-pleaser',
      guest_count: 75,
    });

    // Confirm no PII keys
    const params = mockFbq.mock.calls[0][2] as Record<string, unknown>;
    expect(params).not.toHaveProperty('email');
    expect(params).not.toHaveProperty('em');
    expect(params).not.toHaveProperty('phone');
    expect(params).not.toHaveProperty('ph');
    expect(params).not.toHaveProperty('firstName');
    expect(params).not.toHaveProperty('fn');
    expect(params).not.toHaveProperty('lastName');
    expect(params).not.toHaveProperty('ln');
    expect(params).not.toHaveProperty('value');
    expect(params).not.toHaveProperty('currency');
  });

  it('does not fire when fbq is unavailable', () => {
    delete (window as unknown as Record<string, unknown>).fbq;
    trackLead({ content_name: 'Test' });
    // mockFbq is gone, so nothing to assert except no error thrown
  });
});
