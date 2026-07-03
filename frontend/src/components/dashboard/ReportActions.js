import { exportCsvUrl, exportPdfUrl } from "../../services/api";
export default function ReportActions({ analytics, token }) {
 const downloadFile=async(url,filename)=>{ const headers=token?{Authorization:`Bearer ${token}`}:{};
  const response=await fetch(url,{headers}); const blob=await response.blob(); const downloadUrl=window.URL.createObjectURL(blob); const link=document.createElement("a"); link.href=downloadUrl; link.download=filename; link.click(); window.URL.revokeObjectURL(downloadUrl); };
 const downloadCsv=()=>downloadFile(exportCsvUrl,"ai-financial-report.csv");
 const downloadPdf=()=>downloadFile(exportPdfUrl,"ai-financial-report.pdf");
 return <section className="panel report-actions"><div><h2>Reports</h2><span>Download monthly intelligence</span></div><button onClick={downloadCsv} type="button">Export CSV</button><button onClick={downloadPdf} type="button">Export PDF</button></section>;
}
