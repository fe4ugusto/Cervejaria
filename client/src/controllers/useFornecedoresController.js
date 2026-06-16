import { useState } from "react";
import { useLocalState, uid } from "../models/useLocalState";
import { DEFAULT_FORNECEDORES } from "../models/fornecedorModel";

/**
 * Hook Controlador para gerenciar as operações de CRUD e filtragem de Fornecedores.
 */
export function useFornecedoresController() {
  const [fornecedores, setFornecedores] = useLocalState("brewery_fornecedores", DEFAULT_FORNECEDORES);
  const [modal, setModal] = useState(null); // nulo | "new" | {id, nome, contato, cidade, ativo}
  const [form, setForm] = useState({ nome: "", contato: "", cidade: "", ativo: true });
  const [errors, setErrors] = useState({});
  const [busca, setBusca] = useState("");

  const filtrados = fornecedores.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cidade.toLowerCase().includes(busca.toLowerCase())
  );

  const openNew = () => {
    setForm({ nome: "", contato: "", cidade: "", ativo: true });
    setErrors({});
    setModal("new");
  };

  const openEdit = (f) => {
    setForm({ nome: f.nome, contato: f.contato, cidade: f.cidade, ativo: f.ativo });
    setErrors({});
    setModal(f);
  };

  const closeModal = () => {
    setModal(null);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.contato.trim()) e.contato = "Contato obrigatório";
    if (!form.cidade.trim()) e.cidade = "Cidade obrigatória";
    return e;
  };

  const salvar = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (modal === "new") {
      setFornecedores([...fornecedores, { id: uid(), ...form }]);
    } else {
      setFornecedores(fornecedores.map((x) => (x.id === modal.id ? { ...x, ...form } : x)));
    }
    setModal(null);
  };

  const excluir = (id) => {
    if (confirm("Excluir este fornecedor?")) {
      setFornecedores(fornecedores.filter((x) => x.id !== id));
    }
  };

  return {
    fornecedores,
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
  };
}
