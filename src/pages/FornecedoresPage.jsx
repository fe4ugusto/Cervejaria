import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { styles } from "../styles";

export function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nome: "", contato: "", cidade: "", ativo: true });
  const [errors, setErrors] = useState({});
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarFornecedores();
  }, []);

  async function carregarFornecedores() {
    const snapshot = await getDocs(collection(db, "fornecedores"));
    const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setFornecedores(lista);
  }

  const filtrados = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cidade.toLowerCase().includes(busca.toLowerCase())
  );

  const openNew = () => { setForm({ nome: "", contato: "", cidade: "", ativo: true }); setErrors({}); setModal("new"); };
  const openEdit = (f) => { setForm({ nome: f.nome, contato: f.contato, cidade: f.cidade, ativo: f.ativo }); setErrors({}); setModal(f); };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.contato.trim()) e.contato = "Contato obrigatório";
    if (!form.cidade.trim()) e.cidade = "Cidade obrigatória";
    return e;
  };

  const salvar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (modal === "new") {
      await addDoc(collection(db, "fornecedores"), { nome: form.nome, contato: form.contato, cidade: form.cidade, ativo: form.ativo });
    } else {
      await updateDoc(doc(db, "fornecedores", modal.id), { nome: form.nome, contato: form.contato, cidade: form.cidade, ativo: form.ativo });
    }

    await carregarFornecedores();
    setModal(null);
  };

  const excluir = async (id) => {
    if (confirm("Excluir este fornecedor?")) {
      await deleteDoc(doc(db, "fornecedores", id));
      carregarFornecedores();
    }
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>🚚 Fornecedores</h2>
        <Button onClick={openNew}>+ Novo Fornecedor</Button>
      </div>

      <input style={{ ...styles.input, marginBottom: 20 }} placeholder="🔍 Buscar por nome ou cidade..."
        value={busca} onChange={e => setBusca(e.target.value)} />

      {filtrados.length === 0
        ? <EmptyState msg="Nenhum fornecedor encontrado." />
        : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Fornecedor', 'Contato', 'Cidade', 'Status', 'Ações'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(f => (
                  <tr key={f.id} style={styles.tr}>
                    <td style={styles.td}><strong>{f.nome}</strong></td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12 }}>{f.contato}</td>
                    <td style={styles.td}>{f.cidade}</td>
                    <td style={styles.td}>
                      <Badge color={f.ativo ? '#22c55e' : '#888'}>{f.ativo ? 'Ativo' : 'Inativo'}</Badge>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button variant="ghost" small onClick={() => openEdit(f)}>✏️</Button>
                        <Button variant="danger" small onClick={() => excluir(f.id)}>🗑</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {modal && (
        <Modal title={modal === "new" ? "Novo Fornecedor" : "Editar Fornecedor"} onClose={() => setModal(null)}>
          <Input label="Nome da Empresa" placeholder="ex: HopsBrasil" value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })} error={errors.nome} />
          <Input label="E-mail de Contato" placeholder="ex: contato@empresa.com" value={form.contato}
            onChange={e => setForm({ ...form, contato: e.target.value })} error={errors.contato} />
          <Input label="Cidade" placeholder="ex: São Paulo" value={form.cidade}
            onChange={e => setForm({ ...form, cidade: e.target.value })} error={errors.cidade} />
          <div style={{ marginBottom: 14 }}>
            <label style={styles.label}>Status</label>
            <select style={styles.input} value={form.ativo ? "1" : "0"}
              onChange={e => setForm({ ...form, ativo: e.target.value === "1" })}>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
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
