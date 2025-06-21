import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Operation } from '../types';
import { parseOperationData, calculateProfitLoss } from '../utils/calculations';

interface CompletionModalProps {
  isOpen: boolean;
  operation: Operation | null;
  onClose: () => void;
  onComplete: (id: string, closingData: any) => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  operation,
  onClose,
  onComplete
}) => {
  const [closingData, setClosingData] = useState('');
  const [error, setError] = useState('');

  const handleComplete = () => {
    if (!operation || !closingData.trim()) {
      setError('Por favor proporciona los datos de cierre');
      return;
    }

    const parsedClosingData = parseOperationData(closingData);
    if (!parsedClosingData) {
      setError('No se pudo parsear la información de cierre. Verifica el formato.');
      return;
    }

    const profitLoss = calculateProfitLoss(operation, parsedClosingData);

    onComplete(operation.id, {
      closingOperation: {
        ...parsedClosingData,
        rawData: closingData.trim()
      },
      profitLoss
    });

    setClosingData('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setClosingData('');
    setError('');
    onClose();
  };

  if (!isOpen || !operation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Completar Operación: {operation.crypto} {operation.type.toUpperCase()}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Resumen de la Operación Original</h4>
            <p className="text-sm text-gray-300">
              {operation.type === 'buy' ? 'Buy' : 'Sell'} {operation.executed} {operation.crypto} @ {operation.tradingPrice} 
              (Total: {operation.total.toFixed(2)} USDT)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Fecha: {new Date(operation.date).toLocaleString('es-ES')}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Datos de la Operación de Cierre
            </label>
            <textarea
              value={closingData}
              onChange={(e) => setClosingData(e.target.value)}
              className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors font-mono text-sm text-white placeholder-gray-500"
              placeholder="Pega aquí los datos completos de la operación de cierre..."
              required
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-4 h-4" />
            Confirmar Cierre
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;