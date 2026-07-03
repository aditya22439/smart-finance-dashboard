import { formatCurrency } from "../../utils/financeUtils";

const getWeeklyMessage = (weeklyComparison) => {
  if (!weeklyComparison) {
    return "Weekly trend unavailable";
  }

  const { direction, percentageChange } = weeklyComparison;

  if (direction === "same") {
    return "You spent the same as last week";
  }

  return `You spent ${percentageChange}% ${
    direction === "increase" ? "more" : "less"
  } than last week`;
};

export default function AnalyticsDashboard({ analytics, isLoading }) {
  if (isLoading) {
    return (
      <section className="analytics-section">
        <div className="loading-state">
          <span className="spinner" />
          <p>Loading analytics...</p>
        </div>
      </section>
    );
  }

  if (!analytics || analytics.transactionCount === 0) {
    return (
      <section className="analytics-section">
        <div className="empty-state">No expense data available</div>
      </section>
    );
  }

  const weeklyComparison = analytics.weeklyComparison;
  const cards = [
    {
      label: "Total Spent",
      value: formatCurrency(analytics.totalSpent),
      accent: "green"
    },
    {
      label: "Transactions",
      value: analytics.transactionCount,
      accent: "blue"
    },
    {
      label: "Average Expense",
      value: formatCurrency(analytics.averageExpense),
      accent: "amber"
    },
    {
      label: "Highest Category",
      value: analytics.highestCategory?.category || "None",
      meta: analytics.highestCategory
        ? formatCurrency(analytics.highestCategory.total)
        : "",
      accent: "rose"
    },
    {
      label: "Lowest Category",
      value: analytics.lowestCategory?.category || "None",
      meta: analytics.lowestCategory ? formatCurrency(analytics.lowestCategory.total) : "",
      accent: "slate"
    }
  ];

  return (
    <section className="analytics-section">
      <div className="section-heading">
        <h2>Analytics Dashboard</h2>
        <span>{getWeeklyMessage(weeklyComparison)}</span>
      </div>

      <div className="analytics-grid">
        {cards.map((card) => (
          <article className={`metric-card metric-${card.accent}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            {card.meta && <small>{card.meta}</small>}
          </article>
        ))}
      </div>

      <article className="weekly-card">
        <div>
          <span>Current Week</span>
          <strong>{formatCurrency(weeklyComparison?.currentWeekSpending)}</strong>
        </div>
        <div>
          <span>Previous Week</span>
          <strong>{formatCurrency(weeklyComparison?.previousWeekSpending)}</strong>
        </div>
        <p>{getWeeklyMessage(weeklyComparison)}</p>
      </article>
    </section>
  );
}
