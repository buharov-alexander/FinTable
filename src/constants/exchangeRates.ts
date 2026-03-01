export interface ExchangeRate {
  USD: number;
  EUR: number;
}

export interface ExchangeRatesState {
  rates: ExchangeRate;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}
