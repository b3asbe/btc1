import React, { useState } from 'react';
import { CheckCircle, Trash2, ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Operation, Cryptocurrency } from '../types';

interface CompletedOperationsTableProps {
  operations: Operation[];
  cryptocurrencies: Cryptocurrency[];
  onDelete: (id: string) => void;
}

const CompletedOperationsTable: React.FC<CompletedOperationsTableProps> = ({ 
  operations, 
  cryptocurrencies, 
  onDelete 
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta operación completada?')) {
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

  if (operations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No hay operaciones completadas</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Operaciones Terminadas ({operations.length})
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Historial completo de operaciones finalizadas
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Expandir
              </th>
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
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cripto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                P/L
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {operations.map((operation) => (
              <React.Fragment key={operation.id}>
                <tr className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRowExpansion(operation.id)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {expandedRows.has(operation.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(operation.date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    {operation.tradingPrice.toFixed(6)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    {operation.executed.toFixed(6)}
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`font-bold text-lg ${
                      (operation.profitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(operation.profitLoss || 0) >= 0 ? '+' : ''}{formatCurrency(operation.profitLoss || 0)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(operation.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                
                {/* Expanded row for operation details */}
                {expandedRows.has(operation.id) && operation.closingOperation && (
                  <tr className="bg-gray-900">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Detalles de la Operación Completada
                        </h4>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Opening Operation */}
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-green-300 mb-3">Operación de Apertura</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fecha:</span>
                                <span className="text-gray-300">{formatDate(operation.date)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Precio:</span>
                                <span className="font-mono text-gray-300">{operation.tradingPrice.toFixed(6)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Cantidad:</span>
                                <span className="font-mono text-gray-300">{operation.executed.toFixed(6)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fee:</span>
                                <span className="text-gray-300">{operation.transactionFee}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total:</span>
                                <span className="font-medium text-gray-300">{formatCurrency(operation.total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Closing Operation */}
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-red-300 mb-3">Operación de Cierre</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fecha:</span>
                                <span className="text-gray-300">{formatDate(operation.closingOperation.date)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Precio:</span>
                                <span className="font-mono text-gray-300">{operation.closingOperation.tradingPrice.toFixed(6)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Cantidad:</span>
                                <span className="font-mono text-gray-300">{operation.closingOperation.executed.toFixed(6)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fee:</span>
                                <span className="text-gray-300">{operation.closingOperation.transactionFee}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total:</span>
                                <span className="font-medium text-gray-300">{formatCurrency(operation.closingOperation.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Result Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-300">Resultado Final:</span>
                            <span className={`font-bold text-2xl ${
                              (operation.profitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {(operation.profitLoss || 0) >= 0 ? '+' : ''}{formatCurrency(operation.profitLoss || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedOperationsTable;