import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import ConfirmDialog from "./components/ConfirmDialog";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import MonthlyInsights from "./components/MonthlyInsights";
import Toast from "./components/Toast";
import "./components/components.css";
import { deleteExpense, getExpenses } from "./services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    style: "currency"
  }).format(amount);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [pendingDeleteExpense, setPendingDeleteExpense] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const fetchExpenses = useCallback(async () => {
    setError("");

    try {
      const response = await getExpenses();
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not load expenses. Make sure the backend is running on port 5000.";

      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDeleteExpense = async () => {
    if (!pendingDeleteExpense?._id) {
      return;
    }

    const id = pendingDeleteExpense._id;
    const previousExpenses = expenses;
    setDeletingId(id);
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense._id !== id)
    );

    try {
      await deleteExpense(id);
      setPendingDeleteExpense(null);
      showToast("Expense deleted", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not delete expense. Make sure the backend is running on port 5000.";

      setExpenses(previousExpenses);
      setError(message);
      showToast(message, "error");
    } finally {
      setDeletingId("");
    }
  };

  const totalAmount = useMemo(
    () =>
      expenses.reduce(
        (total, expense) => total + (Number(expense.amount) || 0),
        0
      ),
    [expenses]
  );

  return (
    <main className="app-shell">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ConfirmDialog
        expense={pendingDeleteExpense}
        isDeleting={Boolean(deletingId)}
        onCancel={() => setPendingDeleteExpense(null)}
        onConfirm={handleDeleteExpense}
      />

      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Finance Dashboard</p>
          <h1>Expense Tracker</h1>
          <p className="hero-copy">Track spending, spot patterns, and stay in control.</p>
        </div>
        <div className="total-card">
          <span>Total Spent</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>
      </section>

      <MonthlyInsights expenses={expenses} />

      <section className="panel form-panel">
        <div className="section-heading">
          <h2>Add Expense</h2>
          <span>Required fields are marked by the form</span>
        </div>
        <ExpenseForm onExpenseAdded={fetchExpenses} showToast={showToast} />
      </section>

      {error && <div className="app-error">{error}</div>}

      {isLoading ? (
        <div className="loading-card">Loading expenses...</div>
      ) : (
        <div className="content-grid">
          <ExpenseChart expenses={expenses} />
          <ExpenseList
            deletingId={deletingId}
            expenses={expenses}
            onRequestDelete={setPendingDeleteExpense}
          />
        </div>
      )}
    </main>
  );
}

export default App;
