interface DrinkChoice {
  position: number;
  choice_type: 'signature' | 'custom';
  signature_drink_name_snapshot: string | null;
  custom_mocktail?: {
    base: string;
    puree: string;
    syrup: string;
    garnishes: string[];
  } | null;
}

interface DrinkDisplayProps {
  drinks: DrinkChoice[];
}

function formatGarnishes(garnishes: string[]): string {
  if (garnishes.length === 0) return 'None';
  if (garnishes.length === 1) return garnishes[0];
  if (garnishes.length === 2) return `${garnishes[0]} & ${garnishes[1]}`;
  return `${garnishes.slice(0, -1).join(', ')} & ${garnishes[garnishes.length - 1]}`;
}

export default function DrinkDisplay({ drinks }: DrinkDisplayProps) {
  return (
    <div className="space-y-4">
      {drinks.map((drink) => (
        <div key={drink.position} className="rounded-xl border border-slate/10 p-4">
          <h4 className="font-body text-sm font-semibold text-slate">
            Drink {drink.position}
          </h4>

          {drink.choice_type === 'signature' && (
            <div className="mt-2">
              <p className="font-body text-xs text-slate/75 uppercase tracking-wider">Signature Mocktail</p>
              <p className="font-body text-sm text-slate mt-0.5">
                {drink.signature_drink_name_snapshot}
              </p>
            </div>
          )}

          {drink.choice_type === 'custom' && drink.custom_mocktail && (
            <div className="mt-2 space-y-1">
              <p className="font-body text-xs text-slate/75 uppercase tracking-wider">Custom Mocktail</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <p className="font-body text-xs text-slate/75">Base</p>
                <p className="font-body text-sm text-slate">{drink.custom_mocktail.base}</p>
                <p className="font-body text-xs text-slate/75">Purée</p>
                <p className="font-body text-sm text-slate">{drink.custom_mocktail.puree}</p>
                <p className="font-body text-xs text-slate/75">Syrup</p>
                <p className="font-body text-sm text-slate">{drink.custom_mocktail.syrup}</p>
                <p className="font-body text-xs text-slate/75">Garnishes</p>
                <p className="font-body text-sm text-slate">{formatGarnishes(drink.custom_mocktail.garnishes)}</p>
                <p className="font-body text-xs text-slate/75">Preparation</p>
                <p className="font-body text-sm text-slate/70 italic">Sparkling with club soda</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
