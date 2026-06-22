import React from "react";
import { useFornecedoresController } from "../../controllers/useFornecedoresController";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";

export default function FornecedoresPage() {
  const {
    filtrados,
    modal,
    form,
    errors,
    busca,
    setBusca,
    openNew,
    openEdit,
    closeModal,
    handleFormChange,
    salvar,
    excluir
  } = useFornecedoresController();

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">🚚 Fornecedores</h2>
        <Button onClick={openNew}>+ Novo Fornecedor</Button>
      </div>

      <input
        className="input"
        style={{ marginBottom: 20 }}
        placeholder="🔍 Buscar por nome ou cidade..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {filtrados.length === 0 ? (
        <EmptyState msg="Nenhum fornecedor encontrado." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {["Fornecedor", "Contato", "Cidade", "Status", "Ações"].map((h) => (
                  <th key={h} className="th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((f) => (
                <tr key={f.id} className="tr">
                  <td className="td">
                    <strong>{f.nome}</strong>
                  </td>
                  <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: "#ccc" }}>
                    {f.contato}
                  </td>
                  <td className="td">{f.cidade}</td>
                  <td className="td">
                    <Badge color={f.ativo ? "#22c55e" : "#888"}>
                      {f.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button variant="ghost" small onClick={() => openEdit(f)}>
                        ✏️
                      </Button>
                      <Button variant="danger" small onClick={() => excluir(f.id)}>
                        🗑
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal === "new" ? "Novo Fornecedor" : "Editar Fornecedor"}
          onClose={closeModal}
        >
          <Input
            label="Nome da Empresa"
            placeholder="ex: HopsBrasil"
            value={form.nome}
            onChange={(e) => handleFormChange("nome", e.target.value)}
            error={errors.nome}
          />
          <Input
            label="E-mail de Contato"
            placeholder="ex: contato@empresa.com"
            value={form.contato}
            onChange={(e) => handleFormChange("contato", e.target.value)}
            error={errors.contato}
          />
          <Input
            label="Cidade"
            placeholder="ex: São Paulo"
            value={form.cidade}
            onChange={(e) => handleFormChange("cidade", e.target.value)}
            error={errors.cidade}
          />
          <div style={{ marginBottom: 14 }}>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.ativo ? "1" : "0"}
              onChange={(e) => handleFormChange("ativo", e.target.value === "1")}
            >
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
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
