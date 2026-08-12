'use client';

import { SIGNATURE_DRINKS } from '@/lib/config/drinks';

interface SignatureSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function SignatureSelector({ selectedId, onSelect }: SignatureSelectorProps) {
  return (
    <div className="space-y-2 mt-3">
      {SIGNATURE_DRINKS.map(drink => (
        <label
          key={drink.id}
          className={[
            'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-200',
            selectedId === drink.id
              ? 'bg-peach-nectar/30 ring-1 ring-peach-nectar'
              : 'bg-cool-white hover:bg-peach-nectar/10',
          ].join(' ')}
        >
          <input
            type="radio"
            name="signature-drink"
            value={drink.id}
            checked={selectedId === drink.id}
            onChange={() => onSelect(drink.id)}
            className="sr-only"
          />
          <span
            className={[
              'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
              selectedId === drink.id ? 'border-slate bg-slate' : 'border-slate/30',
            ].join(' ')}
          >
            {selectedId === drink.id && (
              <span className="w-1.5 h-1.5 rounded-full bg-cool-white" />
            )}
          </span>
          <span className="font-body text-sm font-medium text-slate">{drink.name}</span>
        </label>
      ))}
    </div>
  );
}
