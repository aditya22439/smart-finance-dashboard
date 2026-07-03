const express = require("express");
const {
  addExpense,
  deleteExpense,
  getExpenses
} = require("../controllers/expenseController");
const { exportCsv, exportPdf, getAnalytics, getMonthlyReport } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/analytics", getAnalytics);
router.get("/export/csv", exportCsv);
router.get("/export/pdf", exportPdf);
router.get("/report/monthly", getMonthlyReport);
router.get("/", getExpenses);
router.post("/add", addExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
