const ExpenseActions = ({
  expense,
  remarkExpenseId,
  remarkAction,
  remarks,
  remarkLoading,
  onRemarkClick,
  onRemarksChange,
  onSubmitRemark,
  onCancelRemark,
}) => {
  if (expense.status !== "PENDING") {
    return (
      <span className="text-xs text-slate-400">
        {expense.status === "APPROVED" ? "Approved" : "Rejected"}
      </span>
    );
  }

  const isEditing = remarkExpenseId === expense.id;

  if (isEditing) {
    return (
      <div className="flex flex-col items-center gap-2">
        <textarea
          value={remarks}
          onChange={(event) => onRemarksChange(event.target.value)}
          placeholder={`Enter remarks for ${
            remarkAction === "APPROVED" ? "approval" : "rejection"
          }...`}
          rows={3}
          disabled={remarkLoading}
          className="w-64 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-slate-100"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSubmitRemark}
            disabled={remarkLoading}
            className={`px-3 py-1.5 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 ${
              remarkAction === "APPROVED"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {remarkLoading
              ? "Saving..."
              : remarkAction === "APPROVED"
                ? "✓ Confirm Approve"
                : "✕ Confirm Reject"}
          </button>

          <button
            type="button"
            onClick={onCancelRemark}
            disabled={remarkLoading}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onRemarkClick(expense.id, "APPROVED")}
        className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition shadow-sm"
      >
        ✓ Approve
      </button>

      <button
        type="button"
        onClick={() => onRemarkClick(expense.id, "REJECTED")}
        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition shadow-sm"
      >
        ✕ Reject
      </button>
    </div>
  );
};

export default ExpenseActions;
