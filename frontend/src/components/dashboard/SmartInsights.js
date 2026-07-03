export default function SmartInsights({ analytics }) {
 const items=[...(analytics?.recommendations||[]).map((item)=>item.message), ...(analytics?.behavior?.insights||[])];
 return <section className="panel smart-insights"><div className="section-heading"><h2>AI Savings Suggestions</h2><span>Personalized recommendations</span></div><div className="insight-list">{(items.length?items:["No expense data available"]).map((insight)=><article className="smart-insight" key={insight}>{insight}</article>)}</div></section>;
}
