import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/expenses"
});

export const getExpenses = () => api.get("/");

export const addExpense = (expense) => api.post("/add", expense);

export const deleteExpense = (id) => api.delete(`/${id}`);
