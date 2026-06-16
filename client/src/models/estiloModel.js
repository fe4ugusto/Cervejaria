/**
 * Modelo de Estilos (Estilo Model)
 * Define os valores padrão e esquemas para os Estilos de Cerveja.
 */

export const DEFAULT_ESTILOS = [
  { id: "1", nome: "IPA", origem: "Inglaterra", amargor: "Alto" },
  { id: "2", nome: "Stout", origem: "Irlanda", amargor: "Médio" },
  { id: "3", nome: "Weizen", origem: "Alemanha", amargor: "Baixo" },
];

export const amargorColors = {
  "Baixo": "#22c55e",
  "Médio": "#f59e0b",
  "Alto": "#f97316",
  "Muito Alto": "#ef4444"
};

export const amargorOptions = ["Baixo", "Médio", "Alto", "Muito Alto"];
