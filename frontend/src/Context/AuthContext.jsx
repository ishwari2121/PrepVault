import { createContext, useState, useEffect } from "react";
import axios from 'axios';
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check localStorage for user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    console.log("Updated User:", user); // Track user state changes
}, [user]);


  // Login function
  const login = (userData) => {
    console.log("Login Response in AuthContext:", userData); // Debugging line
  
    if (!userData.token) {
        console.error("No token received!");
        return;
    }

    const newUser = { ...userData.user, token: userData.token };
    console.log("Updated User Data:", newUser); // Check stored user object
  
    // ✅ Set token in Axios headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
};

  
  

  // Logout function
  const logout = () => {
    setUser(null);  
    localStorage.removeItem("user");
    delete axios.defaults.headers.common['Authorization'];
    console.log("User logged out successfully.");
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthContext and AuthProvider
export { AuthContext, AuthProvider };
