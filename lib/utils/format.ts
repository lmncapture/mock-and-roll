import { BUSINESS_TIMEZONE } from '@/lib/config/timezone';

/**
 * Format a PostgreSQL date (YYYY-MM-DD) as a human-readable calendar date.
 * Parses date components directly to avoid UTC timezone rollover issues.
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Use UTC to prevent local timezone shifting the day
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // UTC because we constructed it in UTC from calendar components
  }).format(date);
}

/**
 * Format a PostgreSQL time (HH:MM) as a 12-hour wall-clock time.
 * Parses hour/minute directly — no timezone conversion needed.
 */
export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format an actual timestamp (ISO 8601 / timestamptz) in the business timezone.
 * Use for created_at, updated_at, etc.
 */
export function formatDateTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Get today's date string (YYYY-MM-DD) in the business timezone.
 * Used for event date validation (must be today or future).
 */
export function getTodayInBusinessTimezone(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const year = parts.find(p => p.type === 'year')!.value;
  const month = parts.find(p => p.type === 'month')!.value;
  const day = parts.find(p => p.type === 'day')!.value;
  return `${year}-${month}-${day}`;
}
