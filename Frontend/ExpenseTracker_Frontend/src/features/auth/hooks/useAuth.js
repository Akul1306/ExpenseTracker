import { useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const getServerError = (err, fallbackMessage) => {
  const serverError = err.response?.data;

  if (typeof serverError === "object" && serverError !== null) {
    return Object.values(serverError).join(", ");
  }

  return serverError || fallbackMessage;
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const login = async (credentials) => {
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(credentials);

      const token = data.token;

      localStorage.setItem("token", token);

      return data;
    } catch (err) {
      setError(getServerError(err, "Invalid username or password"));

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerUser(userData);

      setSuccess("Registration successful! You can now log in.");
    } catch (err) {
      setError(
        getServerError(
          err,
          "Failed to register. Username or email might be taken.",
        ),
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    setError,
    setSuccess,
    login,
    signup,
  };
};
