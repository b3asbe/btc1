import React, { useState } from 'react';
import { CheckCircle, Target, Trash2, Clock, TrendingUp, TrendingDown, ChevronDown, ChevronRight } from 'lucide-react';
import { Operation, Cryptocurrency } from '../types';
import CompletionModal from './CompletionModal';
import PredictionModal from './PredictionModal';
import { calculatePredictionRanges } from '../utils/calculations';

interface OperationTableProps {
  operations: Operation[];
  cryptocurrencies: Cryptocurrency[];
  onComplete: (id: string, closingData: any) => void;
  onDelete: (id: string) => void;
}

const OperationTable: React.FC<OperationTableProps> = ({ 
  operations, 
  cryptocurrencies, 
  onComplete, 
  onDelete 
}) => {
  const [completionModal, setCompletionModal] = useState<{ isOpen: boolean; operation: Operation | null }>({
    isOpen: false,
    operation: null
  });
  const [predictionModal, setPredictionModal] = useState<{ isOpen: boolean; operation: Operation | null }>({
    isOpen: false,
    operation: null
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleComplete = (operation: Operation) => {
    setCompletionModal({ isOpen: true, operation });
  };

  const handlePredict = (operation: Operation) => {
    setPredictionModal({ isOpen: true, operation });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta operación?')) {
      onDelete(id);
    }
  };

  const toggleRowExpansion = (operationId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(operationId)) {
      newExpanded.delete(operationId);
    } else {
      newExpanded.add(operationId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const formatCurrency = (amount: number, currency: string = 'USDT') => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const getPredictionPrice = (operation: Operation): number | null => {
    const crypto = cryptocurrencies.find(c => c.acronym === operation.crypto);
    if (!crypto) return null;

    const { buyRanges, sellRanges } = calculatePredictionRanges(operation.tradingPrice, crypto);
    
    // If it's a buy operation, show first sell prediction
    // If it's a sell operation, show first buy prediction
    if (operation.type === 'buy') {
      return sellRanges[0] || null;
    } else {
      return buyRanges[0] || null;
    }
  };

  if (operations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-8 text-center">
        <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No hay operaciones pendientes</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Operaciones Pendientes ({operations.length})
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Operaciones esperando ser completadas
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cripto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {operations.map((operation) => {
                const predictionPrice = getPredictionPrice(operation);
                
                return (
                  <tr key={operation.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(operation.date)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                      <div className="space-y-1">
                        <div>{operation.tradingPrice.toFixed(6)}</div>
                        {predictionPrice && (
                          <div className="text-xs text-red-400 font-medium">
                            Predicción: {predictionPrice.toFixed(6)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                      {operation.executed.toFixed(6)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {operation.transactionFee}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {formatCurrency(operation.total)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        operation.type === 'buy' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {operation.type === 'buy' ? (
                          <><TrendingUp className="w-3 h-3 mr-1" /> Buy</>
                        ) : (
                          <><TrendingDown className="w-3 h-3 mr-1" /> Sell</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-black">
                        {operation.crypto}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                        Pendiente
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleComplete(operation)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="Completar"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePredict(operation)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Predicción"
                        >
                          <Target className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(operation.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CompletionModal
        isOpen={completionModal.isOpen}
        operation={completionModal.operation}
        onClose={() => setCompletionModal({ isOpen: false, operation: null })}
        onComplete={onComplete}
      />

      <PredictionModal
        isOpen={predictionModal.isOpen}
        operation={predictionModal.operation}
        cryptocurrency={predictionModal.operation ? 
          cryptocurrencies.find(c => c.acronym === predictionModal.operation?.crypto) : 
          undefined}
        onClose={() => setPredictionModal({ isOpen: false, operation: null })}
      />
    </>
  );
};

export default OperationTable;