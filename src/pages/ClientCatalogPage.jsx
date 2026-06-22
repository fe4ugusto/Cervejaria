import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { useCervejasController } from "../controllers/useCervejasController";

export default function ClientCatalogPage() {
  const { cervejas, estilos, getEstilo } = useCervejasController();
  const { user } = useAuth();

  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [pedidosAberto, setPedidosAberto] = useState(false);
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroEstilo, setFiltroEstilo] = useState("");
  const [finalizando, setFinalizando] = useState(false);
  const [pedidoSucesso, setPedidoSucesso] = useState(false);

  const filtradas = cervejas.filter((c) => {
    const temEstoque = (c.estoque ?? 0) > 0;
    const termo = busca.toLowerCase();
    const atendeBusca =
      c.nome.toLowerCase().includes(termo) ||
      getEstilo(c.estiloId).toLowerCase().includes(termo);
    const atendeEstilo = !filtroEstilo || c.estiloId === filtroEstilo;
    return temEstoque && atendeBusca && atendeEstilo;
  });

  const handleAdicionarAoCarrinho = (cerveja) => {
    const estoqueDisponivel = cerveja.estoque ?? 0;
    const itemExistente = carrinho.find((item) => item.id === cerveja.id);
    const qtdAtual = itemExistente ? itemExistente.quantidade : 0;

    if (qtdAtual >= estoqueDisponivel) {
      alert(`⚠️ Estoque insuficiente! Apenas ${estoqueDisponivel} unidade(s) disponíveis.`);
      return;
    }

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
    const cerveja = cervejas.find((c) => c.id === id);
    const estoqueDisponivel = cerveja?.estoque ?? 0;

    setCarrinho(
      carrinho
        .map((item) => {
          if (item.id === id) {
            const novaQuantidade = item.quantidade + delta;
            if (novaQuantidade > estoqueDisponivel) {
              alert(`⚠️ Apenas ${estoqueDisponivel} unidade(s) disponíveis.`);
              return item;
            }
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

  const carregarMeusPedidos = async () => {
    if (!user?.email) return;
    setCarregandoPedidos(true);
    try {
      const q = query(
        collection(db, "vendas"),
        where("comprador", "==", user.email),
        orderBy("criadoEm", "desc")
      );
      const snap = await getDocs(q);
      setMeusPedidos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoPedidos(false);
    }
  };

  const handleAbrirPedidos = () => {
    setPedidosAberto(true);
    carregarMeusPedidos();
  };

  const handleFinalizarPedido = async () => {
    if (carrinho.length === 0) return;
    setFinalizando(true);

    try {
      const itens = carrinho.map((item) => ({
        cervejaId: item.id,
        cervejaNome: item.nome,
        quantidade: item.quantidade,
        precoUnitario: Number(item.preco),
        subtotal: Number(item.preco) * item.quantidade,
      }));

      const totalVenda = itens.reduce((acc, i) => acc + i.subtotal, 0);

      await addDoc(collection(db, "vendas"), {
        comprador: user?.email || "Anônimo",
        compradorNome: user?.name || user?.email || "Anônimo",
        itens,
        totalVenda,
        status: "Pendente",
        criadoEm: serverTimestamp(),
      });

      for (const item of carrinho) {
        const cerveja = cervejas.find((c) => c.id === item.id);
        if (cerveja) {
          const novoEstoque = Math.max(0, (cerveja.estoque ?? 0) - item.quantidade);
          await updateDoc(doc(db, "cervejas", item.id), { estoque: novoEstoque });
        }
      }

      setCarrinho([]);
      setCarrinhoAberto(false);
      setPedidoSucesso(true);
      setTimeout(() => setPedidoSucesso(false), 4000);
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setFinalizando(false);
    }
  };

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const estoqueColor = (qtd) => {
    if (qtd <= 0) return "#ef4444";
    if (qtd <= 5) return "#f59e0b";
    return "#22c55e";
  };

  const statusColor = (st) => {
    switch (st) {
      case "Pendente": return "#f59e0b";
      case "Preparando": return "#3b82f6";
      case "Em Rota": return "#8b5cf6";
      case "Entregue": return "#22c55e";
      case "Cancelado": return "#ef4444";
      default: return "#666";
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {pedidoSucesso && (
        <div style={{ background: "linear-gradient(135deg, #14532d, #166534)", border: "1px solid #22c55e", borderRadius: 12, padding: "16px 24px", marginBottom: 20, color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: 12, animation: "fadeIn .3s ease" }}>
          🍻 Pedido finalizado com sucesso! Em breve você receberá seu pedido.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>🍻 Catálogo do Cliente</h1>
          <p style={{ color: "#888", fontSize: 14, maxWidth: 560 }}>
            Aqui estão as cervejas disponíveis. Pesquise por nome ou estilo e adicione ao pedido.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Button variant="ghost" small onClick={handleAbrirPedidos}>
            📦 Meus Pedidos
          </Button>
          {totalItens > 0 && (
            <div style={{ color: "#a5f3fc", fontSize: 13, fontFamily: "monospace", background: "#0c1a1f", padding: "6px 12px", borderRadius: 8, border: "1px solid #164e63" }}>
              {totalItens} item(s) · R$ {valorTotal.toFixed(2)}
            </div>
          )}
          <Button variant="primary" small onClick={() => setCarrinhoAberto(true)}>
            🛒 Ver Carrinho {totalItens > 0 && `(${totalItens})`}
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input className="input" style={{ flex: 1, minWidth: 260, background: "#0f1109", border: "1px solid #2a2510", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 14 }} placeholder="🔍 Busque por cerveja ou estilo..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select className="input" style={{ maxWidth: 220, background: "#0f1109", border: "1px solid #2a2510", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 14 }} value={filtroEstilo} onChange={(e) => setFiltroEstilo(e.target.value)}>
          <option value="">Todos os Estilos</option>
          {estilos.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState msg="Nenhuma cerveja disponível em estoque para este filtro." />
      ) : (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {filtradas.map((c) => {
            const noCarrinho = carrinho.find((i) => i.id === c.id)?.quantidade || 0;
            return (
              <div key={c.id} style={{ background: "#13150f", border: "1px solid #1e2010", borderTop: "3px solid #f5c842", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", gap: 0 }}>
                {c.imagemUrl ? (
                  <div style={{ width: "100%", height: 200, background: `url(${c.imagemUrl}) center/cover no-repeat` }} />
                ) : (
                  <div style={{ width: "100%", height: 120, background: "#0c0d0f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🍺</div>
                )}
                
                <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f5c842", fontWeight: 700, margin: 0 }}>
                    {c.nome}
                  </p>
                  <p style={{ color: "#888", fontSize: 12, fontFamily: "monospace", margin: "4px 0 12px" }}>
                    Estilo: {getEstilo(c.estiloId)}
                  </p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                    <Badge color="#f59e0b">IBU {c.ibu || "—"}</Badge>
                    <Badge color="#818cf8">ABV {c.abv}%</Badge>
                    <Badge color="#22c55e">R$ {Number(c.preco).toFixed(2)}</Badge>
                    <Badge color={estoqueColor(c.estoque ?? 0)}>📦 {c.estoque ?? 0} un</Badge>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: "auto", alignItems: "center" }}>
                    {noCarrinho > 0 ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                        <button onClick={() => handleAlterarQuantidade(c.id, -1)} style={{ background: "#1e2010", border: "1px solid #2a2510", borderRadius: 6, color: "#f5c842", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>-</button>
                        <span style={{ color: "#f5c842", fontWeight: 700, minWidth: 24, textAlign: "center" }}>{noCarrinho}</span>
                        <button onClick={() => handleAdicionarAoCarrinho(c)} style={{ background: "#1e2010", border: "1px solid #2a2510", borderRadius: 6, color: "#f5c842", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>+</button>
                        <span style={{ color: "#22c55e", fontSize: 12, fontFamily: "monospace", marginLeft: 4 }}>R$ {(noCarrinho * c.preco).toFixed(2)}</span>
                      </div>
                    ) : (
                      <Button variant="ghost" small style={{ width: "100%", background: "#c8860a11", color: "#f5c842", border: "1px solid #c8860a44" }} onClick={() => handleAdicionarAoCarrinho(c)}>
                        🛒 Adicionar ao Pedido
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CARRINHO MODAL */}
      {carrinhoAberto && (
        <Modal title="🛒 Meu Pedido" onClose={() => setCarrinhoAberto(false)}>
          {carrinho.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: "#aaa", marginBottom: 16 }}>Seu carrinho está vazio.</p>
              <Button variant="ghost" onClick={() => setCarrinhoAberto(false)}>Voltar ao cardápio</Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gap: 12 }}>
                {carrinho.map((item) => (
                  <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center", padding: 14, background: "#111318", borderRadius: 12, border: "1px solid #262b34" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "#f5c842" }}>{item.nome}</p>
                      <p style={{ margin: "6px 0 0", fontSize: 13, color: "#aaa" }}>
                        {item.quantidade} x R$ {Number(item.preco).toFixed(2)} <span style={{ color: "#22c55e" }}>= R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Button variant="ghost" small onClick={() => handleAlterarQuantidade(item.id, -1)}>-</Button>
                      <span style={{ minWidth: 24, textAlign: "center", color: "#f5c842", fontWeight: 700 }}>{item.quantidade}</span>
                      <Button variant="ghost" small onClick={() => handleAlterarQuantidade(item.id, 1)}>+</Button>
                      <Button variant="ghost" small onClick={() => handleRemoverDoCarrinho(item.id)}>✕</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#0c0d0f", borderRadius: 10, padding: 16, border: "1px solid #1e2010" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#888", fontSize: 13 }}>Itens no pedido:</span>
                  <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{totalItens}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888", fontSize: 13 }}>Total:</span>
                  <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 16 }}>R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Button variant="ghost" onClick={() => setCarrinhoAberto(false)}>Cancelar</Button>
                <Button variant="primary" onClick={handleFinalizarPedido} disabled={finalizando}>
                  {finalizando ? "⏳ Finalizando..." : "✅ Finalizar Pedido"}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* MEUS PEDIDOS MODAL */}
      {pedidosAberto && (
        <Modal title="📦 Meus Pedidos" onClose={() => setPedidosAberto(false)}>
          {carregandoPedidos ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>⏳ Carregando...</div>
          ) : meusPedidos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: "#aaa", marginBottom: 16 }}>Você ainda não fez nenhum pedido.</p>
              <Button variant="ghost" onClick={() => setPedidosAberto(false)}>Começar a comprar</Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {meusPedidos.map(pedido => (
                <div key={pedido.id} style={{ background: "#111318", border: "1px solid #262b34", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ color: "#f5c842", fontWeight: 700, fontSize: 16 }}>
                        R$ {Number(pedido.totalVenda || 0).toFixed(2)}
                      </div>
                      <div style={{ color: "#666", fontSize: 11, fontFamily: "monospace", marginTop: 4 }}>
                        {pedido.criadoEm?.toDate ? pedido.criadoEm.toDate().toLocaleString("pt-BR") : "—"}
                      </div>
                    </div>
                    <Badge color={statusColor(pedido.status || "Pendente")}>
                      {pedido.status || "Pendente"}
                    </Badge>
                  </div>
                  <div style={{ background: "#0c0d0f", padding: 10, borderRadius: 8 }}>
                    {(pedido.itens || []).map((i, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#aaa", marginBottom: idx < pedido.itens.length - 1 ? 6 : 0 }}>
                        <span>{i.quantidade}x {i.cervejaNome}</span>
                        <span style={{ fontFamily: "monospace" }}>R$ {i.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
