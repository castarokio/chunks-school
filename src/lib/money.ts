const zeroDecimalCurrencies = new Set(['DZD', 'JPY', 'KRW']);

export function currencyScale(currency: string): number {
  return zeroDecimalCurrencies.has(currency.toUpperCase()) ? 1 : 100;
}

export function toMinorUnits(amount: unknown, currency = 'DZD'): number | null {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) return null;

  const scale = currencyScale(currency);
  const minor = Math.round(amount * scale);
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}

export function fromMinorUnits(amountMinor: number, currency = 'DZD'): number {
  return amountMinor / currencyScale(currency);
}
