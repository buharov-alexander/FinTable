export const ACCOUNT_TYPES = {
  CASH: 'CASH',
  DEPOSIT: 'DEPOSIT',
  SAVINGS: 'SAVINGS',
  INVESTMENT: 'INVESTMENT',
  CRYPTO: 'CRYPTO'
} as const;

export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.CASH]: 'Наличные',
  [ACCOUNT_TYPES.DEPOSIT]: 'Депозит',
  [ACCOUNT_TYPES.SAVINGS]: 'Сберегательный счет',
  [ACCOUNT_TYPES.INVESTMENT]: 'Инвестиционный счет',
  [ACCOUNT_TYPES.CRYPTO]: 'Крипта'
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];
