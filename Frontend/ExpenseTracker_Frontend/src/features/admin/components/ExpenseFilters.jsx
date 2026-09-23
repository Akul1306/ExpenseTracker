import { EXPENSE_CATEGORIES } from "../utils/adminConstants";

const ExpenseFilters = ({
  employeeSearch,
  filteredEmployees,
  showEmployeeDropdown,
  selectedCategory,
  selectedDate,
  maxDate,
  onEmployeeSearch,
  onEmployeeFocus,
  onEmployeeSelect,
  onCloseEmployeeDropdown,
  onCategoryChange,
  onDateChange,
  onClearDate,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        🔍 Filter Records (Employee, Category & Date)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employee */}
        <div className="relative">
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Employee-wise Filter
          </label>

          <input
            type="text"
            value={employeeSearch}
            onChange={(event) => onEmployeeSearch(event.target.value)}
            onFocus={onEmployeeFocus}
            placeholder="Type employee name..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          {showEmployeeDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={onCloseEmployeeDropdown}
              />

              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((username) => (
                    <button
                      key={username}
                      type="button"
                      onClick={() => onEmployeeSelect(username)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-indigo-50"
                    >
                      👤 {username}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-sm text-slate-500 text-center">
                    No employees found
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Category-wise Filter
          </label>

          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Date-wise Filter
          </label>

          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
              max={maxDate}
              onKeyDown={(event) => event.preventDefault()}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />

            {selectedDate && (
              <button
                type="button"
                onClick={onClearDate}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                title="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
