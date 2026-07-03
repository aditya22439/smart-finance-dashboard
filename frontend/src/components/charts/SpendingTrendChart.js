import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "../../utils/financeUtils";

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

export default function SpendingTrendChart({ analytics, type = "daily" }) {
  const isAllTimeWeeklyTrend = type === "weekly" && analytics?.period === "all-time";
  const trend =
    type === "monthly"
      ? analytics?.monthlyTrend || []
      : type === "weekly"
      ? analytics?.weeklyTrend || []
      : analytics?.dailyTrend || [];
  const labels = trend.map((item) => item.label || item.date);
  const values = trend.map((item) => item.total);

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(14, 165, 233, 0.14)",
        borderColor: "#0ea5e9",
        borderWidth: 3,
        data: values,
        fill: true,
        pointBackgroundColor: "#0f766e",
        pointRadius: 4,
        tension: 0.38
      }
    ]
  };

  const options = {
    animation: { duration: 900 },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.raw)
        }
      }
    },
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  return (
    <section className="panel chart-panel">
      <div className="section-heading">
        <h2>{type === "monthly" || isAllTimeWeeklyTrend ? "Monthly" : type === "weekly" ? "Weekly" : "Daily"} Trend</h2>
        <span>{labels.length} points</span>
      </div>
      <div className="chart-wrap">
        {labels.length ? <Line data={data} options={options} /> : <div className="empty-state">No trend data</div>}
      </div>
    </section>
  );
}
