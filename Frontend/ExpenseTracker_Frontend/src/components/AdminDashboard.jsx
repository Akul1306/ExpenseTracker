import { useState, useEffect } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [selectedEmployee, setSelectedEmployee] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchAllExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/expense/admin/all");
      setExpenses(response.data);
    } catch (err) {
      console.error("Failed to fetch admin expenses:", err);
      setError(
        "Failed to fetch admin records. Ensure your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/expense/${id}/status`, { status: newStatus });
      fetchAllExpenses();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  // Get unique employee usernames for dropdown
  const uniqueEmployees = Array.from(
    new Set(expenses.map((e) => e.username).filter(Boolean)),
  );

  // Filtered expense records
  const filteredExpenses = expenses.filter((item) => {
    // Employee filter
    if (selectedEmployee !== "ALL" && item.username !== selectedEmployee) {
      return false;
    }
    // Category filter
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
      return false;
    }
    // Date filter (compare YYYY-MM-DD)
    if (selectedDate) {
      if (!item.expenseDate) return false;
      const itemDateStr = new Date(item.expenseDate)
        .toISOString()
        .split("T")[0];
      if (itemDateStr !== selectedDate) return false;
    }
    return true;
  });

  // Calculate summary metrics
  const totalSpend = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const pendingCount = filteredExpenses.filter(
    (item) => item.status === "PENDING",
  ).length;
  const approvedTotal = filteredExpenses
    .filter((item) => item.status === "APPROVED")
    .reduce((sum, item) => sum + item.amount, 0);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 p-6 rounded-xl shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Admin Expense Control Dashboard
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Review, filter, and manage all employee expense submissions across
            the organization.
          </p>
        </div>
        <button
          onClick={fetchAllExpenses}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition shadow"
        >
          Refresh Records
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Spend (Filtered)
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ${totalSpend.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Approved Total
          </div>
          <div className="text-2xl font-extrabold text-green-600 mt-2">
            ${approvedTotal.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Approval
          </div>
          <div className="text-2xl font-extrabold text-yellow-600 mt-2">
            {pendingCount} Request{pendingCount !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Records
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-2">
            {filteredExpenses.length} / {expenses.length}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          🔍 Filter Records (Employee, Category & Date)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Employee Filter */}
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Employee-wise Filter
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="ALL">All Employees</option>
              {uniqueEmployees.map((emp) => (
                <option key={emp} value={emp}>
                  👤 {emp}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Category-wise Filter
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="ALL">All Categories</option>
              <option value="FOOD">Food</option>
              <option value="TRAVEL">Travel</option>
              <option value="ACCOMMODATION">Accommodation</option>
              <option value="OFFICE_SUPPLIES">Office Supplies</option>
              <option value="MEDICAL">Medical</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Date-wise Filter
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                  title="Clear date filter"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            All Expense Claims
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Showing {filteredExpenses.length} entries
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Loading all employee expenses...
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No matching expense records found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Expense Title
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Proof
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Admin Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                          {expense.username
                            ? expense.username.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                        {expense.username || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">
                        {expense.title}
                      </div>
                      {expense.description && (
                        <div className="text-xs text-slate-500">
                          {expense.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {expense.expenseDate
                        ? new Date(expense.expenseDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-900">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {expense.receiptUrl ? (
                        <a
                          href={`http://localhost:8080${expense.receiptUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline font-semibold text-xs flex items-center gap-1"
                        >
                          📎 View Proof
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No Proof</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
                          expense.status,
                        )}`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {expense.status === "PENDING" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(expense.id, "APPROVED")
                            }
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition shadow-sm"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(expense.id, "REJECTED")
                            }
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition shadow-sm"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {expense.status === "APPROVED"
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
