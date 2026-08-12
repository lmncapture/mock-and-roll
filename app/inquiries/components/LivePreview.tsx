'use client';

interface LivePreviewProps {
  base: string | null;
  puree: string | null;
  syrup: string | null;
  garnishes: string[];
}

function formatGarnishes(garnishes: string[]): string {
  if (garnishes.length === 0) return '';
  if (garnishes.length === 1) return garnishes[0];
  if (garnishes.length === 2) return `${garnishes[0]} & ${garnishes[1]}`;
  return `${garnishes.slice(0, -1).join(', ')} & ${garnishes[garnishes.length - 1]}`;
}

export default function LivePreview({ base, puree, syrup, garnishes }: LivePreviewProps) {
  const hasSelections = base !== null || puree !== null || syrup !== null || garnishes.length > 0;

  if (!hasSelections) return null;

  const segments: { label: string; isFirst: boolean }[] = [];

  if (base !== null) {
    segments.push({ label: base, isFirst: segments.length === 0 });
  }
  if (puree !== null) {
    segments.push({ label: `${puree} Purée`, isFirst: segments.length === 0 });
  }
  if (syrup !== null) {
    segments.push({ label: `${syrup} Syrup`, isFirst: segments.length === 0 });
  }
  if (garnishes.length > 0) {
    segments.push({ label: formatGarnishes(garnishes), isFirst: segments.length === 0 });
  }

  return (
    <div className="mt-6 p-4 rounded-xl bg-frosted-mint/20 border border-slate/10">
      <h4 className="font-display text-base text-slate">Your Mocktail</h4>
      <div className="mt-2 space-y-0.5">
        {segments.map((segment) => (
          <p key={segment.label} className="font-body text-sm text-slate/80">
            {segment.isFirst ? segment.label : `+ ${segment.label}`}
          </p>
        ))}
      </div>
      <p className="mt-2 font-body text-xs text-slate/60 italic">
        Sparkling with club soda
      </p>
    </div>
  );
}
