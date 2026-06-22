import { useState } from "react";
import { useLocalState } from "../models/useLocalState";
import { DEFAULT_ESTILOS } from "../models/estiloModel";
import { DEFAULT_FORNECEDORES } from "../models/fornecedorModel";
import { DEFAULT_CERVEJAS } from "../models/cervejaModel";

/**
 * Hook Controlador para gerenciar a agregação, junção (JOIN) e estatísticas do Relatório de Cervejas.
 */
export function useRelatorioController() {
  const [cervejas] = useLocalState("brewery_cervejas", DEFAULT_CERVEJAS);
  const [estilos] = useLocalState("brewery_estilos", DEFAULT_ESTILOS);
  const [fornecedores] = useLocalState("brewery_fornecedores", DEFAULT_FORNECEDORES);
  
  const [filtroEstilo, setFiltroEstilo] = useState("");

  const joined = cervejas
    .map((c) => {
      const estilo = estilos.find((e) => e.id === c.estiloId) || {};
      const fornecedor = fornecedores.find((f) => f.id === c.fornecedorId) || {};
      return {
        ...c,
        estiloNome: estilo.nome || "—",
        amargor: estilo.amargor || "—",
        origem: estilo.origem || "—",
        fornecedorNome: fornecedor.nome || "—",
        fornecedorCidade: fornecedor.cidade || "—"
      };
    })
    .filter((c) => !filtroEstilo || c.estiloId === filtroEstilo);

  const totalCervejas = joined.length;
  
  const mediaAbv =
    totalCervejas > 0
      ? (joined.reduce((s, c) => s + Number(c.abv), 0) / totalCervejas).toFixed(2)
      : "0.00";

  const precoMedio =
    totalCervejas > 0
      ? (joined.reduce((s, c) => s + Number(c.preco), 0) / totalCervejas).toFixed(2)
      : "0.00";

  return {
    joined,
    estilos,
    filtroEstilo,
    setFiltroEstilo,
    totalCervejas,
    mediaAbv,
    precoMedio
  };
}
