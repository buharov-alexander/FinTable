import { Account } from '../types/account';
import { ExchangeRate } from '../constants/exchangeRates';

export const convertToRubles = (amount: number, currency: string, exchangeRates: ExchangeRate): number => {
  switch (currency) {
    case 'RUB':
      return amount;
    case 'USD':
      return amount * exchangeRates.USD;
    case 'EUR':
      return amount * exchangeRates.EUR;
    default:
      return amount;
  }
};

export const calculateTotalBalance = (accounts: Account[], exchangeRates: ExchangeRate): number => {
  return accounts.reduce((total, account) => {
    return total + convertToRubles(account.balance, account.currency, exchangeRates);
  }, 0);
};
