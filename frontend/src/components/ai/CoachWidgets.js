export default function CoachWidgets({ analytics }) {
  const recommendations = analytics?.recommendations || [];
  const prediction = analytics?.prediction || {};
  return (
    <section className="coach-grid">
      <article className="panel coach-card"><span>Risk Indicator</span><strong>{prediction.overspendingRisk || "low"}</strong><p>{prediction.daysUntilBudgetExceeded != null ? `Budget may run out in ${prediction.daysUntilBudgetExceeded} days` : "No budget risk detected"}</p></article>
      <article className="panel coach-card"><span>Savings Opportunity</span><strong>{recommendations[0]?.impact ? `₹${recommendations[0].impact.toLocaleString("en-IN")}` : "Stable"}</strong><p>{recommendations[0]?.message || "Your spending pattern looks controlled"}</p></article>
      <article className="panel coach-card"><span>Coach Tip</span><strong>{analytics?.behavior?.weekendShare || 0}%</strong><p>Weekend share of current-month spending</p></article>
    </section>
  );
}
