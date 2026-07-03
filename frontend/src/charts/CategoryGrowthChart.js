import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip);
export default function CategoryGrowthChart({ analytics }) {
 const items=(analytics?.behavior?.categoryGrowth || []).slice(0,5);
 return <section className="panel chart-panel"><div className="section-heading"><h2>Category Growth</h2><span>Month over month</span></div><div className="chart-wrap">{items.length ? <Bar data={{labels:items.map(i=>i.category),datasets:[{label:"Growth %",data:items.map(i=>i.change),backgroundColor:"rgba(244,63,94,.72)",borderRadius:8}]}} options={{maintainAspectRatio:false,responsive:true}}/>:<div className="empty-state">No growth data</div>}</div></section>;
}
