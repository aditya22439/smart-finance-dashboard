const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { getMonthRange, isWithinRange } = require("../utils/dateUtils");
const { sumExpenses } = require("../utils/analyticsUtils");

const getMonthKey = () => new Date().toISOString().slice(0, 7);
const getMonthOffset = (month) => {
  const [year, monthNumber] = String(month).split("-").map(Number);

  if (!year || !monthNumber) {
    return 0;
  }

  const now = new Date();
  return (year - now.getFullYear()) * 12 + (monthNumber - 1 - now.getMonth());
};

const buildBudgetSummary = async (userId, month) => {
  const budget = await Budget.findOne({ month, user: userId }).lean();
  const range = getMonthRange(getMonthOffset(month));
  const expenses = await Expense.find({ user: userId }).lean();
  const spent = sumExpenses(expenses.filter((expense) => isWithinRange(expense.date, range)));
  const amount = Number(budget?.amount) || 0;
  const usedPercentage = amount ? Math.round((spent / amount) * 100) : 0;

  return {
    amount,
    month,
    remaining: Math.max(0, amount - spent),
    spent,
    status: usedPercentage < 70 ? "green" : usedPercentage <= 90 ? "yellow" : "red",
    usedPercentage
  };
};

const getBudget = async (req, res) => {
  try {
    const month = req.query.month || getMonthKey();
    res.status(200).json(await buildBudgetSummary(req.user._id, month));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch budget" });
  }
};

const setBudget = async (req, res) => {
  const amount = Number(req.body.amount);
  const month = req.body.month || getMonthKey();

  if (Number.isNaN(amount) || amount < 0) {
    return res.status(400).json({ message: "Budget amount must be valid" });
  }

  try {
    await Budget.findOneAndUpdate(
      { month, user: req.user._id },
      { amount, month, user: req.user._id },
      { returnDocument: "after", upsert: true }
    );

    return res.status(200).json(await buildBudgetSummary(req.user._id, month));
  } catch (error) {
    res.status(500).json({ message: "Failed to save budget" });
  }
};

module.exports = {
  getBudget,
  setBudget
};
