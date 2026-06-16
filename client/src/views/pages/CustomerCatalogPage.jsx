import React, { useState } from "react";
import { useCervejasController } from "../../controllers/useCervejasController";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";

/**
 * Página do Catálogo do Cliente (Vitrine de Cervejas).
 * Permite ao cliente pesquisar, filtrar por estilo, favoritar cervejas e adicioná-las ao pedido.
 */
export default function CustomerCatalogPage({ 
  favoritos, 
  onToggleFavorito, 
  onAdicionarAoCarrinho 
}) {
  const {
    cervejas,
    estilos,
    getEstilo
  } = useCervejasController();

  const [busca, setBusca] = useState("");
  const [filtroEstilo, setFiltroEstilo] = useState("");

  // Filtra as cervejas ativas com base na barra de buscas e no estilo selecionado
  const filtradas = cervejas.filter((c) => {
    const atendeBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) || 
                       getEstilo(c.estiloId).toLowerCase().includes(busca.toLowerCase());
    const atendeEstilo = !filtroEstilo || c.estiloId === filtroEstilo;
    return atendeBusca && atendeEstilo;
  });

  const isFavorita = (id) => favoritos.includes(id);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">🍻 Nosso Cardápio Artesanal</h2>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          className="input"
          style={{ flex: 1, minWidth: 260 }}
          placeholder="🔍 O que vamos beber hoje? (Busque por cerveja ou estilo...)"
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

      {/* Grid de Cervejas */}
      {filtradas.length === 0 ? (
        <EmptyState msg="Nenhuma cerveja encontrada para este filtro. Peça sugestões ao Mestre!" />
      ) : (
        <div className="grid">
          {filtradas.map((c) => (
            <Card key={c.id} style={{ borderTop: "3px solid var(--primary-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    color: "var(--accent-gold)",
                    fontWeight: 700
                  }}
                >
                  {c.nome}
                </p>
                <button
                  onClick={() => onToggleFavorito(c.id)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                    padding: 0
                  }}
                  title={isFavorita(c.id) ? "Remover dos Favoritos" : "Favoritar"}
                >
                  {isFavorita(c.id) ? "⭐" : "☆"}
                </button>
              </div>

              <p
                style={{
                  color: "#888",
                  fontSize: 12,
                  fontFamily: "monospace",
                  margin: "4px 0 12px"
                }}
              >
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
                  onClick={() => onAdicionarAoCarrinho(c)}
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
