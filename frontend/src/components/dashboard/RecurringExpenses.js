import { formatCurrency, formatDate } from "../../utils/financeUtils";

export default function RecurringExpenses({ items = [] }) {
  return (
    <section className="panel recurring-panel">
      <div className="section-heading">
        <h2>Recurring Payments</h2>
        <span>{items.length} detected</span>
      </div>
      {items.length ? (
        <div className="recurring-list">
          {items.map((item) => (
            <article className="recurring-item" key={`${item.label}-${item.lastPaidAt}`}>
              <div>
                <strong>{item.label}</strong>
                <p>{item.category} - last paid {formatDate(item.lastPaidAt)}</p>
              </div>
              <span>{formatCurrency(item.amount)}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">No recurring payments detected</div>
      )}
    </section>
  );
}
