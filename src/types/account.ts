import { AccountType } from '../constants/accountTypes';
import { Currency } from '../constants/currencies';

export interface Account {
  id: string;
  name: string;
  bank: string;
  type: AccountType;
  currency: Currency;
  balance: number;
}

export type AccountFormData = Omit<Account, 'id' | 'balance'>;
