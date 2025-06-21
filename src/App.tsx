import React, { useState, useEffect } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import CryptoForm from './components/CryptoForm';
import CryptoTable from './components/CryptoTable';
import OperationForm from './components/OperationForm';
import OperationTable from './components/OperationTable';
import CompletedOperationsTable from './components/CompletedOperationsTable';
import RecentOperationsTable from './components/RecentOperationsTable';
import Summary from './components/Summary';
import CryptoRanking from './components/CryptoRanking';
import Sidebar from './components/Sidebar';
import { Cryptocurrency, Operation } from './types';
import { 
  saveCryptocurrencies, 
  loadCryptocurrencies, 
  saveOperations, 
  loadOperations 
} from './utils/localStorage';

function App() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    const loadedCryptos = loadCryptocurrencies();
    const loadedOperations = loadOperations();
    
    setCryptocurrencies(loadedCryptos);
    setOperations(loadedOperations);
    setIsLoading(false);
    
    console.log('Data loaded successfully:', {
      cryptocurrencies: loadedCryptos.length,
      operations: loadedOperations.length
    });
  }, []);

  // Save cryptocurrencies to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      console.log('Saving cryptocurrencies...', cryptocurrencies.length);
      saveCryptocurrencies(cryptocurrencies);
    }
  }, [cryptocurrencies, isLoading]);

  // Save operations to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      console.log('Saving operations...', operations.length);
      saveOperations(operations);
    }
  }, [operations, isLoading]);

  const handleAddCrypto = (newCrypto: Omit<Cryptocurrency, 'id'>) => {
    const crypto: Cryptocurrency = {
      ...newCrypto,
      id: Date.now().toString()
    };
    console.log('Adding new crypto:', crypto);
    setCryptocurrencies(prev => [...prev, crypto]);
  };

  const handleEditCrypto = (id: string, updates: Omit<Cryptocurrency, 'id'>) => {
    console.log('Editing crypto:', id, updates);
    setCryptocurrencies(prev => 
      prev.map(crypto => 
        crypto.id === id ? { ...crypto, ...updates } : crypto
      )
    );
  };

  const handleDeleteCrypto = (id: string) => {
    console.log('Deleting crypto:', id);
    setCryptocurrencies(prev => prev.filter(crypto => crypto.id !== id));
  };

  const handleAddOperation = (newOperation: Omit<Operation, 'id'>) => {
    const operation: Operation = {
      ...newOperation,
      id: Date.now().toString()
    };
    console.log('Adding new operation:', operation);
    setOperations(prev => [...prev, operation]);
  };

  const handleCompleteOperation = (id: string, completionData: any) => {
    console.log('Completing operation:', id, completionData);
    setOperations(prev => 
      prev.map(operation => 
        operation.id === id 
          ? { 
              ...operation, 
              status: 'completed' as const,
              ...completionData
            }
          : operation
      )
    );
  };

  const handleDeleteOperation = (id: string) => {
    console.log('Deleting operation:', id);
    setOperations(prev => prev.filter(operation => operation.id !== id));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'add-crypto':
        return (
          <div className="space-y-8">
            <CryptoForm onAdd={handleAddCrypto} />
          </div>
        );
      
      case 'crypto-list':
        return (
          <div className="space-y-8">
            <CryptoTable 
              cryptocurrencies={cryptocurrencies}
              onEdit={handleEditCrypto}
              onDelete={handleDeleteCrypto}
            />
          </div>
        );
      
      case 'completed-operations':
        return (
          <div className="space-y-8">
            <CompletedOperationsTable 
              operations={operations.filter(op => op.status === 'completed')}
              cryptocurrencies={cryptocurrencies}
              onDelete={handleDeleteOperation}
            />
          </div>
        );
      
      case 'ranking':
        return (
          <div className="space-y-8">
            <CryptoRanking operations={operations} />
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            {/* Summary Cards */}
            <Summary operations={operations} />

            {/* Recent Operations */}
            <RecentOperationsTable 
              operations={operations}
              cryptocurrencies={cryptocurrencies}
            />

            {/* Operation Form */}
            <OperationForm 
              cryptocurrencies={cryptocurrencies}
              onAdd={handleAddOperation}
            />

            {/* Pending Operations Table */}
            <OperationTable 
              operations={operations.filter(op => op.status === 'pending')}
              cryptocurrencies={cryptocurrencies}
              onComplete={handleCompleteOperation}
              onDelete={handleDeleteOperation}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hover trigger area for sidebar */}
      <div 
        className="fixed left-0 top-0 w-4 h-full z-50 hidden lg:block"
        onMouseEnter={() => setSidebarOpen(true)}
      />

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onMouseLeave={() => setSidebarOpen(false)}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-full shadow-lg">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                      Binance Operations Manager
                    </h1>
                    <p className="text-sm text-gray-400">
                      Gestiona tus operaciones de trading profesionalmente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;