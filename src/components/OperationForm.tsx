import React, { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Cryptocurrency, Operation } from '../types';
import { parseOperationData } from '../utils/calculations';

interface OperationFormProps {
  cryptocurrencies: Cryptocurrency[];
  onAdd: (operation: Omit<Operation, 'id'>) => void;
}

const OperationForm: React.FC<OperationFormProps> = ({ cryptocurrencies, onAdd }) => {
  const [rawData, setRawData] = useState('');
  const [operationType, setOperationType] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rawData.trim() || !selectedCrypto) {
      setError('Por favor completa todos los campos');
      return;
    }

    const parsedData = parseOperationData(rawData);
    if (!parsedData) {
      setError('No se pudo parsear la información de la operación. Verifica el formato.');
      return;
    }

    const operation: Omit<Operation, 'id'> = {
      ...parsedData,
      type: operationType,
      crypto: selectedCrypto,
      status: 'pending',
      rawData: rawData.trim()
    };

    onAdd(operation);
    setRawData('');
    setSelectedCrypto('');
  };

  const sampleData = `Date
2025-06-18 21:38:48
Trading Price
461
Executed
0.2
Transaction Fee
0.00010757 BNB
Total
92.2 USDT
Role
Maker`;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        Registrar Nueva Operación
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-center gap-2 text-red-300">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Datos de la Operación
          </label>
          <textarea
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder={sampleData}
            className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors font-mono text-sm text-white placeholder-gray-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Pega aquí los datos completos de la operación de Binance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Operación
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="buy"
                  checked={operationType === 'buy'}
                  onChange={(e) => setOperationType(e.target.value as 'buy' | 'sell')}
                  className="mr-2 text-yellow-400 bg-gray-700 border-gray-600 focus:ring-yellow-400"
                />
                <span className="text-green-400 font-medium">Buy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sell"
                  checked={operationType === 'sell'}
                  onChange={(e) => setOperationType(e.target.value as 'buy' | 'sell')}
                  className="mr-2 text-yellow-400 bg-gray-700 border-gray-600 focus:ring-yellow-400"
                />
                <span className="text-red-400 font-medium">Sell</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="crypto" className="block text-sm font-medium text-gray-300 mb-2">
              Criptomoneda
            </label>
            <select
              id="crypto"
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
              required
            >
              <option value="">Seleccionar criptomoneda</option>
              {cryptocurrencies.map((crypto) => (
                <option key={crypto.id} value={crypto.acronym}>
                  {crypto.acronym}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={cryptocurrencies.length === 0}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          <TrendingUp className="w-4 h-4" />
          Registrar Operación
        </button>
        
        {cryptocurrencies.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Primero debes configurar al menos una criptomoneda
          </p>
        )}
      </form>
    </div>
  );
};

export default OperationForm;