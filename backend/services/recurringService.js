const dayDifference = (a, b) =>
  Math.abs((new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24));

const isSimilarAmount = (a, b) => {
  const first = Number(a) || 0;
  const second = Number(b) || 0;
  const tolerance = Math.max(100, Math.min(first, second) * 0.15);
  return Math.abs(first - second) <= tolerance;
};

const detectRecurringExpenses = (expenses) => {
  const groups = {};

  expenses.forEach((expense) => {
    const key = `${expense.category || "Other"}:${String(expense.note || "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .slice(0, 3)
      .join(" ")}`;

    groups[key] = groups[key] || [];
    groups[key].push(expense);
  });

  return Object.values(groups)
    .filter((group) => group.length >= 2)
    .map((group) => [...group].sort((a, b) => new Date(a.date) - new Date(b.date)))
    .filter((group) =>
      group.some((expense, index) => {
        if (index === 0) {
          return false;
        }

        const previous = group[index - 1];
        const days = dayDifference(expense.date, previous.date);
        return days >= 25 && days <= 35 && isSimilarAmount(expense.amount, previous.amount);
      })
    )
    .map((group) => {
      const latest = group[group.length - 1];
      return {
        amount: latest.amount,
        category: latest.category || "Other",
        count: group.length,
        label: latest.note || latest.category || "Recurring expense",
        lastPaidAt: latest.date
      };
    });
};

module.exports = {
  detectRecurringExpenses
};
