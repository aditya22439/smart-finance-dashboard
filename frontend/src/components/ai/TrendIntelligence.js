export default function TrendIntelligence({ analytics }) {
  const trend = analytics?.trendIntelligence;
  if (!trend) return null;
  return (
    <section className="panel trend-intelligence">
      <div className="section-heading"><h2>Spending Trend Intelligence</h2><span>Weekly rhythm</span></div>
      <div className="trend-facts">
        <article><span>Best day</span><strong>{trend.bestSpendingDay?.day}</strong></article>
        <article><span>Worst day</span><strong>{trend.worstSpendingDay?.day}</strong></article>
        <article><span>Highest streak</span><strong>{trend.highestExpenseStreak} days</strong></article>
      </div>
      <div className="heatmap-row">
        {(trend.weeklyRhythm || []).map((item) => <span key={item.day} title={`${item.day}: ${item.total}`}>{item.day}</span>)}
      </div>
    </section>
  );
}
