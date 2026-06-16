import { createContext, useContext, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("brewery_user");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login = async (email, password) => {
    try {
      // Acesso direto para clientes/admins de demonstração
      if (email === "cliente@cervejaria.com" && password === "1234") {
        const u = { email, role: "cliente" };
        localStorage.setItem("brewery_user", JSON.stringify(u));
        setUser(u);
        return true;
      }

      if (email === "admin@cervejaria.com" && password === "1234") {
        const u = { email, role: "admin" };
        localStorage.setItem("brewery_user", JSON.stringify(u));
        setUser(u);
        return true;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const u = { email: userCredential.user.email, role: "admin" };
      localStorage.setItem("brewery_user", JSON.stringify(u));
      setUser(u);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("brewery_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);