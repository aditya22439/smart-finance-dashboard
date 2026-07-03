const { getCurrentWeekRange, isWithinRange } = require("../utils/dateUtils");
const { sum } = require("../ai/spendingAnalyzer");

const generateNotifications = ({ analytics, budget, prediction, recurringExpenses, behavior }) => {
  const notifications = [];
  const budgetAmount = Number(budget?.amount) || 0;
  const spent = Number(analytics?.totalSpent) || 0;
  const usedPercentage = budgetAmount ? Math.round((spent / budgetAmount) * 100) : 0;
  if (usedPercentage >= 80) notifications.push({ id: "budget-warning", message: `Budget warning: ${usedPercentage}% used`, severity: usedPercentage > 90 ? "danger" : "warning", title: "Budget alert" });
  if ((behavior.weekendShare || 0) >= 35) notifications.push({ id: "weekend-spend", message: "Weekend spending is unusually high", severity: "warning", title: "Spending habit" });
  if (behavior.unusualSpikes?.length) notifications.push({ id: "spike-detected", message: "Unusual spending spike detected", severity: "warning", title: "AI anomaly" });
  if (recurringExpenses.length) notifications.push({ id: "recurring-detected", message: "Recurring subscription detected", severity: "info", title: "Recurring expense" });
  if (prediction?.overspendingRisk === "high") notifications.push({ id: "overspending-risk", message: "Projected month-end spending is above your budget", severity: "danger", title: "Overspending risk" });
  return notifications;
};
module.exports = { generateNotifications };
