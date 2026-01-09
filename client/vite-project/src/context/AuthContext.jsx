import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) setUser(jwtDecode(token));
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem("token");
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export { AuthContext };

