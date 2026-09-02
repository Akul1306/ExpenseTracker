import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ username, userRole, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

        {/* User Info & Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition"
          >
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
                {userRole === "ADMIN" ? "ADMIN" : "EMPLOYEE"}
              </span>
            </div>

            {/* Dropdown Arrow */}
            <span
              className={`text-slate-500 text-xs transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
              {/* Admin Only */}
              {userRole === "ADMIN" && (
                <Link
                  to="/manage-employees"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  Manage Employees
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
