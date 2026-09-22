import useExpenses from "../hooks/useExpense";
import useExpenseForm from "../hooks/useExpenseForm";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseSummary from "../components/ExpenseSummary";
import ExpenseTable from "../components/ExpenseTable";
import ExpensePagination from "../components/ExpensePagination";

export default function ExpensePage() {
  // Expense list / pagination / delete
  const {
    expenses,
    currentPage,
    totalPages,
    totalElements,
    refresh,
    deleteExpense,
    setCurrentPage,
  } = useExpenses();

  // Form / create / update / edit
  const {
    formData,
    editingExpenseId,
    error,
    success,
    maxDate,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleEdit,
    handleSubmit,
    cancelEdit,
  } = useExpenseForm(refresh);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Expenses</h1>

        <p className="text-slate-500 mt-1">Manage and track your expenses</p>
      </div>

      {/* Expense Form */}
      <ExpenseForm
        formData={formData}
        editingExpenseId={editingExpenseId}
        error={error}
        success={success}
        maxDate={maxDate}
        fileInputRef={fileInputRef}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        cancelEdit={cancelEdit}
      />

      {/* Summary */}
      <ExpenseSummary expenses={expenses} />

      {/* Table */}
      <ExpenseTable
        expenses={expenses}
        totalElements={totalElements}
        onEdit={handleEdit}
        onDelete={deleteExpense}
      />

      {/* Pagination */}
      <ExpensePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage((page) => Math.max(page - 1, 1))}
        onNext={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
      />
    </div>
  );
}
