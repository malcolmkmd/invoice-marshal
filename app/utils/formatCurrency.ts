export const currencyOptions = ['ZAR', 'USD', 'EUR'] as const;

export type SupportedCurrency = (typeof currencyOptions)[number];

interface iFormatCurrencyProps {
  amount: number;
  currency: SupportedCurrency;
}

export function formatCurrency({ amount, currency }: iFormatCurrencyProps) {
  // Resolve locale from system or fallback to 'en-US' for SSR
  const resolvedLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';

  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  }).format(amount);
}
