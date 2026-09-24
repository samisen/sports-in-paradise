export function usd(value: number, opts: { compact?: boolean } = {}): string {
  if (!Number.isFinite(value)) return '—';
  if (opts.compact && value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: value >= 1_000_000 ? 2 : 0,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  construction: 'Under construction',
  reserved: 'Reserved',
  delivered: 'Delivered',
  'coming-soon': 'Coming soon',
};

export const STATUS_COLOR: Record<string, string> = {
  available: 'green',
  construction: 'gold',
  reserved: 'blue',
  delivered: 'default',
  'coming-soon': 'purple',
};

export const TYPE_LABEL: Record<string, string> = {
  villa: 'Villa',
  townhouse: 'Townhouse',
  apartment: 'Apartment',
  commercial: 'Commercial',
  land: 'Land',
};
