import { ETAPAS, type Etapa, type Zona } from "@/lib/rede-mock";

export type Ordenacao = "nome" | "maior-ideb" | "menor-ideb" | "menor-participacao";

export type EscolaFinderFiltros = {
  q: string;
  zona: Zona | "";
  etapa: Etapa | "";
  atencao: boolean;
  ordem: Ordenacao;
};

export const zonas: Zona[] = ["Urbana", "Rural"];
export const etapas = ETAPAS;
export const ordenacoes: { value: Ordenacao; label: string }[] = [
  { value: "nome", label: "Nome (A–Z)" },
  { value: "maior-ideb", label: "Maior Ideb" },
  { value: "menor-ideb", label: "Menor Ideb" },
  { value: "menor-participacao", label: "Menor participação" },
];

export function parseFiltros(
  params: Record<string, string | string[] | undefined>,
): EscolaFinderFiltros {
  const read = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : "";
  };
  const zona = read("zona");
  const etapa = read("etapa");
  const ordem = read("ordem");

  return {
    q: read("q"),
    zona: zonas.includes(zona as Zona) ? (zona as Zona) : "",
    etapa: etapas.includes(etapa as Etapa) ? (etapa as Etapa) : "",
    atencao: read("atencao") === "1",
    ordem: ordenacoes.some((o) => o.value === ordem) ? (ordem as Ordenacao) : "nome",
  };
}
