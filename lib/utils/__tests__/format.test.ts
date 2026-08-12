import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, formatDateTime } from '../format';

describe('formatDate', () => {
  it('formats YYYY-MM-DD as readable date', () => {
    expect(formatDate('2026-08-11')).toBe('August 11, 2026');
  });

  it('does not shift dates due to UTC rollover', () => {
    // This is the critical test - a date like 2026-01-01 should NOT become Dec 31, 2025
    expect(formatDate('2026-01-01')).toBe('January 1, 2026');
    expect(formatDate('2026-12-31')).toBe('December 31, 2026');
  });
});

describe('formatTime', () => {
  it('formats 24h time as 12h', () => {
    expect(formatTime('18:30')).toBe('6:30 PM');
    expect(formatTime('09:00')).toBe('9:00 AM');
    expect(formatTime('00:00')).toBe('12:00 AM');
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('23:59')).toBe('11:59 PM');
  });
});

describe('formatDateTime', () => {
  it('formats ISO timestamp in business timezone', () => {
    const result = formatDateTime('2026-08-11T18:30:00Z');
    expect(result).toContain('August');
    expect(result).toContain('2026');
    // Should contain AM or PM
    expect(result).toMatch(/AM|PM/);
  });
});
