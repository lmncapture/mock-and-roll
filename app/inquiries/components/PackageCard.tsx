'use client';

import { type PackageConfig } from '@/lib/config/packages';

interface PackageCardProps {
  pkg: PackageConfig;
  isSelected: boolean;
  isEligible: boolean;
  onSelect: (id: string) => void;
}

export default function PackageCard({ pkg, isSelected, isEligible, onSelect }: PackageCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pkg.id)}
      disabled={!isEligible}
      aria-pressed={isSelected}
      className={[
        'w-full text-left rounded-2xl p-5 lg:p-6 transition-all duration-200 border-2',
        isSelected
          ? 'border-slate bg-frosted-mint/30'
          : isEligible
            ? 'border-transparent bg-cool-white hover:bg-frosted-mint/20 cursor-pointer'
            : 'border-transparent bg-slate/5 opacity-60 cursor-not-allowed',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {pkg.badge && (
            <span className="font-body text-xs font-semibold text-slate/60 tracking-widest uppercase">
              {pkg.badge}
            </span>
          )}
          <h3 className="font-display text-lg lg:text-xl text-slate mt-0.5">{pkg.name}</h3>
          <p className="font-body text-sm text-slate/70 mt-1">{pkg.shortDescription}</p>
        </div>
        <span className="font-display text-xl lg:text-2xl text-slate flex-shrink-0">
          {pkg.priceDisplay}
        </span>
      </div>
      {!isEligible && (
        <p className="font-body text-xs text-rose-500 mt-2">
          Not available for your guest count
        </p>
      )}
    </button>
  );
}
