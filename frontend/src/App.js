import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import AuthGate from "./components/AuthGate";
import BehaviorAnalysis from "./components/ai/BehaviorAnalysis";
import CoachWidgets from "./components/ai/CoachWidgets";
import TrendIntelligence from "./components/ai/TrendIntelligence";
import ExpensePieChart from "./components/charts/ExpensePieChart";
import SpendingTrendChart from "./components/charts/SpendingTrendChart";
import ConfirmDialog from "./components/ConfirmDialog";
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
import BudgetCard from "./components/dashboard/BudgetCard";
import FinancialHealth from "./components/dashboard/FinancialHealth";
import PeriodFilter from "./components/dashboard/PeriodFilter";
import RecurringExpenses from "./components/dashboard/RecurringExpenses";
import ReportActions from "./components/dashboard/ReportActions";
import SmartInsights from "./components/dashboard/SmartInsights";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import NotificationCenter from "./components/notifications/NotificationCenter";
import MonthlyReportPreview from "./components/reports/MonthlyReportPreview";
import Toast from "./components/Toast";
import "./components/components.css";
import { useAuth } from "./context/AuthContext";
import useTheme from "./hooks/useTheme";
import { deleteExpense, getAnalytics, getBudget, getExpenses } from "./services/api";
import { formatCurrency, getFilteredExpenses } from "./utils/financeUtils";
import BudgetUtilizationChart from "./charts/BudgetUtilizationChart";
import CategoryGrowthChart from "./charts/CategoryGrowthChart";
import PredictionChart from "./charts/PredictionChart";

function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [budget, setBudget] = useState(null);
  const [activePeriod, setActivePeriod] = useState("current-month");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
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
    if (!isAuthenticated) {
      return;
    }

    setError("");
    setIsLoading(true);
    setIsAnalyticsLoading(true);

    try {
      const [expensesResponse, analyticsResponse, budgetResponse] = await Promise.all([
        getExpenses(),
        getAnalytics(activePeriod),
        getBudget()
      ]);

      setExpenses(Array.isArray(expensesResponse.data) ? expensesResponse.data : []);
      setAnalytics(analyticsResponse.data);
      setBudget(budgetResponse.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not load expenses. Make sure the backend is running on port 5000.";

      if (err.response?.status === 401) {
        logout();
      }

      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
      setIsAnalyticsLoading(false);
    }
  }, [activePeriod, isAuthenticated, logout, showToast]);

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
      await fetchExpenses();
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
  const visibleExpenses = useMemo(
    () => getFilteredExpenses(expenses, activePeriod),
    [activePeriod, expenses]
  );

  if (!isAuthenticated) {
    return <AuthGate />;
  }

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
          <h1>Expense Tracker AI</h1>
          <p className="hero-copy">Track spending, predict risks, and improve your money habits.</p>
        </div>
        <div className="total-card">
          <span>{user?.name ? `${user.name}'s All-Time Spent` : "All-Time Spent"}</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>
      </section>

      <div className="dashboard-toolbar">
        <div>
          <h2>Spending Overview</h2>
          <span>Filter analytics, charts, and recent expenses by period</span>
        </div>
        <div className="toolbar-actions">
          <PeriodFilter activePeriod={activePeriod} onChange={setActivePeriod} />
          <button className="secondary-button" onClick={toggleTheme} type="button">
            {isDark ? "Light" : "Dark"}
          </button>
          <button className="secondary-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </div>

      <NotificationCenter notifications={analytics?.notifications} />
      <CoachWidgets analytics={analytics} />

      <AnalyticsDashboard analytics={analytics} isLoading={isAnalyticsLoading} />

      <div className="advanced-grid">
        <BudgetCard budget={budget} onBudgetUpdated={setBudget} showToast={showToast} />
        <FinancialHealth analytics={analytics} />
      </div>

      <div className="advanced-grid">
        <BehaviorAnalysis behavior={analytics?.behavior} />
        <TrendIntelligence analytics={analytics} />
      </div>

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
          <ExpensePieChart analytics={analytics} />
          <ExpenseList
            deletingId={deletingId}
            expenses={visibleExpenses}
            onRequestDelete={setPendingDeleteExpense}
          />
        </div>
      )}

      <div className="trend-grid">
        <SpendingTrendChart analytics={analytics} type="daily" />
        <SpendingTrendChart analytics={analytics} type="weekly" />
        <SpendingTrendChart analytics={analytics} type="monthly" />
      </div>

      <div className="trend-grid">
        <BudgetUtilizationChart budget={budget} />
        <CategoryGrowthChart analytics={analytics} />
        <PredictionChart analytics={analytics} />
      </div>

      <div className="advanced-grid">
        <RecurringExpenses items={analytics?.recurringExpenses} />
        <ReportActions analytics={analytics} token={localStorage.getItem("expense_token")} />
      </div>

      <MonthlyReportPreview analytics={analytics} />

      {!isLoading && <SmartInsights analytics={analytics} />}
    </main>
  );
}

export default App;
