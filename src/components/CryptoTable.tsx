import React, { useState } from 'react';
import { Edit2, Trash2, Coins } from 'lucide-react';
import { Cryptocurrency } from '../types';

interface CryptoTableProps {
  cryptocurrencies: Cryptocurrency[];
  onEdit: (id: string, updates: Omit<Cryptocurrency, 'id'>) => void;
  onDelete: (id: string) => void;
}

const CryptoTable: React.FC<CryptoTableProps> = ({ cryptocurrencies, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Cryptocurrency, 'id'>>({
    acronym: '',
    buyAdjustment: 0,
    sellAdjustment: 0
  });

  const handleEdit = (crypto: Cryptocurrency) => {
    setEditingId(crypto.id);
    setEditForm({
      acronym: crypto.acronym,
      buyAdjustment: crypto.buyAdjustment,
      sellAdjustment: crypto.sellAdjustment
    });
  };

  const handleSave = () => {
    if (editingId) {
      onEdit(editingId, editForm);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ acronym: '', buyAdjustment: 0, sellAdjustment: 0 });
  };

  const handleDelete = (id: string, acronym: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${acronym}?`)) {
      onDelete(id);
    }
  };

  if (cryptocurrencies.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-8 text-center">
        <Coins className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No hay criptomonedas configuradas</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          Criptomonedas Configuradas
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acrónimo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ajuste Compra (+)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ajuste Venta (–)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {cryptocurrencies.map((crypto) => (
              <tr key={crypto.id} className="hover:bg-gray-700 transition-colors">
                {editingId === crypto.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editForm.acronym}
                        onChange={(e) => setEditForm({ ...editForm, acronym: e.target.value })}
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm text-white"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editForm.buyAdjustment}
                        onChange={(e) => setEditForm({ ...editForm, buyAdjustment: parseFloat(e.target.value) })}
                        step="0.001"
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm text-white"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editForm.sellAdjustment}
                        onChange={(e) => setEditForm({ ...editForm, sellAdjustment: parseFloat(e.target.value) })}
                        step="0.001"
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm text-white"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="text-green-400 hover:text-green-300 text-sm font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-400 hover:text-gray-300 text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-black">
                        {crypto.acronym}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {crypto.buyAdjustment.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {crypto.sellAdjustment.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(crypto)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(crypto.id, crypto.acronym)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;