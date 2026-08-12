'use client';

import { BASES, PUREES, SYRUPS, GARNISHES } from '@/lib/config/drinks';
import IngredientChip, { type StepColorScheme } from './IngredientChip';
import LivePreview from './LivePreview';

interface CustomMocktailState {
  base: string | null;
  puree: string | null;
  syrup: string | null;
  garnishes: string[];
}

interface CustomMocktailBuilderProps {
  state: CustomMocktailState;
  onChange: (state: CustomMocktailState) => void;
}

const STEP_COLORS: {
  base: StepColorScheme;
  puree: StepColorScheme;
  syrup: StepColorScheme;
  garnishes: StepColorScheme;
} = {
  base: { idle: 'bg-frosted-mint/40', hover: 'hover:bg-frosted-mint/70', selected: 'bg-lime-sorbet' },
  puree: { idle: 'bg-lemon-zest/40', hover: 'hover:bg-lemon-zest/70', selected: 'bg-peach-nectar' },
  syrup: { idle: 'bg-rose-petal/40', hover: 'hover:bg-rose-petal/70', selected: 'bg-berry-crush' },
  garnishes: { idle: 'bg-blueberry-dew/40', hover: 'hover:bg-blueberry-dew/70', selected: 'bg-soft-plum' },
};

export default function CustomMocktailBuilder({ state, onChange }: CustomMocktailBuilderProps) {
  const handleSingleSelect = (field: 'base' | 'puree' | 'syrup', value: string) => {
    onChange({ ...state, [field]: state[field] === value ? null : value });
  };

  const handleGarnishToggle = (garnish: string) => {
    const garnishes = state.garnishes.includes(garnish)
      ? state.garnishes.filter(g => g !== garnish)
      : [...state.garnishes, garnish];
    onChange({ ...state, garnishes });
  };

  return (
    <div className="space-y-8 mt-4">
      <p className="font-body text-sm text-slate/60 italic">
        All drinks come sparkling with club soda unless otherwise requested.
      </p>

      {/* Step 1: Base */}
      <div>
        <h4 className="font-body text-sm font-semibold tracking-widest uppercase text-slate/40">01</h4>
        <p className="font-display text-lg text-slate mt-1">Choose Your Base</p>
        <div className="flex flex-wrap gap-3 mt-3">
          {BASES.map(base => (
            <IngredientChip
              key={base}
              name={base}
              isSelected={state.base === base}
              onSelect={() => handleSingleSelect('base', base)}
              colorScheme={STEP_COLORS.base}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Purée */}
      <div>
        <h4 className="font-body text-sm font-semibold tracking-widest uppercase text-slate/40">02</h4>
        <p className="font-display text-lg text-slate mt-1">Choose Your Purée</p>
        <div className="flex flex-wrap gap-3 mt-3">
          {PUREES.map(puree => (
            <IngredientChip
              key={puree}
              name={puree}
              isSelected={state.puree === puree}
              onSelect={() => handleSingleSelect('puree', puree)}
              colorScheme={STEP_COLORS.puree}
            />
          ))}
        </div>
      </div>

      {/* Step 3: Syrup */}
      <div>
        <h4 className="font-body text-sm font-semibold tracking-widest uppercase text-slate/40">03</h4>
        <p className="font-display text-lg text-slate mt-1">Choose Your Syrup</p>
        <div className="flex flex-wrap gap-3 mt-3">
          {SYRUPS.map(syrup => (
            <IngredientChip
              key={syrup}
              name={syrup}
              isSelected={state.syrup === syrup}
              onSelect={() => handleSingleSelect('syrup', syrup)}
              colorScheme={STEP_COLORS.syrup}
            />
          ))}
        </div>
      </div>

      {/* Step 4: Garnishes */}
      <div>
        <h4 className="font-body text-sm font-semibold tracking-widest uppercase text-slate/40">04</h4>
        <p className="font-display text-lg text-slate mt-1">Choose Your Garnishes</p>
        <p className="font-body text-xs text-slate/50 mt-0.5">Optional — select as many as you like</p>
        <div className="flex flex-wrap gap-3 mt-3">
          {GARNISHES.map(garnish => (
            <IngredientChip
              key={garnish}
              name={garnish}
              isSelected={state.garnishes.includes(garnish)}
              onSelect={() => handleGarnishToggle(garnish)}
              colorScheme={STEP_COLORS.garnishes}
            />
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <LivePreview
        base={state.base}
        puree={state.puree}
        syrup={state.syrup}
        garnishes={state.garnishes}
      />
    </div>
  );
}
