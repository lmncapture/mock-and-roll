import { describe, it, expect } from 'vitest';
import { sanitizeAdminParams, PAGE_SIZE } from '../admin-params';

describe('sanitizeAdminParams', () => {
  it('returns defaults for empty params', () => {
    const result = sanitizeAdminParams({});
    expect(result.sort).toBe('created_at');
    expect(result.direction).toBe('desc');
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(PAGE_SIZE);
  });

  it('validates status against canonical values', () => {
    const valid = sanitizeAdminParams({ status: 'new' });
    expect(valid.status).toBe('new');

    const invalid = sanitizeAdminParams({ status: 'fake_status' });
    expect(invalid.status).toBeUndefined();
  });

  it('validates sort column', () => {
    const valid = sanitizeAdminParams({ sort: 'event_date' });
    expect(valid.sort).toBe('event_date');

    const invalid = sanitizeAdminParams({ sort: 'malicious_column' });
    expect(invalid.sort).toBe('created_at');
  });

  it('enforces minimum page', () => {
    const result = sanitizeAdminParams({ page: '0' });
    expect(result.page).toBe(1);
  });

  it('trims search input', () => {
    const result = sanitizeAdminParams({ search: '  smith  ' });
    expect(result.search).toBe('smith');
  });
});
