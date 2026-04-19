import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  const { darkMode } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <Icon size={28} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
      </div>
      <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</h3>
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
