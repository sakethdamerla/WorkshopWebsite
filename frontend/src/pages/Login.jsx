// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import useAuth
import { FaHome } from "react-icons/fa";

export default function Login() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailOrMobile, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to login.");
        return;
      }

      console.log("Login.jsx: User data from backend:", data.user); // Added for debugging
      login(data.user);

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="relative max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <Link to="/" className="absolute top-6 left-4 text-black hover:text-primary text-2xl">
          <FaHome />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-neutral-900 mb-4">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Email or Mobile Number</label>
            <input
              type="text"
              placeholder="you@example.com or 123-456-7890"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
