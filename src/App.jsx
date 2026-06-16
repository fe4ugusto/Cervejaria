import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { EstilosPage } from "./pages/EstilosPage";
import { FornecedoresPage } from "./pages/FornecedoresPage";
import { CervejasPage } from "./pages/CervejasPage";
import { RelatorioPage } from "./pages/RelatorioPage";
import ClientCatalogPage from "./pages/ClientCatalogPage";
import { Button } from "./components/Button";
import { styles } from "./styles";

// ═══════════════════════════════════════════════════════
//  NAVEGAÇÃO
// ═══════════════════════════════════════════════════════
const ADMIN_NAV = [
  { id: "catalogo", label: "Catálogo", icon: "🛍️" },
  { id: "estilos", label: "Estilos", icon: "🌾" },
  { id: "fornecedores", label: "Fornecedores", icon: "🚚" },
  { id: "cervejas", label: "Cervejas", icon: "🍺" },
  { id: "relatorio", label: "Relatório", icon: "📊" },
];

const CLIENT_NAV = [
  { id: "catalogo", label: "Catálogo", icon: "🛍️" },
];

// ═══════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════
function Dashboard() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(() =>
    user?.role === "cliente" ? "catalogo" : "cervejas"
  );

  const pages = {
    catalogo: ClientCatalogPage,
    estilos: EstilosPage,
    fornecedores: FornecedoresPage,
    cervejas: CervejasPage,
    relatorio: RelatorioPage,
  };

  const navItems = user?.role === "cliente" ? CLIENT_NAV : ADMIN_NAV;

  const PageComponent = pages[page];

  return (
    <div style={styles.appWrap}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={{ fontSize: 36 }}>🍻</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#f5c842", lineHeight: 1.2 }}>
            Cervejaria<br />
            <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>Artesanal</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {navItems.map((n) => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ ...styles.navBtn, ...(page === n.id ? styles.navBtnActive : {}) }}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <p style={{ color: "#888", fontSize: 11, fontFamily: "monospace", marginBottom: 8 }}>👤 {user?.email}</p>
          <Button variant="ghost" small onClick={logout} style={{ width: "100%" }}>Sair</Button>
        </div>
      </aside>

      <main style={styles.main}>
        <PageComponent />
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  AUTH GATE
// ═══════════════════════════════════════════════════════
function AuthGate() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginPage />;
}

// ═══════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════
export default function App() {
  return (
    <AuthProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0d0f; color: #e2e8f0; font-family: 'Syne', sans-serif; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        select option { background: #1a1d24; }
      `}</style>
      <AuthGate />
    </AuthProvider>
  );
}
