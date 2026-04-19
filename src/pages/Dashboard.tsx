import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import TransactionItem from '../components/transactions/TransactionItem';
import { formatCurrency, getMonthlyData } from '../utils/format';

const Dashboard: React.FC = () => {
  const { transactions, students, totalBalance, totalIncome, totalExpense, darkMode } = useApp();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const monthlyData = getMonthlyData(transactions);
  const paidCount = students.filter(s => s.paymentStatus === 'paid').length;
  const unpaidCount = students.filter(s => s.paymentStatus === 'unpaid').length;
  const today = new Date();
  const monthName = today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-xl shadow-lg text-xs border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }} className="font-medium">
              {p.name === 'income' ? 'Pemasukan' : 'Pengeluaran'}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
          <p className={`text-sm mt-0.5 flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Calendar size={13} />
            {monthName}
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${totalBalance >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {totalBalance >= 0 ? '▲ Surplus' : '▼ Defisit'}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Saldo"
          value={formatCurrency(totalBalance)}
          icon={Wallet}
          color="blue"
          subtitle="Total saldo kas"
        />
        <StatCard
          title="Pemasukan"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="green"
          subtitle={`${transactions.filter(t => t.type === 'income').length} transaksi`}
        />
        <StatCard
          title="Pengeluaran"
          value={formatCurrency(totalExpense)}
          icon={TrendingDown}
          color="red"
          subtitle={`${transactions.filter(t => t.type === 'expense').length} transaksi`}
        />
        <StatCard
          title="Siswa Lunas"
          value={`${paidCount}/${students.length}`}
          icon={Users}
          color="purple"
          subtitle={`${unpaidCount} belum bayar`}
        />
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className={`lg:col-span-2 rounded-2xl p-5 shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
          <h2 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ringkasan Bulanan</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => value === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="income" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Belum ada data transaksi</p>
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div className={`rounded-2xl p-5 shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
          <h2 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Status Pembayaran</h2>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Progress Pembayaran</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>{Math.round((paidCount / (students.length || 1)) * 100)}%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${(paidCount / (students.length || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Sudah Bayar</span>
              </div>
              <span className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{paidCount}</span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className={`text-xs font-medium ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Belum Bayar</span>
              </div>
              <span className={`text-sm font-bold ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{unpaidCount}</span>
            </div>
          </div>

          {/* Unpaid Students */}
          {unpaidCount > 0 && (
            <div className="mt-4">
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Belum Bayar:</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {students
                  .filter(s => s.paymentStatus === 'unpaid')
                  .slice(0, 5)
                  .map(s => (
                    <div key={s.id} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <span className="truncate">{s.name}</span>
                    </div>
                  ))}
              </div>
              {unpaidCount > 5 && (
                <Link to="/students" className="text-xs text-green-500 hover:text-green-600 font-medium mt-2 inline-block">
                  +{unpaidCount - 5} lainnya →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`rounded-2xl p-5 shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Transaksi Terbaru</h2>
          <Link
            to="/transactions"
            className="flex items-center gap-1 text-xs font-semibold text-green-500 hover:text-green-600 transition-colors"
          >
            Lihat Semua <ArrowRight size={13} />
          </Link>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map(t => (
              <TransactionItem key={t.id} transaction={t} showActions={false} />
            ))}
          </div>
        ) : (
          <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Belum ada transaksi
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
