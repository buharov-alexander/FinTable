import { Account, AccountFormData } from '../types/account';

// Моковые данные
const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Основной счет',
    bank: 'СберБанк',
    type: 'checking',
    currency: 'RUB',
    balance: 125000.50
  },
  {
    id: '2',
    name: 'Накопительный счет',
    bank: 'Тинькофф',
    type: 'savings',
    currency: 'RUB',
    balance: 45000.00
  },
  {
    id: '3',
    name: 'Кредитная карта',
    bank: 'Альфа-Банк',
    type: 'credit',
    currency: 'RUB',
    balance: -5000.00
  },
  {
    id: '4',
    name: 'Инвестиционный счет',
    bank: 'ВТБ',
    type: 'investment',
    currency: 'USD',
    balance: 2500.75
  },
  {
    id: '5',
    name: 'Зарплатный проект',
    bank: 'Газпромбанк',
    type: 'checking',
    currency: 'RUB',
    balance: 85000.30
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
