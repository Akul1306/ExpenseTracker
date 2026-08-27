export default function Navbar({ username, userRole, onLogout }) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ExpenseTracker
            </span>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800">
              {username ? `Hello, ${username}` : "User Profile"}
            </div>
            <span
              className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider ${
                userRole === "ADMIN"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {userRole === "ADMIN" ? "🛡️ ADMIN" : "👤 EMPLOYEE"}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
