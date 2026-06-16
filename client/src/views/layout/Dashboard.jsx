import React, { useState } from "react";
import { useAuth } from "../../controllers/useAuthController";
import Button from "../components/Button";
import EstilosPage from "../pages/EstilosPage";
import FornecedoresPage from "../pages/FornecedoresPage";
import CervejasPage from "../pages/CervejasPage";
import RelatorioPage from "../pages/RelatorioPage";

const NAV = [
  { id: "estilos", label: "Estilos", icon: "🌾" },
  { id: "fornecedores", label: "Fornecedores", icon: "🚚" },
  { id: "cervejas", label: "Cervejas", icon: "🍺" },
  { id: "relatorio", label: "Relatório", icon: "📊" }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState("cervejas");

  const pages = {
    estilos: EstilosPage,
    fornecedores: FornecedoresPage,
    cervejas: CervejasPage,
    relatorio: RelatorioPage
  };

  const PageComponent = pages[page];

  return (
    <div className="app-wrap">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ fontSize: 36 }}>🍻</div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 16,
              color: "var(--accent-gold)",
              lineHeight: 1.2
            }}
          >
            Cervejaria<br />
            <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>
              Artesanal
            </span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className={`nav-btn ${page === n.id ? "nav-btn-active" : ""}`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p
            style={{
              color: "#888",
              fontSize: 11,
              fontFamily: "monospace",
              marginBottom: 8
            }}
          >
            👤 {user?.name}
          </p>
          <Button variant="ghost" small onClick={logout} style={{ width: "100%" }}>
            Sair
          </Button>
        </div>
      </aside>

      <main className="main-content">
        <PageComponent />
      </main>
    </div>
  );
}
