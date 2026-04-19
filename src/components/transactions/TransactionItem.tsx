import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Trash2, Edit2, ChevronDown, ChevronUp, User, FileText } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDateShort } from '../../utils/format';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useApp } from '../../context/AppContext';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit, onDelete, showActions = true }) => {
  const { darkMode } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isIncome = transaction.type === 'income';

  return (
    <>
      <div
        className={`rounded-xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700/50' : 'bg-white hover:bg-gray-50 border border-gray-100'}`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isIncome ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {isIncome
              ? <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
              : <TrendingDown size={18} className="text-red-600 dark:text-red-400" />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{transaction.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDateShort(transaction.date)}</span>
              <Badge variant={transaction.type}>{isIncome ? 'Pemasukan' : 'Pengeluaran'}</Badge>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-sm font-bold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
            {expanded ? <ChevronUp size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} /> : <ChevronDown size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />}
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className={`mt-3 pt-3 border-t space-y-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`} onClick={e => e.stopPropagation()}>
            {transaction.student && (
              <div className="flex items-center gap-2">
                <User size={13} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{transaction.student}</span>
              </div>
            )}
            {transaction.notes && (
              <div className="flex items-start gap-2">
                <FileText size={13} className={`mt-0.5 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{transaction.notes}</span>
              </div>
            )}
            {showActions && (onEdit || onDelete) && (
              <div className="flex gap-2 pt-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(transaction)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onDelete && onDelete(transaction.id)}
        title="Hapus Transaksi"
        message={`Apakah kamu yakin ingin menghapus "${transaction.title}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
};

export default TransactionItem;
