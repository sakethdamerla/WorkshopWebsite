import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isDashboard = location.pathname === "/admin-dashboard" || location.pathname === "/student-dashboard";

  return (
    <header className="sticky top-0 z-50 bg-blue-200/80 backdrop-blur-sm text-neutral-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
            Workshop
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="text-neutral-800 hover:text-primary focus:outline-none focus:text-primary"
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
        <nav
          className={`absolute top-16 left-0 right-0 bg-blue-200/95 md:bg-transparent md:static md:block z-20 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0 items-center">
            {!isDashboard && (
              <li>
                <Link
                  to="/"
                  className="block py-2 px-4 text-lg hover:text-primary transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
            )}
            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block py-2 px-4 text-lg hover:text-primary transition-colors duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block py-2 px-4 text-lg bg-blue-500 text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-4 text-lg bg-red-600 text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
