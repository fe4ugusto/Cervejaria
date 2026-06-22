import React from "react";
import { useCervejasController } from "../../controllers/useCervejasController";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";

export default function CervejasPage() {
  const {
    cervejas,
    estilos,
    fornecedores,
    modal,
    form,
    errors,
    openNew,
    openEdit,
    closeModal,
    handleFormChange,
    salvar,
    excluir,
    getEstilo,
    getForn
  } = useCervejasController();

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">🍺 Cervejas</h2>
        <Button onClick={openNew}>+ Nova Cerveja</Button>
      </div>

      {cervejas.length === 0 ? (
        <EmptyState msg="Nenhuma cerveja cadastrada ainda." />
      ) : (
        <div className="grid">
          {cervejas.map((c) => (
            <Card key={c.id} style={{ borderTop: "3px solid var(--primary-color)" }}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  color: "var(--accent-gold)"
                }}
              >
                {c.nome}
              </p>
              <p
                style={{
                  color: "#888",
                  fontSize: 12,
                  fontFamily: "monospace",
                  margin: "4px 0 12px"
                }}
              >
                {getEstilo(c.estiloId)} · {getForn(c.fornecedorId)}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <Badge color="#f59e0b">IBU {c.ibu || "—"}</Badge>
                <Badge color="#818cf8">ABV {c.abv}%</Badge>
                <Badge color="#22c55e">R$ {Number(c.preco).toFixed(2)}</Badge>
              </div>
              <div className="card-actions">
                <Button variant="ghost" small onClick={() => openEdit(c)}>
                  ✏️ Editar
                </Button>
                <Button variant="danger" small onClick={() => excluir(c.id)}>
                  🗑 Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === "new" ? "Nova Cerveja" : "Editar Cerveja"}
          onClose={closeModal}
        >
          <Input
            label="Nome da Cerveja"
            placeholder="ex: Amarillo Hop"
            value={form.nome}
            onChange={(e) => handleFormChange("nome", e.target.value)}
            error={errors.nome}
          />
          <div style={{ marginBottom: 14 }}>
            <label className="label">Estilo</label>
            <select
              className="input"
              value={form.estiloId}
              onChange={(e) => handleFormChange("estiloId", e.target.value)}
            >
              <option value="">Selecione...</option>
              {estilos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
            {errors.estiloId && <p className="err-msg">{errors.estiloId}</p>}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Fornecedor</label>
            <select
              className="input"
              value={form.fornecedorId}
              onChange={(e) => handleFormChange("fornecedorId", e.target.value)}
            >
              <option value="">Selecione...</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
            {errors.fornecedorId && <p className="err-msg">{errors.fornecedorId}</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Input
              label="IBU"
              type="number"
              placeholder="ex: 45"
              value={form.ibu}
              onChange={(e) => handleFormChange("ibu", e.target.value)}
              error={errors.ibu}
            />
            <Input
              label="ABV (%)"
              type="number"
              step="0.1"
              placeholder="ex: 6.5"
              value={form.abv}
              onChange={(e) => handleFormChange("abv", e.target.value)}
              error={errors.abv}
            />
            <Input
              label="Preço (R$)"
              type="number"
              step="0.01"
              placeholder="ex: 18.90"
              value={form.preco}
              onChange={(e) => handleFormChange("preco", e.target.value)}
              error={errors.preco}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button onClick={salvar}>Salvar</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
