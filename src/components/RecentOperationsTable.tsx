import React from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Operation, Cryptocurrency } from '../types';

interface RecentOperationsTableProps {
  operations: Operation[];
  cryptocurrencies: Cryptocurrency[];
}

const RecentOperationsTable: React.FC<RecentOperationsTableProps> = ({ 
  operations, 
  cryptocurrencies 
}) => {
  // Get the last 2 operations (most recent first)
  const recentOperations = operations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const formatCurrency = (amount: number, currency: string = 'USDT') => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  if (recentOperations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-8 text-center">
        <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No hay operaciones recientes</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Últimas 2 Operaciones Realizadas
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Acceso rápido a tus operaciones más recientes
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
                P/L
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {recentOperations.map((operation, index) => (
              <tr key={operation.id} className="hover:bg-gray-700 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                        Más reciente
                      </span>
                    )}
                    <span>{formatDate(operation.date)}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                  {operation.tradingPrice.toFixed(6)}
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    operation.status === 'completed' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {operation.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {operation.profitLoss !== undefined ? (
                    <span className={`font-medium ${
                      operation.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {operation.profitLoss >= 0 ? '+' : ''}{formatCurrency(operation.profitLoss)}
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOperationsTable;