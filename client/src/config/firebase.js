import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Configuração e Inicialização do Firebase.
 * 
 * Este arquivo lê as credenciais de segurança a partir de variáveis de ambiente
 * protegidas no arquivo `.env` na raiz do projeto (padrão do Vite).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa o aplicativo Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o serviço de Autenticação (Firebase Auth)
export const auth = getAuth(app);

// Inicializa e exporta o serviço de Banco de Dados NoSQL (Firestore)
export const db = getFirestore(app);

export default app;
