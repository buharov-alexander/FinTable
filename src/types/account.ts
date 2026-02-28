export interface Account {
  id: string;
  name: string;
  bank: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  currency: string;
  balance: number;
}

export type AccountFormData = Omit<Account, 'id'>;
