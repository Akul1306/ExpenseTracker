import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function AuthPage({ onLoginSuccess }) {
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return (
      <Signup
        onSignupSuccess={() => setShowSignup(false)}
        onToggleLogin={() => setShowSignup(false)}
      />
    );
  }

  return (
    <Login
      onLoginSuccess={onLoginSuccess}
      onToggleSignup={() => setShowSignup(true)}
    />
  );
}
