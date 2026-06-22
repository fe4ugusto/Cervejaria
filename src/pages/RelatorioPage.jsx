import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { styles } from "../styles";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function estoqueColor(qtd) {
  if (qtd === undefined || qtd === null) return "#666";
  if (qtd === 0) return "#ef4444";
  if (qtd <= 5) return "#f59e0b";
  return "#22c55e";
}

const COLORS = ['#f5c842', '#818cf8', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

export function RelatorioPage() {
  const [vendas, setVendas] = useState([]);
  const [cervejas, setCervejas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState("dashboard"); // "dashboard" | "vendas" | "estoque"
  const [filtroBusca, setFiltroBusca] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const [snapVendas, snapCervejas] = await Promise.all([
        getDocs(query(collection(db, "vendas"), orderBy("criadoEm", "desc"))),
        getDocs(collection(db, "cervejas")),
      ]);
      setVendas(snapVendas.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCervejas(snapCervejas.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Erro ao carregar relatório:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (vendaId, novoStatus) => {
    try {
      await updateDoc(doc(db, "vendas", vendaId), { status: novoStatus });
      setVendas(vendas.map(v => v.id === vendaId ? { ...v, status: novoStatus } : v));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Falha ao atualizar status.");
    }
  };

  const totalVendas = vendas.length;
  const receitaTotal = vendas.reduce((s, v) => s + (v.totalVenda || 0), 0);
  const totalItensVendidos = vendas.reduce((s, v) => s + (v.itens || []).reduce((a, i) => a + i.quantidade, 0), 0);
  const estoqueTotal = cervejas.reduce((s, c) => s + (c.estoque ?? 0), 0);
  const cervejasZeradas = cervejas.filter((c) => (c.estoque ?? 0) === 0).length;

  const rankingMap = {};
  vendas.forEach((v) => {
    (v.itens || []).forEach((item) => {
      if (!rankingMap[item.cervejaId]) {
        rankingMap[item.cervejaId] = { nome: item.cervejaNome, quantidade: 0, receita: 0 };
      }
      rankingMap[item.cervejaId].quantidade += item.quantidade;
      rankingMap[item.cervejaId].receita += item.subtotal;
    });
  });
  const ranking = Object.values(rankingMap).sort((a, b) => b.quantidade - a.quantidade);
  const pieData = ranking.slice(0, 5).map(r => ({ name: r.nome, value: r.quantidade }));

  // Agrupar vendas por dia
  const vendasPorDiaMap = {};
  [...vendas].reverse().forEach(v => {
    if (!v.criadoEm) return;
    const d = v.criadoEm.toDate ? v.criadoEm.toDate() : new Date(v.criadoEm);
    const dateStr = d.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' });
    if (!vendasPorDiaMap[dateStr]) vendasPorDiaMap[dateStr] = 0;
    vendasPorDiaMap[dateStr] += v.totalVenda || 0;
  });
  const barData = Object.keys(vendasPorDiaMap).map(k => ({ dia: k, receita: vendasPorDiaMap[k] }));

  const vendasFiltradas = vendas.filter((v) => {
    const termo = filtroBusca.toLowerCase();
    if (!termo) return true;
    const matchComprador = (v.comprador || "").toLowerCase().includes(termo);
    const matchNome = (v.compradorNome || "").toLowerCase().includes(termo);
    const matchItem = (v.itens || []).some((i) => i.cervejaNome.toLowerCase().includes(termo));
    return matchComprador || matchNome || matchItem;
  });

  const cervejasFiltradas = cervejas.filter((c) =>
    c.nome.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const abaStyle = (id) => ({
    padding: "10px 24px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer",
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, transition: "all .2s",
    background: aba === id ? "#c8860a18" : "transparent", color: aba === id ? "#f5c842" : "#666",
    borderBottom: aba === id ? "2px solid #c8860a" : "2px solid transparent",
  });

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>📊 Relatório Administrativo</h2>
        <button onClick={carregarDados} style={{ background: "#1e2010", border: "1px solid #2a2510", borderRadius: 8, color: "#888", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'Syne', sans-serif" }}>
          🔄 Atualizar
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total de Vendas", value: totalVendas, icon: "🧾", color: "#818cf8" },
          { label: "Receita Total", value: `R$ ${receitaTotal.toFixed(2)}`, icon: "💰", color: "#22c55e" },
          { label: "Itens Vendidos", value: totalItensVendidos, icon: "📦", color: "#f59e0b" },
          { label: "Estoque Total", value: `${estoqueTotal} un`, icon: "🍺", color: "#a5f3fc" },
          { label: "Sem Estoque", value: cervejasZeradas, icon: "⚠️", color: cervejasZeradas > 0 ? "#ef4444" : "#22c55e" },
        ].map((s) => (
          <Card key={s.label} style={{ textAlign: "center", padding: "16px 12px" }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: s.color, margin: "4px 0" }}>{s.value}</div>
            <div style={{ color: "#555", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #1e2010", marginBottom: 20, gap: 4 }}>
        <button style={abaStyle("dashboard")} onClick={() => setAba("dashboard")}>📈 Dashboard</button>
        <button style={abaStyle("vendas")} onClick={() => setAba("vendas")}>🧾 Vendas Realizadas</button>
        <button style={abaStyle("estoque")} onClick={() => setAba("estoque")}>📦 Estoque Atual</button>
      </div>

      {aba !== "dashboard" && (
        <div style={{ marginBottom: 16 }}>
          <input style={{ ...styles.input, maxWidth: 380 }} placeholder="🔍 Buscar..." value={filtroBusca} onChange={(e) => setFiltroBusca(e.target.value)} />
        </div>
      )}

      {/* ABA: DASHBOARD */}
      {aba === "dashboard" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#13150f", border: "1px solid #1e2010", borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: "#e2e8f0", marginBottom: 20, fontFamily: "'Syne', sans-serif" }}>Receita por Dia</h3>
            {barData.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <XAxis dataKey="dia" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip cursor={{ fill: '#1a1c14' }} contentStyle={{ background: '#0c0d0f', border: '1px solid #2a2510', borderRadius: 8 }} itemStyle={{ color: '#22c55e' }} formatter={(v) => [`R$ ${v.toFixed(2)}`, 'Receita']} />
                    <Bar dataKey="receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p style={{ color: "#666" }}>Sem dados suficientes.</p>}
          </div>

          <div style={{ background: "#13150f", border: "1px solid #1e2010", borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: "#e2e8f0", marginBottom: 20, fontFamily: "'Syne', sans-serif" }}>Cervejas Mais Vendidas</h3>
            {pieData.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0c0d0f', border: '1px solid #2a2510', borderRadius: 8 }} itemStyle={{ color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p style={{ color: "#666" }}>Sem dados suficientes.</p>}
          </div>
        </div>
      )}

      {/* ABA: VENDAS */}
      {aba === "vendas" && (
        <>
          {loading ? (
            <div style={{ color: "#666", fontFamily: "monospace", padding: 40, textAlign: "center" }}>⏳ Carregando vendas...</div>
          ) : vendasFiltradas.length === 0 ? (
            <EmptyState msg="Nenhuma venda registrada ainda." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {vendasFiltradas.map((venda) => (
                <div key={venda.id} style={{ background: "#13150f", border: "1px solid #1e2010", borderLeft: "4px solid #c8860a", borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>👤</span>
                        <div>
                          <div style={{ color: "#f5c842", fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>
                            {venda.compradorNome || venda.comprador}
                          </div>
                          {venda.compradorNome && venda.compradorNome !== venda.comprador && (
                            <div style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>{venda.comprador}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display', serif" }}>
                        R$ {Number(venda.totalVenda || 0).toFixed(2)}
                      </div>
                      <select 
                        value={venda.status || "Pendente"} 
                        onChange={(e) => handleUpdateStatus(venda.id, e.target.value)}
                        style={{ background: "#0f1109", color: "#a5f3fc", border: "1px solid #164e63", padding: "4px 8px", borderRadius: 6, fontSize: 12, outline: "none", cursor: "pointer" }}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Preparando">Preparando</option>
                        <option value="Em Rota">Em Rota</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                      <div style={{ color: "#555", fontSize: 11, fontFamily: "monospace", marginTop: 2 }}>
                        🕐 {formatDate(venda.criadoEm)}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#0c0d0f", borderRadius: 8, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {["Cerveja", "Qtd", "Preço Unit.", "Subtotal"].map((h) => (
                            <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "#555", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid #1e2010", background: "#0f1109" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(venda.itens || []).map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #141408" }}>
                            <td style={{ padding: "10px 12px", color: "#e2e8f0", fontWeight: 600, fontSize: 13 }}>🍺 {item.cervejaNome}</td>
                            <td style={{ padding: "10px 12px", color: "#a5f3fc", fontFamily: "monospace", fontSize: 13 }}>{item.quantidade}</td>
                            <td style={{ padding: "10px 12px", color: "#888", fontFamily: "monospace", fontSize: 13 }}>R$ {Number(item.precoUnitario).toFixed(2)}</td>
                            <td style={{ padding: "10px 12px", color: "#22c55e", fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>R$ {Number(item.subtotal).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ABA: ESTOQUE */}
      {aba === "estoque" && (
        <>
          {loading ? (
            <div style={{ color: "#666", fontFamily: "monospace", padding: 40, textAlign: "center" }}>⏳ Carregando estoque...</div>
          ) : cervejasFiltradas.length === 0 ? (
            <EmptyState msg="Nenhuma cerveja encontrada." />
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Cerveja", "Estoque Atual", "Preço Unit.", "Valor em Estoque", "Status"].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cervejasFiltradas.sort((a, b) => (a.estoque ?? 0) - (b.estoque ?? 0)).map((c) => {
                    const qtd = c.estoque ?? 0;
                    const valorEstoque = qtd * Number(c.preco || 0);
                    const status = qtd === 0 ? { label: "Sem estoque", color: "#ef4444" } : qtd <= 5 ? { label: "Estoque baixo", color: "#f59e0b" } : { label: "OK", color: "#22c55e" };
                    return (
                      <tr key={c.id} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: 700, color: "#f5c842", fontFamily: "'Playfair Display', serif" }}>{c.nome}</td>
                        <td style={{ ...styles.td, fontFamily: "monospace" }}><span style={{ color: estoqueColor(qtd), fontWeight: 700, fontSize: 16 }}>{qtd}</span> <span style={{ color: "#555", fontSize: 11 }}>un</span></td>
                        <td style={{ ...styles.td, fontFamily: "monospace" }}>R$ {Number(c.preco || 0).toFixed(2)}</td>
                        <td style={{ ...styles.td, fontFamily: "monospace", color: "#a5f3fc" }}>R$ {valorEstoque.toFixed(2)}</td>
                        <td style={styles.td}><Badge color={status.color}>{status.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
