import React from 'react';
import { X, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { Operation, Cryptocurrency } from '../types';
import { calculatePredictionRanges } from '../utils/calculations';

interface PredictionModalProps {
  isOpen: boolean;
  operation: Operation | null;
  cryptocurrency: Cryptocurrency | undefined;
  onClose: () => void;
}

const PredictionModal: React.FC<PredictionModalProps> = ({
  isOpen,
  operation,
  cryptocurrency,
  onClose
}) => {
  if (!isOpen || !operation || !cryptocurrency) return null;

  const { buyRanges, sellRanges } = calculatePredictionRanges(operation.tradingPrice, cryptocurrency);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Predicción de Precios: {operation.crypto}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-white mb-2">Información de la Operación</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Precio Actual:</span>
                <p className="font-mono font-medium text-gray-300">{operation.tradingPrice.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-gray-400">Cantidad:</span>
                <p className="font-mono font-medium text-gray-300">{operation.executed.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-gray-400">Tipo:</span>
                <p className="font-medium text-gray-300">{operation.type.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-gray-400">Total:</span>
                <p className="font-medium text-gray-300">{operation.total.toFixed(2)} USDT</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 border border-green-700">
              <h4 className="font-medium text-green-300 mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Rangos de Compra (por debajo del precio actual)
              </h4>
              <div className="space-y-2">
                {buyRanges.map((price, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                    <span className="text-sm text-gray-400">Nivel {index + 1}:</span>
                    <span className="font-mono font-medium text-green-300">
                      {price.toFixed(6)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 border border-red-700">
              <h4 className="font-medium text-red-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Rangos de Venta (por encima del precio actual)
              </h4>
              <div className="space-y-2">
                {sellRanges.map((price, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                    <span className="text-sm text-gray-400">Nivel {index + 1}:</span>
                    <span className="font-mono font-medium text-red-300">
                      {price.toFixed(6)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-700">
            <h4 className="font-medium text-yellow-300 mb-2">Configuración de Ajustes</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-yellow-400">Ajuste de Compra:</span>
                <span className="ml-2 font-medium text-gray-300">{cryptocurrency.buyAdjustment.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-yellow-400">Ajuste de Venta:</span>
                <span className="ml-2 font-medium text-gray-300">{cryptocurrency.sellAdjustment.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;