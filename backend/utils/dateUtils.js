const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const getMonthRange = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);

  return { end, start };
};

const getCurrentWeekRange = () => {
  const today = startOfDay(new Date());
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(today);
  start.setDate(today.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { end, start };
};

const getPreviousWeekRange = () => {
  const currentWeek = getCurrentWeekRange();
  const start = new Date(currentWeek.start);
  start.setDate(currentWeek.start.getDate() - 7);

  const end = new Date(currentWeek.start);

  return { end, start };
};

const isWithinRange = (date, range) => {
  const value = new Date(date);
  return value >= range.start && value < range.end;
};

module.exports = {
  getCurrentWeekRange,
  getMonthRange,
  getPreviousWeekRange,
  isWithinRange
};
