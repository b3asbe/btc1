import React from 'react';
import { DollarSign, Coins, TrendingUp } from 'lucide-react';
import { Operation } from '../types';
import { extractTransactionFee } from '../utils/calculations';

interface SummaryProps {
  operations: Operation[];
}

const Summary: React.FC<SummaryProps> = ({ operations }) => {
  const completedOperations = operations.filter(op => op.status === 'completed');
  
  const totalProfitLoss = completedOperations.reduce((sum, op) => {
    return sum + (op.profitLoss || 0);
  }, 0);

  const totalFees = completedOperations.reduce((acc, op) => {
    const openFee = extractTransactionFee(op.transactionFee);
    const closeFee = op.closingOperation ? extractTransactionFee(op.closingOperation.transactionFee) : { amount: 0, currency: '' };
    
    if (openFee.currency === 'BNB') {
      acc.BNB = (acc.BNB || 0) + openFee.amount;
    }
    if (closeFee.currency === 'BNB') {
      acc.BNB = (acc.BNB || 0) + closeFee.amount;
    }
    
    return acc;
  }, {} as Record<string, number>);

  const pendingOperations = operations.filter(op => op.status === 'pending');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Ganancias</p>
            <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} USD
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {completedOperations.length} operaciones completadas
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Fees</p>
            <p className="text-2xl font-bold text-yellow-400">
              {(totalFees.BNB || 0).toFixed(8)} BNB
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Comisiones acumuladas
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-full">
            <Coins className="w-8 h-8 text-black" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Operaciones Pendientes</p>
            <p className="text-2xl font-bold text-blue-400">{pendingOperations.length}</p>
            <p className="text-gray-500 text-xs mt-1">
              Esperando cierre
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;