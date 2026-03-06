import { Account, AccountFormData } from '../types/account';
import { supabase } from '../lib/supabase';
import { exchangeRatesApi } from './exchangeRates';

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

    // Добавляем начальный баланс в историю с курсом 1 для рубля
    const exchangeRate = accountData.currency === 'RUB' ? 1 : 0;
    const { error: historyError } = await supabase
      .from('account_balance_history')
      .insert({
        account_id: account.id,
        balance: 0,
        exchange_rate: exchangeRate
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

  // Получение текущего курса валюты
  async getCurrentExchangeRate(currency: string): Promise<number> {
    if (currency === 'RUB') return 1;
    
    try {
      const rates = await exchangeRatesApi.getExchangeRates();
      return currency === 'USD' ? rates.USD : rates.EUR;
    } catch (error) {
      console.warn('Failed to get exchange rate, using 1 as fallback:', error);
      return 1;
    }
  },

  // Обновление баланса счета с сохранением курса валюты
  async updateAccountBalance(id: string, balance: number): Promise<Account> {
    // Получаем информацию о счете для определения валюты
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('currency')
      .eq('id', id)
      .single();

    if (accountError) {
      throw new Error(accountError.message);
    }

    // Получаем текущий курс валюты
    const exchangeRate = await this.getCurrentExchangeRate(account.currency);

    // Добавляем новую запись в историю балансов с курсом
    const { error: historyError } = await supabase
      .from('account_balance_history')
      .insert({
        account_id: id,
        balance,
        exchange_rate: exchangeRate
      });

    if (historyError) {
      throw new Error(historyError.message);
    }

    // Получаем обновленный счет с новым балансом
    const { data: updatedAccount, error: fetchError } = await supabase
      .from('accounts_with_current_balance')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    return updatedAccount;
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
    exchange_rate: number;
  }>> {
    const { data, error } = await supabase
      .from('account_balance_history')
      .select('id, balance, created_at, exchange_rate')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
};
