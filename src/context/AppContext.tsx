import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction, Student } from '../types';
import { mockTransactions, mockStudents } from '../data/mockData';

interface AppContextType {
  transactions: Transaction[];
  students: Student[];
  darkMode: boolean;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  toggleDarkMode: () => void;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

const AppContext = createContext<AppContextType | null>(null);

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem('treasurer_transactions');
      return stored ? JSON.parse(stored) : mockTransactions;
    } catch {
      return mockTransactions;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem('treasurer_students');
      return stored ? JSON.parse(stored) : mockStudents;
    } catch {
      return mockStudents;
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('treasurer_darkmode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('treasurer_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('treasurer_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('treasurer_darkmode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTransaction = (t: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions(prev => [
      { ...t, id: generateId(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const updateTransaction = (id: string, t: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => (tx.id === id ? { ...tx, ...t } : tx)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const addStudent = (s: Omit<Student, 'id'>) => {
    setStudents(prev => [...prev, { ...s, id: generateId() }]);
  };

  const updateStudent = (id: string, s: Partial<Student>) => {
    setStudents(prev => prev.map(st => (st.id === id ? { ...st, ...s } : st)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(st => st.id !== id));
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <AppContext.Provider
      value={{
        transactions,
        students,
        darkMode,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleDarkMode,
        totalBalance,
        totalIncome,
        totalExpense,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
