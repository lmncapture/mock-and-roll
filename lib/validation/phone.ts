import { parsePhoneNumberFromString } from 'libphonenumber-js';

export interface NormalizedPhone {
  phoneNumber: string;       // E.164 or trimmed raw
  phoneSearchDigits: string; // digits only for search
}

/**
 * Normalize a phone number input into storage and search representations.
 *
 * Tier A: libphonenumber-js parses AND confirms valid → E.164
 * Tier B: Cannot confirm valid, but ≥10 digits present → trimmed raw + digits
 * Tier C: <10 digits AND not parseable/valid → reject
 *
 * Default parsing country: US (unless input starts with +)
 */
export function normalizePhone(raw: string): NormalizedPhone {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('Phone number is required');
  }

  const digits = trimmed.replace(/\D/g, '');

  // Attempt E.164 parsing (default country US unless + prefix supplied)
  const parsed = parsePhoneNumberFromString(trimmed, 'US');

  // TIER A: libphonenumber-js parses AND confirms valid
  if (parsed && parsed.isValid()) {
    const e164 = parsed.format('E.164');
    return {
      phoneNumber: e164,
      phoneSearchDigits: e164.replace(/\D/g, ''),
    };
  }

  // TIER B: Cannot confirm valid, but ≥10 digits present
  if (digits.length >= 10) {
    return {
      phoneNumber: trimmed,
      phoneSearchDigits: digits,
    };
  }

  // TIER C: <10 digits AND not parseable/valid → reject
  throw new Error('Phone number does not appear to be valid');
}

/**
 * Strip non-digit characters from a search input for phone matching.
 */
export function normalizePhoneForSearch(input: string): string {
  return input.replace(/\D/g, '');
}
