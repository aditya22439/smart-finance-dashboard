const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const { buildAnalytics } = require("../utils/analyticsUtils");
const { analyzeSpendingBehavior } = require("../ai/spendingAnalyzer");
const { buildRecommendations } = require("../ai/recommendationEngine");
const { predictMonthEnd } = require("../ai/predictionEngine");
const { buildFinancialScore } = require("../ai/financialScoreEngine");
const { detectRecurringExpenses } = require("../ai/recurringDetection");
const { generateNotifications } = require("../services/notificationService");

const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const formatCurrency = (value) => `INR ${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

const buildCoachPayload = async (userId, period = "current-month") => {
  const month = new Date().toISOString().slice(0, 7);
  const [expenses, budget] = await Promise.all([
    Expense.find({ user: userId }).lean(),
    Budget.findOne({ month, user: userId }).lean()
  ]);
  const budgetAmount = Number(budget?.amount) || 0;
  const analytics = buildAnalytics(expenses, period);
  const behavior = analyzeSpendingBehavior(expenses);
  const prediction = predictMonthEnd(expenses, budgetAmount);
  const recurringExpenses = detectRecurringExpenses(expenses);
  const financialHealth = buildFinancialScore({ analytics, behavior, budgetAmount, expenses, prediction });
  const recommendations = buildRecommendations({ analytics, behavior, recurringExpenses, prediction });
  const notifications = generateNotifications({ analytics, behavior, budget, prediction, recurringExpenses });
  return { ...analytics, behavior, financialHealth, notifications, prediction, recommendations, recurringExpenses };
};

const getAnalytics = async (req, res) => {
  try {
    res.status(200).json(await buildCoachPayload(req.user._id, req.query.period || "current-month"));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const payload = await buildCoachPayload(req.user._id, "current-month");
    res.status(200).json({
      generatedAt: new Date().toISOString(),
      month: new Date().toISOString().slice(0, 7),
      ...payload
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to build monthly report" });
  }
};

const exportCsv = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 }).lean();
    const payload = await buildCoachPayload(req.user._id, "current-month");
    const rows = [
      "Type,Date,Category,Amount,Note",
      ...expenses.map((expense) =>
        [
          "Expense",
          new Date(expense.date).toISOString().slice(0, 10),
          escapeCsv(expense.category || "Other"),
          Number(expense.amount) || 0,
          escapeCsv(expense.note || "")
        ].join(",")
      ),
      "",
      "Summary,Metric,Value",
      `Summary,Total Spending,${payload.totalSpent}`,
      `Summary,Financial Health Score,${payload.financialHealth.score}`,
      `Summary,Projected Month End,${Math.round(payload.prediction.projectedMonthEndSpending)}`,
      ...payload.recommendations.map((item) => `Recommendation,${escapeCsv(item.type)},${escapeCsv(item.message)}`)
    ];

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=ai-financial-report.csv");
    res.status(200).send(rows.join("\n"));
  } catch (error) {
    res.status(500).json({ message: "Failed to export CSV" });
  }
};

const buildPdf = (lines) => {
  const escapePdf = (text) => String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const content = [
    "BT",
    "/F1 18 Tf",
    "50 780 Td",
    ...lines.flatMap((line, index) => [
      index === 0 ? "" : "0 -20 Td",
      `(${escapePdf(line).slice(0, 95)}) Tj`
    ]),
    "ET"
  ].filter(Boolean).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body));
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    body += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(body);
};

const exportPdf = async (req, res) => {
  try {
    const payload = await buildCoachPayload(req.user._id, "current-month");
    const lines = [
      "AI Monthly Financial Report",
      `Month: ${new Date().toISOString().slice(0, 7)}`,
      `Total spending: ${formatCurrency(payload.totalSpent)}`,
      `Top category: ${payload.highestCategory?.category || "None"}`,
      `Weekly change: ${payload.weeklyComparison.percentageChange}% ${payload.weeklyComparison.direction}`,
      `Projected month-end spending: ${formatCurrency(payload.prediction.projectedMonthEndSpending)}`,
      `Financial Health Score: ${payload.financialHealth.score}/100`,
      "Behavior signals:",
      ...(payload.behavior.insights.length ? payload.behavior.insights : ["No unusual behavior detected"]),
      "Improvement suggestions:",
      ...(payload.recommendations.length ? payload.recommendations.map((item) => item.message) : ["Keep your current budget rhythm"])
    ];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ai-financial-report.pdf");
    res.status(200).send(buildPdf(lines));
  } catch (error) {
    res.status(500).json({ message: "Failed to export PDF" });
  }
};

module.exports = { exportCsv, exportPdf, getAnalytics, getMonthlyReport };
