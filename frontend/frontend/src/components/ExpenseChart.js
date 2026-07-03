import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColors = {
  Bills: "#dc2626",
  Food: "#16a34a",
  Health: "#0891b2",
  Other: "#64748b",
  Shopping: "#7c3aed",
  Travel: "#f59e0b"
};

export default function ExpenseChart({ expenses }) {
  const categoryTotals = expenses.reduce((totals, expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    return {
      ...totals,
      [category]: (totals[category] || 0) + amount
    };
  }, {});

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: labels.map((label) => categoryColors[label] || categoryColors.Other),
        borderColor: "#ffffff",
        borderWidth: 3,
        data: values,
        hoverOffset: 12
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
          color: "#475569",
          padding: 16,
          usePointStyle: true
        },
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = values.reduce((sum, value) => sum + value, 0);
            const value = Number(context.raw) || 0;
            const percent = total ? Math.round((value / total) * 100) : 0;

            return `${context.label}: Rs ${value.toLocaleString("en-IN")} (${percent}%)`;
          }
        }
      }
    },
    responsive: true
  };

  return (
    <section className="panel chart-panel">
      <div className="section-heading">
        <h2>Category Split</h2>
        <span>{labels.length} categories</span>
      </div>
      <div className="chart-wrap">
        {labels.length ? (
          <Pie data={data} options={options} />
        ) : (
          <div className="empty-state">No expenses added yet</div>
        )}
      </div>
    </section>
  );
}
