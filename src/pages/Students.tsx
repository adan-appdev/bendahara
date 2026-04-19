import React, { useState } from 'react';
import {
  Plus,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Trash2,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDateShort } from '../utils/format';

const Students: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, darkMode } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.paymentStatus === filter;
    return matchSearch && matchFilter;
  });

  const paidCount = students.filter(s => s.paymentStatus === 'paid').length;
  const unpaidCount = students.filter(s => s.paymentStatus === 'unpaid').length;

  const handleToggle = (student: Student) => {
    const newStatus = student.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    updateStudent(student.id, {
      paymentStatus: newStatus,
      lastPaymentDate: newStatus === 'paid' ? new Date().toISOString().slice(0, 10) : undefined,
    });
  };

  const handleAdd = () => {
    if (!newName.trim()) {
      setNameError('Nama siswa wajib diisi');
      return;
    }
    if (students.some(s => s.name.toLowerCase() === newName.trim().toLowerCase())) {
      setNameError('Nama siswa sudah ada');
      return;
    }
    addStudent({ name: newName.trim(), paymentStatus: 'unpaid' });
    setNewName('');
    setNameError('');
    setAddModalOpen(false);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-teal-400 to-teal-600',
      'from-orange-400 to-orange-600',
      'from-cyan-400 to-cyan-600',
      'from-green-400 to-green-600',
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      active
        ? 'bg-green-500 text-white shadow-sm'
        : darkMode
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  const confirmStudent = students.find(s => s.id === confirmId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Daftar Siswa</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kelola status pembayaran siswa</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-green-500/30"
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Tambah Siswa</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-2xl p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-sm`}>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{students.length}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Siswa</p>
        </div>
        <div className={`rounded-2xl p-4 text-center ${darkMode ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-100'} shadow-sm`}>
          <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{paidCount}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-green-500' : 'text-green-600'}`}>Sudah Bayar</p>
        </div>
        <div className={`rounded-2xl p-4 text-center ${darkMode ? 'bg-orange-900/20 border border-orange-800/30' : 'bg-orange-50 border border-orange-100'} shadow-sm`}>
          <p className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{unpaidCount}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-orange-500' : 'text-orange-600'}`}>Belum Bayar</p>
        </div>
      </div>

      {/* Unpaid Alert */}
      {unpaidCount > 0 && (
        <div className={`flex items-start gap-3 p-4 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-800/30' : 'bg-orange-50 border border-orange-200'}`}>
          <AlertCircle size={16} className={`mt-0.5 flex-shrink-0 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
          <div>
            <p className={`text-sm font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
              {unpaidCount} siswa belum membayar iuran
            </p>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-orange-500' : 'text-orange-600'}`}>
              {students.filter(s => s.paymentStatus === 'unpaid').map(s => s.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-colors focus:ring-2 focus:ring-green-400/40 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-green-400'}`}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={filterBtnClass(filter === 'all')}>Semua</button>
          <button onClick={() => setFilter('paid')} className={filterBtnClass(filter === 'paid')}>Lunas</button>
          <button onClick={() => setFilter('unpaid')} className={filterBtnClass(filter === 'unpaid')}>Belum</button>
        </div>
      </div>

      {/* Student List */}
      <div className={`rounded-2xl shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'}`}>
        <div className={`px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Menampilkan {filtered.length} dari {students.length} siswa
          </p>
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={32} className={`mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada siswa ditemukan</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filtered.map((student, idx) => (
              <div
                key={student.id}
                className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}
              >
                {/* Number + Avatar */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`text-xs w-5 text-right flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(student.name)} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{student.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{student.name}</p>
                    {student.lastPaymentDate && student.paymentStatus === 'paid' && (
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Bayar: {formatDateShort(student.lastPaymentDate)}
                      </p>
                    )}
                    {student.paymentStatus === 'unpaid' && (
                      <p className={`text-xs ${darkMode ? 'text-orange-500' : 'text-orange-500'}`}>Belum bayar</p>
                    )}
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(student)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
                      student.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50'
                    }`}
                  >
                    {student.paymentStatus === 'paid'
                      ? <><CheckCircle size={13} /> Lunas</>
                      : <><XCircle size={13} /> Belum</>
                    }
                  </button>
                  <button
                    onClick={() => setConfirmId(student.id)}
                    className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={addModalOpen} onClose={() => { setAddModalOpen(false); setNewName(''); setNameError(''); }} title="Tambah Siswa" size="sm">
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nama Siswa *</label>
            <input
              type="text"
              placeholder="cth: Ahmad Fauzi"
              value={newName}
              onChange={e => { setNewName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
              className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-colors outline-none focus:ring-2 ${
                nameError
                  ? 'border-red-400 focus:ring-red-300'
                  : darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500/50 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-green-400/50 focus:border-green-400'
              }`}
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setAddModalOpen(false); setNewName(''); setNameError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Batal
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={15} /> Tambah
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => { if (confirmId) deleteStudent(confirmId); setConfirmId(null); }}
        title="Hapus Siswa"
        message={`Apakah kamu yakin ingin menghapus ${confirmStudent?.name}? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
};

export default Students;
