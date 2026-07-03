import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip);
export default function BudgetUtilizationChart({ budget }) {
 const spent=budget?.spent||0, remaining=budget?.remaining||0;
 return <section className="panel chart-panel"><div className="section-heading"><h2>Budget Utilization</h2><span>{budget?.usedPercentage||0}% used</span></div><div className="chart-wrap"><Bar data={{labels:["Budget"],datasets:[{label:"Spent",data:[spent],backgroundColor:"#0ea5e9"},{label:"Remaining",data:[remaining],backgroundColor:"#22c55e"}]}} options={{maintainAspectRatio:false,responsive:true,scales:{x:{stacked:true},y:{stacked:true}}}}/></div></section>;
}
