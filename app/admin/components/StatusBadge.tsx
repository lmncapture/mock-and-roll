import { STATUS_LABELS, type InquiryStatus } from '@/lib/config/statuses';

const STATUS_COLORS: Record<InquiryStatus, string> = {
  new: 'bg-lime-sorbet/60 text-slate',
  contacted: 'bg-lemon-zest/50 text-slate',
  in_discussion: 'bg-peach-nectar/50 text-slate',
  booked: 'bg-frosted-mint/60 text-slate',
  closed: 'bg-slate/15 text-slate/60',
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status as InquiryStatus] ?? status;
  const colors = STATUS_COLORS[status as InquiryStatus] ?? 'bg-slate/10 text-slate';

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full font-body text-xs font-medium ${colors}`}>
      {label}
    </span>
  );
}
