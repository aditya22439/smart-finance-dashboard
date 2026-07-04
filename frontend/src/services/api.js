import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("expense_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post("/auth/login", credentials);
export const signup = (payload) => api.post("/auth/signup", payload);
export const getMe = () => api.get("/auth/me");

export const getExpenses = () => api.get("/expenses");
export const getAnalytics = (period = "current-month") =>
  api.get("/expenses/analytics", { params: { period } });

export const getMonthlyReport = () =>
  api.get("/expenses/report/monthly");

export const getBudget = () => api.get("/budget");
export const setBudget = (budget) => api.post("/budget", budget);

export const addExpense = (expense) =>
  api.post("/expenses/add", expense);

export const deleteExpense = (id) =>
  api.delete(`/expenses/${id}`);

export const exportCsvUrl = `${API_URL}/api/expenses/export/csv`;
export const exportPdfUrl = `${API_URL}/api/expenses/export/pdf`;

export default api;

