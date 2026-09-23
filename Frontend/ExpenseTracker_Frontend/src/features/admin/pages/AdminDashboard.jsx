import AdminHeader from "../components/AdminHeader";
import AdminSummaryCards from "../components/AdminSummaryCards";
import ExpenseFilters from "../components/ExpenseFilters";
import ExpenseTable from "../components/ExpenseTable";
import Pagination from "../components/Pagination";

import { useAdminExpenses } from "../hooks/useAdminExpenses";

const AdminDashboard = () => {
  const {
    expenses,
    loading,
    error,

    selectedCategory,
    selectedDate,
    employeeSearch,
    showEmployeeDropdown,
    filteredEmployees,
    maxDate,

    currentPage,
    totalPages,
    totalElements,
    startEntry,
    endEntry,

    totalSpend,
    approvedTotal,
    pendingCount,

    remarkExpenseId,
    remarkAction,
    remarks,
    remarkLoading,

    fetchExpenses,

    handleEmployeeSearch,
    handleEmployeeSelect,
    setShowEmployeeDropdown,

    handleCategoryChange,
    handleDateChange,
    clearDateFilter,

    handleRemarkClick,
    handleSubmitRemark,
    cancelRemark,
    setRemarks,

    goToPreviousPage,
    goToNextPage,
  } = useAdminExpenses();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <AdminHeader onRefresh={fetchExpenses} loading={loading} />

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      <AdminSummaryCards
        totalSpend={totalSpend}
        approvedTotal={approvedTotal}
        pendingCount={pendingCount}
        totalElements={totalElements}
      />

      {/* Filters */}
      <ExpenseFilters
        employeeSearch={employeeSearch}
        filteredEmployees={filteredEmployees}
        showEmployeeDropdown={showEmployeeDropdown}
        selectedCategory={selectedCategory}
        selectedDate={selectedDate}
        maxDate={maxDate}
        onEmployeeSearch={handleEmployeeSearch}
        onEmployeeFocus={() => setShowEmployeeDropdown(true)}
        onEmployeeSelect={handleEmployeeSelect}
        onCloseEmployeeDropdown={() => setShowEmployeeDropdown(false)}
        onCategoryChange={handleCategoryChange}
        onDateChange={handleDateChange}
        onClearDate={clearDateFilter}
      />

      {/* Table */}
      <ExpenseTable
        expenses={expenses}
        loading={loading}
        startEntry={startEntry}
        endEntry={endEntry}
        totalElements={totalElements}
        remarkExpenseId={remarkExpenseId}
        remarkAction={remarkAction}
        remarks={remarks}
        remarkLoading={remarkLoading}
        onRemarkClick={handleRemarkClick}
        onRemarksChange={setRemarks}
        onSubmitRemark={handleSubmitRemark}
        onCancelRemark={cancelRemark}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
      />
    </div>
  );
};

export default AdminDashboard;
