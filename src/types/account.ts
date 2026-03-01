import { AccountType } from '../constants/accountTypes';

export interface Account {
  id: string;
  name: string;
  bank: string;
  type: AccountType;
  currency: string;
  balance: number;
}

export type AccountFormData = Omit<Account, 'id'>;
