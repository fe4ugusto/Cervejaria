import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { useCervejasController } from "../controllers/useCervejasController";

// Componente simples para Toasts (Notificações)
function Toast({ show, message }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      background: "#22c55e", color: "#000", padding: "12px 24px", borderRadius: 30,
      fontWeight: 700, fontSize: 14, boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
      zIndex: 1000, animation: "slideUp 0.3s ease, fadeOut 0.3s ease 2.7s forwards"
    }}>
      ✓ {message}
    </div>
  );
}

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
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

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
    
    showToast(`${cerveja.nome} adicionada ao pedido!`);
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

  const carregarMeusPedidos = async () => {
    if (!user?.email) return;
    setCarregandoPedidos(true);
    try {
      const q = query(
        collection(db, "vendas"),
        where("comprador", "==", user.email)
      );
      const snap = await getDocs(q);
      const ped = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      ped.sort((a, b) => {
        const tA = a.criadoEm?.toMillis ? a.criadoEm.toMillis() : 0;
        const tB = b.criadoEm?.toMillis ? b.criadoEm.toMillis() : 0;
        return tB - tA;
      });
      setMeusPedidos(ped);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoPedidos(false);
    }
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
      showToast("🍻 Pedido finalizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setFinalizando(false);
    }
  };

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingBottom: 100 }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; bottom: 0; } to { opacity: 1; bottom: 20px; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .beer-card { transition: all 0.3s ease; }
        .beer-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(200, 134, 10, 0.15); border-color: #c8860a !important; }
        .pill-btn { transition: all 0.2s ease; white-space: nowrap; }
        .pill-btn:hover { background: #c8860a !important; color: #000 !important; }
        .fab-cart { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0px); } }
      `}</style>

      {/* HERO BANNER */}
      <div style={{ 
        background: "radial-gradient(ellipse at top, #2a2510 0%, #0c0d0f 70%)",
        padding: "60px 24px", textAlign: "center", marginBottom: 30, borderBottom: "1px solid #1e2010"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🍻</div>
        <h1 style={{ fontSize: 42, color: "#f5c842", fontFamily: "'Playfair Display', serif", marginBottom: 12 }}>
          Catálogo de Cervejas
        </h1>
        <p style={{ color: "#aaa", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
          Explore nossa seleção artesanal, peça de onde estiver e acompanhe o status da entrega em tempo real.
        </p>
        <div style={{ marginTop: 28 }}>
          <button 
            onClick={() => { setPedidosAberto(true); carregarMeusPedidos(); }}
            style={{ 
              background: "#1a1c14", border: "1px solid #c8860a", color: "#f5c842", 
              borderRadius: 30, padding: "10px 24px", fontSize: 15, fontWeight: 600, 
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#c8860a"; e.currentTarget.style.color = "#000"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "#1a1c14"; e.currentTarget.style.color = "#f5c842"; }}
          >
            📦 Acompanhar Meus Pedidos
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        
        {/* FILTERS (PILLS & SEARCH) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: 12, fontSize: 18 }}>🔍</span>
            <input className="input" style={{ width: "100%", background: "#0f1109", border: "1px solid #2a2510", borderRadius: 30, padding: "14px 14px 14px 44px", color: "#e2e8f0", fontSize: 15 }} 
              placeholder="Qual cerveja você está procurando?" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            <button className="pill-btn" onClick={() => setFiltroEstilo("")} 
              style={{ background: filtroEstilo === "" ? "#f5c842" : "#1a1c14", color: filtroEstilo === "" ? "#000" : "#aaa", border: "none", padding: "8px 20px", borderRadius: 20, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              🍻 Todos
            </button>
            {estilos.map((e) => (
              <button key={e.id} className="pill-btn" onClick={() => setFiltroEstilo(e.id)} 
                style={{ background: filtroEstilo === e.id ? "#f5c842" : "#1a1c14", color: filtroEstilo === e.id ? "#000" : "#aaa", border: "none", padding: "8px 20px", borderRadius: 20, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                {e.nome}
              </button>
            ))}
          </div>
        </div>

        {/* GRID DE CERVEJAS */}
        {filtradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#666" }}>Nenhuma cerveja encontrada para sua busca.</div>
        ) : (
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {filtradas.map((c) => {
              const noCarrinho = carrinho.find((i) => i.id === c.id)?.quantidade || 0;
              return (
                <div key={c.id} className="beer-card" style={{ background: "rgba(19, 21, 15, 0.7)", backdropFilter: "blur(10px)", border: "1px solid #1e2010", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
                  
                  {/* Badge de Estoque Flutuante */}
                  <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
                    <Badge color={c.estoque <= 5 ? "#f59e0b" : "rgba(34, 197, 94, 0.8)"} style={{ backdropFilter: "blur(4px)" }}>
                      📦 Restam {c.estoque}
                    </Badge>
                  </div>

                  {c.imagemUrl ? (
                    <div style={{ width: "100%", height: 220, background: `url(${c.imagemUrl}) center/cover no-repeat` }} />
                  ) : (
                    <div style={{ width: "100%", height: 220, background: "linear-gradient(135deg, #2a2510, #0c0d0f)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🍺</div>
                  )}
                  
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#f5c842", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{c.nome}</p>
                      <p style={{ color: "#22c55e", fontSize: 18, fontWeight: 700, margin: 0 }}>R$ {Number(c.preco).toFixed(2)}</p>
                    </div>
                    
                    <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>{getEstilo(c.estiloId)}</p>

                    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#a5f3fc", fontSize: 12, background: "rgba(165, 243, 252, 0.1)", padding: "4px 8px", borderRadius: 6 }}>
                        <span style={{ fontSize: 14 }}>💧</span> IBU {c.ibu || "—"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fca5a5", fontSize: 12, background: "rgba(252, 165, 165, 0.1)", padding: "4px 8px", borderRadius: 6 }}>
                        <span style={{ fontSize: 14 }}>🔥</span> ABV {c.abv}%
                      </div>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      {noCarrinho > 0 ? (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0c0d0f", border: "1px solid #2a2510", borderRadius: 30, padding: 4 }}>
                          <button onClick={() => handleAlterarQuantidade(c.id, -1)} style={{ background: "#1a1c14", border: "none", borderRadius: "50%", color: "#f5c842", width: 36, height: 36, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                          <span style={{ color: "#f5c842", fontWeight: 700, fontSize: 16 }}>{noCarrinho}</span>
                          <button onClick={() => handleAdicionarAoCarrinho(c)} style={{ background: "#c8860a", border: "none", borderRadius: "50%", color: "#000", width: 36, height: 36, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => handleAdicionarAoCarrinho(c)} style={{ width: "100%", background: "transparent", color: "#f5c842", border: "1px solid #c8860a", borderRadius: 30, padding: "10px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#c8860a"; e.currentTarget.style.color = "#000"; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#f5c842"; }}>
                          Adicionar ao Pedido
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FLOATING ACTION BUTTON (CARRINHO) */}
      {totalItens > 0 && (
        <button className="fab-cart" onClick={() => setCarrinhoAberto(true)} style={{
          position: "fixed", bottom: 30, right: 30, zIndex: 100, background: "#c8860a", color: "#000",
          border: "none", borderRadius: 30, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 8px 32px rgba(200, 134, 10, 0.4)", cursor: "pointer", fontWeight: 700, fontSize: 16, fontFamily: "'Syne', sans-serif"
        }}>
          🛒 Ver Carrinho
          <div style={{ background: "#000", color: "#f5c842", borderRadius: 20, padding: "2px 10px", fontSize: 14 }}>
            {totalItens} itens
          </div>
        </button>
      )}

      {/* CARRINHO MODAL */}
      {carrinhoAberto && (
        <Modal title="🛒 Seu Pedido" onClose={() => setCarrinhoAberto(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gap: 12 }}>
              {carrinho.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "rgba(17, 19, 24, 0.8)", borderRadius: 16, border: "1px solid #262b34" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#f5c842", fontSize: 16 }}>{item.nome}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 14, color: "#aaa" }}>
                      R$ {Number(item.preco).toFixed(2)} uni.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#0c0d0f", padding: 6, borderRadius: 30 }}>
                    <button onClick={() => handleAlterarQuantidade(item.id, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#1a1c14", color: "#fff", cursor: "pointer" }}>-</button>
                    <span style={{ minWidth: 20, textAlign: "center", fontWeight: 700 }}>{item.quantidade}</span>
                    <button onClick={() => handleAlterarQuantidade(item.id, 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#1a1c14", color: "#fff", cursor: "pointer" }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg, #164e63, #082f49)", borderRadius: 16, padding: 20, color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#a5f3fc" }}>Total do Pedido:</span>
                <span style={{ fontWeight: 800, fontSize: 20 }}>R$ {valorTotal.toFixed(2)}</span>
              </div>
            </div>
            <Button variant="primary" onClick={handleFinalizarPedido} disabled={finalizando} style={{ padding: 16, fontSize: 16, borderRadius: 30 }}>
              {finalizando ? "⏳ Processando..." : "✅ Confirmar Compra"}
            </Button>
          </div>
        </Modal>
      )}

      {/* MEUS PEDIDOS MODAL */}
      {pedidosAberto && (
        <Modal title="📦 Histórico de Pedidos" onClose={() => setPedidosAberto(false)}>
          {carregandoPedidos ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>⏳ Buscando seus pedidos...</div>
          ) : meusPedidos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🍺</div>
              <p style={{ color: "#aaa", fontSize: 16 }}>Você ainda não fez nenhum pedido.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {meusPedidos.map(pedido => {
                const colors = {
                  "Pendente": "#f59e0b", "Preparando": "#3b82f6", "Em Rota": "#8b5cf6", "Entregue": "#22c55e", "Cancelado": "#ef4444"
                };
                return (
                  <div key={pedido.id} style={{ background: "rgba(17, 19, 24, 0.8)", border: "1px solid #262b34", borderRadius: 16, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
                          R$ {Number(pedido.totalVenda || 0).toFixed(2)}
                        </div>
                        <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
                          {pedido.criadoEm?.toDate ? pedido.criadoEm.toDate().toLocaleString("pt-BR") : "—"}
                        </div>
                      </div>
                      <Badge color={colors[pedido.status] || "#666"} style={{ padding: "6px 12px", fontSize: 12 }}>
                        {pedido.status || "Pendente"}
                      </Badge>
                    </div>
                    <div style={{ background: "#0c0d0f", padding: 12, borderRadius: 12 }}>
                      {(pedido.itens || []).map((i, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#ccc", marginBottom: idx < pedido.itens.length - 1 ? 8 : 0 }}>
                          <span><span style={{ color: "#f5c842", fontWeight: 700 }}>{i.quantidade}x</span> {i.cervejaNome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Modal>
      )}

      {/* TOAST MESSAGE */}
      <Toast show={!!toastMsg} message={toastMsg} />
    </div>
  );
}
