import { useCallback, useEffect, useState } from "react";

import {
  getExpenses,
  deleteExpense as deleteExpenseApi,
} from "../api/expenseApi";

const ITEMS_PER_PAGE = 3;

export default function useExpenses() {
  const [expenses, setExpenses] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Fetch expenses
   */
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getExpenses(currentPage - 1, ITEMS_PER_PAGE);

      console.log("Expense API response:", response.data);

      setExpenses(response.data.content || []);

      setTotalPages(response.data.totalPages || 0);

      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);

      const serverError = err.response?.data;

      if (typeof serverError === "string") {
        setError(serverError);
      } else {
        setError("Failed to fetch expenses.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  /*
   * Fetch whenever page changes
   */
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  /*
   * If deleting the last item on the current page
   * causes the page to disappear, move back.
   */
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /*
   * Delete expense
   */
  const deleteExpense = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteExpenseApi(id);

      await fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense:", err);

      alert("Failed to delete expense.");
    }
  };

  /*
   * Go to next page
   */
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1);
    }
  };

  /*
   * Go to previous page
   */
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  return {
    expenses,

    currentPage,
    totalPages,
    totalElements,

    loading,
    error,

    setCurrentPage,

    refresh: fetchExpenses,

    deleteExpense,

    nextPage,
    previousPage,
  };
}
