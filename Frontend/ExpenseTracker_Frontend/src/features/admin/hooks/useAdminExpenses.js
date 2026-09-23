import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addExpenseRemark,
  getAdminExpenses,
  updateExpenseStatus,
} from "../api/adminExpenseApi";

import { ADMIN_ITEMS_PER_PAGE } from "../utils/adminConstants";
import {
  calculateApprovedTotal,
  calculatePendingCount,
  calculateTotalSpend,
  getMaxDate,
  getUniqueEmployees,
} from "../utils/adminHelpers";

export const useAdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Employee search
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Remarks
  const [remarkExpenseId, setRemarkExpenseId] = useState(null);
  const [remarkAction, setRemarkAction] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [remarkLoading, setRemarkLoading] = useState(false);

  const maxDate = useMemo(() => getMaxDate(), []);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminExpenses({
        page: currentPage - 1,
        size: ADMIN_ITEMS_PER_PAGE,
        name: selectedEmployee,
        category: selectedCategory,
        date: selectedDate,
      });

      setExpenses(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch admin expenses:", err);

      setError(
        err?.response?.data?.message || "Failed to load expense records.",
      );

      setExpenses([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedEmployee, selectedCategory, selectedDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  const handleEmployeeSearch = (value) => {
    setEmployeeSearch(value);
    setShowEmployeeDropdown(true);

    if (value === "") {
      setSelectedEmployee("ALL");
      resetToFirstPage();
    }
  };

  const handleEmployeeSelect = (username) => {
    setSelectedEmployee(username);
    setEmployeeSearch(username);
    setShowEmployeeDropdown(false);
    resetToFirstPage();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    resetToFirstPage();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    resetToFirstPage();
  };

  const clearDateFilter = () => {
    setSelectedDate("");
    resetToFirstPage();
  };

  const handleStatusUpdate = async (expenseId, newStatus) => {
    try {
      setError("");

      await updateExpenseStatus(expenseId, newStatus);

      await fetchExpenses();
    } catch (err) {
      console.error("Failed to update status:", err);

      setError(
        err?.response?.data?.message || "Failed to update expense status.",
      );
    }
  };

  const handleRemarkClick = (expenseId, action) => {
    setRemarkExpenseId(expenseId);
    setRemarkAction(action);
    setRemarks("");
  };

  const cancelRemark = () => {
    setRemarkExpenseId(null);
    setRemarkAction(null);
    setRemarks("");
  };

  const handleSubmitRemark = async () => {
    if (!remarkExpenseId || !remarkAction) {
      return;
    }

    if (!remarks.trim()) {
      setError("Please enter remarks.");
      return;
    }

    try {
      setRemarkLoading(true);
      setError("");

      // First update the status.
      await updateExpenseStatus(remarkExpenseId, remarkAction);

      // Then save the remarks.
      await addExpenseRemark(remarkExpenseId, remarks.trim());

      cancelRemark();

      await fetchExpenses();
    } catch (err) {
      console.error("Failed to update expense:", err);

      setError(err?.response?.data?.message || "Failed to update expense.");
    } finally {
      setRemarkLoading(false);
    }
  };

  const uniqueEmployees = useMemo(
    () => getUniqueEmployees(expenses),
    [expenses],
  );

  const filteredEmployees = useMemo(() => {
    const search = employeeSearch.toLowerCase();

    return uniqueEmployees.filter((username) =>
      username.toLowerCase().includes(search),
    );
  }, [uniqueEmployees, employeeSearch]);

  const totalSpend = useMemo(() => calculateTotalSpend(expenses), [expenses]);

  const approvedTotal = useMemo(
    () => calculateApprovedTotal(expenses),
    [expenses],
  );

  const pendingCount = useMemo(
    () => calculatePendingCount(expenses),
    [expenses],
  );

  const startEntry =
    totalElements === 0 ? 0 : (currentPage - 1) * ADMIN_ITEMS_PER_PAGE + 1;

  const endEntry = Math.min(currentPage * ADMIN_ITEMS_PER_PAGE, totalElements);

  const goToPreviousPage = () => {
    setCurrentPage((previous) => Math.max(1, previous - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((previous) => Math.min(totalPages, previous + 1));
  };

  return {
    // Data
    expenses,
    loading,
    error,

    // Filters
    selectedEmployee,
    selectedCategory,
    selectedDate,
    employeeSearch,
    showEmployeeDropdown,
    maxDate,
    uniqueEmployees,
    filteredEmployees,

    // Pagination
    currentPage,
    totalPages,
    totalElements,
    startEntry,
    endEntry,

    // Summary
    totalSpend,
    approvedTotal,
    pendingCount,

    // Remarks
    remarkExpenseId,
    remarkAction,
    remarks,
    remarkLoading,

    // Actions
    fetchExpenses,
    handleEmployeeSearch,
    handleEmployeeSelect,
    setShowEmployeeDropdown,
    handleCategoryChange,
    handleDateChange,
    clearDateFilter,
    handleStatusUpdate,
    handleRemarkClick,
    handleSubmitRemark,
    cancelRemark,
    setRemarks,
    goToPreviousPage,
    goToNextPage,
  };
};
