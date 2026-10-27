import { DISCIPLINAS, type Disciplina } from "@/lib/saeb";

/**
 * Provas aplicadas pela LUH Educa ao longo do ano letivo, do 1º ao 9º ano:
 * 1 diagnóstica, 8 formativas e 1 somativa, em Língua Portuguesa e Matemática.
 * Os PDFs são um modelo de demonstração até a integração com os arquivos reais.
 */
export type TipoAvaliacao = "Diagnóstica" | "Formativa" | "Somativa";

export type Serie = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const SERIES: Serie[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function nomeSerie(serie: Serie) {
  return `${serie}º Ano`;
}

const MESES_FORMATIVAS: { nome: string; numero: number }[] = [
  { nome: "Março", numero: 3 },
  { nome: "Abril", numero: 4 },
  { nome: "Maio", numero: 5 },
  { nome: "Junho", numero: 6 },
  { nome: "Agosto", numero: 8 },
  { nome: "Setembro", numero: 9 },
  { nome: "Outubro", numero: 10 },
  { nome: "Novembro", numero: 11 },
];

export type CicloAvaliativo = {
  tipo: TipoAvaliacao;
  /** 1 para Diagnóstica/Somativa; 1–8 para Formativa. */
  ordem: number;
  periodo: string;
  mes: number;
};

/**
 * Calendário de aplicação do ano letivo: 1 diagnóstica, 8 formativas e 1
 * somativa. Compartilhado entre as provas (por série) e os resultados por
 * turma/estudante (lib/turmas-mock.ts), para manter os nomes e meses alinhados.
 */
export const CICLOS_AVALIATIVOS: CicloAvaliativo[] = [
  { tipo: "Diagnóstica", ordem: 1, periodo: "Fevereiro", mes: 2 },
  ...MESES_FORMATIVAS.map(({ nome, numero }, i) => ({
    tipo: "Formativa" as const,
    ordem: i + 1,
    periodo: nome,
    mes: numero,
  })),
  { tipo: "Somativa", ordem: 1, periodo: "Dezembro", mes: 12 },
];

export function tituloCiclo(ciclo: Pick<CicloAvaliativo, "tipo" | "ordem">) {
  return ciclo.tipo === "Formativa" ? `${ciclo.tipo} ${ciclo.ordem}` : ciclo.tipo;
}

export type Avaliacao = {
  id: string;
  serie: Serie;
  tipo: TipoAvaliacao;
  /** 1 para Diagnóstica/Somativa; 1–8 para Formativa. */
  ordem: number;
  disciplina: Disciplina;
  titulo: string;
  periodo: string;
  arquivoUrl: string;
  arquivoNome: string;
};

function construirAvaliacoes(serie: Serie): Avaliacao[] {
  return CICLOS_AVALIATIVOS.flatMap(({ tipo, ordem, periodo }) =>
    DISCIPLINAS.map(({ codigo, nome }) => ({
      id: `${serie}-${tipo.toLowerCase()}-${ordem}-${codigo.toLowerCase()}`,
      serie,
      tipo,
      ordem,
      disciplina: codigo,
      titulo: `${tituloCiclo({ tipo, ordem })} · ${nome}`,
      periodo,
      arquivoUrl: "/provas/modelo-prova.pdf",
      arquivoNome: `${serie}ano-${tipo.toLowerCase()}${tipo === "Formativa" ? ordem : ""}-${codigo.toLowerCase()}.pdf`,
    })),
  );
}

export const AVALIACOES_POR_SERIE: Record<Serie, Avaliacao[]> = Object.fromEntries(
  SERIES.map((serie) => [serie, construirAvaliacoes(serie)]),
) as Record<Serie, Avaliacao[]>;

export function getAvaliacoes(serie: Serie) {
  return AVALIACOES_POR_SERIE[serie];
}

export function agruparPorTipo(avaliacoes: Avaliacao[]) {
  const porOrdem = (a: Avaliacao, b: Avaliacao) => a.ordem - b.ordem;

  return {
    diagnostica: avaliacoes.filter((a) => a.tipo === "Diagnóstica").sort(porOrdem),
    formativas: avaliacoes.filter((a) => a.tipo === "Formativa").sort(porOrdem),
    somativa: avaliacoes.filter((a) => a.tipo === "Somativa").sort(porOrdem),
  };
}

export function isSerie(value: string): value is `${Serie}` {
  return SERIES.some((serie) => String(serie) === value);
}

export const TOTAL_AVALIACOES_POR_SERIE = 10;
