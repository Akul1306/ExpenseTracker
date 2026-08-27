import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Navbar from "./components/Navbar";
import ExpenseForm from "./components/ExpenseForm";
import AdminDashboard from "./components/AdminDashboard";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState("login"); // "login" or "signup"
  const [userInfo, setUserInfo] = useState({ username: "", role: "EMPLOYEE" });

  const loadUserDataFromToken = (token) => {
    if (!token) return;
    const claims = parseJwt(token);
    if (claims) {
      const username = claims.sub || claims.username || "User";
      const role = claims.role || "EMPLOYEE";
      setUserInfo({ username, role });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      loadUserDataFromToken(token);
    }
  }, []);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(true);
    loadUserDataFromToken(token);
  };

  const handleSignupSuccess = () => {
    setAuthView("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAuthView("login");
    setUserInfo({ username: "", role: "EMPLOYEE" });
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar
          username={userInfo.username}
          userRole={userInfo.role}
          onLogout={handleLogout}
        />
        <main className="flex-grow py-8 bg-slate-50">
          {/* Strict Protected Route Rendering based on User Role */}
          {userInfo.role === "ADMIN" ? (
            <AdminDashboard />
          ) : (
            <ExpenseForm />
          )}
        </main>
      </div>
    );
  }

  return (
    <>
      {authView === "login" ? (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onToggleSignup={() => setAuthView("signup")}
        />
      ) : (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onToggleLogin={() => setAuthView("login")}
        />
      )}
    </>
  );
}

export default App;
