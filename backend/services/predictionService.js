const { getMonthRange, isWithinRange } = require("../utils/dateUtils");

const sumExpenses = (expenses) =>
  expenses.reduce((total, expense) => total + (Number(expense.amount) || 0), 0);

const predictSavings = (expenses, budgetAmount = 0) => {
  const monthRange = getMonthRange(0);
  const today = new Date();
  const currentMonthExpenses = expenses.filter((expense) => isWithinRange(expense.date, monthRange));
  const spent = sumExpenses(currentMonthExpenses);
  const daysElapsed = Math.max(1, today.getDate());
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dailyAverage = spent / daysElapsed;
  const projectedMonthEndSpending = dailyAverage * daysInMonth;
  const possibleSavings = Math.max(0, Number(budgetAmount || 0) - projectedMonthEndSpending);
  const overspendingRisk =
    budgetAmount > 0 && projectedMonthEndSpending > budgetAmount
      ? "high"
      : budgetAmount > 0 && projectedMonthEndSpending > budgetAmount * 0.85
      ? "medium"
      : "low";

  return {
    dailyAverage,
    overspendingRisk,
    possibleSavings,
    projectedMonthEndSpending
  };
};

module.exports = {
  predictSavings
};
