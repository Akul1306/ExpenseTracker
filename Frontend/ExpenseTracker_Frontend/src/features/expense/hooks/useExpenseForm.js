import { useRef, useState } from "react";

import {
  createExpense,
  updateExpense,
  deleteExpense,
  uploadReceipt,
} from ".././api/expenseApi";

const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  amount: "",
  category: "FOOD",
  date: "",
};

export default function useExpenseForm(refreshExpenses) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const [file, setFile] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  /*
   * Maximum date = yesterday
   */
  const [maxDate] = useState(() => {
    const today = new Date();

    today.setDate(today.getDate() - 1);

    return today.toISOString().split("T")[0];
  });

  /*
   * Input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  /*
   * Receipt selection
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");

    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  /*
   * Start editing
   */
  const handleEdit = (expense) => {
    setEditingExpenseId(expense.id);

    setFormData({
      title: expense.title || "",
      description: expense.description || "",
      amount: expense.amount || "",
      category: expense.category || "FOOD",
      date: expense.date || "",
    });

    setError("");
    setSuccess("");
  };

  /*
   * Reset form
   */
  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);

    setEditingExpenseId(null);

    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * Cancel edit
   */
  const cancelEdit = () => {
    resetForm();

    setError("");
    setSuccess("");
  };

  /*
   * Submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const payload = {
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    try {
      /*
       * ==========================================
       * UPDATE EXISTING EXPENSE
       * ==========================================
       */

      if (editingExpenseId) {
        await updateExpense(editingExpenseId, payload);

        setSuccess("Expense updated successfully!");

        resetForm();

        await refreshExpenses();

        return;
      }

      /*
       * ==========================================
       * CREATE NEW EXPENSE
       * ==========================================
       */

      const response = await createExpense(payload);

      const createdExpenseId = response.data?.id;

      /*
       * ==========================================
       * UPLOAD RECEIPT
       * ==========================================
       */

      if (file && createdExpenseId) {
        try {
          const fileFormData = new FormData();

          fileFormData.append("file", file);

          await uploadReceipt(createdExpenseId, fileFormData);
        } catch (uploadErr) {
          console.error("Receipt upload failed:", uploadErr);

          /*
           * Rollback created expense
           */
          try {
            await deleteExpense(createdExpenseId);
          } catch (rollbackErr) {
            console.error("Rollback failed:", rollbackErr);
          }

          const uploadMessage = uploadErr.response?.data;

          const finalMessage =
            typeof uploadMessage === "string"
              ? uploadMessage
              : "Receipt file upload failed. The expense was rolled back.";

          setError(finalMessage);

          return;
        }
      }

      /*
       * Successful creation
       */

      setSuccess("Expense added successfully!");

      resetForm();

      await refreshExpenses();
    } catch (err) {
      console.error("Failed to save expense:", err);

      const serverError = err.response?.data;

      if (typeof serverError === "object" && serverError !== null) {
        setError(Object.values(serverError).join(", "));
      } else {
        setError(serverError || "Failed to save expense. Check details.");
      }
    }
  };

  return {
    formData,

    editingExpenseId,

    file,

    error,

    success,

    maxDate,

    fileInputRef,

    handleChange,

    handleFileChange,

    handleEdit,

    handleSubmit,

    cancelEdit,
  };
}
