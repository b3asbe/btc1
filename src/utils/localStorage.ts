import { Cryptocurrency, Operation } from '../types';

const CRYPTO_KEY = 'binance_cryptocurrencies';
const OPERATIONS_KEY = 'binance_operations';

export const saveCryptocurrencies = (cryptos: Cryptocurrency[]): void => {
  try {
    localStorage.setItem(CRYPTO_KEY, JSON.stringify(cryptos));
    console.log('Cryptocurrencies saved:', cryptos.length);
  } catch (error) {
    console.error('Error saving cryptocurrencies:', error);
  }
};

export const loadCryptocurrencies = (): Cryptocurrency[] => {
  try {
    const data = localStorage.getItem(CRYPTO_KEY);
    const result = data ? JSON.parse(data) : [];
    console.log('Cryptocurrencies loaded:', result.length);
    return result;
  } catch (error) {
    console.error('Error loading cryptocurrencies:', error);
    return [];
  }
};

export const saveOperations = (operations: Operation[]): void => {
  try {
    localStorage.setItem(OPERATIONS_KEY, JSON.stringify(operations));
    console.log('Operations saved:', operations.length);
  } catch (error) {
    console.error('Error saving operations:', error);
  }
};

export const loadOperations = (): Operation[] => {
  try {
    const data = localStorage.getItem(OPERATIONS_KEY);
    const result = data ? JSON.parse(data) : [];
    console.log('Operations loaded:', result.length);
    return result;
  } catch (error) {
    console.error('Error loading operations:', error);
    return [];
  }
};

// Clear all data (useful for debugging)
export const clearAllData = (): void => {
  localStorage.removeItem(CRYPTO_KEY);
  localStorage.removeItem(OPERATIONS_KEY);
  console.log('All data cleared');
};

// Export data for backup
export const exportData = () => {
  return {
    cryptocurrencies: loadCryptocurrencies(),
    operations: loadOperations(),
    timestamp: new Date().toISOString()
  };
};

// Import data from backup
export const importData = (data: { cryptocurrencies: Cryptocurrency[], operations: Operation[] }) => {
  saveCryptocurrencies(data.cryptocurrencies);
  saveOperations(data.operations);
};