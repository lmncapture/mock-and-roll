"use client";

interface LivePreviewProps {
  base: string | null;
  puree: string | null;
  syrup: string | null;
  garnishes: string[];
  onReset: () => void;
}

function formatGarnishes(garnishes: string[]): string {
  if (garnishes.length === 0) return "";
  if (garnishes.length === 1) return garnishes[0];
  if (garnishes.length === 2) return `${garnishes[0]} & ${garnishes[1]}`;
  return `${garnishes.slice(0, -1).join(", ")} & ${garnishes[garnishes.length - 1]}`;
}

export default function LivePreview({
  base,
  puree,
  syrup,
  garnishes,
  onReset,
}: LivePreviewProps) {
  const hasSelections =
    base !== null || puree !== null || syrup !== null || garnishes.length > 0;

  if (!hasSelections) {
    return null;
  }

  // Build segments — each segment is a line in the recipe card
  const segments: { label: string; isFirst?: boolean }[] = [];

  if (base) {
    segments.push({ label: base });
  }
  if (puree) {
    segments.push({ label: `${puree} Purée` });
  }
  if (syrup) {
    segments.push({ label: `${syrup} Syrup` });
  }
  if (garnishes.length > 0) {
    segments.push({ label: formatGarnishes(garnishes) });
  }

  // Mark the first segment
  if (segments.length > 0) {
    segments[0].isFirst = true;
  }

  return (
    <div className="mt-12 lg:mt-16 p-6 lg:p-8 rounded-2xl bg-frosted-mint/30">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl lg:text-2xl text-slate">
          Your Mocktail
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="font-body text-sm text-slate/50 underline hover:text-slate/75 transition-colors shrink-0"
        >
          Start Over
        </button>
      </div>

      <div className="mt-4 space-y-1">
        {segments.map((segment) => (
          <p
            key={segment.label}
            className="font-body text-base lg:text-lg text-slate/80"
          >
            {!segment.isFirst && (
              <span className="text-slate/40">+ </span>
            )}
            {segment.label}
          </p>
        ))}
      </div>

      <p className="mt-4 font-body text-sm text-slate/60 italic">
        Sparkling with club soda
      </p>
    </div>
  );
}
