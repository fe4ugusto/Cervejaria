import { useState } from "react";
import { useCervejasController } from "../controllers/useCervejasController";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Modal } from "../components/Modal";
import { useLocalState } from "../models/useLocalState";

export default function ClientCatalogPage() {
  const { cervejas, estilos, getEstilo } = useCervejasController();
  const [favoritos, setFavoritos] = useLocalState("brewery_favoritos", []);
  const [carrinho, setCarrinho] = useLocalState("brewery_carrinho", []);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroEstilo, setFiltroEstilo] = useState("");

  const filtradas = cervejas.filter((c) => {
    const termo = busca.toLowerCase();
    const atendeBusca =
      c.nome.toLowerCase().includes(termo) ||
      getEstilo(c.estiloId).toLowerCase().includes(termo);
    const atendeEstilo = !filtroEstilo || c.estiloId === filtroEstilo;
    return atendeBusca && atendeEstilo;
  });

  const isFavorita = (id) => favoritos.includes(id);

  const handleToggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((item) => item !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

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
            const novaQuantidade = item.quantidade + delta;
            return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : null;
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
    setCarrinho([]);
    setCarrinhoAberto(false);
    alert("Pedido finalizado com sucesso! 🍻");
  };

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>🍻 Catálogo do Cliente</h1>
          <p style={{ color: "#888", fontSize: 14, maxWidth: 560 }}>
            Aqui estão as cervejas disponíveis. Pesquise por nome ou estilo e adicione ao pedido.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ color: "#a5f3fc", fontSize: 13, fontFamily: "monospace" }}>
            {totalItens} item(s) no pedido · R$ {valorTotal.toFixed(2)}
          </div>
          <Button variant="ghost" small onClick={() => setCarrinhoAberto(true)}>
            🛒 Ver Carrinho
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          className="input"
          style={{ flex: 1, minWidth: 260 }}
          placeholder="🔍 Busque por cerveja ou estilo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className="input"
          style={{ maxWidth: 220 }}
          value={filtroEstilo}
          onChange={(e) => setFiltroEstilo(e.target.value)}
        >
          <option value="">Todos os Estilos</option>
          {estilos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState msg="Nenhuma cerveja encontrada para este filtro. Tente outra busca." />
      ) : (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {filtradas.map((c) => (
            <Card key={c.id} style={{ borderTop: "3px solid #f5c842" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f5c842", fontWeight: 700 }}>
                  {c.nome}
                </p>
                <button
                  onClick={() => handleToggleFavorito(c.id)}
                  style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0 }}
                  title={isFavorita(c.id) ? "Remover dos Favoritos" : "Favoritar"}
                >
                  {isFavorita(c.id) ? "⭐" : "☆"}
                </button>
              </div>

              <p style={{ color: "#888", fontSize: 12, fontFamily: "monospace", margin: "4px 0 12px" }}>
                Estilo: {getEstilo(c.estiloId)}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <Badge color="#f59e0b">IBU {c.ibu || "—"}</Badge>
                <Badge color="#818cf8">ABV {c.abv}%</Badge>
                <Badge color="#22c55e">R$ {Number(c.preco).toFixed(2)}</Badge>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <Button
                  variant="primary"
                  small
                  style={{ width: "100%" }}
                  onClick={() => handleAdicionarAoCarrinho(c)}
                >
                  🛒 Adicionar ao Pedido
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {carrinhoAberto && (
        <Modal title="🛒 Meu Pedido" onClose={() => setCarrinhoAberto(false)}>
          {carrinho.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: "#aaa", marginBottom: 16 }}>Seu carrinho está vazio.</p>
              <Button variant="ghost" onClick={() => setCarrinhoAberto(false)}>
                Voltar ao cardápio
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gap: 12 }}>
                {carrinho.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 12,
                      alignItems: "center",
                      padding: 14,
                      background: "#111318",
                      borderRadius: 12,
                      border: "1px solid #262b34"
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "#f5c842" }}>{item.nome}</p>
                      <p style={{ margin: "6px 0 0", fontSize: 13, color: "#aaa" }}>
                        {item.quantidade} x R$ {Number(item.preco).toFixed(2)}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Button variant="ghost" small onClick={() => handleAlterarQuantidade(item.id, -1)}>
                        -
                      </Button>
                      <span style={{ minWidth: 24, textAlign: "center", color: "#f5c842", fontWeight: 700 }}>
                        {item.quantidade}
                      </span>
                      <Button variant="ghost" small onClick={() => handleAlterarQuantidade(item.id, 1)}>
                        +
                      </Button>
                      <Button variant="ghost" small onClick={() => handleRemoverDoCarrinho(item.id)}>
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                  Total: R$ {valorTotal.toFixed(2)}
                </div>
                <Button variant="primary" onClick={handleFinalizarPedido}>
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
