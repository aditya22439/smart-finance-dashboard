const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const { detectCategory } = require("../services/categoryService");

const validateExpenseInput = ({ amount, category, date, note }) => {
  const errors = [];
  const numericAmount = Number(amount);
  const resolvedCategory = category || detectCategory(note);

  if (!amount && amount !== 0) {
    errors.push("Amount is required");
  } else if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    errors.push("Amount must be greater than 0");
  }

  if (!resolvedCategory || !String(resolvedCategory).trim()) {
    errors.push("Category is required");
  }

  if (!date) {
    errors.push("Date is required");
  } else if (Number.isNaN(new Date(date).getTime())) {
    errors.push("Date must be valid");
  }

  return errors;
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

const addExpense = async (req, res) => {
  const errors = validateExpenseInput(req.body);

  if (errors.length) {
    return res.status(400).json({ message: errors[0], errors });
  }

  try {
    const category = req.body.category || detectCategory(req.body.note) || "Other";
    const expense = await Expense.create({
      amount: Number(req.body.amount),
      category: String(category).trim(),
      date: req.body.date,
      note: req.body.note ? String(req.body.note).trim() : "",
      user: req.user._id
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense" });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid expense id" });
  }

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense deleted",
      expense: deletedExpense
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

module.exports = {
  addExpense,
  deleteExpense,
  getExpenses
};
