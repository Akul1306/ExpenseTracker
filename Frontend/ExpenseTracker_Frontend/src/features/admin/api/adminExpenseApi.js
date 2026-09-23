import api from "../../../api";

/**
 * Fetch paginated admin expenses
 */
export const getAdminExpenses = async ({
  page,
  size,
  name,
  category,
  date,
}) => {
  const params = {
    page,
    size,
  };

  if (name && name !== "ALL") {
    params.name = name;
  }

  if (category && category !== "ALL") {
    params.category = category;
  }

  if (date) {
    params.date = date;
  }

  const response = await api.get("/expense/admin/all", {
    params,
  });

  return response.data;
};

/**
 * Update expense status
 */
export const updateExpenseStatus = async (expenseId, status) => {
  const response = await api.patch(`/expense/admin/${expenseId}/status`, {
    status,
  });

  return response.data;
};

/**
 * Save admin remarks
 */
export const addExpenseRemark = async (expenseId, remarks) => {
  const response = await api.post(
    "/expense/admin/remarks",
    {
      remarks,
    },
    {
      params: {
        expenseId,
      },
    },
  );

  return response.data;
};
