const dayDifference = (a, b) => Math.abs((new Date(a) - new Date(b)) / 86400000);
const similarAmount = (a, b) => Math.abs((Number(a) || 0) - (Number(b) || 0)) <= Math.max(100, Math.min(Number(a) || 0, Number(b) || 0) * 0.15);

const detectRecurringExpenses = (expenses) => {
  const groups = {};
  expenses.forEach((expense) => {
    const key = `${expense.category || "Other"}:${String(expense.note || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").slice(0, 3).join(" ")}`;
    groups[key] = groups[key] || [];
    groups[key].push(expense);
  });

  return Object.values(groups)
    .filter((group) => group.length >= 2)
    .map((group) => [...group].sort((a, b) => new Date(a.date) - new Date(b.date)))
    .filter((group) => group.some((expense, index) => index > 0 && dayDifference(expense.date, group[index - 1].date) >= 25 && dayDifference(expense.date, group[index - 1].date) <= 35 && similarAmount(expense.amount, group[index - 1].amount)))
    .map((group) => {
      const latest = group[group.length - 1];
      return { amount: latest.amount, category: latest.category || "Other", count: group.length, label: latest.note || latest.category || "Recurring expense", lastPaidAt: latest.date };
    });
};

module.exports = { detectRecurringExpenses };
