// src/utils/calculations.js
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBalance = (transactions) => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

export const calculateBudgetProgress = (budget, expenses) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  return Math.min((totalExpenses / budget) * 100, 100);
};
