import { createContext, useContext, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("brewery_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      // Usuários de demonstração
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

      if (email === "julio@gmail.com" && password === "123456") {
        const u = { email, role: "admin", name: "Julio" };
        localStorage.setItem("brewery_user", JSON.stringify(u));
        setUser(u);
        return true;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userEmail = userCredential.user.email;
      const isAdmin = userEmail === "julio@gmail.com" || userEmail === "admin@cervejaria.com";

      const u = {
        email: userEmail,
        name: userCredential.user.displayName || userEmail.split("@")[0],
        role: isAdmin ? "admin" : "cliente",
      };

      localStorage.setItem("brewery_user", JSON.stringify(u));
      setUser(u);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const u = {
        email: userCredential.user.email,
        name: name || userCredential.user.displayName || email.split("@")[0],
        role: "cliente",
      };

      localStorage.setItem("brewery_user", JSON.stringify(u));
      setUser(u);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const userEmail = result.user.email;
      const isAdmin = userEmail === "julio@gmail.com" || userEmail === "admin@cervejaria.com";

      const u = {
        email: userEmail,
        name: result.user.displayName || userEmail.split("@")[0],
        role: isAdmin ? "admin" : "cliente",
      };

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
    <AuthContext.Provider
      value={{ user, login, signup, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);