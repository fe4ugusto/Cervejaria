import React, { useState } from "react";
import { useAuth } from "../../controllers/useAuthController";
import { useLocalState } from "../../models/useLocalState";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import Modal from "../components/Modal";
import CustomerCatalogPage from "../pages/CustomerCatalogPage";

/**
 * Componente do Painel do Cliente (Vitrine + Carrinho de Compras).
 * Fornece a experiência premium do consumidor de cervejas artesanais.
 */
export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [favoritos, setFavoritos] = useLocalState("brewery_favoritos", []);
  const [carrinho, setCarrinho] = useLocalState("brewery_carrinho", []);
  
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [pedidoConcluido, setPedidoConcluido] = useState(false);

  // --- Funções de Favoritos ---
  const handleToggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((x) => x !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  // --- Funções do Carrinho ---
  const handleAdicionarAoCarrinho = (cerveja) => {
    const itemExistente = carrinho.find((item) => item.id === cerveja.id);
    if (itemExistente) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === cerveja.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([...carrinho, { ...cerveja, quantidade: 1 }]);
    }
  };

  const handleAlterarQuantidade = (id, delta) => {
    setCarrinho(
      carrinho
        .map((item) => {
          if (item.id === id) {
            const novaQtd = item.quantidade + delta;
            return novaQtd > 0 ? { ...item, quantidade: novaQtd } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoverDoCarrinho = (id) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const handleFinalizarPedido = () => {
    setPedidoConcluido(true);
    setCarrinho([]); // Limpa o carrinho
    setCarrinhoAberto(false); // Fecha o painel do carrinho
  };

  // --- Cálculos ---
  const totalItens = carrinho.reduce((acc, curr) => acc + curr.quantidade, 0);
  const valorTotal = carrinho.reduce(
    (acc, curr) => acc + curr.preco * curr.quantidade,
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-color)",
        color: "var(--text-color)"
      }}
    >
      {/* 1. CABEÇALHO / HEADER PREMIUM */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          background: "var(--sidebar-bg)",
          borderBottom: "1px solid var(--border-color)",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 32 }}>🍻</div>
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                color: "var(--accent-gold)",
                fontWeight: 700,
                margin: 0
              }}
            >
              Cervejaria Artesanal
            </h1>
            <p
              style={{
                fontSize: 10,
                color: "#888",
                margin: 0,
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: 1
              }}
            >
              Área do Consumidor
            </p>
          </div>
        </div>

        {/* Informações e Ações do Usuário */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</span>
            <Badge color="#818cf8">Cliente</Badge>
          </div>

          {/* Botão de Carrinho */}
          <button
            onClick={() => setCarrinhoAberto(true)}
            style={{
              background: "rgba(200, 134, 10, 0.1)",
              border: "1px solid var(--primary-color)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "var(--accent-gold)",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease"
            }}
            className="btn-carrinho"
          >
            <span>🛒</span>
            <span>Meu Pedido</span>
            <span
              style={{
                background: "var(--primary-color)",
                color: "var(--bg-color)",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: 11,
                minWidth: 18,
                textAlign: "center",
                fontWeight: 800
              }}
            >
              {totalItens}
            </span>
          </button>

          <Button variant="ghost" small onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <main style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
        
        {/* BANNER DE BOAS-VINDAS HERO */}
        <div
          style={{
            background: "linear-gradient(135deg, #1d1708 0%, #0f1109 100%)",
            border: "1px solid var(--border-highlight)",
            borderRadius: 16,
            padding: "32px",
            marginBottom: 32,
            boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                color: "var(--accent-gold)",
                marginBottom: 8
              }}
            >
              <h1>{(user.name || user.email || "Usuário").split("@")[0]}, seja bem-vindo ao Templo da Cerveja! 🍺</h1>
            </h2>
            <p style={{ color: "#aaa", fontSize: 14, maxWidth: 650, lineHeight: 1.5 }}>
              Bem-vindo ao nosso Templo da Cerveja. Explore nosso cardápio exclusivo abaixo, 
              selecionado com os melhores lúpulos e maltes pelos nossos mestres cervejeiros. 
              Adicione suas preferidas ao pedido e nós preparamos tudo para você!
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              right: 30,
              bottom: -10,
              fontSize: 120,
              opacity: 0.1,
              userSelect: "none"
            }}
          >
            🍺
          </div>
        </div>

        {/* VITRINE DE PRODUTOS (CUSTOMER CATALOG PAGE) */}
        <CustomerCatalogPage
          favoritos={favoritos}
          onToggleFavorito={handleToggleFavorito}
          onAdicionarAoCarrinho={handleAdicionarAoCarrinho}
        />
      </main>

      {/* 3. DRAWER / MODAL DO CARRINHO */}
      {carrinhoAberto && (
        <Modal title="🛒 Meu Pedido Atual" onClose={() => setCarrinhoAberto(false)}>
          {carrinho.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <p style={{ color: "#888", fontFamily: "monospace" }}>
                Seu carrinho está vazio. Adicione algumas cervejas deliciosas!
              </p>
              <Button
                variant="primary"
                style={{ marginTop: 20 }}
                onClick={() => setCarrinhoAberto(false)}
              >
                Explorar Cardápio
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  maxHeight: "350px",
                  overflowY: "auto",
                  paddingRight: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                }}
              >
                {carrinho.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border-color)",
                      borderRadius: 8,
                      padding: 12
                    }}
                  >
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "var(--accent-gold)" }}>
                        {item.nome}
                      </p>
                      <p style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>
                        R$ {Number(item.preco).toFixed(2)} un.
                      </p>
                    </div>

                    {/* Controles de Quantidade */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}>
                      <button
                        onClick={() => handleAlterarQuantidade(item.id, -1)}
                        style={{
                          background: "var(--ghost-bg)",
                          border: "1px solid var(--ghost-border)",
                          borderRadius: 4,
                          color: "#ccc",
                          width: 24,
                          height: 24,
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: "bold"
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: 14, fontWeight: "bold", width: 20, textAlign: "center" }}>
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => handleAlterarQuantidade(item.id, 1)}
                        style={{
                          background: "var(--ghost-bg)",
                          border: "1px solid var(--ghost-border)",
                          borderRadius: 4,
                          color: "#ccc",
                          width: 24,
                          height: 24,
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: "bold"
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: "right", marginRight: 12 }}>
                      <p style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0" }}>
                        R$ {Number(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoverDoCarrinho(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--error-color)",
                        cursor: "pointer",
                        fontSize: 16,
                        padding: 4
                      }}
                      title="Remover item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Totalizador */}
              <div
                style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: 16,
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <p style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>TOTAL DO PEDIDO</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-gold)" }}>
                    R$ {valorTotal.toFixed(2)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="ghost" onClick={() => setCarrinhoAberto(false)}>
                    Voltar
                  </Button>
                  <Button variant="primary" onClick={handleFinalizarPedido}>
                    Confirmar Pedido 🍻
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* 4. MODAL DE SUCESSO DO PEDIDO */}
      {pedidoConcluido && (
        <Modal title="🎉 Pedido Confirmado!" onClose={() => setPedidoConcluido(false)}>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                fontSize: 64,
                marginBottom: 16,
                animation: "modalEnter 0.5s ease-out",
                display: "inline-block"
              }}
            >
              🍻✨
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                color: "var(--accent-gold)",
                marginBottom: 12
              }}
            >
              Tudo certo, {user?.name.split(" ")[0]}!
            </h3>
            <p
              style={{
                color: "#ccc",
                fontSize: 14,
                lineHeight: 1.5,
                marginBottom: 24,
                maxWidth: 360,
                margin: "0 auto 24px"
              }}
            >
              O Mestre Cervejeiro já recebeu a comanda. Suas cervejas artesanais começaram a ser preparadas 
              e logo mais estarão prontas para o brinde. Tim-tim!
            </p>
            <Button variant="primary" style={{ width: "100%" }} onClick={() => setPedidoConcluido(false)}>
              Excelente, quero continuar navegando!
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
