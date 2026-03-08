import React from 'react';
import { Account } from '../types/account';
import { calculateTotalBalance } from '../utils/currencyConverter';
import { useExchangeRates } from '../hooks/useExchangeRates';
import AccountRow from './AccountRow';

interface AccountTableProps {
  accounts: Account[];
  onUpdateAccountBalance: (id: string, balance: number) => void;
  onDeleteAccount: (id: string) => void;
  onAccountClick: (account: Account) => void;
  isLoading?: boolean;
}

const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onUpdateAccountBalance,
  onDeleteAccount,
  onAccountClick,
  isLoading = false
}) => {
  const { rates } = useExchangeRates();

  if (isLoading) {
    return (
      <div className="has-text-centered py-6">
        <div className="loader"></div>
        <p className="has-text-grey mt-4">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th className="is-hidden-mobile">Название</th>
            <th className="is-hidden-mobile">Банк</th>
            <th className="is-hidden-mobile">Тип</th>
            <th>Валюта</th>
            <th>Баланс</th>
            <th className="has-text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onUpdateAccountBalance={onUpdateAccountBalance}
              onDeleteAccount={onDeleteAccount}
              onAccountClick={onAccountClick}
            />
          ))}
        </tbody>
        {accounts.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={6} className="has-text-right has-text-weight-bold">
                Итого: {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB'
                }).format(calculateTotalBalance(accounts, rates || { USD: 0, EUR: 0 }))}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      
      {accounts.length === 0 && !isLoading && (
        <div className="has-text-centered py-6">
          <p className="has-text-grey">Счета не найдены</p>
        </div>
      )}
    </div>
  );
};

export default AccountTable;
