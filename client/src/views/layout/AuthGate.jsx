import React from "react";
import { useAuth } from "../../controllers/useAuthController";
import Dashboard from "./Dashboard";
import CustomerDashboard from "./CustomerDashboard";
import LoginPage from "../pages/LoginPage";

/**
 * Portão de Autenticação e Controle de Acessos (AuthGate).
 * Decida qual view renderizar com base no estado e na role (papel) de acesso do usuário.
 */
export default function AuthGate() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  // Roteamento baseado em Perfis (RBAC)
  if (user.role === "admin") {
    return <Dashboard />;
  }

  // Caso seja cliente (ou qualquer outra role comum), acessa a área do consumidor
  return <CustomerDashboard />;
}
