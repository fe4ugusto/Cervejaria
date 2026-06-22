import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useLocalState } from "../models/useLocalState";

const DEFAULT_ESTILOS = [
  { id: "1", nome: "IPA", origem: "Inglaterra", amargor: "Alto" },
  { id: "2", nome: "Stout", origem: "Irlanda", amargor: "Médio" },
  { id: "3", nome: "Weizen", origem: "Alemanha", amargor: "Baixo" },
];

const DEFAULT_CERVEJAS = [
  { id: "1", nome: "Amarillo Hop", estiloId: "1", ibu: 45, abv: 6.5, preco: 18.9 },
  { id: "2", nome: "Dark Night", estiloId: "2", ibu: 30, abv: 5.0, preco: 16.5 },
  { id: "3", nome: "Weiss Sonnen", estiloId: "3", ibu: 12, abv: 4.8, preco: 14.0 },
];

export function useCervejasController() {
  const [estilos, setEstilos] = useState(DEFAULT_ESTILOS);
  const [cervejas, setCervejas] = useState(DEFAULT_CERVEJAS);
  const [localEstilos] = useLocalState("brewery_estilos", DEFAULT_ESTILOS);
  const [localCervejas] = useLocalState("brewery_cervejas", DEFAULT_CERVEJAS);

  useEffect(() => {
    let unsubscribeEstilos = null;
    let unsubscribeCervejas = null;

    try {
      const estilosRef = collection(db, "estilos");
      const cervejasRef = collection(db, "cervejas");

      unsubscribeEstilos = onSnapshot(
        estilosRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          if (data.length) {
            setEstilos(data);
          }
        },
        () => {
          setEstilos(localEstilos);
        }
      );

      unsubscribeCervejas = onSnapshot(
        cervejasRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          if (data.length) {
            setCervejas(data);
          }
        },
        () => {
          setCervejas(localCervejas);
        }
      );
    } catch (error) {
      setEstilos(localEstilos);
      setCervejas(localCervejas);
    }

    return () => {
      if (unsubscribeEstilos) unsubscribeEstilos();
      if (unsubscribeCervejas) unsubscribeCervejas();
    };
  }, [localEstilos, localCervejas]);

  const getEstilo = (id) => estilos.find((e) => e.id === id)?.nome || "—";

  return {
    cervejas,
    estilos,
    getEstilo,
  };
}
