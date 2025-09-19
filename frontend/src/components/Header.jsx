import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">AI Workshop</Link>
      </div>
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
          aria-label="toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            {isMenuOpen ? (
              <path
                fillRule="evenodd"
                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              />
            )}
          </svg>
        </button>
      </div>
      <nav className={`absolute top-16 left-0 right-0 bg-gray-800 md:bg-transparent md:static md:block ${isMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col md:flex-row md:space-x-4 p-4 md:p-0">
          {isAuthenticated ? (
            <li>
              <button onClick={logout} className="block py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-300 rounded">Logout</button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/" className="block py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-300 rounded">Home</Link>
              </li>
              <li>
                <Link to="/login" className="block py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-300 rounded">Login</Link>
              </li>
              <li>
                <Link to="/register" className="block py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-300 rounded">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
