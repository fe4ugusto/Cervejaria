import React from "react";
import { AuthProvider } from "./controllers/useAuthController";
import AuthGate from "./views/layout/AuthGate";

/**
 * Componente Raiz da Aplicação.
 * Envolve a aplicação no Provedor de Contexto de Autenticação e renderiza o AuthGate.
 */
export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
