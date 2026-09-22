export default function ExpenseSummary({ expenses }) {
  const totalAmount = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const approvedTotal = expenses
    .filter((item) => item.status === "APPROVED")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const pendingCount = expenses.filter(
    (item) => item.status === "PENDING"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* TOTAL */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Total Claimed
        </div>

        <div className="text-xl font-extrabold text-slate-900 mt-1">
          ₹{totalAmount.toFixed(2)}
        </div>
      </div>

      {/* APPROVED */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Approved Amount
        </div>

        <div className="text-xl font-extrabold text-green-600 mt-1">
          ₹{approvedTotal.toFixed(2)}
        </div>
      </div>

      {/* PENDING */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Pending Claims
        </div>

        <div className="text-xl font-extrabold text-yellow-600 mt-1">
          {pendingCount} item
          {pendingCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
