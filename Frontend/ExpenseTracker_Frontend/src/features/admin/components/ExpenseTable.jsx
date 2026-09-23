import ExpenseRow from "./ExpenseRow";

const ExpenseTable = ({
  expenses,
  loading,
  startEntry,
  endEntry,
  totalElements,

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">All Expense Claims</h2>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Showing {startEntry}-{endEntry} of {totalElements} entries
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">
          Loading all employee expenses...
        </div>
      ) : expenses.length === 0 ? (
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
              {expenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
