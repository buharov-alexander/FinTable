import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface BalanceHistoryItem {
  id: string;
  balance: number;
  created_at: string;
}

interface AccountBalanceHistoryProps {
  account: {
    id: string;
    name: string;
    bank: string;
    type: string;
    currency: string;
    balance: number;
  };
  onBack: () => void;
  getAccountBalanceHistory: (accountId: string) => Promise<BalanceHistoryItem[]>;
}

const AccountBalanceHistory: React.FC<AccountBalanceHistoryProps> = ({
  account,
  onBack,
  getAccountBalanceHistory
}) => {
  const [history, setHistory] = useState<BalanceHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAccountBalanceHistory(account.id);
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки истории');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [account.id, getAccountBalanceHistory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: account.currency,
    }).format(balance);
  };

  const getBalanceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = previous !== 0 ? (change / previous) * 100 : 0;
    return { change, percentage };
  };

  if (isLoading) {
    return (
      <div className="has-text-centered py-6">
        <div className="loader"></div>
        <p className="has-text-grey mt-4">Загрузка истории баланса...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero is-fullheight is-light">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h2 className="title is-4 has-text-danger">Ошибка загрузки</h2>
            <p className="subtitle">{error}</p>
            <button className="button is-primary" onClick={onBack}>
              <ArrowLeft size={16} />
              <span>Назад</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container is-fluid" style={{ padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div className="mb-6">
          <button className="button is-light mb-4" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Назад к счетам</span>
          </button>
          
          <div className="box">
            <h1 className="title is-3 mb-2">{account.name}</h1>
            <div className="columns is-vcentered">
              <div className="column">
                <p className="subtitle has-text-grey mb-0">{account.bank}</p>
                <div className="tags">
                  <span className="tag is-info is-light">{account.type}</span>
                  <span className="tag is-primary is-light">{account.currency}</span>
                </div>
              </div>
              <div className="column is-narrow has-text-right">
                <p className="has-text-grey is-size-6">Текущий баланс</p>
                <p className={`title is-4 ${account.balance < 0 ? 'has-text-danger' : 'has-text-success'}`}>
                  {formatBalance(account.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* История баланса */}
        <div className="box">
          <h2 className="title is-4 mb-4">
            <Calendar size={20} className="mr-2" />
            История баланса
          </h2>
          
          {history.length === 0 ? (
            <div className="has-text-centered py-6">
              <p className="has-text-grey">История балансов пуста</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Дата и время</th>
                    <th className="has-text-right">Баланс</th>
                    <th className="has-text-right">Изменение</th>
                    <th className="has-text-right">Изменение %</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => {
                    const previousBalance = index < history.length - 1 ? history[index + 1].balance : item.balance;
                    const { change, percentage } = getBalanceChange(item.balance, previousBalance);
                    const isPositive = change > 0;
                    const isNegative = change < 0;
                    
                    return (
                      <tr key={item.id}>
                        <td>
                          <span className="has-text-grey">{formatDate(item.created_at)}</span>
                        </td>
                        <td className={`has-text-right has-text-weight-bold ${
                          item.balance < 0 ? 'has-text-danger' : 'has-text-success'
                        }`}>
                          {formatBalance(item.balance)}
                        </td>
                        <td className={`has-text-right has-text-weight-bold ${
                          isPositive ? 'has-text-success' : isNegative ? 'has-text-danger' : ''
                        }`}>
                          {index < history.length - 1 && (
                            <span className="is-flex is-align-items-center is-justify-content-flex-end">
                              {isPositive && <TrendingUp size={14} className="mr-1" />}
                              {isNegative && <TrendingDown size={14} className="mr-1" />}
                              {formatBalance(change)}
                            </span>
                          )}
                        </td>
                        <td className={`has-text-right has-text-weight-bold ${
                          isPositive ? 'has-text-success' : isNegative ? 'has-text-danger' : ''
                        }`}>
                          {index < history.length - 1 && (
                            <span>
                              {isPositive && '+'}{percentage.toFixed(2)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Статистика */}
        {history.length > 1 && (
          <div className="columns">
            <div className="column">
              <div className="box">
                <h3 className="title is-5 mb-3">Статистика</h3>
                <div className="content">
                  <p><strong>Всего записей:</strong> {history.length}</p>
                  <p><strong>Период:</strong> с {formatDate(history[history.length - 1].created_at)} по {formatDate(history[0].created_at)}</p>
                  <p><strong>Максимальный баланс:</strong> {formatBalance(Math.max(...history.map(h => h.balance)))}</p>
                  <p><strong>Минимальный баланс:</strong> {formatBalance(Math.min(...history.map(h => h.balance)))}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBalanceHistory;
