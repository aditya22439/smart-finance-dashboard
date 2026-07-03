const periods = [
  { label: "Current Month", value: "current-month" },
  { label: "Last Month", value: "last-month" },
  { label: "All Time", value: "all-time" }
];

export default function PeriodFilter({ activePeriod, onChange }) {
  return (
    <div className="period-filter" aria-label="Expense period filter">
      {periods.map((period) => (
        <button
          className={activePeriod === period.value ? "active" : ""}
          key={period.value}
          onClick={() => onChange(period.value)}
          type="button"
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
