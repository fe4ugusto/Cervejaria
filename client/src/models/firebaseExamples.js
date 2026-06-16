/**
 * Exemplos Práticos de Integração com Firebase (Autenticação + Firestore)
 * 
 * Este arquivo serve como um guia prático de referência para quando você decidir
 * migrar a persistência local (localStorage) para a nuvem do Firebase.
 * 
 * As importações abaixo consomem as instâncias criadas em `src/config/firebase.js`.
 */

import { auth, db } from "../config/firebase";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

// =========================================================================
// 1. EXEMPLO: AUTENTICAÇÃO E REGISTRO BASEADO EM PERFIS (RBAC) via FIREBASE
// =========================================================================
export const firebaseAuthExample = {
  /**
   * Realiza login no Firebase com e-mail e senha e retorna a role armazenada.
   * Cole esta lógica no seu `useAuthController.jsx`.
   */
  async login(email, password) {
    try {
      // 1. Autentica no Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Busca o documento do usuário no Firestore para obter o papel (role) de acesso
      const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
      let role = "cliente"; // Papel padrão se não existir no banco
      let name = firebaseUser.displayName || "Usuário Cervejaria";

      if (userDoc.exists()) {
        const userData = userDoc.data();
        role = userData.role || "cliente";
        name = userData.name || name;
      }

      return {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        name,
        role // Retorna se é "admin" ou "cliente"
      };
    } catch (error) {
      console.error("Erro no login do Firebase Auth:", error.message);
      throw error; // Propaga o erro para exibir feedback na View
    }
  },

  /**
   * Registra um novo usuário no Firebase Auth e cria o seu perfil correspondente no Firestore.
   * Perfeito para a sua tela de cadastro de novos clientes.
   */
  async registrarComRole(email, password, name, role = "cliente") {
    try {
      const { updateProfile } = await import("firebase/auth");
      
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Atualiza o nome visual (displayName) no Firebase Auth
      await updateProfile(firebaseUser, { displayName: name });

      // 3. Salva a role e dados extras na coleção 'usuarios' do Firestore vinculando pelo UID
      await setDoc(doc(db, "usuarios", firebaseUser.uid), {
        name,
        email,
        role, // "cliente" ou "admin"
        createdAt: new Date().toISOString()
      });

      return {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        name,
        role
      };
    } catch (error) {
      console.error("Erro ao registrar novo usuário:", error.message);
      throw error;
    }
  },

  /**
   * Realiza o encerramento da sessão ativa no Firebase.
   */
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao deslogar do Firebase Auth:", error.message);
    }
  },

  /**
   * Monitora o estado da autenticação em tempo real.
   * Ideal para rodar dentro de um `useEffect` no seu AuthProvider.
   */
  monitorAuthState(onUserChanged) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Busca a role ao restaurar a sessão do usuário conectado
        let role = "cliente";
        let name = firebaseUser.displayName || "Mestre Cervejeiro";

        try {
          const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            role = userData.role || "cliente";
            name = userData.name || name;
          }
        } catch (e) {
          console.warn("Não foi possível carregar a role do Firestore na restauração de sessão.", e);
        }

        onUserChanged({
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          name,
          role
        });
      } else {
        onUserChanged(null);
      }
    });
  }
};

// =========================================================================
// 2. EXEMPLO: CRUD NO BANCO DE DADOS NOSQL (FIRESTORE)
// =========================================================================
export const firebaseFirestoreExample = {
  
  // -------------------------------------------------------------
  // OPERAÇÕES PARA ESTILOS DE CERVEJA
  // -------------------------------------------------------------
  estilos: {
    /**
     * Busca todos os estilos cadastrados na coleção 'estilos' do Firestore.
     */
    async getTodos() {
      const querySnapshot = await getDocs(collection(db, "estilos"));
      const lista = [];
      querySnapshot.forEach((documento) => {
        lista.push({ id: documento.id, ...documento.data() });
      });
      return lista;
    },

    /**
     * Adiciona um novo estilo no Firestore.
     */
    async adicionar(nome, origem, amargor) {
      const docRef = await addDoc(collection(db, "estilos"), { nome, origem, amargor });
      return docRef.id; // Retorna o ID gerado automaticamente pelo Firestore
    },

    /**
     * Atualiza um estilo existente no Firestore.
     */
    async atualizar(id, nome, origem, amargor) {
      const estiloDoc = doc(db, "estilos", id);
      await updateDoc(estiloDoc, { nome, origem, amargor });
    },

    /**
     * Exclui um estilo do Firestore.
     */
    async excluir(id) {
      const estiloDoc = doc(db, "estilos", id);
      await deleteDoc(estiloDoc);
    }
  },

  // -------------------------------------------------------------
  // OPERAÇÕES PARA FORNECEDORES
  // -------------------------------------------------------------
  fornecedores: {
    async getTodos() {
      const querySnapshot = await getDocs(collection(db, "fornecedores"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      return lista;
    },

    async adicionar(nome, contato, cidade, ativo) {
      const docRef = await addDoc(collection(db, "fornecedores"), { nome, contato, cidade, ativo });
      return docRef.id;
    },

    async atualizar(id, nome, contato, cidade, ativo) {
      const fornDoc = doc(db, "fornecedores", id);
      await updateDoc(fornDoc, { nome, contato, cidade, ativo });
    },

    async excluir(id) {
      const fornDoc = doc(db, "fornecedores", id);
      await deleteDoc(fornDoc);
    }
  },

  // -------------------------------------------------------------
  // OPERAÇÕES PARA CERVEJAS
  // -------------------------------------------------------------
  cervejas: {
    async getTodos() {
      const querySnapshot = await getDocs(collection(db, "cervejas"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      return lista;
    },

    async adicionar(nome, estiloId, fornecedorId, ibu, abv, preco) {
      const docRef = await addDoc(collection(db, "cervejas"), { 
        nome, 
        estiloId, 
        fornecedorId, 
        ibu: Number(ibu), 
        abv: Number(abv), 
        preco: Number(preco) 
      });
      return docRef.id;
    },

    async atualizar(id, nome, estiloId, fornecedorId, ibu, abv, preco) {
      const cervejaDoc = doc(db, "cervejas", id);
      await updateDoc(cervejaDoc, { 
        nome, 
        estiloId, 
        fornecedorId, 
        ibu: Number(ibu), 
        abv: Number(abv), 
        preco: Number(preco) 
      });
    },

    async excluir(id) {
      const cervejaDoc = doc(db, "cervejas", id);
      await deleteDoc(cervejaDoc);
    }
  }
};
