import { useState } from "react";
import api from "../api";

export default function Signup({ onSignupSuccess, onToggleLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "EMPLOYEE", // Default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", formData);
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => onSignupSuccess(), 2000);
    } catch (err) {
      const serverError = err.response?.data;
      if (typeof serverError === "object" && serverError !== null) {
        setError(Object.values(serverError).join(", "));
      } else {
        setError(serverError || "Failed to register. Username or email might be taken.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create an Account
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {success}
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
              placeholder="e.g. alex"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="ab@abcd.com"
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
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Sign Up
          </button>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <button
              type="button"
              onClick={onToggleLogin}
              className="text-sm text-green-600 hover:underline font-semibold"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
