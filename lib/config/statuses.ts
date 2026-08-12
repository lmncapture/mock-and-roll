export const INQUIRY_STATUSES = ['new', 'contacted', 'in_discussion', 'booked', 'closed'] as const;
export type InquiryStatus = typeof INQUIRY_STATUSES[number];

export const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_discussion: 'In Discussion',
  booked: 'Booked',
  closed: 'Closed',
};
