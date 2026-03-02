import axios from 'axios';
import { ExchangeRate } from '../constants/exchangeRates';

// API ключ для FreeCurrencyAPI из переменных окружения
const API_KEY = process.env.REACT_APP_CURRENCY_API_KEY || 'fca_live_demo';
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';

export const exchangeRatesApi = {
  // Получение текущих курсов валют
  async getExchangeRates(): Promise<ExchangeRate> {
    try {
      const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&currencies=RUB,EUR&base_currency=USD`);
      
      if (response.data && response.data.data) {
        const rates = response.data.data;
        
        // FreeCurrencyAPI возвращает курсы относительно USD
        // Нам нужно получить курсы USD/RUB и EUR/RUB
        const usdToRub = rates.RUB;
        const usdToEur = rates.EUR || 0;
        const eurToRub = usdToRub / usdToEur;
        
        return {
          USD: usdToRub,
          EUR: eurToRub
        };
      }
      
      throw new Error('Не удалось получить курсы валют');
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      
      // Возвращаем запасные значения при ошибке
      return {
        USD: 91.5,
        EUR: 99.2
      };
    }
  }
};
