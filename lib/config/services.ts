/**
 * Central configuration for service-related pricing and policies.
 * This is the single source of truth — components should import from here
 * rather than hardcoding values.
 */

export const SERVICE_PRICING = {
  /** Hours of service included in every package */
  includedHours: 3,
  /** Cost per additional hour beyond the included service time */
  additionalHourRate: 100,
  /** Miles of travel included at no extra charge */
  includedTravelMiles: 20,
  /** Hosted gratuity percentage */
  hostedGratuityPercent: 18,
} as const;

export interface TravelTier {
  readonly minMiles: number;
  readonly maxMiles: number | null;
  readonly label: string;
  readonly price: number | null;
  readonly priceDisplay: string;
}

/**
 * Tiered travel pricing from the Mock & Roll home base.
 *
 * Display logic: use `label` and `priceDisplay` for UI rendering.
 * Calculation logic: the custom-quote tier begins ABOVE 60 miles,
 * so exactly 60 miles falls within the $110 tier (51–60).
 */
export const TRAVEL_PRICING: readonly TravelTier[] = [
  { minMiles: 0, maxMiles: 20, label: '0–20 miles', price: 0, priceDisplay: 'Included' },
  { minMiles: 21, maxMiles: 30, label: '21–30 miles', price: 35, priceDisplay: '$35' },
  { minMiles: 31, maxMiles: 40, label: '31–40 miles', price: 60, priceDisplay: '$60' },
  { minMiles: 41, maxMiles: 50, label: '41–50 miles', price: 85, priceDisplay: '$85' },
  { minMiles: 51, maxMiles: 60, label: '51–60 miles', price: 110, priceDisplay: '$110' },
  { minMiles: 61, maxMiles: null, label: '60+ miles', price: null, priceDisplay: 'Custom quote' },
] as const;
