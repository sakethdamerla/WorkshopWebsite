// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { workshopId } = useParams();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (workshopId) {
        // Workshop registration
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentEmail: email, phoneNumber }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to register for workshop.");
          return;
        }

        alert("Successfully registered for the workshop!");
        navigate("/student-dashboard"); // Or wherever appropriate after workshop registration
      } else {
        // User registration
        const role = "student"; // Always register as a student
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, role, phoneNumber }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to register.");
          return;
        }

        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="relative max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <Link to="/" className="absolute top-9 left-4 text-black hover:text-primary text-2xl">
          <FaHome />
        </Link>
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-6">
          {workshopId ? "Register for Workshop" : "Create Your Account"}
        </h2>
        

        <form onSubmit={handleRegister} className="space-y-6">
          {!workshopId && (
            <div>
              <label className="text-sm font-medium text-neutral-700">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700">Phone Number</label>
            <input
              type="text"
              placeholder="123-456-7890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              required
            />
          </div>

          {!workshopId && (
            <div>
              <label className="text-sm font-medium text-neutral-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300">
            {workshopId ? "Register for Workshop" : "Register"}
          </button>
        </form>

        {!workshopId && (
          <>
            <p className="mt-8 text-center text-neutral-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
