import React from "react";
import { useEstilosController } from "../../controllers/useEstilosController";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";

export default function EstilosPage() {
  const {
    estilos,
    modal,
    form,
    errors,
    amargorOptions,
    amargorColors,
    openNew,
    openEdit,
    closeModal,
    handleFormChange,
    salvar,
    excluir
  } = useEstilosController();

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">🌾 Estilos de Cerveja</h2>
        <Button onClick={openNew}>+ Novo Estilo</Button>
      </div>

      {estilos.length === 0 ? (
        <EmptyState msg="Nenhum estilo cadastrado ainda." />
      ) : (
        <div className="grid">
          {estilos.map((e) => (
            <Card key={e.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      color: "var(--accent-gold)",
                      marginBottom: 4
                    }}
                  >
                    {e.nome}
                  </p>
                  <p style={{ color: "#888", fontSize: 13, fontFamily: "monospace" }}>
                    🌍 {e.origem}
                  </p>
                </div>
                <Badge color={amargorColors[e.amargor] || "#c8860a"}>{e.amargor}</Badge>
              </div>
              <div className="card-actions">
                <Button variant="ghost" small onClick={() => openEdit(e)}>
                  ✏️ Editar
                </Button>
                <Button variant="danger" small onClick={() => excluir(e.id)}>
                  🗑 Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === "new" ? "Novo Estilo" : "Editar Estilo"}
          onClose={closeModal}
        >
          <Input
            label="Nome do Estilo"
            placeholder="ex: IPA"
            value={form.nome}
            onChange={(e) => handleFormChange("nome", e.target.value)}
            error={errors.nome}
          />
          <Input
            label="País de Origem"
            placeholder="ex: Alemanha"
            value={form.origem}
            onChange={(e) => handleFormChange("origem", e.target.value)}
            error={errors.origem}
          />
          <div style={{ marginBottom: 14 }}>
            <label className="label">Nível de Amargor</label>
            <select
              className="input"
              value={form.amargor}
              onChange={(e) => handleFormChange("amargor", e.target.value)}
            >
              <option value="">Selecione...</option>
              {amargorOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {errors.amargor && <p className="err-msg">{errors.amargor}</p>}
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
