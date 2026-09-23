const AdminHeader = ({ onRefresh, loading }) => {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-indigo-900 p-6 rounded-xl shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Admin Expense Control Dashboard
        </h1>

        <p className="text-slate-300 text-sm mt-1">
          Review, filter, and manage all employee expense submissions across the
          organization.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition shadow"
      >
        {loading ? "Refreshing..." : "Refresh Records"}
      </button>
    </div>
  );
};

export default AdminHeader;
