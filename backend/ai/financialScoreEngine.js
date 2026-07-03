const { sum } = require("./spendingAnalyzer");

const buildFinancialScore = ({ analytics, behavior, budgetAmount, expenses, prediction }) => {
  const spent = analytics.totalSpent;
  const budgetRatio = budgetAmount ? spent / budgetAmount : 0;
  const budgetAdherence = budgetAmount ? Math.max(0, 30 - Math.max(0, budgetRatio - 0.7) * 90) : 18;
  const spendingConsistency = analytics.weeklyComparison.direction === "increase" ? Math.max(5, 20 - analytics.weeklyComparison.percentageChange / 2) : 20;
  const topShare = spent && analytics.categoryBreakdown?.[0] ? analytics.categoryBreakdown[0].total / spent : 0;
  const categoryBalance = Math.max(5, 20 - Math.max(0, topShare - 0.4) * 40);
  const savingsEfficiency = budgetAmount ? Math.max(0, 20 * (1 - budgetRatio)) : 10;
  const overspendingFrequency = behavior.unusualSpikes.length ? Math.max(0, 10 - behavior.unusualSpikes.length * 2) : 10;
  const score = Math.max(0, Math.min(100, Math.round(budgetAdherence + spendingConsistency + categoryBalance + savingsEfficiency + overspendingFrequency)));
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  if (budgetRatio <= 0.8) strengths.push("Strong budget consistency"); else weaknesses.push("Budget usage is running high");
  if (prediction.overspendingRisk === "low") strengths.push("Good savings discipline"); else weaknesses.push("Projected overspending risk");
  if (topShare > 0.45) weaknesses.push(`High ${analytics.categoryBreakdown[0].category.toLowerCase()} concentration`); else strengths.push("Healthy category balance");
  if (behavior.weekendShare >= 35) weaknesses.push("Weekend spending needs attention");
  if (weaknesses.length) recommendations.push("Reduce the largest flexible category first");
  if (prediction.overspendingRisk !== "low") recommendations.push("Set a weekly spending cap for the rest of the month");

  return {
    breakdown: { budgetAdherence: Math.round(budgetAdherence), categoryBalance: Math.round(categoryBalance), overspendingFrequency: Math.round(overspendingFrequency), savingsEfficiency: Math.round(savingsEfficiency), spendingConsistency: Math.round(spendingConsistency) },
    recommendations,
    score,
    strengths,
    weaknesses
  };
};

module.exports = { buildFinancialScore };
