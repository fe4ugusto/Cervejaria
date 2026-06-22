import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { styles } from "../styles";

export function RelatorioPage() {
  const [cervejas, setCervejas] = useState([]);
  const [estilos, setEstilos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [filtroEstilo, setFiltroEstilo] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const [snapCervejas, snapEstilos, snapFornecedores] = await Promise.all([
      getDocs(collection(db, "cervejas")),
      getDocs(collection(db, "estilos")),
      getDocs(collection(db, "fornecedores")),
    ]);

    setCervejas(snapCervejas.docs.map(d => ({ id: d.id, ...d.data() })));
    setEstilos(snapEstilos.docs.map(d => ({ id: d.id, ...d.data() })));
    setFornecedores(snapFornecedores.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  const joined = cervejas
    .map(c => {
      const estilo = estilos.find(e => e.id === c.estiloId) || {};
      const fornecedor = fornecedores.find(f => f.id === c.fornecedorId) || {};
      return {
        ...c,
        estiloNome: estilo.nome || "—",
        amargor: estilo.amargor || "—",
        origem: estilo.origem || "—",
        fornecedorNome: fornecedor.nome || "—",
        fornecedorCidade: fornecedor.cidade || "—"
      };
    })
    .filter(c => !filtroEstilo || c.estiloId === filtroEstilo);

  const totalCervejas = joined.length;
  const mediaAbv = totalCervejas > 0
    ? (joined.reduce((s, c) => s + Number(c.abv), 0) / totalCervejas).toFixed(2)
    : "0.00";
  const precoMedio = totalCervejas > 0
    ? (joined.reduce((s, c) => s + Number(c.preco), 0) / totalCervejas).toFixed(2)
    : "0.00";

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>📊 Relatório de Cervejas</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total de Cervejas", value: totalCervejas, icon: "🍺" },
          { label: "ABV Médio", value: `${mediaAbv}%`, icon: "💧" },
          { label: "Preço Médio", value: `R$ ${precoMedio}`, icon: "💰" },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#f5c842", margin: "4px 0" }}>{s.value}</div>
            <div style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Filtrar por Estilo</label>
        <select style={{ ...styles.input, maxWidth: 260 }} value={filtroEstilo} onChange={e => setFiltroEstilo(e.target.value)}>
          <option value="">Todos os estilos</option>
          {estilos.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select>
      </div>

      {joined.length === 0
        ? <EmptyState msg="Nenhuma cerveja para exibir. Cadastre cervejas, estilos e fornecedores." />
        : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Cerveja', 'Estilo', 'Amargor', 'Origem', 'Fornecedor', 'Cidade', 'IBU', 'ABV', 'Preço'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {joined.map(c => (
                  <tr key={c.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: 700, color: "#f5c842", fontFamily: "'Playfair Display', serif" }}>{c.nome}</td>
                    <td style={styles.td}>{c.estiloNome}</td>
                    <td style={styles.td}><Badge>{c.amargor}</Badge></td>
                    <td style={styles.td}>{c.origem}</td>
                    <td style={styles.td}>{c.fornecedorNome}</td>
                    <td style={styles.td}>{c.fornecedorCidade}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace" }}>{c.ibu || "—"}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace" }}>{c.abv}%</td>
                    <td style={{ ...styles.td, fontFamily: "monospace", color: "#22c55e" }}>R$ {Number(c.preco).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
