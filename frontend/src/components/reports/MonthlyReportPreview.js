import { formatCurrency } from "../../utils/financeUtils";
export default function MonthlyReportPreview({ analytics }) {
 return <section className="panel report-preview"><div className="section-heading"><h2>Monthly Financial Report</h2><span>AI summary</span></div><div className="report-grid"><article><span>Total spending</span><strong>{formatCurrency(analytics?.totalSpent)}</strong></article><article><span>Top category</span><strong>{analytics?.highestCategory?.category || "None"}</strong></article><article><span>Financial score</span><strong>{analytics?.financialHealth?.score || 0}/100</strong></article></div><ul>{(analytics?.behavior?.insights || []).slice(0,3).map((item)=><li key={item}>{item}</li>)}</ul></section>;
}
