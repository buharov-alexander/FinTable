import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AccountTable from './components/AccountTable';
import AddAccountForm from './components/AddAccountForm';
import ExchangeRatesWidget from './components/ExchangeRatesWidget';
import AccountBalanceHistory from './components/AccountBalanceHistory';
import BalanceChart from './components/BalanceChart';
import AuthForm from './components/AuthForm';
import UserMenu from './components/UserMenu';
import { useAccounts } from './hooks/useAccounts';
import { useAuth } from './hooks/useAuth';
import { Account } from './types/account';
import { accountsApi } from './api/accounts';
import 'bulma/css/bulma.min.css';

const queryClient = new QueryClient();

function AppContent() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  
  const {
    accounts,
    isLoading,
    error,
    monthlyBalances,
    isLoadingMonthlyBalances,
    createAccount,
    updateAccountBalance,
    deleteAccount,
    isCreating,
    isUpdatingBalance,
    isDeleting
  } = useAccounts();

  const handleAccountClick = useCallback((account: Account) => {
    // Предотвращаем повторный выбор того же счета
    if (selectedAccount?.id !== account.id) {
      setSelectedAccount(account);
    }
  }, [selectedAccount]);

  const handleGetAccountBalanceHistory = useCallback(async (accountId: string) => {
    return await accountsApi.getAccountBalanceHistory(accountId);
  }, []);

  const handleBackToAccounts = () => {
    setSelectedAccount(null);
  };

  // Показываем форму аутентификации если пользователь не авторизован
  if (authLoading) {
    return (
      <div className="has-text-centered py-6">
        <div className="loader"></div>
        <p className="has-text-grey mt-4">Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} signIn={signIn} signUp={signUp} />;
  }

  if (error) {
    return (
      <div className="hero is-fullheight is-light">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h2 className="title is-4 has-text-danger">Ошибка загрузки данных</h2>
            <p className="subtitle">Не удалось загрузить информацию о счетах. Попробуйте обновить страницу.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container is-fluid" style={{ padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {selectedAccount ? (
          <AccountBalanceHistory
            account={selectedAccount}
            onBack={handleBackToAccounts}
            getAccountBalanceHistory={handleGetAccountBalanceHistory}
          />
        ) : (
          <>
            <div className="is-flex is-justify-content-space-between is-align-items-start mb-5">
              <div style={{ flex: 1 }}>
                <section className="section" style={{ padding: '0 0 2rem 0' }}>
                  <h1 className="title is-2">FinTable</h1>
                  <p className="subtitle has-text-grey">Управление банковскими счетами</p>
                </section>
              </div>
              <div className="ml-4 is-flex is-align-items-center">
                <div className="mr-4">
                  <ExchangeRatesWidget />
                </div>
                <UserMenu user={user} onSignOut={signOut} />
              </div>
            </div>

            <section className="section" style={{ padding: '0' }}>
              <div className="level" style={{ marginBottom: '1.5rem' }}>
                <div className="level-left">
                  <h2 className="title is-4">
                    Мои счета ({accounts.length})
                  </h2>
                </div>
                <div className="level-right">
                  <AddAccountForm 
                    onAddAccount={createAccount}
                    isLoading={isCreating}
                  />
                </div>
              </div>

              {accounts.length === 0 && !isLoading ? (
                <div className="box has-text-centered">
                  <p className="has-text-grey" style={{ marginBottom: '1rem' }}>У вас пока нет счетов</p>
                  <p className="has-text-grey-light is-size-7">Добавьте первый счет, чтобы начать отслеживать финансы</p>
                </div>
              ) : (
                <AccountTable
                  accounts={accounts}
                  onUpdateAccountBalance={updateAccountBalance}
                  onDeleteAccount={deleteAccount}
                  onAccountClick={handleAccountClick}
                  isLoading={isLoading || isDeleting || isUpdatingBalance}
                />
              )}
            </section>

            {/* График месячных балансов */}
            {monthlyBalances.length > 0 && (
              <section className="section" style={{ padding: '2rem 0 0 0' }}>
                <h2 className="title is-4 mb-4">Динамика общего баланса</h2>
                {isLoadingMonthlyBalances ? (
                  <div className="has-text-centered py-4">
                    <div className="loader"></div>
                    <p className="has-text-grey mt-2">Загрузка графика...</p>
                  </div>
                ) : (
                  <BalanceChart 
                    data={monthlyBalances} 
                    currency="RUB" 
                  />
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
