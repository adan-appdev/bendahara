import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../../types';
import { useApp } from '../../context/AppContext';

interface TransactionFormProps {
  type: TransactionType;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSubmit, onCancel, initialData }) => {
  const { darkMode, students } = useApp();
  const [form, setForm] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount?.toString() || '',
    date: initialData?.date || new Date().toISOString().slice(0, 10),
    student: initialData?.student || '',
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        amount: initialData.amount.toString(),
        date: initialData.date,
        student: initialData.student || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Judul wajib diisi';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Jumlah harus lebih dari 0';
    if (!form.date) errs.date = 'Tanggal wajib diisi';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      type,
      title: form.title.trim(),
      amount: Number(form.amount),
      date: form.date,
      student: form.student || undefined,
      notes: form.notes || undefined,
    });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl text-sm border transition-colors outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-400 focus:ring-red-300'
        : darkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500/50 focus:border-green-500'
        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-green-400/50 focus:border-green-400'
    }`;

  const labelClass = `block text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Judul *</label>
        <input
          type="text"
          placeholder={type === 'income' ? 'cth: Iuran Bulanan Mei' : 'cth: Beli ATK'}
          value={form.title}
          onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: '' })); }}
          className={inputClass('title')}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className={labelClass}>Jumlah (Rp) *</label>
        <input
          type="number"
          placeholder="cth: 50000"
          min="0"
          value={form.amount}
          onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); setErrors(er => ({ ...er, amount: '' })); }}
          className={inputClass('amount')}
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className={labelClass}>Tanggal *</label>
        <input
          type="date"
          value={form.date}
          onChange={e => { setForm(f => ({ ...f, date: e.target.value })); setErrors(er => ({ ...er, date: '' })); }}
          className={inputClass('date')}
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      {type === 'income' && (
        <div>
          <label className={labelClass}>Nama Siswa (opsional)</label>
          <select
            value={form.student}
            onChange={e => setForm(f => ({ ...f, student: e.target.value }))}
            className={inputClass('student')}
          >
            <option value="">-- Pilih Siswa --</option>
            {students.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Catatan (opsional)</label>
        <textarea
          placeholder="Tambahkan catatan..."
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={3}
          className={`${inputClass('notes')} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Batal
        </button>
        <button
          type="submit"
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-md ${
            type === 'income'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'
              : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/30'
          }`}
        >
          {initialData ? 'Simpan Perubahan' : 'Tambah'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
