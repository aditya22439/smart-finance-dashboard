import { formatCurrency } from "../../utils/financeUtils";

export default function BehaviorAnalysis({ behavior }) {
  const insights = behavior?.insights || [];
  const patterns = behavior?.overspendingPatterns || [];
  const spikes = behavior?.unusualSpikes || [];
  return (
    <section className="panel ai-panel">
      <div className="section-heading"><h2>AI Spending Behavior</h2><span>{insights.length} signals</span></div>
      <div className="coach-list">
        {insights.length ? insights.map((item) => <article key={item}>{item}</article>) : <div className="empty-state">No unusual behavior detected</div>}
      </div>
      {patterns.length > 0 && <div className="coach-list compact">{patterns.map((item) => <article key={item}>{item}</article>)}</div>}
      {spikes.length > 0 && <p className="micro-copy">Largest recent spike: {formatCurrency(spikes[0].amount)} in {spikes[0].category}</p>}
    </section>
  );
}
