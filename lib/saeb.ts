export type Disciplina = "LP" | "MT";
export type AnoSaeb = 2 | 5 | 9;

export const ANOS_SAEB: AnoSaeb[] = [2, 5, 9];

export const DISCIPLINAS: { codigo: Disciplina; nome: string }[] = [
  { codigo: "LP", nome: "Língua Portuguesa" },
  { codigo: "MT", nome: "Matemática" },
];

/** Participação mínima no Saeb para o resultado ser considerado representativo. */
export const PARTICIPACAO_MINIMA_SAEB = 80;

/**
 * Taxa de aprovação (Censo Escolar) mínima para a escola atender à
 * condicionante de fluxo do VAAR: abaixo disso, reprovação/abandono alto
 * compromete o valor agregado mesmo com proficiência em alta (demonstração).
 */
export const APROVACAO_MINIMA_VAAR = 90;

// ---------------------------------------------------------------------------
// Condicionalidade III do VAAR (Fundeb, Lei nº 14.113/2020, art. 14, § 1º,
// inciso III) — redução das desigualdades educacionais socioeconômicas e
// raciais, conforme a Nota Técnica nº 2/2026/CGEFE/DIRED-INEP.
// ---------------------------------------------------------------------------

export type AnoVaar = 5 | 9;

/** Ponto de corte do desempenho "adequado" na escala do Saeb (Tabela 1 da Nota Técnica). */
export const PONTO_CORTE_ADEQUADO_VAAR: Record<AnoVaar, Record<Disciplina, number>> = {
  5: { LP: 200, MT: 225 },
  9: { LP: 275, MT: 300 },
};

/** Patamar a partir do qual uma queda na proporção de adequados é tratada como neutra ("efeito teto"). */
export const TETO_VAAR = 90;

/**
 * Faixa de flutuação (Tabela 2): quanto menor o nº de estudantes avaliados,
 * maior a queda (em pontos percentuais) ainda considerada estabilidade, não
 * queda real. Ordenada do maior para o menor "número médio de estudantes".
 */
const FAIXAS_FLUTUACAO_VAAR: { maisQue: number; faixaPP: number }[] = [
  { maisQue: 10000, faixaPP: -1 },
  { maisQue: 1000, faixaPP: -2.5 },
  { maisQue: 500, faixaPP: -5 },
  { maisQue: 200, faixaPP: -7.5 },
  { maisQue: 100, faixaPP: -10 },
  { maisQue: 0, faixaPP: -15 },
];

/** Faixa de flutuação (em p.p., valor negativo) aplicável a `numEstudantes` estudantes avaliados. */
export function faixaFlutuacaoVaar(numEstudantes: number) {
  for (const faixa of FAIXAS_FLUTUACAO_VAAR) {
    if (numEstudantes > faixa.maisQue) return faixa.faixaPP;
  }
  return FAIXAS_FLUTUACAO_VAAR[FAIXAS_FLUTUACAO_VAAR.length - 1].faixaPP;
}

type EscalaConfig = {
  /** Início do Nível 1; abaixo disso é Nível 0. Cada nível tem 25 pontos. */
  inicioNivel1: number;
  niveis: number;
  /** Cortes Abaixo do Básico | Básico | Adequado | Avançado. */
  cortesPadroes: [number, number, number];
};

export const ESCALA_SAEB: Record<AnoSaeb, Record<Disciplina, EscalaConfig>> = {
  2: {
    LP: { inicioNivel1: 75, niveis: 6, cortesPadroes: [100, 125, 150] },
    MT: { inicioNivel1: 75, niveis: 6, cortesPadroes: [100, 130, 160] },
  },
  5: {
    LP: { inicioNivel1: 125, niveis: 9, cortesPadroes: [150, 200, 250] },
    MT: { inicioNivel1: 125, niveis: 10, cortesPadroes: [175, 225, 275] },
  },
  9: {
    LP: { inicioNivel1: 200, niveis: 8, cortesPadroes: [200, 275, 325] },
    MT: { inicioNivel1: 200, niveis: 9, cortesPadroes: [225, 300, 350] },
  },
};

export const PADROES = ["Abaixo do Básico", "Básico", "Adequado", "Avançado"] as const;
export type Padrao = (typeof PADROES)[number];

/** Desvio-padrão típico da proficiência dos alunos dentro de uma escola (mock). */
const DESVIO_ALUNOS = 45;

export type ResultadoSaeb = {
  ano: AnoSaeb;
  alunosAvaliados: number;
  participacao: number;
  /** Taxa de aprovação do ano no Censo Escolar (%). */
  aprovacao: number;
  proficiencia: Record<Disciplina, number>;
};

function normalCdf(x: number) {
  // Aproximação de Abramowitz–Stegun para a função erro.
  const t = 1 / (1 + 0.3275911 * Math.abs(x / Math.SQRT2));
  const erf =
    1 -
    t *
      (0.254829592 +
        t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) *
      Math.exp(-(x * x) / 2);
  return x >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}

/** Percentual de alunos entre dois pontos da escala, supondo distribuição normal (mock). */
function percentualEntre(media: number, de: number, ate: number) {
  const acima = (ponto: number) =>
    Number.isFinite(ponto) ? 1 - normalCdf((ponto - media) / DESVIO_ALUNOS) : ponto > 0 ? 0 : 1;
  return (acima(de) - acima(ate)) * 100;
}

export function distribuicaoPadroes(ano: AnoSaeb, disciplina: Disciplina, media: number) {
  const [basico, proficiente, avancado] = ESCALA_SAEB[ano][disciplina].cortesPadroes;
  const limites = [-Infinity, basico, proficiente, avancado, Infinity];

  return PADROES.map((padrao, i) => ({
    padrao,
    intervalo:
      i === 0
        ? `< ${limites[1]}`
        : i === PADROES.length - 1
          ? `≥ ${limites[i]}`
          : `${limites[i]}–${limites[i + 1]}`,
    percentual: percentualEntre(media, limites[i], limites[i + 1]),
  }));
}

/** % de alunos com aprendizado adequado (Adequado + Avançado). */
export function aprendizadoAdequado(ano: AnoSaeb, disciplina: Disciplina, media: number) {
  const [, proficiente] = ESCALA_SAEB[ano][disciplina].cortesPadroes;
  return percentualEntre(media, proficiente, Infinity);
}

export function distribuicaoNiveis(ano: AnoSaeb, disciplina: Disciplina, media: number) {
  const { inicioNivel1, niveis } = ESCALA_SAEB[ano][disciplina];

  return Array.from({ length: niveis + 1 }, (_, nivel) => {
    const de = nivel === 0 ? -Infinity : inicioNivel1 + (nivel - 1) * 25;
    const ate = nivel === niveis ? Infinity : inicioNivel1 + nivel * 25;
    return {
      nivel,
      intervalo:
        nivel === 0 ? `< ${inicioNivel1}` : nivel === niveis ? `≥ ${de}` : `${de}–${ate}`,
      percentual: percentualEntre(media, de, ate),
    };
  });
}

export function padraoDaProficiencia(ano: AnoSaeb, disciplina: Disciplina, proficiencia: number): Padrao {
  const cortes = ESCALA_SAEB[ano][disciplina].cortesPadroes;
  return PADROES[cortes.filter((corte) => proficiencia >= corte).length];
}

export function nivelDaProficiencia(ano: AnoSaeb, disciplina: Disciplina, media: number) {
  const { inicioNivel1, niveis } = ESCALA_SAEB[ano][disciplina];
  if (media < inicioNivel1) return 0;
  return Math.min(niveis, Math.floor((media - inicioNivel1) / 25) + 1);
}

export function formatProficiencia(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatPercent(value: number) {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function formatDelta(value: number, format: (n: number) => string = formatProficiencia) {
  return `${value >= 0 ? "+" : "−"}${format(Math.abs(value))}`;
}
