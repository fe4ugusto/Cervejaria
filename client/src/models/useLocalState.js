import { useState } from "react";

/**
 * Hook customizado para gerenciar o estado do React sincronizado com o localStorage.
 * 
 * @param {string} key A chave do localStorage
 * @param {any} initial O valor inicial caso a chave não exista
 * @returns {[any, (val: any) => void]} Estado e a função modificadora (setter)
 */
export function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });

  const set = (v) => {
    setState(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {
      console.error("Failed to persist state to localStorage:", e);
    }
  };

  return [state, set];
}

let _nextId = Date.now();
export const uid = () => String(++_nextId);

