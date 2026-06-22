import { useState } from "react";
import { useCervejasController } from "../controllers/useCervejasController";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { useLocalState } from "../models/useLocalState";

export function CustomerCatalogPage() {
  const { cervejas, estilos, getEstilo } = useCervejasController();
  const [favoritos, setFavoritos] = useLocalState("brewery_favoritos", []);
  const [carrinho, setCarrinho] = useLocalState("brewery_carrinho", []);
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, marginBottom: 8 }}>🍻 Nosso Cardápio Artesanal</h2>
          <p style={{ color: "#888", fontSize: 14 }}>Descubra, favorite e adicione cervejas ao pedido do cliente.</p>
        </div>
        <div style={{ color: "#a5f3fc", fontSize: 13, fontFamily: "monospace" }}>
          {carrinho.length} item(s) no carrinho
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
        <EmptyState msg="Nenhuma cerveja encontrada para este filtro. Peça sugestões ao Mestre!" />
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
    </div>
  );
}
