import React from "react";
import { useRelatorioController } from "../../controllers/useRelatorioController";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";

export default function RelatorioPage() {
  const {
    joined,
    estilos,
    filtroEstilo,
    setFiltroEstilo,
    totalCervejas,
    mediaAbv,
    precoMedio
  } = useRelatorioController();

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">📊 Relatório de Cervejas</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 24
        }}
      >
        {[
          { label: "Total de Cervejas", value: totalCervejas, icon: "🍺" },
          { label: "ABV Médio", value: `${mediaAbv}%`, icon: "💧" },
          { label: "Preço Médio", value: `R$ ${precoMedio}`, icon: "💰" }
        ].map((s) => (
          <Card key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                color: "var(--accent-gold)",
                margin: "4px 0"
              }}
            >
              {s.value}
            </div>
            <div style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="label">Filtrar por Estilo</label>
        <select
          className="input"
          style={{ maxWidth: 260 }}
          value={filtroEstilo}
          onChange={(e) => setFiltroEstilo(e.target.value)}
        >
          <option value="">Todos os estilos</option>
          {estilos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
      </div>

      {joined.length === 0 ? (
        <EmptyState msg="Nenhuma cerveja para exibir. Cadastre cervejas, estilos e fornecedores." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {[
                  "Cerveja",
                  "Estilo",
                  "Amargor",
                  "Origem",
                  "Fornecedor",
                  "Cidade",
                  "IBU",
                  "ABV",
                  "Preço"
                ].map((h) => (
                  <th key={h} className="th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {joined.map((c) => (
                <tr key={c.id} className="tr">
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--accent-gold)",
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    {c.nome}
                  </td>
                  <td className="td">{c.estiloNome}</td>
                  <td className="td">
                    <Badge>{c.amargor}</Badge>
                  </td>
                  <td className="td">{c.origem}</td>
                  <td className="td">{c.fornecedorNome}</td>
                  <td className="td">{c.fornecedorCidade}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontFamily: "monospace", color: "#ccc" }}>
                    {c.ibu || "—"}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontFamily: "monospace", color: "#ccc" }}>
                    {c.abv}%
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      fontFamily: "monospace",
                      color: "#22c55e"
                    }}
                  >
                    R$ {Number(c.preco).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
