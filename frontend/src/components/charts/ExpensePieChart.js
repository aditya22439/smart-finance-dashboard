import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import { formatCurrency, getCategoryColor } from "../../utils/financeUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensePieChart({ analytics }) {
  const breakdown = analytics?.categoryBreakdown || [];
  const labels = breakdown.map((item) => item.category);
  const values = breakdown.map((item) => item.total);

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: labels.map((label, index) => getCategoryColor(label, index)),
        borderColor: "#ffffff",
        borderRadius: 4,
        borderWidth: 3,
        data: values,
        hoverBorderWidth: 4,
        hoverOffset: 14
      }
    ]
  };

  const options = {
    animation: {
      animateRotate: true,
      duration: 800
    },
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
        backgroundColor: "#111827",
        callbacks: {
          label: (context) => {
            const total = values.reduce((sum, value) => sum + value, 0);
            const value = Number(context.raw) || 0;
            const percent = total ? Math.round((value / total) * 100) : 0;

            return `${context.label}: ${formatCurrency(value)} (${percent}%)`;
          }
        },
        padding: 12,
        titleColor: "#ffffff"
      }
    },
    responsive: true
  };

  return (
    <section className="panel chart-panel">
      <div className="section-heading">
        <h2>Category Breakdown</h2>
        <span>{labels.length} categories</span>
      </div>
      <div className="chart-wrap">
        {labels.length ? (
          <Pie data={data} options={options} />
        ) : (
          <div className="empty-state">No expense data available</div>
        )}
      </div>
    </section>
  );
}
