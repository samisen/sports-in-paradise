export function usd(value: number, opts: { compact?: boolean } = {}): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: opts.compact && value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(value);
}
