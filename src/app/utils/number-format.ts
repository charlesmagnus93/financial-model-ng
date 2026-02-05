export function formatNumberEnglish(value: number): string {
  const numberValue = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(numberValue);
}

export function formatNumberCompact(value: number): string {
  const numberValue = Number(value ?? 0);
  const sign = numberValue < 0 ? '-' : '';
  const abs = Math.abs(numberValue);
  if (abs >= 1_000_000) {
    return `${sign}${Math.round(abs / 1_000_000)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${Math.round(abs / 1_000)}k`;
  }
  return formatNumberEnglish(numberValue);
}
