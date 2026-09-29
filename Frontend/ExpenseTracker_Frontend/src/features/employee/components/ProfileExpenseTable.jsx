import React from "react";

export default function ProfileExpenseTable({ expenses = [] }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500 font-medium">No expenses submitted yet.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "PENDING":
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Recent Expense History</h2>
        <p className="text-xs text-slate-500">Your submitted expense requests and their statuses</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Title</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/75 transition">
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {item.title}
                  {item.description && (
                    <span className="block text-xs font-normal text-slate-400 truncate max-w-xs">
                      {item.description}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">
                    {item.category ? item.category.replace("_", " ") : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                  {item.expenseDate
                    ? new Date(item.expenseDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  ${typeof item.amount === "number" ? item.amount.toFixed(2) : item.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-extrabold rounded-full uppercase border ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status || "PENDING"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                  {item.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
