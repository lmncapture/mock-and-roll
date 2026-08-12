'use client';

export interface StepColorScheme {
  idle: string; // e.g., "bg-frosted-mint/40"
  hover: string; // e.g., "hover:bg-frosted-mint/70" (already includes hover: prefix)
  selected: string; // e.g., "bg-lime-sorbet"
}

interface IngredientChipProps {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
  colorScheme: StepColorScheme;
}

export default function IngredientChip({
  name,
  isSelected,
  onSelect,
  colorScheme,
}: IngredientChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={[
        'rounded-full',
        'min-h-[44px] min-w-[44px] px-5 py-2.5',
        'font-body font-medium text-sm text-slate',
        'transition-colors duration-200',
        'cursor-pointer',
        isSelected
          ? colorScheme.selected
          : `${colorScheme.idle} ${colorScheme.hover}`,
      ].join(' ')}
    >
      {name}
    </button>
  );
}
