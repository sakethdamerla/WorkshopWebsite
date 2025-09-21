import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const userData = JSON.parse(storedUser);
        console.log("AuthContext: Loading user from localStorage:", userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("AuthContext: Error parsing user from localStorage", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  const login = (userData) => {
    console.log("AuthContext: Logging in with userData:", userData); // Added log
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log("AuthContext: Logging out."); // Added log
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}