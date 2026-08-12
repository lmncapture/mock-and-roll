export const EVENT_TYPES = [
  'Wedding',
  'Bridal Shower',
  'Baby Shower',
  'Birthday',
  'Corporate Event',
  'Networking Event',
  'Community Event',
  'Private Party',
  'Family Event',
  'Other',
] as const;

export type EventType = typeof EVENT_TYPES[number];
