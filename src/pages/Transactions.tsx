import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  List,
  TrendingUp,
  TrendingDown,
  Calendar,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction, TransactionType } from '../types';
import TransactionItem from '../components/transactions/TransactionItem';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/transactions/TransactionForm';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, exportToCSV } from '../utils/format';

type FilterType = 'all' | TransactionType;

const Transactions: React.FC = () => {
  const { transactions, updateTransaction, deleteTransaction, darkMode } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | undefined>(undefined);

  const filtered = useMemo(() => {
    return [...transactions]
      .filter(t => {
        const matchSearch =
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.student?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          (t.notes?.toLowerCase().includes(search.toLowerCase()) ?? false);

        const matchType = typeFilter === 'all' || t.type === typeFilter;

        const matchFrom = !dateFrom || t.date >= dateFrom;
        const matchTo = !dateTo || t.date <= dateTo;

        return matchSearch && matchType && matchFrom && matchTo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, typeFilter, dateFrom, dateTo]);

  const totalFiltered = filtered.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const filteredIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const handleEdit = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editTarget) {
      updateTransaction(editTarget.id, data);
      setEditTarget(undefined);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = search || typeFilter !== 'all' || dateFrom || dateTo;

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors focus:ring-2 focus:ring-green-400/40 ${
    darkMode
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-green-400'
  }`;

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
      active
        ? 'bg-green-500 text-white shadow-sm'
        : darkMode
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Transaksi</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Semua riwayat transaksi kas kelas</p>
        </div>
        <button
          onClick={() => exportToCSV(filtered)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-95 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-2xl p-3 sm:p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-sm`}>
          <p className={`text-lg sm:text-xl font-bold ${filteredIncome >= filteredExpense ? 'text-green-500' : 'text-gray-600'}`}>
            {formatCurrency(filteredIncome)}
          </p>
          <p className={`text-xs mt-0.5 flex items-center justify-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <TrendingUp size={11} /> Pemasukan
          </p>
        </div>
        <div className={`rounded-2xl p-3 sm:p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-sm`}>
          <p className="text-lg sm:text-xl font-bold text-red-500">{formatCurrency(filteredExpense)}</p>
          <p className={`text-xs mt-0.5 flex items-center justify-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <TrendingDown size={11} /> Pengeluaran
          </p>
        </div>
        <div className={`rounded-2xl p-3 sm:p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-sm`}>
          <p className={`text-lg sm:text-xl font-bold ${totalFiltered >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
            {totalFiltered >= 0 ? '+' : ''}{formatCurrency(Math.abs(totalFiltered))}
          </p>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Net Balance</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className={`rounded-2xl p-4 space-y-3 shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Cari transaksi, nama siswa, catatan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${inputClass} pl-9`}
            />
            {search && (
              <button onClick={() => setSearch('')} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
              showFilters || hasActiveFilters
                ? 'bg-green-500 text-white border-green-500'
                : darkMode
                ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && <span className="w-4 h-4 rounded-full bg-white text-green-600 text-xs flex items-center justify-center font-bold leading-none">!</span>}
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-1">
            {/* Type Filter */}
            <div>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tipe Transaksi</p>
              <div className="flex gap-2">
                <button onClick={() => setTypeFilter('all')} className={filterBtnClass(typeFilter === 'all')}>
                  <List size={12} /> Semua
                </button>
                <button onClick={() => setTypeFilter('income')} className={filterBtnClass(typeFilter === 'income')}>
                  <TrendingUp size={12} /> Pemasukan
                </button>
                <button onClick={() => setTypeFilter('expense')} className={filterBtnClass(typeFilter === 'expense')}>
                  <TrendingDown size={12} /> Pengeluaran
                </button>
              </div>
            </div>

            {/* Date Filter */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className={`text-xs font-semibold mb-1.5 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Calendar size={11} /> Dari Tanggal
                </p>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={inputClass} />
              </div>
              <div>
                <p className={`text-xs font-semibold mb-1.5 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Calendar size={11} /> Sampai Tanggal
                </p>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={inputClass} />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'}`}
              >
                <X size={12} /> Hapus semua filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className={`rounded-2xl p-5 shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Hasil ({filtered.length} transaksi)
          </h2>
          {hasActiveFilters && (
            <span className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'}`}>
              Filter aktif
            </span>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map(t => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onEdit={setEditTarget}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={List}
            title="Tidak ada transaksi"
            description={hasActiveFilters ? 'Coba ubah filter pencarian kamu' : 'Belum ada transaksi yang tercatat'}
            action={
              hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  <X size={14} /> Hapus Filter
                </button>
              ) : undefined
            }
          />
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(undefined)}
        title={`Edit ${editTarget?.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
      >
        {editTarget && (
          <TransactionForm
            type={editTarget.type}
            initialData={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(undefined)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Transactions;
