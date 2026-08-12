import { z } from 'zod';
import { INQUIRY_STATUSES } from '@/lib/config/statuses';
import { PACKAGE_IDS } from '@/lib/config/packages';
import { EVENT_TYPES } from '@/lib/config/event-types';

const ALLOWED_SORTS = ['created_at', 'event_date'] as const;
const ALLOWED_DIRECTIONS = ['asc', 'desc'] as const;
export const PAGE_SIZE = 20;

// Build the schema with safe defaults for invalid values
const adminParamsSchema = z.object({
  search: z.string().max(100).optional().transform(s => s?.trim() || undefined),
  status: z.enum(INQUIRY_STATUSES).optional().catch(undefined),
  eventType: z.enum(EVENT_TYPES).optional().catch(undefined),
  package: z.enum(PACKAGE_IDS as [string, ...string[]]).optional().catch(undefined),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().catch(undefined),
  sort: z.enum(ALLOWED_SORTS).optional().catch('created_at' as const),
  direction: z.enum(ALLOWED_DIRECTIONS).optional().catch('desc' as const),
  page: z.coerce.number().int().min(1).optional().catch(1),
});

export type ValidatedAdminParams = {
  search: string | undefined;
  status: string | undefined;
  eventType: string | undefined;
  packageFilter: string | undefined;
  eventDate: string | undefined;
  sort: 'created_at' | 'event_date';
  direction: 'asc' | 'desc';
  page: number;
  pageSize: number;
};

export function sanitizeAdminParams(raw: Record<string, string | undefined>): ValidatedAdminParams {
  const parsed = adminParamsSchema.parse(raw);
  return {
    search: parsed.search,
    status: parsed.status,
    eventType: parsed.eventType,
    packageFilter: parsed.package,
    eventDate: parsed.eventDate,
    sort: parsed.sort ?? 'created_at',
    direction: parsed.direction ?? 'desc',
    page: parsed.page ?? 1,
    pageSize: PAGE_SIZE,
  };
}
