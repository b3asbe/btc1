import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Cryptocurrency } from '../types';

interface CryptoFormProps {
  onAdd: (crypto: Omit<Cryptocurrency, 'id'>) => void;
}

const CryptoForm: React.FC<CryptoFormProps> = ({ onAdd }) => {
  const [acronym, setAcronym] = useState('');
  const [buyAdjustment, setBuyAdjustment] = useState('');
  const [sellAdjustment, setSellAdjustment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acronym.trim() || !buyAdjustment || !sellAdjustment) {
      return;
    }

    onAdd({
      acronym: acronym.toUpperCase().trim(),
      buyAdjustment: parseFloat(buyAdjustment),
      sellAdjustment: parseFloat(sellAdjustment)
    });

    setAcronym('');
    setBuyAdjustment('');
    setSellAdjustment('');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-yellow-400" />
        Añadir Nueva Criptomoneda
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="acronym" className="block text-sm font-medium text-gray-300 mb-1">
              Acrónimo
            </label>
            <input
              type="text"
              id="acronym"
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              placeholder="BTC"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <label htmlFor="buyAdjustment" className="block text-sm font-medium text-gray-300 mb-1">
              Ajuste Compra (+)
            </label>
            <input
              type="number"
              id="buyAdjustment"
              value={buyAdjustment}
              onChange={(e) => setBuyAdjustment(e.target.value)}
              step="0.001"
              placeholder="0.010"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <label htmlFor="sellAdjustment" className="block text-sm font-medium text-gray-300 mb-1">
              Ajuste Venta (–)
            </label>
            <input
              type="number"
              id="sellAdjustment"
              value={sellAdjustment}
              onChange={(e) => setSellAdjustment(e.target.value)}
              step="0.001"
              placeholder="0.010"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white placeholder-gray-400"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Agregar Cripto
        </button>
      </form>
    </div>
  );
};

export default CryptoForm;