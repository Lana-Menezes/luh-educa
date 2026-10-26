export type Etapa = "Anos Iniciais" | "Anos Finais";
export type Disciplina = "LP" | "MT";
export type AnoSaeb = 5 | 9;

export const ANO_POR_ETAPA: Record<Etapa, AnoSaeb> = {
  "Anos Iniciais": 5,
  "Anos Finais": 9,
};

export const DISCIPLINAS: { codigo: Disciplina; nome: string }[] = [
  { codigo: "LP", nome: "Língua Portuguesa" },
  { codigo: "MT", nome: "Matemática" },
];

/** O Ideb não é divulgado quando menos de 80% dos alunos participam do Saeb. */
export const PARTICIPACAO_MINIMA_IDEB = 80;

type EscalaConfig = {
  /** Início do Nível 1; abaixo disso é Nível 0. Cada nível tem 25 pontos. */
  inicioNivel1: number;
  niveis: number;
  /** Cortes Insuficiente | Básico | Proficiente | Avançado. */
  cortesPadroes: [number, number, number];
  /** Limites usados pelo Inep para padronizar a proficiência no Ideb (0–10). */
  limitesIdeb: [number, number];
};

export const ESCALA_SAEB: Record<AnoSaeb, Record<Disciplina, EscalaConfig>> = {
  5: {
    LP: { inicioNivel1: 125, niveis: 9, cortesPadroes: [150, 200, 250], limitesIdeb: [49, 324] },
    MT: { inicioNivel1: 125, niveis: 10, cortesPadroes: [175, 225, 275], limitesIdeb: [60, 322] },
  },
  9: {
    LP: { inicioNivel1: 200, niveis: 8, cortesPadroes: [200, 275, 325], limitesIdeb: [100, 400] },
    MT: { inicioNivel1: 200, niveis: 9, cortesPadroes: [225, 300, 350], limitesIdeb: [100, 400] },
  },
};

export const PADROES = ["Insuficiente", "Básico", "Proficiente", "Avançado"] as const;
export type Padrao = (typeof PADROES)[number];

/** Desvio-padrão típico da proficiência dos alunos dentro de uma escola (mock). */
const DESVIO_ALUNOS = 45;

export type ResultadoSaeb = {
  ano: AnoSaeb;
  alunosAvaliados: number;
  participacao: number;
  /** Taxa de aprovação da etapa no Censo Escolar (%). */
  aprovacao: number;
  proficiencia: Record<Disciplina, number>;
};

export function notaPadronizada(ano: AnoSaeb, disciplina: Disciplina, proficiencia: number) {
  const [inferior, superior] = ESCALA_SAEB[ano][disciplina].limitesIdeb;
  const nota = ((proficiencia - inferior) / (superior - inferior)) * 10;
  return Math.min(10, Math.max(0, nota));
}

/** Ideb = N (média das notas padronizadas de LP e MT) × P (aprovação, 0–1). */
export function calcularIdeb(resultado: ResultadoSaeb) {
  const notaLP = notaPadronizada(resultado.ano, "LP", resultado.proficiencia.LP);
  const notaMT = notaPadronizada(resultado.ano, "MT", resultado.proficiencia.MT);
  const N = (notaLP + notaMT) / 2;
  const P = resultado.aprovacao / 100;

  return {
    notaLP,
    notaMT,
    N,
    P,
    ideb: Math.round(N * P * 10) / 10,
    divulgado: resultado.participacao >= PARTICIPACAO_MINIMA_IDEB,
  };
}

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

/** % de alunos com aprendizado adequado (Proficiente + Avançado). */
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

export function formatIdeb(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatPercent(value: number) {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function formatDelta(value: number, format: (n: number) => string = formatProficiencia) {
  return `${value >= 0 ? "+" : "−"}${format(Math.abs(value))}`;
}
