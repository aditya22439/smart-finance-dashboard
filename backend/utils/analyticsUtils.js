const { getCurrentWeekRange, getMonthRange, getPreviousWeekRange, isWithinRange } = require("./dateUtils");
const { groupByCategory, sum } = require("../ai/spendingAnalyzer");
const { buildTrendIntelligence } = require("../analytics/trendIntelligence");

const sumExpenses = sum;
const formatDateKey = (date) => new Date(date).toISOString().slice(0, 10);
const monthLabel = (date, includeYear = false) => date.toLocaleDateString("en-IN", { month: "short", ...(includeYear ? { year: "numeric" } : {}) });
const getCategoryBreakdown = (expenses) => Object.entries(groupByCategory(expenses)).map(([category,total]) => ({category,total})).sort((a,b)=>b.total-a.total);
const getCategoryExtremes = (breakdown) => breakdown.length ? { highestCategory: breakdown[0], lowestCategory: [...breakdown].sort((a,b)=>a.total-b.total)[0] } : { highestCategory:null, lowestCategory:null };
const getFilteredExpenses = (expenses, period = "current-month") => period === "all-time" ? expenses : expenses.filter((expense)=>isWithinRange(expense.date, period === "last-month" ? getMonthRange(-1) : getMonthRange(0)));
const getWeeklyComparison = (expenses) => {
  const currentWeekSpending = sum(expenses.filter((expense)=>isWithinRange(expense.date,getCurrentWeekRange())));
  const previousWeekSpending = sum(expenses.filter((expense)=>isWithinRange(expense.date,getPreviousWeekRange())));
  const raw = previousWeekSpending ? ((currentWeekSpending-previousWeekSpending)/previousWeekSpending)*100 : currentWeekSpending ? 100 : 0;
  return { currentWeekSpending, direction: raw>0?"increase":raw<0?"decrease":"same", percentageChange: Math.abs(Number(raw.toFixed(1))), previousWeekSpending };
};
const buildDailyTrend = (expenses) => Object.entries(expenses.reduce((days,expense)=>{ const key=formatDateKey(expense.date); days[key]=(days[key]||0)+(Number(expense.amount)||0); return days; },{})).sort(([a],[b])=>new Date(a)-new Date(b)).map(([date,total])=>({date,total}));
const buildMonthWeekTrend = (expenses, range) => {
 const daysInMonth = new Date(range.start.getFullYear(), range.start.getMonth() + 1, 0).getDate();
 const weekCount = daysInMonth > 28 ? 5 : 4;
 return Array.from({length:weekCount},(_,index)=>{
  const start = new Date(range.start.getFullYear(), range.start.getMonth(), index * 7 + 1);
  const end = index === weekCount - 1 ? new Date(range.end) : new Date(range.start.getFullYear(), range.start.getMonth(), (index + 1) * 7 + 1);
  return {label:`W${index+1}`, total: sum(expenses.filter((expense)=>isWithinRange(expense.date,{start,end})))};
 });
};
const buildAllTimeMonthlyTrend = (expenses) => {
 const years = new Set(expenses.map((expense)=>new Date(expense.date).getFullYear()).filter((year)=>!Number.isNaN(year)));
 const includeYear = years.size > 1;
 const monthTotals = expenses.reduce((months,expense)=>{
  const date = new Date(expense.date);
  if (Number.isNaN(date.getTime())) return months;
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  months[key] = (months[key] || 0) + (Number(expense.amount) || 0);
  return months;
 },{});
 return Object.entries(monthTotals).sort(([a],[b])=>a.localeCompare(b)).map(([key,total])=>{
  const [year, month] = key.split("-").map(Number);
  return {label: monthLabel(new Date(year, month - 1, 1), includeYear), total};
 });
};
const buildWeeklyTrend = (expenses, period = "current-month") => {
 if (period === "all-time") return buildAllTimeMonthlyTrend(expenses);
 return buildMonthWeekTrend(expenses, period === "last-month" ? getMonthRange(-1) : getMonthRange(0));
};
const buildMonthlyTrend = (expenses) => Array.from({length:6},(_,index)=>{ const range=getMonthRange(index-5); return {label:monthLabel(range.start), total:sum(expenses.filter((expense)=>isWithinRange(expense.date,range)))}; });
const buildAnalytics = (expenses, period) => { const filteredExpenses=getFilteredExpenses(expenses,period); const totalSpent=sum(filteredExpenses); const categoryBreakdown=getCategoryBreakdown(filteredExpenses); const {highestCategory,lowestCategory}=getCategoryExtremes(categoryBreakdown); return { averageExpense: filteredExpenses.length?totalSpent/filteredExpenses.length:0, categoryBreakdown, dailyTrend: buildDailyTrend(filteredExpenses), highestCategory, lowestCategory, monthlyTrend: buildMonthlyTrend(expenses), period, totalSpent, transactionCount: filteredExpenses.length, trendIntelligence: buildTrendIntelligence(filteredExpenses), weeklyComparison: getWeeklyComparison(expenses), weeklyTrend: buildWeeklyTrend(filteredExpenses, period) }; };
module.exports={ buildAnalytics, getFilteredExpenses, sumExpenses };
