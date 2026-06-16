import { useState, createContext, useContext } from "react";
import { authModel } from "../models/authModel";

const AuthContext = createContext(null);

/**
 * Componente do Provedor de Autenticação (Auth Provider).
 * Fornece o estado de autenticação do usuário, login (local + Firebase) e logout.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authModel.loadUser());

  /**
   * Realiza login. Tenta primeiro a validação local (Mock) e, se não encontrar,
   * tenta realizar a autenticação segura no Firebase Auth buscando a role no Firestore.
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<boolean>} Retorna verdadeiro se o login for bem-sucedido
   */
  const login = async (email, password) => {
    // 1. Tenta autenticação local simulada (Mock) primeiro
    const localUser = authModel.authenticate(email, password);
    if (localUser) {
      authModel.persistUser(localUser);
      setUser(localUser);
      return true;
    }

    // 2. Tenta autenticação real com o Firebase caso o local falhe
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth, db } = await import("../config/firebase");
      const { doc, getDoc } = await import("firebase/firestore");

      // Login no Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Busca o documento correspondente ao UID do usuário na coleção 'usuarios' do Firestore
      const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
      let role = "cliente"; // Papel padrão se não especificado
      let name = firebaseUser.displayName || "Usuário Cervejaria";

      if (userDoc.exists()) {
        const userData = userDoc.data();
        role = userData.role || "cliente";
        name = userData.name || name;
      }

      const loggedUser = {
        email: firebaseUser.email,
        name,
        role,
        uid: firebaseUser.uid
      };

      authModel.persistUser(loggedUser);
      setUser(loggedUser);
      return true;
    } catch (error) {
      console.warn("Falha no login ou Firebase não configurado. Erro:", error.message);
      return false;
    }
  };

  /**
   * Encerra a sessão conectada.
   */
  const logout = async () => {
    // Tenta deslogar do Firebase Auth se estiver inicializado
    try {
      const { signOut } = await import("firebase/auth");
      const { auth } = await import("../config/firebase");
      await signOut(auth);
    } catch {
      // Ignora erro se o Firebase não estiver configurado
    }

    authModel.clearUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook customizado para consumir o AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
