import React from 'react';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { RefreshCw } from 'lucide-react';

const ExchangeRatesWidget: React.FC = () => {
  const { rates, isLoading, error, refetch } = useExchangeRates();

  if (error) {
    return (
      <div className="notification is-danger is-light" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
        Ошибка загрузки курсов
      </div>
    );
  }

  return (
    <div className="box" style={{ padding: '0.75rem', minWidth: '200px' }}>
      <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
        <h4 className="title is-6 mb-0">Курсы валют</h4>
        <button
          className="button is-small is-white is-text"
          onClick={() => refetch()}
          disabled={isLoading}
          title="Обновить курсы"
        >
          <RefreshCw size={16} className={isLoading ? 'is-spinning' : ''} />
        </button>
      </div>
      
      {isLoading ? (
        <div className="has-text-centered py-2">
          <div className="loader is-small"></div>
        </div>
      ) : rates ? (
        <div className="is-size-7">
          <div className="is-flex is-justify-content-space-between mb-2">
            <span className="has-text-grey">USD:</span>
            <span className="has-text-weight-semibold">{rates.USD.toFixed(2)} ₽</span>
          </div>
          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-grey">EUR:</span>
            <span className="has-text-weight-semibold">{rates.EUR.toFixed(2)} ₽</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExchangeRatesWidget;
