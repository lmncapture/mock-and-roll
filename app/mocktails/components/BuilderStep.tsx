"use client";

import IngredientChip, { type StepColorScheme } from "./IngredientChip";

interface BuilderStepProps {
  stepNumber: string;
  label: string;
  options: string[];
  selected: string | string[] | null;
  onSelect: (name: string) => void;
  colorScheme: StepColorScheme;
  multiSelect: boolean;
}

export default function BuilderStep({
  stepNumber,
  label,
  options,
  selected,
  onSelect,
  colorScheme,
  multiSelect,
}: BuilderStepProps) {
  function isChipSelected(name: string): boolean {
    if (multiSelect) {
      return Array.isArray(selected) && selected.includes(name);
    }
    return selected === name;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-4 md:gap-8 items-start">
      {/* Left column: step number + heading */}
      <div>
        <span className="font-body text-sm font-semibold tracking-widest uppercase text-slate/40 block mb-1">
          {stepNumber}
        </span>
        <h3 className="font-display text-2xl lg:text-3xl text-slate">
          {label}
        </h3>
      </div>

      {/* Right column: chip grid */}
      <div className="flex flex-wrap gap-3 items-center">
        {options.map((option) => (
          <IngredientChip
            key={option}
            name={option}
            isSelected={isChipSelected(option)}
            onSelect={() => onSelect(option)}
            colorScheme={colorScheme}
          />
        ))}
      </div>
    </div>
  );
}
