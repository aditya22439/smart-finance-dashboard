import { useEffect, useState } from "react";
import { setBudget } from "../../services/api";
import { formatCurrency } from "../../utils/financeUtils";

export default function BudgetCard({ budget, onBudgetUpdated, showToast }) {
  const [amount, setAmount] = useState(budget?.amount || "");
  const [isSaving, setIsSaving] = useState(false);
  const usedPercentage = Math.min(100, Number(budget?.usedPercentage) || 0);

  useEffect(() => {
    setAmount(budget?.amount || "");
  }, [budget?.amount]);

  const saveBudget = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await setBudget({ amount: Number(amount) });
      onBudgetUpdated(response.data);
      showToast("Budget updated", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not save budget", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={`panel budget-card budget-${budget?.status || "green"}`}>
      <div className="section-heading">
        <h2>Monthly Budget</h2>
        <span>{usedPercentage}% used</span>
      </div>
      <form className="budget-form" onSubmit={saveBudget}>
        <input
          min="0"
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Set budget"
          type="number"
          value={amount}
        />
        <button disabled={isSaving} type="submit">
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>
      <div className="budget-progress">
        <span style={{ width: `${usedPercentage}%` }} />
      </div>
      <div className="budget-meta">
        <strong>Budget: {formatCurrency(budget?.amount)}</strong>
        <strong>Spent: {formatCurrency(budget?.spent)}</strong>
        <strong>Remaining: {formatCurrency(budget?.remaining)}</strong>
      </div>
    </section>
  );
}
