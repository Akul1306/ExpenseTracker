import React from "react";

const CATEGORY_COLORS = {
  FOOD: "bg-amber-500 text-amber-600 border-amber-200 bg-amber-50",
  TRAVEL: "bg-blue-500 text-blue-600 border-blue-200 bg-blue-50",
  OFFICE_SUPPLIES: "bg-purple-500 text-purple-600 border-purple-200 bg-purple-50",
  SUPPLIES: "bg-purple-500 text-purple-600 border-purple-200 bg-purple-50",
  UTILITIES: "bg-emerald-500 text-emerald-600 border-emerald-200 bg-emerald-50",
  MEDICAL: "bg-rose-500 text-rose-600 border-rose-200 bg-rose-50",
  OTHER: "bg-slate-500 text-slate-600 border-slate-200 bg-slate-50",
};

export default function CategorySummaryCards({ categorySummary = {} }) {
  const entries = Object.entries(categorySummary);
  const totalAmount = Object.values(categorySummary).reduce((acc, curr) => acc + curr, 0);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Category Spending Breakdown</h2>
        <p className="text-sm text-slate-500">No category spending data recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Category Spending Breakdown</h2>
          <p className="text-xs text-slate-500">Summary of total expenses aggregated by category</p>
        </div>
        <span className="text-sm font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          Total: ${totalAmount.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([category, amount]) => {
          const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
          const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0;

          return (
            <div
              key={category}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {category.replace("_", " ")}
                </span>
                <span className="text-xs font-semibold text-slate-400">{percentage}%</span>
              </div>
              <div className="text-xl font-black text-slate-900 mb-3">${amount.toFixed(2)}</div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
