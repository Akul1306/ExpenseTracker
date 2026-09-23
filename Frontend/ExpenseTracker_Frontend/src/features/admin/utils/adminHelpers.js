export const getMaxDate = () => {
  const today = new Date();

  today.setDate(today.getDate() - 1);

  return today.toISOString().split("T")[0];
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";

    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";

    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};

export const calculateTotalSpend = (expenses = []) => {
  return expenses.reduce(
    (sum, item) => sum + Number(item?.amount || 0),
    0,
  );
};

export const calculateApprovedTotal = (expenses = []) => {
  return expenses
    .filter((item) => item?.status === "APPROVED")
    .reduce((sum, item) => sum + Number(item?.amount || 0), 0);
};

export const calculatePendingCount = (expenses = []) => {
  return expenses.filter((item) => item?.status === "PENDING").length;
};

export const getUniqueEmployees = (expenses = []) => {
  return Array.from(
    new Set(expenses.map((expense) => expense?.username).filter(Boolean)),
  );
};

export const formatAmount = (amount) => {
  return Number(amount || 0).toFixed(2);
};

export const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString();
};

export const getEmployeeInitial = (username) => {
  if (!username) {
    return "U";
  }

  return username.charAt(0).toUpperCase();
};