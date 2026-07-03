const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    style: "currency"
  }).format(Number(amount) || 0);

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(date))
    : "No date";

export default function ExpenseList({ expenses, deletingId, onRequestDelete }) {
  if (!expenses.length) {
    return (
      <section className="panel expenses-panel">
        <div className="section-heading">
          <h2>Recent Expenses</h2>
          <span>0 records</span>
        </div>
        <div className="empty-state">No expenses added yet</div>
      </section>
    );
  }

  return (
    <section className="panel expenses-panel">
      <div className="section-heading">
        <h2>Recent Expenses</h2>
        <span>{expenses.length} records</span>
      </div>
      <div className="expense-list">
        {expenses.map((expense) => (
          <article className="expense-card" key={expense._id}>
            <div className="expense-category">
              <span>{expense.category?.charAt(0) || "E"}</span>
              <div>
                <strong>{expense.category || "Other"}</strong>
                <p>{expense.note || "No note added"}</p>
              </div>
            </div>

            <div className="expense-details">
              <strong>{formatCurrency(expense.amount)}</strong>
              <span>{formatDate(expense.date)}</span>
            </div>

            <button
              aria-label={`Delete ${expense.category || "expense"}`}
              className="delete-button"
              disabled={deletingId === expense._id}
              onClick={() => onRequestDelete(expense)}
              type="button"
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
