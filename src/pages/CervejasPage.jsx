import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { styles } from "../styles";

export function CervejasPage() {
  const [estilos, setEstilos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [cervejas, setCervejas] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nome: "", estiloId: "", fornecedorId: "", ibu: "", abv: "", preco: "" });
  const [errors, setErrors] = useState({});
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarEstilos();
    carregarFornecedores();
    carregarCervejas();
  }, []);

  async function carregarEstilos() {
    const snapshot = await getDocs(collection(db, "estilos"));
    setEstilos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function carregarFornecedores() {
    const snapshot = await getDocs(collection(db, "fornecedores"));
    setFornecedores(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function carregarCervejas() {
    const snapshot = await getDocs(collection(db, "cervejas"));
    setCervejas(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  const openNew = () => {
    setForm({ nome: "", estiloId: "", fornecedorId: "", ibu: "", abv: "", preco: "" });
    setErrors({});
    setModal("new");
  };

  const openEdit = (c) => {
    setForm({ nome: c.nome, estiloId: c.estiloId, fornecedorId: c.fornecedorId, ibu: c.ibu, abv: c.abv, preco: c.preco });
    setErrors({});
    setModal(c);
  };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.estiloId) e.estiloId = "Selecione o estilo";
    if (!form.fornecedorId) e.fornecedorId = "Selecione o fornecedor";
    if (!form.ibu || isNaN(form.ibu)) e.ibu = "IBU inválido";
    if (!form.abv || isNaN(form.abv)) e.abv = "ABV inválido";
    if (!form.preco || isNaN(form.preco)) e.preco = "Preço inválido";
    return e;
  };

  const salvar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const data = {
      nome: form.nome,
      estiloId: form.estiloId,
      fornecedorId: form.fornecedorId,
      ibu: Number(form.ibu),
      abv: Number(form.abv),
      preco: Number(form.preco),
    };

    if (modal === "new") {
      await addDoc(collection(db, "cervejas"), data);
    } else {
      await updateDoc(doc(db, "cervejas", modal.id), data);
    }

    await carregarCervejas();
    alert("✅ Cerveja salva com sucesso!");
    setModal(null);
  };

  const excluir = async (id) => {
    if (confirm("Excluir esta cerveja?")) {
      await deleteDoc(doc(db, "cervejas", id));
      carregarCervejas();
      alert("🗑️ Cerveja excluída!");
    }
  };

  const getEstilo = (id) => estilos.find(e => e.id === id)?.nome || "—";
  const getForn = (id) => fornecedores.find(f => f.id === id)?.nome || "—";
  const cervejasFiltradas = cervejas.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>🍺 Cervejas</h2>
        <Button onClick={openNew}>+ Nova Cerveja</Button>
      </div>

      <input style={{ ...styles.input, marginBottom: 20 }} placeholder="🔍 Buscar cerveja..."
        value={busca} onChange={e => setBusca(e.target.value)} />

      {cervejas.length === 0
        ? <EmptyState msg="Nenhuma cerveja cadastrada ainda." />
        : (
          <div style={styles.grid}>
            {cervejasFiltradas.map(c => (
              <Card key={c.id} style={{ borderTop: "3px solid #c8860a" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f5c842" }}>{c.nome}</p>
                <p style={{ color: "#888", fontSize: 12, fontFamily: "monospace", margin: "4px 0 12px" }}>
                  {getEstilo(c.estiloId)} · {getForn(c.fornecedorId)}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  <Badge color="#f59e0b">IBU {c.ibu || "—"}</Badge>
                  <Badge color="#818cf8">ABV {c.abv}%</Badge>
                  <Badge color="#22c55e">R$ {Number(c.preco).toFixed(2)}</Badge>
                </div>
                <div style={styles.cardActions}>
                  <Button variant="ghost" small onClick={() => openEdit(c)}>✏️ Editar</Button>
                  <Button variant="danger" small onClick={() => excluir(c.id)}>🗑 Excluir</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      {modal && (
        <Modal title={modal === "new" ? "Nova Cerveja" : "Editar Cerveja"} onClose={() => setModal(null)}>
          <Input label="Nome da Cerveja" value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })} error={errors.nome} />

          <div style={{ marginBottom: 14 }}>
            <label style={styles.label}>Estilo</label>
            <select style={styles.input} value={form.estiloId} onChange={e => setForm({ ...form, estiloId: e.target.value })}>
              <option value="">Selecione...</option>
              {estilos.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
            {errors.estiloId && <p style={styles.errMsg}>{errors.estiloId}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={styles.label}>Fornecedor</label>
            <select style={styles.input} value={form.fornecedorId} onChange={e => setForm({ ...form, fornecedorId: e.target.value })}>
              <option value="">Selecione...</option>
              {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
            {errors.fornecedorId && <p style={styles.errMsg}>{errors.fornecedorId}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Input label="IBU" type="number" value={form.ibu}
              onChange={e => setForm({ ...form, ibu: e.target.value })} error={errors.ibu} />
            <Input label="ABV (%)" type="number" step="0.1" value={form.abv}
              onChange={e => setForm({ ...form, abv: e.target.value })} error={errors.abv} />
            <Input label="Preço (R$)" type="number" step="0.01" value={form.preco}
              onChange={e => setForm({ ...form, preco: e.target.value })} error={errors.preco} />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
