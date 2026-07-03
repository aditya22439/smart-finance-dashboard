import { useState } from "react";
import { addExpense } from "../services/api";

const initialForm = {
  amount: "",
  category: "",
  date: "",
  note: ""
};

const categories = ["Food", "Travel", "Shopping", "Bills", "Health", "Other"];

export default function ExpenseForm({ onExpenseAdded, showToast }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    const amount = Number(form.amount);

    if (!form.amount || !form.category || !form.date) {
      return "Amount, category, and date are required.";
    }

    if (Number.isNaN(amount) || amount <= 0) {
      return "Amount must be greater than 0.";
    }

    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError("");
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      showToast(validationError, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await addExpense({
        ...form,
        amount: Number(form.amount)
      });
      setForm(initialForm);
      await onExpenseAdded();
      showToast("Expense added", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not add the expense. Check that the backend is running.";

      setError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          min="1"
          name="amount"
          onChange={handleChange}
          placeholder="250"
          required
          step="0.01"
          type="number"
          value={form.amount}
        />
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          onChange={handleChange}
          required
          value={form.category}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          onChange={handleChange}
          required
          type="date"
          value={form.date}
        />
      </div>

      <div className="field field-wide">
        <label htmlFor="note">Note</label>
        <input
          id="note"
          name="note"
          onChange={handleChange}
          placeholder="Lunch, cab, subscription..."
          type="text"
          value={form.note}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
