import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { Operation } from '../types';

interface CryptoRankingProps {
  operations: Operation[];
}

const CryptoRanking: React.FC<CryptoRankingProps> = ({ operations }) => {
  // Calculate P/L by cryptocurrency
  const cryptoStats = operations
    .filter(op => op.status === 'completed' && op.profitLoss !== undefined)
    .reduce((acc, op) => {
      const crypto = op.crypto;
      if (!acc[crypto]) {
        acc[crypto] = {
          totalPL: 0,
          operationsCount: 0,
          wins: 0,
          losses: 0
        };
      }
      
      acc[crypto].totalPL += op.profitLoss || 0;
      acc[crypto].operationsCount += 1;
      
      if ((op.profitLoss || 0) > 0) {
        acc[crypto].wins += 1;
      } else if ((op.profitLoss || 0) < 0) {
        acc[crypto].losses += 1;
      }
      
      return acc;
    }, {} as Record<string, { totalPL: number; operationsCount: number; wins: number; losses: number }>);

  // Sort by total P/L descending
  const sortedCryptos = Object.entries(cryptoStats)
    .sort(([, a], [, b]) => b.totalPL - a.totalPL);

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} USDT`;
  };

  const getWinRate = (wins: number, total: number) => {
    return total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <Coins className="w-5 h-5 text-gray-500" />;
    }
  };

  if (sortedCryptos.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-8 text-center">
        <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No hay operaciones completadas para mostrar el ranking</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Ranking de Criptomonedas por Rentabilidad
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Ordenado por ganancias/pérdidas totales acumuladas
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Criptomoneda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                P/L Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Operaciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ganadas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Perdidas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tasa de Éxito
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedCryptos.map(([crypto, stats], index) => (
              <tr key={crypto} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index)}
                    <span className="font-bold text-lg text-gray-300">
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-400 text-black">
                    {crypto}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-lg font-bold ${
                    stats.totalPL >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(stats.totalPL)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className="font-medium">{stats.operationsCount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">{stats.wins}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-medium">{stats.losses}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getWinRate(stats.wins, stats.operationsCount)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300 min-w-[3rem]">
                      {getWinRate(stats.wins, stats.operationsCount)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoRanking;