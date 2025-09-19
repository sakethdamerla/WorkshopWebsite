import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";



export default function Register() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // On successful registration, navigate to the login page.
    // You would typically handle the API call for registration here.
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-green-500 text-white py-2 rounded">
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
