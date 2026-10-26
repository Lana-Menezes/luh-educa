import { etapasDaEscola, type EscolaRede } from "@/lib/rede-mock";
import {
  ANO_POR_ETAPA,
  DISCIPLINAS,
  PADROES,
  padraoDaProficiencia,
  type AnoSaeb,
  type Disciplina,
  type Etapa,
  type Padrao,
} from "@/lib/saeb";

/**
 * Avaliações aplicadas pela LUH Educa na rede, com resultados por estudante
 * na escala Saeb. O Saeb oficial (Inep) só divulga resultados por escola;
 * o acompanhamento por turma e estudante vem destas avaliações.
 */
export const AVALIACOES = [
  { id: "diagnostica", nome: "Avaliação diagnóstica", data: "2026-03-16" },
  { id: "intermediaria", nome: "Avaliação intermediária", data: "2026-06-15" },
  { id: "simulado", nome: "Simulado Saeb", data: "2026-09-21" },
] as const;

export const AVALIACAO_ATUAL = AVALIACOES[AVALIACOES.length - 1];

export type Proficiencias = Record<Disciplina, number>;

export type Aluno = {
  id: string;
  nome: string;
  /** Proficiência em cada avaliação (mesma ordem de AVALIACOES); null = ausente. */
  resultados: (Proficiencias | null)[];
};

export type Turma = {
  id: string;
  nome: string;
  ano: AnoSaeb;
  etapa: Etapa;
  turno: "Manhã" | "Tarde";
  escolaId: string;
  alunos: Aluno[];
};

const ALUNOS_POR_TURMA = 28;

const PRENOMES = [
  "Ana", "Arthur", "Beatriz", "Bernardo", "Camila", "Davi", "Eduarda", "Enzo",
  "Gabriel", "Giovanna", "Heitor", "Helena", "Isabela", "João", "Júlia", "Kauã",
  "Laura", "Lorena", "Lucas", "Manuela", "Maria Clara", "Matheus", "Miguel", "Nicolas",
  "Pedro", "Rafaela", "Samuel", "Sophia", "Théo", "Valentina", "Vitória", "Yasmin",
];

const SOBRENOMES = [
  "Alves", "Barbosa", "Cardoso", "Carvalho", "Costa", "Dias", "Ferreira", "Gomes",
  "Lima", "Martins", "Melo", "Moreira", "Nascimento", "Oliveira", "Pereira", "Ribeiro",
  "Rocha", "Rodrigues", "Santos", "Silva", "Soares", "Souza", "Teixeira", "Vieira",
];

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Gerador pseudoaleatório determinístico (mulberry32). */
function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(rand: () => number) {
  return Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
}

const cache = new Map<string, Turma[]>();

/** Turmas do ano avaliado da etapa, derivadas do resultado Saeb da escola. */
export function getTurmas(escola: EscolaRede, etapa: Etapa): Turma[] {
  const key = `${escola.id}:${etapa}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const resultado = escola.resultados[etapa];
  if (!resultado) return [];

  const ano = ANO_POR_ETAPA[etapa];
  const matriculados = Math.round(resultado.alunosAvaliados / (resultado.participacao / 100));
  const quantidade = Math.max(1, Math.round(matriculados / ALUNOS_POR_TURMA));
  const rand = rng(key);

  const turmas = Array.from({ length: quantidade }, (_, i): Turma => {
    const letra = String.fromCharCode(65 + i);
    const tamanho = Math.round(matriculados / quantidade + (rand() - 0.5) * 4);
    const efeitoTurma = normal(rand) * 10;
    const participacaoTurma = Math.min(1, resultado.participacao / 100 + (rand() - 0.5) * 0.08);

    const alunos = Array.from({ length: tamanho }, (_, j): Aluno => {
      const habilidade = normal(rand) * 40;
      const crescimento = 8 + rand() * 22;
      const final: Proficiencias = {
        LP: resultado.proficiencia.LP + efeitoTurma + habilidade + normal(rand) * 18,
        MT: resultado.proficiencia.MT + efeitoTurma + habilidade + normal(rand) * 18,
      };
      const resultados = AVALIACOES.map((_, k) => {
        const ultima = k === AVALIACOES.length - 1;
        const presente = ultima ? rand() < participacaoTurma : rand() < 0.95;
        if (!presente) return null;
        const recuo = (crescimento * (AVALIACOES.length - 1 - k)) / (AVALIACOES.length - 1);
        return {
          LP: Math.round((final.LP - recuo + normal(rand) * 6) * 10) / 10,
          MT: Math.round((final.MT - recuo + normal(rand) * 6) * 10) / 10,
        };
      });

      return {
        id: `${hash(escola.codigoInep)}`.slice(-4) + `${ano}${letra}${String(j + 1).padStart(2, "0")}`,
        nome: `${PRENOMES[Math.floor(rand() * PRENOMES.length)]} ${
          SOBRENOMES[Math.floor(rand() * SOBRENOMES.length)]
        } ${SOBRENOMES[Math.floor(rand() * SOBRENOMES.length)]}`,
        resultados,
      };
    });

    return {
      id: `${ano}${letra.toLowerCase()}`,
      nome: `${ano}º ano ${letra}`,
      ano,
      etapa,
      turno: i % 2 === 0 ? "Manhã" : "Tarde",
      escolaId: escola.id,
      alunos: alunos.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    };
  });

  cache.set(key, turmas);
  return turmas;
}

export function etapaDoAno(escola: EscolaRede, ano: number): Etapa | undefined {
  return etapasDaEscola(escola).find((etapa) => ANO_POR_ETAPA[etapa] === ano);
}

export function getTurma(escola: EscolaRede, ano: number, turmaId: string) {
  const etapa = etapaDoAno(escola, ano);
  return etapa ? getTurmas(escola, etapa).find((turma) => turma.id === turmaId) : undefined;
}

export function resultadoAtual(aluno: Aluno) {
  return aluno.resultados[aluno.resultados.length - 1];
}

/** Presente na avaliação mais recente e no padrão Insuficiente em LP ou MT. */
export function estaInsuficiente(aluno: Aluno, ano: AnoSaeb) {
  const atual = resultadoAtual(aluno);
  return (
    atual !== null &&
    DISCIPLINAS.some(({ codigo }) => padraoDaProficiencia(ano, codigo, atual[codigo]) === "Insuficiente")
  );
}

export type ResumoAvaliacao = {
  matriculados: number;
  avaliados: number;
  participacao: number;
  media: Proficiencias;
  padroes: Record<Disciplina, Record<Padrao, number>>;
  /** % de estudantes avaliados em Proficiente ou Avançado. */
  adequado: Proficiencias;
};

/** Resumo de um grupo de estudantes (turma, ano) numa avaliação. */
export function resumir(
  alunos: Aluno[],
  ano: AnoSaeb,
  avaliacao: number = AVALIACOES.length - 1,
): ResumoAvaliacao {
  const presentes = alunos.flatMap((aluno) => aluno.resultados[avaliacao] ?? []);
  const n = Math.max(presentes.length, 1);
  const media = {} as Proficiencias;
  const adequado = {} as Proficiencias;
  const padroes = {} as ResumoAvaliacao["padroes"];

  for (const { codigo } of DISCIPLINAS) {
    media[codigo] = presentes.reduce((sum, p) => sum + p[codigo], 0) / n;
    padroes[codigo] = Object.fromEntries(PADROES.map((p) => [p, 0])) as Record<Padrao, number>;
    for (const p of presentes) padroes[codigo][padraoDaProficiencia(ano, codigo, p[codigo])]++;
    adequado[codigo] = ((padroes[codigo].Proficiente + padroes[codigo].Avançado) / n) * 100;
  }

  return {
    matriculados: alunos.length,
    avaliados: presentes.length,
    participacao: (presentes.length / Math.max(alunos.length, 1)) * 100,
    media,
    padroes,
    adequado,
  };
}

export function formatData(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
}
