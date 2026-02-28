import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AccountTable from './components/AccountTable';
import AddAccountForm from './components/AddAccountForm';
import { useAccounts } from './hooks/useAccounts';

const queryClient = new QueryClient();

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  padding: '2rem 1rem',
};

const contentStyle: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '2rem',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.875rem',
  fontWeight: '700',
  color: '#111827',
  marginBottom: '0.5rem',
};

const subtitleStyle: React.CSSProperties = {
  color: '#4b5563',
};

const bodyStyle: React.CSSProperties = {
  marginTop: '1.5rem',
};

const accountsHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
};

const accountsTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#1f2937',
};

const noAccountsStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '0.5rem',
  border: '1px solid #e5e7eb',
  textAlign: 'center',
};

const noAccountsTextStyle: React.CSSProperties = {
  color: '#6b7280',
  marginBottom: '1rem',
};

const noAccountsSubtextStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '0.875rem',
};

const errorContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  textAlign: 'center',
};

const errorTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
};

function AppContent() {
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    isCreating,
    isUpdating,
    isDeleting
  } = useAccounts();

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <div style={errorStyle}>
          <h2 style={errorTitleStyle}>Ошибка загрузки данных</h2>
          <p>Не удалось загрузить информацию о счетах. Попробуйте обновить страницу.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>FinTable</h1>
          <p style={subtitleStyle}>Управление банковскими счетами</p>
        </div>

        <div style={bodyStyle}>
          <div style={accountsHeaderStyle}>
            <h2 style={accountsTitleStyle}>
              Мои счета ({accounts.length})
            </h2>
            <AddAccountForm 
              onAddAccount={createAccount}
              isLoading={isCreating}
            />
          </div>

          {accounts.length === 0 && !isLoading ? (
            <div style={noAccountsStyle}>
              <p style={noAccountsTextStyle}>У вас пока нет счетов</p>
              <p style={noAccountsSubtextStyle}>Добавьте первый счет, чтобы начать отслеживать финансы</p>
            </div>
          ) : (
            <AccountTable
              accounts={accounts}
              onUpdateAccount={updateAccount}
              onDeleteAccount={deleteAccount}
              isLoading={isLoading || isUpdating || isDeleting}
            />
          )}
        </div>
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
