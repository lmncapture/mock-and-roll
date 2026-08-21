export interface PackageConfig {
  readonly id: string;
  readonly name: string;
  readonly pricingMode: 'flat' | 'per_guest';
  readonly price: number;
  readonly priceDisplay: string;
  readonly guestMin: number | null;
  readonly guestMax: number | null;
  readonly allowedDrinkCount: number;
  readonly badge: string | null;
  readonly shortDescription: string;
}

export const PACKAGES: readonly PackageConfig[] = [
  {
    id: 'signature-experience',
    name: 'Signature Experience',
    pricingMode: 'flat',
    price: 550,
    priceDisplay: '$550 + tax',
    guestMin: null,
    guestMax: 35,
    allowedDrinkCount: 2,
    badge: 'Most Popular',
    shortDescription: 'Up to 35 guests • 2 drinks • $550 + tax',
  },
  {
    id: 'celebration-experience',
    name: 'Celebration Experience',
    pricingMode: 'per_guest',
    price: 16,
    priceDisplay: '$16/person + tax',
    guestMin: 36,
    guestMax: null,
    allowedDrinkCount: 2,
    badge: null,
    shortDescription: '36+ guests • 2 drinks • $16/person + tax',
  },
  {
    id: 'premier-experience',
    name: 'Premier Experience',
    pricingMode: 'per_guest',
    price: 18,
    priceDisplay: '$18/person + tax',
    guestMin: null,
    guestMax: null,
    allowedDrinkCount: 3,
    badge: null,
    shortDescription: '3 drinks • $18/person + tax',
  },
  {
    id: 'reserve-experience',
    name: 'Reserve Experience',
    pricingMode: 'per_guest',
    price: 20,
    priceDisplay: '$20/person + tax',
    guestMin: null,
    guestMax: null,
    allowedDrinkCount: 4,
    badge: 'Most Elevated',
    shortDescription: '4 drinks • $20/person + tax',
  },
] as const;

export const PACKAGE_IDS = PACKAGES.map((p) => p.id);

export function getPackageById(id: string): PackageConfig | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function isPackageEligible(packageId: string, guestCount: number): boolean {
  const pkg = getPackageById(packageId);
  if (!pkg) return false;
  if (pkg.guestMin !== null && guestCount < pkg.guestMin) return false;
  if (pkg.guestMax !== null && guestCount > pkg.guestMax) return false;
  return true;
}
