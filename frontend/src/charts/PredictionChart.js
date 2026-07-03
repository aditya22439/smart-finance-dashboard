import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip);
export default function PredictionChart({ analytics }) {
 const spent=analytics?.totalSpent||0; const projected=analytics?.prediction?.projectedMonthEndSpending||0;
 return <section className="panel chart-panel"><div className="section-heading"><h2>Prediction Curve</h2><span>Current pace</span></div><div className="chart-wrap"><Line data={{labels:["Now","Month end"],datasets:[{label:"Spending",data:[spent,projected],borderColor:"#8b5cf6",backgroundColor:"rgba(139,92,246,.12)",fill:true,tension:.35}]}} options={{maintainAspectRatio:false,responsive:true}}/></div></section>;
}
