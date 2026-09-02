import { useState, useEffect } from "react";
import api from "../api";

export default function ManageEmployees() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/user/");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch employees. Ensure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (
      !window.confirm(
        `Are you sure you want to delete employee "${username}"? This will also delete all their expenses.`,
      )
    ) {
      return;
    }

    try {
      await api.delete(`/user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);

      const message = err.response?.data?.error || "Failed to delete user.";

      alert(message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          onClick={fetchUsers}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition shadow"
        >
          🔄 Refresh
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
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Loading employees...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    ID
                  </th>

                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Username
                  </th>

                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Role
                  </th>

                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Joined
                  </th>

                  <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.id}
                    </td>

                    {/* Username */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                          {user.username
                            ? user.username.charAt(0).toUpperCase()
                            : "U"}
                        </span>

                        {user.username}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {user.role === "EMPLOYEE" ? (
                        <button
                          onClick={() =>
                            handleDeleteUser(user.id, user.username)
                          }
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition shadow-sm"
                        >
                          🗑️ Delete
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
