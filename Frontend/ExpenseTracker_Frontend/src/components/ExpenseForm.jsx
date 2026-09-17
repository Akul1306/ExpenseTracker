import { useState, useEffect, useRef } from "react";
import api from "../api";

export default function ExpenseForm() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "FOOD",
    date: "",
  });
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const fileInputRef = useRef(null);
  const [maxDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split("T")[0];
  });

  const itemsPerPage = 3;

  const fetchExpenses = async () => {
    try {
      const response = await api.get(
        `/expense/expense?page=${currentPage - 1}&size=${itemsPerPage}`,
      );

      console.log("API response:", response.data);

      setExpenses(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setError("");
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };
  const handleEdit = (expense) => {
    setEditingExpenseId(expense.id);

    setFormData({
      title: expense.title || "",
      description: expense.description || "",
      amount: expense.amount ?? "",
      category: expense.category || "FOOD",
      date: expense.expenseDate ? expense.expenseDate.substring(0, 10) : "",
    });

    setFile(null);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // rest of your code
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    try {
      if (editingExpenseId) {
        // EDIT EXISTING EXPENSE
        await api.patch(`/expense/${editingExpenseId}`, payload);

        setSuccess("Expense updated successfully!");

        setEditingExpenseId(null);
        setFormData({
          title: "",
          description: "",
          amount: "",
          category: "FOOD",
          date: "",
        });

        setFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        fetchExpenses();
        return;
      }

      // ADD NEW EXPENSE
      const response = await api.post("/expense", payload);

      const createdExpenseId = response.data?.id;

      if (file && createdExpenseId) {
        try {
          const fileFormData = new FormData();
          fileFormData.append("file", file);

          await api.post(`/expense/${createdExpenseId}/receipt`, fileFormData);
        } catch (uploadErr) {
          try {
            await api.delete(`/expense/${createdExpenseId}`);
          } catch (delErr) {
            console.error("Rollback failed:", delErr);
          }

          const uploadMsg = uploadErr.response?.data;

          const finalMsg =
            typeof uploadMsg === "string"
              ? uploadMsg
              : "Receipt file upload failed. The expense claim was rolled back.";

          setError(finalMsg);
          return;
        }
      }

      setSuccess("Expense added successfully!");

      setFormData({
        title: "",
        description: "",
        amount: "",
        category: "FOOD",
        date: "",
      });

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchExpenses();
    } catch (err) {
      const serverError = err.response?.data;

      if (typeof serverError === "object" && serverError !== null) {
        setError(Object.values(serverError).join(", "));
      } else {
        setError(serverError || "Failed to save expense. Check details.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await api.delete(`/expense/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      alert("Failed to delete expense.");
    }
  };

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

  // Totals calculations
  const totalAmount = expenses.reduce(
    (sum, item) => sum + (item.amount || 0),
    0,
  );
  const approvedTotal = expenses
    .filter((item) => item.status === "APPROVED")
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const pendingCount = expenses.filter(
    (item) => item.status === "PENDING",
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Employee Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Employee Expense Portal
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Submit new expense claims and track your reimbursement approvals.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-right">
          <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
            My Total Claimed
          </div>
          <div className="text-xl font-extrabold text-white">
            ₹{approvedTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Add Expense Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          {editingExpenseId ? `Edit Expense` : "Submit New Expense Claim"}
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {success}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Client Dinner"
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FOOD">Food</option>
              <option value="TRAVEL">Travel</option>
              <option value="ACCOMMODATION">Accommodation</option>
              <option value="OFFICE_SUPPLIES">Office Supplies</option>
              <option value="MEDICAL">Medical</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              onKeyDown={(e) => e.preventDefault()}
              max={maxDate}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Proof / Receipt Attachment (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional notes or details..."
              rows="2"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow"
            >
              {editingExpenseId ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Claimed
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            ₹{totalAmount.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Approved Amount
          </div>
          <div className="text-xl font-extrabold text-green-600 mt-1">
            ₹{approvedTotal.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Claims
          </div>
          <div className="text-xl font-extrabold text-yellow-600 mt-1">
            {pendingCount} item{pendingCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Expense List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            Your Expense Claims
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {totalElements} Total Submissions
          </span>
        </div>

        {expenses.length === 0 ? (
          <p className="text-slate-500 text-center py-10">
            No expenses added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Title
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
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Actions / Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {expense.expenseDate
                        ? new Date(expense.expenseDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-900">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {expense.receiptUrl ? (
                        <a
                          href={`http://localhost:8080${expense.receiptUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-semibold text-xs flex items-center gap-1"
                        >
                          View Proof
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        {expense.status === "APPROVED" ||
                        expense.status === "REJECTED" ? (
                          <div className="max-w-xs ml-auto text-right">
                            <div className="text-xs font-semibold text-slate-500 mb-1">
                              Admin Remark
                            </div>

                            <div className="text-sm text-slate-700 whitespace-normal break-words">
                              {expense.remarks || "No remarks provided"}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-900 font-semibold"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* TOTAL COLUMN / FOOTER ROW */}
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-slate-800 text-sm uppercase"
                  >
                    GRAND TOTAL ({expenses.length} Claims)
                  </td>
                  <td className="px-6 py-4 text-slate-900 text-base font-black">
                    ₹{totalAmount.toFixed(2)}
                  </td>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-right text-xs text-slate-500 font-normal"
                  >
                    Approved Total:{" "}
                    <strong className="text-green-700">
                      ₹{approvedTotal.toFixed(2)}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        {/* Pagination */}
        {expenses.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
