import { z } from 'zod';
import { PACKAGE_IDS } from '@/lib/config/packages';
import { SIGNATURE_DRINK_IDS, BASES, PUREES, SYRUPS, GARNISHES } from '@/lib/config/drinks';
import { EVENT_TYPES } from '@/lib/config/event-types';

const MAX_TEXT = 200;
const MAX_NOTES = 2000;

const customMocktailSchema = z.object({
  base: z.enum(BASES),
  puree: z.enum(PUREES),
  syrup: z.enum(SYRUPS),
  garnishes: z.array(z.enum(GARNISHES)).default([]),
});

const drinkChoiceSchema = z.discriminatedUnion('choiceType', [
  z.object({
    choiceType: z.literal('signature'),
    signatureDrinkId: z.enum(SIGNATURE_DRINK_IDS as [string, ...string[]]),
  }),
  z.object({
    choiceType: z.literal('custom'),
    custom: customMocktailSchema,
  }),
]);

export const inquirySchema = z.object({
  firstName: z.string().min(1).max(MAX_TEXT),
  lastName: z.string().min(1).max(MAX_TEXT),
  email: z.string().email().max(MAX_TEXT),
  phoneNumber: z.string().min(1).max(30),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eventType: z.enum(EVENT_TYPES),
  eventTypeOther: z.string().max(MAX_TEXT).optional(),
  estimatedGuestCount: z.number().int().positive(),
  eventLocation: z.string().min(1).max(MAX_TEXT),
  eventTime: z.string().regex(/^\d{2}:\d{2}$/),
  packageId: z.enum(PACKAGE_IDS as [string, ...string[]]),
  drinks: z.array(drinkChoiceSchema).min(1).max(4),
  additionalNotes: z.string().max(MAX_NOTES).optional(),
  honeypot: z.string().max(0).optional(),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;
