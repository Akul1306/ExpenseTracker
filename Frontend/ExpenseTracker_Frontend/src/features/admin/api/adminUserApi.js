import api from "../../../api";

/**
 * Fetch paginated users for admin management.
 *
 * @param {Object} params
 * @param {number} params.page - 0-based page number
 * @param {number} params.size - number of users per page
 */
export const getAdminUsers = async ({ page, size }) => {
  const response = await api.get("/user/paginate", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

/**
 * Delete an employee/user.
 *
 * @param {number|string} userId
 */
export const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/user/${userId}`);

  return response.data;
};
