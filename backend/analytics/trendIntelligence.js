const { sum } = require("../ai/spendingAnalyzer");

const dayLabel = (day) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];

const buildTrendIntelligence = (expenses) => {
  const byDay = Array.from({ length: 7 }, (_, day) => ({ day: dayLabel(day), total: 0 }));
  const byDate = {};
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    byDay[date.getDay()].total += Number(expense.amount) || 0;
    const key = date.toISOString().slice(0, 10);
    byDate[key] = (byDate[key] || 0) + (Number(expense.amount) || 0);
  });
  const sortedDates = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0]));
  let currentStreak = 0;
  let highestExpenseStreak = 0;
  let previousDate = null;
  sortedDates.forEach(([dateKey, total]) => {
    const date = new Date(dateKey);
    const isConsecutive = previousDate && (date - previousDate) / 86400000 === 1;
    if (total > 0) {
      currentStreak = isConsecutive ? currentStreak + 1 : 1;
      highestExpenseStreak = Math.max(highestExpenseStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
    previousDate = date;
  });
  const sortedDays = [...byDay].sort((a, b) => b.total - a.total);
  return {
    bestSpendingDay: [...byDay].sort((a, b) => a.total - b.total)[0],
    highestExpenseStreak,
    spendingHeatmap: sortedDates.map(([date, total]) => ({ date, total })),
    weeklyRhythm: byDay,
    worstSpendingDay: sortedDays[0]
  };
};

module.exports = { buildTrendIntelligence };
