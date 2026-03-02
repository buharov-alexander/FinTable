import { useQuery } from '@tanstack/react-query';
import { exchangeRatesApi } from '../api/exchangeRates';

export const useExchangeRates = () => {
  const {
    data: rates,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: () => exchangeRatesApi.getExchangeRates(),
    staleTime: 5 * 60 * 1000, // Кэшировать на 5 минут
    refetchInterval: 15 * 60 * 1000, // Обновлять каждые 15 минут
  });

  return {
    rates,
    isLoading,
    error,
    refetch
  };
};
