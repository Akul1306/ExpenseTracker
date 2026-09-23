import ExpenseActions from "./ExpenseActions";

import {
  formatAmount,
  formatDate,
  getEmployeeInitial,
  getStatusBadgeClass,
} from "../utils/adminHelpers";

const ExpenseRow = ({
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
  return (
    <tr className="hover:bg-slate-50 transition">
      {/* Employee */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
            {getEmployeeInitial(expense.username)}
          </span>

          {expense.username || "Unknown"}
        </div>
      </td>

      {/* Title */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-slate-900">
          {expense.title}
        </div>

        {expense.description && (
          <div className="text-xs text-slate-500 max-w-xs truncate">
            {expense.description}
          </div>
        )}
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          {expense.category}
        </span>
      </td>

      {/* Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {formatDate(expense.expenseDate)}
      </td>

      {/* Amount */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-900">
        ${formatAmount(expense.amount)}
      </td>

      {/* Proof */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {expense.receiptUrl ? (
          <a
            href={expense.receiptUrl}
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

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
            expense.status,
          )}`}
        >
          {expense.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <ExpenseActions
          expense={expense}
          remarkExpenseId={remarkExpenseId}
          remarkAction={remarkAction}
          remarks={remarks}
          remarkLoading={remarkLoading}
          onRemarkClick={onRemarkClick}
          onRemarksChange={onRemarksChange}
          onSubmitRemark={onSubmitRemark}
          onCancelRemark={onCancelRemark}
        />
      </td>
    </tr>
  );
};

export default ExpenseRow;
