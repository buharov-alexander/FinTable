export const CURRENCIES = {
  RUB: 'RUB',
  USD: 'USD',
  EUR: 'EUR'
} as const;

export const CURRENCY_LABELS = {
  [CURRENCIES.RUB]: 'Российский рубль',
  [CURRENCIES.USD]: 'Доллар США',
  [CURRENCIES.EUR]: 'Евро'
} as const;

export type Currency = typeof CURRENCIES[keyof typeof CURRENCIES];
