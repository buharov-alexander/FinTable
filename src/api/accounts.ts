import { Account, AccountFormData } from '../types/account';
import { supabase } from '../lib/supabase';

export const accountsApi = {
  // Получение всех счетов
  async getAccounts(): Promise<Account[]> {
    const { data: accounts, error } = await supabase
      .from('accounts_with_current_balance')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return accounts || [];
  },

  // Создание нового счета
  async createAccount(accountData: AccountFormData): Promise<Account> {
    const { data: account, error } = await supabase
      .from('accounts')
      .insert(accountData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return account;
  },

  // Обновление счета
  async updateAccount(id: string, accountData: Partial<AccountFormData>): Promise<Account> {
    const { data: account, error } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return account;
  },

  // Удаление счета
  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};
