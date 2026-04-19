import React, { useState } from 'react';
import { Plus, TrendingDown, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import StatCard from '../components/ui/StatCard';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionItem from '../components/transactions/TransactionItem';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/format';

const Expense: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, darkMode } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | undefined>(undefined);

  const expenseTransactions = [...transactions]
    .filter(t => t.type === 'expense')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExpense = expenseTransactions.reduce((s, t) => s + t.amount, 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyExpense = expenseTransactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((s, t) => s + t.amount, 0);

  const handleAdd = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    addTransaction(data);
    setModalOpen(false);
  };

  const handleEdit = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editTarget) {
      updateTransaction(editTarget.id, data);
      setEditTarget(undefined);
    }
  };

  const openEdit = (t: Transaction) => setEditTarget(t);
  const closeEdit = () => setEditTarget(undefined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pengeluaran</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kelola data pengeluaran kas kelas</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-red-500/30"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          title="Total Pengeluaran"
          value={formatCurrency(totalExpense)}
          icon={TrendingDown}
          color="red"
          subtitle="Semua waktu"
        />
        <StatCard
          title="Bulan Ini"
          value={formatCurrency(monthlyExpense)}
          icon={TrendingDown}
          color="blue"
          subtitle={new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        />
        <StatCard
          title="Jumlah Transaksi"
          value={`${expenseTransactions.length}`}
          icon={List}
          color="purple"
          subtitle="Total transaksi"
        />
      </div>

      {/* List */}
      <div className={`rounded-2xl p-5 shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
        <h2 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Riwayat Pengeluaran ({expenseTransactions.length})
        </h2>
        {expenseTransactions.length > 0 ? (
          <div className="space-y-2">
            {expenseTransactions.map(t => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onEdit={openEdit}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingDown}
            title="Belum ada pengeluaran"
            description="Tambahkan transaksi pengeluaran pertamamu"
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500"
              >
                <Plus size={15} /> Tambah Pengeluaran
              </button>
            }
          />
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Pengeluaran">
        <TransactionForm
          type="expense"
          onSubmit={handleAdd}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={closeEdit} title="Edit Pengeluaran">
        <TransactionForm
          type="expense"
          initialData={editTarget}
          onSubmit={handleEdit}
          onCancel={closeEdit}
        />
      </Modal>
    </div>
  );
};

export default Expense;
