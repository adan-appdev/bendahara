import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue' | 'purple';
  subtitle?: string;
  trend?: number;
}

const colorMap = {
  green: {
    bg: 'from-green-500 to-emerald-500',
    light: 'bg-green-50',
    lightDark: 'bg-green-900/20',
    text: 'text-green-600',
    textDark: 'text-green-400',
    shadow: 'shadow-green-500/20',
  },
  red: {
    bg: 'from-red-500 to-rose-500',
    light: 'bg-red-50',
    lightDark: 'bg-red-900/20',
    text: 'text-red-600',
    textDark: 'text-red-400',
    shadow: 'shadow-red-500/20',
  },
  blue: {
    bg: 'from-blue-500 to-indigo-500',
    light: 'bg-blue-50',
    lightDark: 'bg-blue-900/20',
    text: 'text-blue-600',
    textDark: 'text-blue-400',
    shadow: 'shadow-blue-500/20',
  },
  purple: {
    bg: 'from-purple-500 to-violet-500',
    light: 'bg-purple-50',
    lightDark: 'bg-purple-900/20',
    text: 'text-purple-600',
    textDark: 'text-purple-400',
    shadow: 'shadow-purple-500/20',
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => {
  const { darkMode } = useApp();
  const c = colorMap[color];

  return (
    <div className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg ${c.shadow} flex-shrink-0 ml-3`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
