export function currencyFormatter(amount: number) {
  // Resolve locale from system or fallback to 'en-US' for SSR
  const resolvedLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';

  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
  }).format(amount);
}
