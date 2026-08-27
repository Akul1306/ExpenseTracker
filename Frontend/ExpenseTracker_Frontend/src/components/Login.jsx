import { useState } from "react";
import api from "../api";

export default function Login({ onLoginSuccess, onToggleSignup }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      onLoginSuccess();
    } catch (err) {
      const serverError = err.response?.data;
      if (typeof serverError === "object" && serverError !== null) {
        setError(Object.values(serverError).join(", "));
      } else {
        setError(serverError || "Invalid username or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Expense Tracker
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <button
              type="button"
              onClick={onToggleSignup}
              className="text-sm text-blue-600 hover:underline font-semibold"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
