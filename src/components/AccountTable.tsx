import React from 'react';
import { Account } from '../types/account';
import { calculateTotalBalance } from '../utils/currencyConverter';
import { useExchangeRates } from '../hooks/useExchangeRates';
import AccountRow from './AccountRow';

interface AccountTableProps {
  accounts: Account[];
  onUpdateAccountBalance: (id: string, balance: number) => void;
  onDeleteAccount: (id: string) => void;
  isLoading?: boolean;
}

const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onUpdateAccountBalance,
  onDeleteAccount,
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
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th className="has-text-grey">Название счета</th>
            <th className="has-text-grey">Название банка</th>
            <th className="has-text-grey">Тип счета</th>
            <th className="has-text-grey">Валюта</th>
            <th className="has-text-grey">Баланс</th>
            <th className="has-text-grey">Действия</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onUpdateAccountBalance={onUpdateAccountBalance}
              onDeleteAccount={onDeleteAccount}
            />
          ))}
        </tbody>
        {rates && (
          <tfoot>
            <tr className="has-background-light has-text-weight-bold">
              <td colSpan={4} className="has-text-right">
                Итого:
              </td>
              <td colSpan={2} className="has-text-success">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                }).format(calculateTotalBalance(accounts, rates))}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default AccountTable;
