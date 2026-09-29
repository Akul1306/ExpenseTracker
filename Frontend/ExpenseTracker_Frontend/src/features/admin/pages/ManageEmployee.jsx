import EmployeeTable from "../components/EmployeeTable";
import EmployeePagination from "../components/EmployeePagination";
import { useAdminUsers } from "../hooks/useAdminUsers";

export default function ManageEmployees() {
  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    setCurrentPage,
    fetchUsers,
    handleDeleteUser,
  } = useAdminUsers();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 p-6 rounded-xl shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            👥 Manage Employees
          </h1>

          <p className="text-slate-300 text-sm mt-1">
            View and manage employees in your organization.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold rounded-lg text-sm transition shadow"
        >
          🔄 {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <EmployeeTable
          users={users}
          loading={loading}
          totalElements={totalElements}
          onDeleteUser={handleDeleteUser}
        />

        <EmployeePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPrevious={() => setCurrentPage((prev) => prev - 1)}
          onNext={() => setCurrentPage((prev) => prev + 1)}
        />
      </div>
    </div>
  );
}
