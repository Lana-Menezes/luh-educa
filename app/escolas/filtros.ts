import { type Zona } from "@/lib/mock-data";
import { ANOS_SAEB, type AnoSaeb } from "@/lib/saeb";

export type Ordenacao = "nome" | "maior-proficiencia" | "menor-proficiencia" | "menor-participacao";

export type EscolaFinderFiltros = {
  q: string;
  /** Vazio = todas as zonas. */
  zona: Zona[];
  /** Vazio = todos os anos. */
  ano: AnoSaeb[];
  atencao: boolean;
  ordem: Ordenacao;
};

export const zonas: Zona[] = ["Urbana", "Rural"];
export const anos = ANOS_SAEB;
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
  const readAnoList = (key: string): AnoSaeb[] => {
    const valores = read(key).split(",").map((v) => Number(v.trim()));
    return anos.filter((ano) => valores.includes(ano));
  };
  const ordem = read("ordem");

  return {
    q: read("q"),
    zona: readList("zona", zonas),
    ano: readAnoList("ano"),
    atencao: read("atencao") === "1",
    ordem: ordenacoes.some((o) => o.value === ordem) ? (ordem as Ordenacao) : "nome",
  };
}
