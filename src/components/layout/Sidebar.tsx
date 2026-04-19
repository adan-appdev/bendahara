import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  List,
  Moon,
  Sun,
  Menu,
  X,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/income', icon: TrendingUp, label: 'Pemasukan' },
  { to: '/expense', icon: TrendingDown, label: 'Pengeluaran' },
  { to: '/students', icon: Users, label: 'Siswa' },
  { to: '/transactions', icon: List, label: 'Transaksi' },
];

const Sidebar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 shadow-sm ${darkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kas Kelas</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 top-14"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`md:hidden fixed top-14 left-0 bottom-0 w-64 z-40 transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}>
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/30'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-30 ${darkMode ? 'bg-gray-900 border-r border-gray-700/50' : 'bg-white border-r border-gray-200'} shadow-sm`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 py-5 border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-base leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kas Kelas</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bendahara XII IPA 3</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Menu</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/30'
                    : darkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-70" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
