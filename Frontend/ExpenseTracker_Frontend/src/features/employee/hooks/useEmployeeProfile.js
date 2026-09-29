import { useState, useEffect, useCallback } from "react";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  getEmployeeExpenses,
  getEmployeeCategorySummary,
} from "../api/employeeProfileApi";

export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categorySummary, setCategorySummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profileData, expensesData, summaryData] = await Promise.all([
        getEmployeeProfile(),
        getEmployeeExpenses(),
        getEmployeeCategorySummary(),
      ]);

      setProfile(profileData);
      setExpenses(expensesData || []);
      setCategorySummary(summaryData || {});
    } catch (err) {
      console.error("Failed to fetch employee profile data:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load profile. Please ensure backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateProfile = async (formData) => {
    setSaving(true);
    setError("");
    setSuccessMessage("");
    try {
      const updated = await updateEmployeeProfile(formData);
      setProfile(updated);
      setSuccessMessage("Profile updated successfully!");
      return updated;
    } catch (err) {
      console.error("Failed to update profile:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to update profile.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    profile,
    expenses,
    categorySummary,
    loading,
    saving,
    error,
    successMessage,
    setError,
    setSuccessMessage,
    updateProfile: handleUpdateProfile,
    refreshProfileData: fetchProfileData,
  };
};
