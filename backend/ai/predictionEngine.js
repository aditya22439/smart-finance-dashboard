const { getMonthRange, isWithinRange } = require("../utils/dateUtils");
const { sum } = require("./spendingAnalyzer");

const predictMonthEnd = (expenses, budgetAmount = 0) => {
  const today = new Date();
  const monthRange = getMonthRange(0);
  const currentMonth = expenses.filter((expense) => isWithinRange(expense.date, monthRange));
  const spent = sum(currentMonth);
  const daysElapsed = Math.max(1, today.getDate());
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dailyAverage = spent / daysElapsed;
  const projectedMonthEndSpending = dailyAverage * daysInMonth;
  const possibleSavings = Math.max(0, budgetAmount - projectedMonthEndSpending);
  const overspendingRisk = budgetAmount > 0 && projectedMonthEndSpending > budgetAmount ? "high" : budgetAmount > 0 && projectedMonthEndSpending > budgetAmount * 0.85 ? "medium" : "low";
  const remainingBudget = Math.max(0, budgetAmount - spent);
  const daysUntilBudgetExceeded = budgetAmount > 0 && dailyAverage > 0 ? Math.max(0, Math.ceil(remainingBudget / dailyAverage)) : null;

  return { dailyAverage, daysUntilBudgetExceeded, overspendingRisk, possibleSavings, projectedMonthEndSpending };
};

module.exports = { predictMonthEnd };
