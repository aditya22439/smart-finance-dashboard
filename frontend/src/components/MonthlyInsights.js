const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);

const getCurrentMonthExpenses = (expenses) => {
  const now = new Date();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });
};

const getHighestCategory = (expenses) => {
  const categoryTotals = expenses.reduce((totals, expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    return {
      ...totals,
      [category]: (totals[category] || 0) + amount
    };
  }, {});

  const [category] = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || [];

  return category || "None";
};

export default function MonthlyInsights({ expenses }) {
  const monthlyExpenses = getCurrentMonthExpenses(expenses);
  const totalThisMonth = monthlyExpenses.reduce(
    (total, expense) => total + (Number(expense.amount) || 0),
    0
  );
  const transactionCount = monthlyExpenses.length;
  const averageSpending = transactionCount ? totalThisMonth / transactionCount : 0;

  const insights = [
    {
      label: "Highest Category",
      value: getHighestCategory(monthlyExpenses)
    },
    {
      label: "This Month",
      value: formatCurrency(totalThisMonth)
    },
    {
      label: "Transactions",
      value: transactionCount
    },
    {
      label: "Average Spend",
      value: formatCurrency(averageSpending)
    }
  ];

  return (
    <section className="insights-grid" aria-label="Monthly insights">
      {insights.map((insight) => (
        <article className="insight-card" key={insight.label}>
          <span>{insight.label}</span>
          <strong>{insight.value}</strong>
        </article>
      ))}
    </section>
  );
}
