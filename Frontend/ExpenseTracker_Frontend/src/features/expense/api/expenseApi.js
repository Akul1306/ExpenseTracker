import api from "../../../api";

/*
 * Get paginated expenses
 */
export const getExpenses = (page, size) => {
  return api.get(`/expense/expense?page=${page}&size=${size}`);
};

/*
 * Create expense
 */
export const createExpense = (expenseData) => {
  return api.post("/expense", expenseData);
};

/*
 * Update expense
 */
export const updateExpense = (id, expenseData) => {
  return api.patch(`/expense/${id}`, expenseData);
};

/*
 * Delete expense
 */
export const deleteExpense = (id) => {
  return api.delete(`/expense/${id}`);
};

/*
 * Upload receipt
 */
export const uploadReceipt = (id, formData) => {
  return api.post(`/expense/${id}/receipt`, formData);
};
