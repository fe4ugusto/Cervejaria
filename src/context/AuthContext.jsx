import { createContext, useContext, useState } from "react";
import { signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("brewery_user");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const u = { email: userCredential.user.email, name: userCredential.user.displayName };
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
      const u = { email: result.user.email, name: result.user.displayName };
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
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);