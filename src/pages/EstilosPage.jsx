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

export function EstilosPage() {
  const [estilos, setEstilos] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nome: "", origem: "", amargor: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    carregarEstilos();
  }, []);

  async function carregarEstilos() {
    const snapshot = await getDocs(collection(db, "estilos"));
    const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setEstilos(lista);
  }

  const amargorOpts = ["Baixo", "Médio", "Alto", "Muito Alto"];
  const amargorColor = { "Baixo": "#22c55e", "Médio": "#f59e0b", "Alto": "#f97316", "Muito Alto": "#ef4444" };

  const openNew = () => { setForm({ nome: "", origem: "", amargor: "" }); setErrors({}); setModal("new"); };
  const openEdit = (e) => { setForm({ nome: e.nome, origem: e.origem, amargor: e.amargor }); setErrors({}); setModal(e); };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.origem.trim()) e.origem = "Origem obrigatória";
    if (!form.amargor) e.amargor = "Selecione o amargor";
    return e;
  };

  const salvar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (modal === "new") {
      await addDoc(collection(db, "estilos"), { nome: form.nome, origem: form.origem, amargor: form.amargor });
    } else {
      await updateDoc(doc(db, "estilos", modal.id), { nome: form.nome, origem: form.origem, amargor: form.amargor });
    }

    await carregarEstilos();
    setModal(null);
  };

  const excluir = async (id) => {
    if (confirm("Excluir este estilo?")) {
      await deleteDoc(doc(db, "estilos", id));
      carregarEstilos();
    }
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>🌾 Estilos de Cerveja</h2>
        <Button onClick={openNew}>+ Novo Estilo</Button>
      </div>

      {estilos.length === 0
        ? <EmptyState msg="Nenhum estilo cadastrado ainda." />
        : (
          <div style={styles.grid}>
            {estilos.map(e => (
              <Card key={e.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f5c842", marginBottom: 4 }}>{e.nome}</p>
                    <p style={{ color: "#888", fontSize: 13, fontFamily: "monospace" }}>🌍 {e.origem}</p>
                  </div>
                  <Badge color={amargorColor[e.amargor] || "#c8860a"}>{e.amargor}</Badge>
                </div>
                <div style={styles.cardActions}>
                  <Button variant="ghost" small onClick={() => openEdit(e)}>✏️ Editar</Button>
                  <Button variant="danger" small onClick={() => excluir(e.id)}>🗑 Excluir</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      {modal && (
        <Modal title={modal === "new" ? "Novo Estilo" : "Editar Estilo"} onClose={() => setModal(null)}>
          <Input label="Nome do Estilo" placeholder="ex: IPA" value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })} error={errors.nome} />
          <Input label="País de Origem" placeholder="ex: Alemanha" value={form.origem}
            onChange={e => setForm({ ...form, origem: e.target.value })} error={errors.origem} />
          <div style={{ marginBottom: 14 }}>
            <label style={styles.label}>Nível de Amargor</label>
            <select style={styles.input} value={form.amargor} onChange={e => setForm({ ...form, amargor: e.target.value })}>
              <option value="">Selecione...</option>
              {amargorOpts.map(o => <option key={o}>{o}</option>)}
            </select>
            {errors.amargor && <p style={styles.errMsg}>{errors.amargor}</p>}
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
