"use client";

export interface StepColorScheme {
  idle: string;
  hover: string;
  selected: string;
  ring: string;
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
  const baseClasses = [
    "rounded-full",
    "min-h-[44px]",
    "min-w-[44px]",
    "px-5",
    "py-2.5",
    "font-body",
    "font-medium",
    "text-sm",
    "text-slate",
    "transition-colors",
    "duration-200",
    "cursor-pointer",
    "select-none",
  ].join(" ");

  const stateClasses = isSelected
    ? colorScheme.selected
    : `${colorScheme.idle} hover:${colorScheme.hover}`;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={`${baseClasses} ${stateClasses}`}
    >
      {name}
    </button>
  );
}
