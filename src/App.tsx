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
    <div className="container is-fluid" style={{ padding: '1rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {selectedAccount ? (
          <AccountBalanceHistory
            account={selectedAccount}
            onBack={handleBackToAccounts}
            getAccountBalanceHistory={handleGetAccountBalanceHistory}
          />
        ) : (
          <>
            {/* Шапка с логотипом и курсами валют */}
            <div className="columns is-mobile is-multiline is-align-items-start mb-4">
              <div className="column is-12-mobile is-6-tablet">
                <div className="is-flex is-align-items-start">
                  <section className="has-text-left-mobile has-text-left-tablet">
                    <h1 className="title is-3-mobile is-2">FinTable</h1>
                    <p className="subtitle is-6-mobile is-5 has-text-grey">Управление счетами</p>
                  </section>
                  <div className="ml-4">
                    <UserMenu user={user} onSignOut={signOut} />
                  </div>
                </div>
              </div>
              <div className="column is-12-mobile is-6-tablet has-text-right-mobile has-text-right-tablet">
                <div className="is-flex is-align-items-start is-justify-content-flex-end">
                  <ExchangeRatesWidget />
                </div>
              </div>
            </div>

            {/* Секция со счетами */}
            <section className="section" style={{ padding: '0 0 3rem 0' }}>
              <div className="columns is-mobile">
                <div className="column is-12-mobile">
                  <div className="level is-mobile is-align-items-center mb-5">
                    <div className="level-left">
                      <h2 className="title is-5-mobile is-4">
                        Мои счета ({accounts.length})
                      </h2>
                    </div>
                    <div className="level-right">
                      <div className="is-flex is-align-items-center">
                        <AddAccountForm 
                          onAddAccount={createAccount}
                          isLoading={isCreating}
                        />
                      </div>
                    </div>
                  </div>

                  {accounts.length === 0 && !isLoading ? (
                    <div className="box has-text-centered py-6">
                      <p className="has-text-grey mb-3">У вас пока нет счетов</p>
                      <p className="has-text-grey-light is-size-7">Добавьте первый счет, чтобы начать отслеживать финансы</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <AccountTable
                        accounts={accounts}
                        onUpdateAccountBalance={updateAccountBalance}
                        onDeleteAccount={deleteAccount}
                        onAccountClick={handleAccountClick}
                        isLoading={isLoading || isDeleting || isUpdatingBalance}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* График месячных балансов */}
            {monthlyBalances.length > 0 && (
              <section className="section" style={{ padding: '0' }}>
                <div className="columns">
                  <div className="column is-12">
                    <h2 className="title is-5-mobile is-4 mb-4">Динамика баланса</h2>
                    {isLoadingMonthlyBalances ? (
                      <div className="has-text-centered py-6">
                        <div className="loader"></div>
                        <p className="has-text-grey mt-3">Загрузка графика...</p>
                      </div>
                    ) : (
                      <div className="box" style={{ padding: '1.5rem' }}>
                        <div style={{ height: '300px min-height: 250px' }}>
                          <BalanceChart 
                            data={monthlyBalances} 
                            currency="RUB" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
