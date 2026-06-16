import { useState } from "react";
import { useLocalState, uid } from "../models/useLocalState";
import { DEFAULT_ESTILOS, amargorColors, amargorOptions } from "../models/estiloModel";

/**
 * Hook Controlador para gerenciar as operações de CRUD de Estilos.
 */
export function useEstilosController() {
  const [estilos, setEstilos] = useLocalState("brewery_estilos", DEFAULT_ESTILOS);
  const [modal, setModal] = useState(null); // nulo | "new" | {id, nome, origem, amargor}
  const [form, setForm] = useState({ nome: "", origem: "", amargor: "" });
  const [errors, setErrors] = useState({});

  const openNew = () => {
    setForm({ nome: "", origem: "", amargor: "" });
    setErrors({});
    setModal("new");
  };

  const openEdit = (style) => {
    setForm({ nome: style.nome, origem: style.origem, amargor: style.amargor });
    setErrors({});
    setModal(style);
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
    if (!form.origem.trim()) e.origem = "Origem obrigatória";
    if (!form.amargor) e.amargor = "Selecione o amargor";
    return e;
  };

  const salvar = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (modal === "new") {
      setEstilos([...estilos, { id: uid(), ...form }]);
    } else {
      setEstilos(estilos.map((x) => (x.id === modal.id ? { ...x, ...form } : x)));
    }
    setModal(null);
  };

  const excluir = (id) => {
    if (confirm("Excluir este estilo?")) {
      setEstilos(estilos.filter((x) => x.id !== id));
    }
  };

  return {
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
  };
}
