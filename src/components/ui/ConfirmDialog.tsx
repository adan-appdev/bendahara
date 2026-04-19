import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../context/AppContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { darkMode } = useApp();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Batal
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
