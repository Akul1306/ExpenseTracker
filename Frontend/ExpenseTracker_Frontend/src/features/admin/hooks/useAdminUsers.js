import { useCallback, useEffect, useState } from "react";
import { getAdminUsers, deleteAdminUser } from "../api/adminUserApi";

const ITEMS_PER_PAGE = 10;

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminUsers({
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
      });

      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch users:", err);

      setError("Failed to fetch employees. Ensure your backend is running.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const handleDeleteUser = async (id, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete employee "${username}"? This will also delete all their expenses.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(id);

      /*
       * If the deleted user was the only user on the current page,
       * move back one page when possible.
       */
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Failed to delete user:", err);

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete user.";

      window.alert(message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    itemsPerPage: ITEMS_PER_PAGE,
    setCurrentPage,
    fetchUsers,
    handleDeleteUser,
  };
};
