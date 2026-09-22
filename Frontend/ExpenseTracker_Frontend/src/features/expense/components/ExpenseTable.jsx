export default function ExpenseTable({
  expenses,
  totalElements,
  onEdit,
  onDelete,
}) {
  const totalAmount = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const approvedTotal = expenses
    .filter((item) => item.status === "APPROVED")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">
          Your Expense Claims
        </h2>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {totalElements} Total Submissions
        </span>
      </div>

      {/* EMPTY */}
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
                  {/* TITLE */}
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

                  {/* CATEGORY */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {expense.category}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {expense.expenseDate
                      ? new Date(expense.expenseDate).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-900">
                    ₹{Number(expense.amount || 0).toFixed(2)}
                  </td>

                  {/* PROOF */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {expense.receiptUrl ? (
                      <a
                        href={`http://localhost:8080${expense.receiptUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold text-xs"
                      >
                        View Proof
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">No Proof</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
                        expense.status
                      )}`}
                    >
                      {expense.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                          onClick={() => onEdit(expense)}
                          className="text-blue-600 hover:text-blue-900 font-semibold"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(expense.id)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* FOOTER */}
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
    </div>
  );
}
