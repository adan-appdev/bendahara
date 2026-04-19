import { Transaction } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getMonthlyData = (transactions: Transaction[]) => {
  const monthMap: Record<string, { income: number; expense: number }> = {};

  transactions.forEach(t => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap[key]) {
      monthMap[key] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthMap[key].income += t.amount;
    } else {
      monthMap[key].expense += t.amount;
    }
  });

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, val]) => {
      const [year, month] = key.split('-');
      const date = new Date(Number(year), Number(month) - 1, 1);
      return {
        month: new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit' }).format(date),
        income: val.income,
        expense: val.expense,
      };
    });
};

export const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['ID', 'Tipe', 'Judul', 'Jumlah', 'Tanggal', 'Siswa', 'Catatan'];
  const rows = transactions.map(t => [
    t.id,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    t.title,
    t.amount,
    t.date,
    t.student || '',
    t.notes || '',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kas-kelas-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
