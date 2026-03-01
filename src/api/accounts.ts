import { Account, AccountFormData } from '../types/account';
import { ACCOUNT_TYPES } from '../constants/accountTypes';

// Моковые данные
const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Основной счет',
    bank: 'СберБанк',
    type: ACCOUNT_TYPES.SAVINGS,
    currency: 'RUB',
    balance: 125000.50
  },
  {
    id: '2',
    name: 'Накопительный счет',
    bank: 'Тинькофф',
    type: ACCOUNT_TYPES.DEPOSIT,
    currency: 'RUB',
    balance: 45000.00
  },
  {
    id: '3',
    name: 'Инвестиционный портфель',
    bank: 'ВТБ',
    type: ACCOUNT_TYPES.INVESTMENT,
    currency: 'USD',
    balance: 2500.75
  },
  {
    id: '4',
    name: 'Криптовалютный кошелек',
    bank: 'Binance',
    type: ACCOUNT_TYPES.CRYPTO,
    currency: 'USD',
    balance: 5000.00
  },
  {
    id: '5',
    name: 'Наличные',
    bank: 'Кошелек',
    type: ACCOUNT_TYPES.CASH,
    currency: 'RUB',
    balance: 15000.00
  }
];

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const accountsApi = {
  // Получение всех счетов
  async getAccounts(): Promise<Account[]> {
    await delay(500);
    return [...mockAccounts];
  },

  // Создание нового счета
  async createAccount(accountData: AccountFormData): Promise<Account> {
    await delay(300);
    const newAccount: Account = {
      id: Date.now().toString(),
      ...accountData
    };
    mockAccounts.push(newAccount);
    return newAccount;
  },

  // Обновление счета
  async updateAccount(id: string, accountData: Partial<AccountFormData>): Promise<Account> {
    await delay(300);
    const index = mockAccounts.findIndex(acc => acc.id === id);
    if (index === -1) {
      throw new Error('Счет не найден');
    }
    
    mockAccounts[index] = { ...mockAccounts[index], ...accountData };
    return mockAccounts[index];
  },

  // Удаление счета
  async deleteAccount(id: string): Promise<void> {
    await delay(300);
    const index = mockAccounts.findIndex(acc => acc.id === id);
    if (index === -1) {
      throw new Error('Счет не найден');
    }
    mockAccounts.splice(index, 1);
  }
};
