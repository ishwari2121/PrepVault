import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
  }, []);

  const login = (userData) => {
    if (!userData?.token) {
      console.error("Invalid login data - no token provided");
      return;
    }

    const newUser = {
      ...userData.user,
      token: userData.token
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    // Clear all auth-related data
    setUser(null);
    localStorage.removeItem("user");
    
    // Completely remove axios authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Force clear cached credentials
    axios.interceptors.request.use(config => {
      config.headers['Authorization'] = undefined;
      return config;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };