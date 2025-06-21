import React from 'react';
import { 
  Home, 
  Plus, 
  Coins, 
  CheckCircle, 
  Trophy,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onMouseLeave: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange,
  onMouseLeave
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Vista general y operaciones pendientes'
    },
    {
      id: 'add-crypto',
      label: 'Añadir Nueva Criptomoneda',
      icon: Plus,
      description: 'Configurar nueva criptomoneda'
    },
    {
      id: 'crypto-list',
      label: 'Criptomonedas Configuradas',
      icon: Coins,
      description: 'Gestionar criptomonedas existentes'
    },
    {
      id: 'completed-operations',
      label: 'Operaciones Terminadas',
      icon: CheckCircle,
      description: 'Historial de operaciones completadas'
    },
    {
      id: 'ranking',
      label: 'Ranking por Rentabilidad',
      icon: Trophy,
      description: 'Rendimiento por criptomoneda'
    }
  ];

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'
      }`}
      onMouseLeave={onMouseLeave}
    >
      
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-full shadow-lg">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Binance Manager</h2>
            <p className="text-xs text-gray-400">Trading Operations</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-black' : 'text-gray-400 group-hover:text-yellow-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${
                    isActive ? 'text-black' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-xs mt-1 ${
                    isActive ? 'text-gray-800' : 'text-gray-500 group-hover:text-gray-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Binance Operations Manager
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Professional Trading Tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;