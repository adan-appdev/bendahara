import React from 'react';

interface BadgeProps {
  variant: 'income' | 'expense' | 'paid' | 'unpaid';
  children: React.ReactNode;
}

const variantMap = {
  income: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  expense: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  unpaid: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantMap[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
