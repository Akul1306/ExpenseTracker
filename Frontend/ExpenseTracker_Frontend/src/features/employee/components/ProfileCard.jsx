import React from "react";

export default function ProfileCard({ profile, totalExpensesCount, totalSpentAmount, onEditClick }) {
  if (!profile) return null;

  const initial = profile.username ? profile.username.charAt(0).toUpperCase() : "U";
  const formattedDate = profile.date
    ? new Date(profile.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Profile Header Info */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md flex-shrink-0">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{profile.username}</h1>
              <span
                className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full uppercase tracking-wider ${
                  profile.role === "ADMIN"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {profile.role}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium mb-1">{profile.email}</p>
            <p className="text-xs text-slate-400">Member since {formattedDate}</p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="text-left md:text-right pr-4 border-r border-slate-200">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Total Expenses</span>
            <span className="text-xl font-extrabold text-slate-800">{totalExpensesCount}</span>
          </div>
          <div className="text-left md:text-right pr-4 border-r border-slate-200">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Total Spent</span>
            <span className="text-xl font-extrabold text-emerald-600">${totalSpentAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={onEditClick}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
