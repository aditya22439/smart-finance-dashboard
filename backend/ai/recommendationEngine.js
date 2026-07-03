const { sum } = require("./spendingAnalyzer");

const buildRecommendations = ({ analytics, behavior, recurringExpenses, prediction }) => {
  const recommendations = [];
  const topCategory = analytics.categoryBreakdown?.[0];
  if (topCategory) {
    recommendations.push({
      impact: Math.round(topCategory.total * 0.15),
      message: `Reducing ${topCategory.category.toLowerCase()} spending by 15% could save INR ${Math.round(topCategory.total * 0.15).toLocaleString("en-IN")}/month`,
      type: "savings"
    });
  }
  if ((behavior.weekendShare || 0) >= 35) {
    recommendations.push({ message: "You can save more by limiting weekend spending", type: "habit" });
  }
  const subscriptions = recurringExpenses.filter((item) => item.category === "Subscription");
  const subscriptionTotal = sum(subscriptions);
  if (subscriptionTotal > analytics.totalSpent * 0.15 && subscriptionTotal > 0) {
    recommendations.push({ message: "Subscription costs exceed recommended limits", type: "subscription" });
  }
  if (prediction.overspendingRisk !== "low") {
    recommendations.push({ message: "Pause non-essential purchases until your spending pace settles", type: "risk" });
  }
  return recommendations;
};

module.exports = { buildRecommendations };
