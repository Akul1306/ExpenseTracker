import React, { useState } from "react";
import { useEmployeeProfile } from "../hooks/useEmployeeProfile";
import ProfileCard from "../components/ProfileCard";
import CategorySummaryCards from "../components/CategorySummaryCards";
import ProfileExpenseTable from "../components/ProfileExpenseTable";
import ProfileEditForm from "../components/ProfileEditForm";

export default function EmployeeProfilePage() {
  const {
    profile,
    expenses,
    categorySummary,
    loading,
    saving,
    error,
    successMessage,
    updateProfile,
    refreshProfileData,
  } = useEmployeeProfile();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const totalSpent = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => refreshProfileData()} className="text-xs text-emerald-600 underline">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {/* User Profile Card Header */}
      <ProfileCard
        profile={profile}
        totalExpensesCount={expenses.length}
        totalSpentAmount={totalSpent}
        onEditClick={() => setIsEditOpen(true)}
      />

      {/* Category Breakdown Cards */}
      <CategorySummaryCards categorySummary={categorySummary} />

      {/* Expense History Table */}
      <ProfileExpenseTable expenses={expenses} />

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <ProfileEditForm
          profile={profile}
          onSave={updateProfile}
          onClose={() => setIsEditOpen(false)}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
}
