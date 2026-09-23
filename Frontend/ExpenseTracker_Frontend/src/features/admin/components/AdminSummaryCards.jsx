const AdminSummaryCards = ({
  totalSpend,
  approvedTotal,
  pendingCount,
  totalElements,
}) => {
  return (
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
          {pendingCount} Request
          {pendingCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Total Records
        </div>

        <div className="text-2xl font-extrabold text-indigo-600 mt-2">
          {totalElements}
        </div>
      </div>
    </div>
  );
};

export default AdminSummaryCards;
