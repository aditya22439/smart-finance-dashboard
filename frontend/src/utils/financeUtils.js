export const formatCurrency = (amount, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits,
    style: "currency"
  }).format(Number(amount) || 0);

export const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(date))
    : "No date";

export const categoryColors = {
  Bills: "#ef4444",
  Education: "#8b5cf6",
  Entertainment: "#ec4899",
  Food: "#22c55e",
  Health: "#06b6d4",
  Other: "#64748b",
  Rent: "#14b8a6",
  Shopping: "#f97316",
  Subscription: "#8b5cf6",
  Travel: "#0ea5e9"
};

export const getCategoryColor = (category, index = 0) => {
  const fallbackColors = [
    "#14b8a6",
    "#f59e0b",
    "#6366f1",
    "#84cc16",
    "#a855f7",
    "#0f766e"
  ];

  return categoryColors[category] || fallbackColors[index % fallbackColors.length];
};

export const getFilteredExpenses = (expenses, period) => {
  if (period === "all-time") {
    return expenses;
  }

  const now = new Date();
  const monthOffset = period === "last-month" ? -1 : 0;
  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate < end;
  });
};
