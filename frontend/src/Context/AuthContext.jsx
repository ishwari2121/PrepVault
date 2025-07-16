import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const decoded = jwtDecode(parsedUser.token);

        // Check if token has expired
        if (decoded.exp * 1000 < Date.now()) {
          logout(); // Token is expired, force logout
        } else {
          setUser(parsedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        console.error("Failed to decode or parse token:", error);
        logout(); // Malformed token or localStorage — clean it up
      }
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    if (!userData?.token) return;

    const newUser = {
      ...userData.user,
      token: userData.token
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
