'use client';

import SignatureSelector from './SignatureSelector';
import CustomMocktailBuilder from './CustomMocktailBuilder';

interface DrinkSlotState {
  choiceType: 'signature' | 'custom' | null;
  signatureDrinkId: string | null;
  custom: {
    base: string | null;
    puree: string | null;
    syrup: string | null;
    garnishes: string[];
  };
}

interface DrinkSlotProps {
  index: number;
  state: DrinkSlotState;
  onChange: (index: number, state: DrinkSlotState) => void;
  isExcess?: boolean;
}

export type { DrinkSlotState };

export default function DrinkSlot({ index, state, onChange, isExcess = false }: DrinkSlotProps) {
  const setChoiceType = (type: 'signature' | 'custom') => {
    // When switching types, clear stale data from the other type
    if (type === 'signature') {
      onChange(index, { ...state, choiceType: 'signature', custom: { base: null, puree: null, syrup: null, garnishes: [] } });
    } else {
      onChange(index, { ...state, choiceType: 'custom', signatureDrinkId: null });
    }
  };

  const handleSignatureSelect = (id: string) => {
    onChange(index, { ...state, signatureDrinkId: id });
  };

  const handleCustomChange = (custom: DrinkSlotState['custom']) => {
    onChange(index, { ...state, custom });
  };

  return (
    <div className={[
      'rounded-2xl p-5 lg:p-6 border',
      isExcess
        ? 'border-rose-petal bg-rose-petal/10 opacity-70'
        : 'border-slate/10 bg-frosted-mint/10',
    ].join(' ')}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-slate">Drink {index + 1}</h3>
        {isExcess && (
          <span className="font-body text-xs text-rose-500 font-medium">Not included in this package</span>
        )}
      </div>

      {!isExcess && (
        <>
          {/* Choice type toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setChoiceType('signature')}
              className={[
                'font-body text-sm px-4 py-2.5 min-h-[44px] rounded-full transition-colors duration-200',
                state.choiceType === 'signature'
                  ? 'bg-slate text-cool-white'
                  : 'bg-slate/10 text-slate hover:bg-slate/20',
              ].join(' ')}
            >
              Signature Mocktail
            </button>
            <button
              type="button"
              onClick={() => setChoiceType('custom')}
              className={[
                'font-body text-sm px-4 py-2.5 min-h-[44px] rounded-full transition-colors duration-200',
                state.choiceType === 'custom'
                  ? 'bg-slate text-cool-white'
                  : 'bg-slate/10 text-slate hover:bg-slate/20',
              ].join(' ')}
            >
              Create Your Own
            </button>
          </div>

          {/* Conditional content based on choice type */}
          {state.choiceType === 'signature' && (
            <SignatureSelector
              selectedId={state.signatureDrinkId}
              onSelect={handleSignatureSelect}
            />
          )}
          {state.choiceType === 'custom' && (
            <CustomMocktailBuilder
              state={state.custom}
              onChange={handleCustomChange}
            />
          )}
          {state.choiceType === null && (
            <p className="font-body text-sm text-slate/50 italic">
              Choose a drink type above to get started.
            </p>
          )}
        </>
      )}
    </div>
  );
}
