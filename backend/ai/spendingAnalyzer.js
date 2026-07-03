const { getMonthRange, isWithinRange } = require("../utils/dateUtils");

const sum = (items) => items.reduce((total, item) => total + (Number(item.amount) || 0), 0);
const round = (value) => Math.round((Number(value) || 0) * 10) / 10;

const groupByCategory = (expenses) =>
  expenses.reduce((totals, expense) => {
    const category = expense.category || "Other";
    totals[category] = (totals[category] || 0) + (Number(expense.amount) || 0);
    return totals;
  }, {});

const weekendTotal = (expenses) =>
  sum(expenses.filter((expense) => [0, 6].includes(new Date(expense.date).getDay())));

const analyzeSpendingBehavior = (expenses) => {
  const current = expenses.filter((expense) => isWithinRange(expense.date, getMonthRange(0)));
  const previous = expenses.filter((expense) => isWithinRange(expense.date, getMonthRange(-1)));
  const currentTotal = sum(current);
  const previousTotal = sum(previous);
  const currentCategories = groupByCategory(current);
  const previousCategories = groupByCategory(previous);
  const categoryGrowth = Object.entries(currentCategories)
    .map(([category, total]) => {
      const previousAmount = previousCategories[category] || 0;
      const change = previousAmount ? ((total - previousAmount) / previousAmount) * 100 : total > 0 ? 100 : 0;
      return { category, change: round(change), current: total, previous: previousAmount };
    })
    .sort((a, b) => b.change - a.change);

  const unusualSpikes = current
    .filter((expense) => current.length > 2 && Number(expense.amount) > currentTotal / current.length * 2)
    .map((expense) => ({ amount: expense.amount, category: expense.category, date: expense.date, note: expense.note }));

  const overspendingPatterns = categoryGrowth
    .filter((item) => item.change >= 25 && item.current >= currentTotal * 0.15)
    .map((item) => `${item.category} spending is growing faster than your monthly average`);
  const weekendShare = currentTotal ? (weekendTotal(current) / currentTotal) * 100 : 0;
  const insights = [];
  if (previousTotal > 0 && currentTotal !== previousTotal) {
    insights.push(`Total spending ${currentTotal > previousTotal ? "increased" : "decreased"} by ${Math.abs(round(((currentTotal - previousTotal) / previousTotal) * 100))}% this month`);
  }
  if (categoryGrowth[0]?.change > 15) {
    insights.push(`${categoryGrowth[0].category} expenses increased by ${categoryGrowth[0].change}% this month`);
  }
  if (categoryGrowth.some((item) => item.category === "Subscription" && item.change > 10)) {
    insights.push("Subscription expenses are rising");
  }
  if (weekendShare >= 35) insights.push("Weekend spending is consistently high");
  if (unusualSpikes.length) insights.push(`${unusualSpikes.length} unusual spending spike${unusualSpikes.length === 1 ? "" : "s"} detected`);

  return {
    categoryGrowth,
    insights,
    currentTotal,
    overspendingPatterns,
    previousTotal,
    unusualSpikes,
    weekendShare: round(weekendShare)
  };
};

module.exports = { analyzeSpendingBehavior, groupByCategory, sum };
