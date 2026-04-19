export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  student?: string;
  notes?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  paymentStatus: 'paid' | 'unpaid';
  lastPaymentDate?: string;
}

export type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};
