import { Account, AccountFormData } from '../types/account';
import { supabase } from '../lib/supabase';

export const accountsApi = {
  // Получение всех счетов с текущим балансом
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
    // Создаем счет в таблице accounts (без баланса)
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .insert({
        name: accountData.name,
        type: accountData.type,
        bank: accountData.bank,
        currency: accountData.currency
      })
      .select()
      .single();

    if (accountError) {
      throw new Error(accountError.message);
    }

    // Добавляем начальный баланс в историю
    const { error: historyError } = await supabase
      .from('account_balance_history')
      .insert({
        account_id: account.id,
        balance: 0
      });

    if (historyError) {
      throw new Error(historyError.message);
    }

    // Возвращаем счет с балансом
    return {
      ...account,
      balance: 0
    };
  },

  // Обновление баланса счета
  async updateAccountBalance(id: string, balance: number): Promise<Account> {
    // Добавляем новую запись в историю балансов
    const { error: historyError } = await supabase
      .from('account_balance_history')
      .insert({
        account_id: id,
        balance
      });

    if (historyError) {
      throw new Error(historyError.message);
    }

    // Получаем обновленный счет с новым балансом
    const { data: account, error: accountError } = await supabase
      .from('accounts_with_current_balance')
      .select('*')
      .eq('id', id)
      .single();

    if (accountError) {
      throw new Error(accountError.message);
    }

    return account;
  },

  // Удаление счета (каскадно удалит историю балансов)
  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  // Получение истории балансов для счета
  async getAccountBalanceHistory(accountId: string): Promise<Array<{
    id: string;
    balance: number;
    created_at: string;
  }>> {
    const { data, error } = await supabase
      .from('account_balance_history')
      .select('id, balance, created_at')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
};
