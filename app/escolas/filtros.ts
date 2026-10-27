import { ETAPAS, type Etapa, type Zona } from "@/lib/mock-data";

export type Ordenacao = "nome" | "maior-proficiencia" | "menor-proficiencia" | "menor-participacao";

export type EscolaFinderFiltros = {
  q: string;
  /** Vazio = todas as zonas. */
  zona: Zona[];
  /** Vazio = todas as etapas. */
  etapa: Etapa[];
  atencao: boolean;
  ordem: Ordenacao;
};

export const zonas: Zona[] = ["Urbana", "Rural"];
export const etapas = ETAPAS;
export const ordenacoes: { value: Ordenacao; label: string }[] = [
  { value: "nome", label: "Nome (A–Z)" },
  { value: "maior-proficiencia", label: "Maior proficiência" },
  { value: "menor-proficiencia", label: "Menor proficiência" },
  { value: "menor-participacao", label: "Menor participação" },
];

export function parseFiltros(
  params: Record<string, string | string[] | undefined>,
): EscolaFinderFiltros {
  const read = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : "";
  };
  const readList = <T extends string>(key: string, validos: readonly T[]): T[] => {
    const valores = read(key).split(",").map((v) => v.trim());
    return validos.filter((v) => valores.includes(v));
  };
  const ordem = read("ordem");

  return {
    q: read("q"),
    zona: readList("zona", zonas),
    etapa: readList("etapa", etapas),
    atencao: read("atencao") === "1",
    ordem: ordenacoes.some((o) => o.value === ordem) ? (ordem as Ordenacao) : "nome",
  };
}
