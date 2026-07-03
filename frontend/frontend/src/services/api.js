import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getExpenses = () => api.get("/");

export const addExpense = (expense) => api.post("/add", expense);

export const deleteExpense = (id) => api.delete(`/${id}`);
