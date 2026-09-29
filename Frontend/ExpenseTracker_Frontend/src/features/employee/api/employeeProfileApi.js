import api from "../../../api";

/**
 * Fetch current employee profile details.
 */
export const getEmployeeProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

/**
 * Update current employee profile (username, email, optional password).
 * @param {Object} data - { username, email, password }
 */
export const updateEmployeeProfile = async (data) => {
  const response = await api.put("/user/profile", data);
  return response.data;
};

/**
 * Fetch current employee's submitted expenses.
 */
export const getEmployeeExpenses = async () => {
  const response = await api.get("/user/profile/expenses");
  return response.data;
};

/**
 * Fetch current employee's expense summary by category.
 */
export const getEmployeeCategorySummary = async () => {
  const response = await api.get("/user/profile/expenses/category-summary");
  return response.data;
};
