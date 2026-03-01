import { ExchangeRate } from '../constants/exchangeRates';

// Моковые данные для курсов валют (в реальном приложении здесь был бы API запрос)
const mockExchangeRates: ExchangeRate = {
  USD: 91.5,
  EUR: 99.2
};

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const exchangeRatesApi = {
  // Получение текущих курсов валют
  async getExchangeRates(): Promise<ExchangeRate> {
    await delay(1000); // Имитация запроса к API
    return { ...mockExchangeRates };
  }
};
