import { useState } from "react";
import { useLocalState, uid } from "../models/useLocalState";
import { DEFAULT_ESTILOS } from "../models/estiloModel";
import { DEFAULT_FORNECEDORES } from "../models/fornecedorModel";
import { DEFAULT_CERVEJAS } from "../models/cervejaModel";

/**
 * Hook Controlador para gerenciar as operações de CRUD de Cervejas.
 */
export function useCervejasController() {
  const [estilos] = useLocalState("brewery_estilos", DEFAULT_ESTILOS);
  const [fornecedores] = useLocalState("brewery_fornecedores", DEFAULT_FORNECEDORES);
  const [cervejas, setCervejas] = useLocalState("brewery_cervejas", DEFAULT_CERVEJAS);

  const [modal, setModal] = useState(null); // nulo | "new" | {id, nome, estiloId, fornecedorId, ibu, abv, preco}
  const [form, setForm] = useState({ nome: "", estiloId: "", fornecedorId: "", ibu: "", abv: "", preco: "" });
  const [errors, setErrors] = useState({});

  const openNew = () => {
    setForm({ nome: "", estiloId: "", fornecedorId: "", ibu: "", abv: "", preco: "" });
    setErrors({});
    setModal("new");
  };

  const openEdit = (c) => {
    setForm({
      nome: c.nome,
      estiloId: c.estiloId,
      fornecedorId: c.fornecedorId,
      ibu: c.ibu,
      abv: c.abv,
      preco: c.preco
    });
    setErrors({});
    setModal(c);
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
    if (!form.estiloId) e.estiloId = "Selecione o estilo";
    if (!form.fornecedorId) e.fornecedorId = "Selecione o fornecedor";
    if (form.ibu === "" || isNaN(form.ibu) || Number(form.ibu) < 0) e.ibu = "IBU inválido";
    if (form.abv === "" || isNaN(form.abv) || Number(form.abv) < 0) e.abv = "ABV inválido";
    if (form.preco === "" || isNaN(form.preco) || Number(form.preco) < 0) e.preco = "Preço inválido";
    return e;
  };

  const salvar = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      ...form,
      ibu: Number(form.ibu),
      abv: Number(form.abv),
      preco: Number(form.preco)
    };

    if (modal === "new") {
      setCervejas([...cervejas, { id: uid(), ...data }]);
    } else {
      setCervejas(cervejas.map((x) => (x.id === modal.id ? { ...x, ...data } : x)));
    }
    setModal(null);
  };

  const excluir = (id) => {
    if (confirm("Excluir esta cerveja?")) {
      setCervejas(cervejas.filter((x) => x.id !== id));
    }
  };

  const getEstilo = (id) => estilos.find((e) => e.id === id)?.nome || "—";
  const getForn = (id) => fornecedores.find((f) => f.id === id)?.nome || "—";

  return {
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
  };
}
