import { CICLOS_AVALIATIVOS, tituloCiclo } from "@/lib/avaliacoes-mock";
import { etapasDaEscola, redeMock, type EscolaRede } from "@/lib/rede-mock";
import {
  ANO_POR_ETAPA,
  DISCIPLINAS,
  PADROES,
  PARTICIPACAO_MINIMA_SAEB,
  padraoDaProficiencia,
  type AnoSaeb,
  type Disciplina,
  type Etapa,
  type Padrao,
} from "@/lib/saeb";

/**
 * Avaliações aplicadas pela LUH Educa na rede, com resultados por estudante
 * na escala Saeb: 1 diagnóstica, 8 formativas e 1 somativa, no mesmo
 * calendário das provas (lib/avaliacoes-mock.ts). O Saeb oficial (Inep) só
 * divulga resultados por escola; o acompanhamento mês a mês por turma e
 * estudante vem destas avaliações.
 */
export const AVALIACOES = CICLOS_AVALIATIVOS.map((ciclo) => ({
  id: `${ciclo.tipo.toLowerCase()}-${ciclo.ordem}`,
  nome: tituloCiclo(ciclo),
  periodo: ciclo.periodo,
  data: `2026-${String(ciclo.mes).padStart(2, "0")}-15`,
}));

export const AVALIACAO_ATUAL = AVALIACOES[AVALIACOES.length - 1];

/** Índice válido de AVALIACOES a partir de um parâmetro de busca; padrão: a mais recente. */
export function indiceAvaliacao(param?: string) {
  const i = Number(param);
  if (!Number.isInteger(i) || i < 0 || i >= AVALIACOES.length) {
    return AVALIACOES.length - 1;
  }
  return i;
}

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
  const quantidade = Math.min(3, Math.max(1, Math.round(matriculados / ALUNOS_POR_TURMA)));
  const rand = rng(key);

  const turmas = Array.from({ length: quantidade }, (_, i): Turma => {
    const letra = String.fromCharCode(65 + i);
    const tamanho = Math.round(matriculados / quantidade + (rand() - 0.5) * 4);
    const efeitoTurma = normal(rand) * 10;
    const participacaoTurma = Math.min(1, resultado.participacao / 100 + (rand() - 0.5) * 0.08);

    const alunos = Array.from({ length: tamanho }, (_, j): Aluno => {
      const habilidade = normal(rand) * 40;
      // Ponto de partida (Diagnóstica) abaixo do nível final, para haver espaço de recomposição.
      const atraso = 18 + rand() * 24;
      let atualLP = resultado.proficiencia.LP + efeitoTurma + habilidade - atraso;
      let atualMT = resultado.proficiencia.MT + efeitoTurma + habilidade - atraso;

      const resultados = AVALIACOES.map((_, k) => {
        if (k > 0) {
          // Caminhada com viés positivo: cada avaliação tende a vir melhor que a anterior.
          atualLP += 1.5 + rand() * 3.5 + normal(rand) * 1.2;
          atualMT += 1.5 + rand() * 3.5 + normal(rand) * 1.2;
        }

        const ultima = k === AVALIACOES.length - 1;
        const presente = ultima ? rand() < participacaoTurma : rand() < 0.95;
        if (!presente) return null;
        return {
          LP: Math.round(atualLP * 10) / 10,
          MT: Math.round(atualMT * 10) / 10,
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

/** Presente na avaliação (padrão: a mais recente) e no padrão Abaixo do Básico em LP ou MT. */
export function estaInsuficiente(
  aluno: Aluno,
  ano: AnoSaeb,
  avaliacaoIndex: number = AVALIACOES.length - 1,
) {
  const resultado = aluno.resultados[avaliacaoIndex] ?? null;
  return (
    resultado !== null &&
    DISCIPLINAS.some(({ codigo }) => padraoDaProficiencia(ano, codigo, resultado[codigo]) === "Abaixo do Básico")
  );
}

export type ResumoAvaliacao = {
  matriculados: number;
  avaliados: number;
  participacao: number;
  media: Proficiencias;
  padroes: Record<Disciplina, Record<Padrao, number>>;
  /** % de estudantes avaliados em Adequado ou Avançado. */
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
    adequado[codigo] = ((padroes[codigo].Adequado + padroes[codigo].Avançado) / n) * 100;
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

export type MotivoAtencao = { etapa: Etapa; motivo: string };

/**
 * Ordem fixa de prioridade (mock), da escola que mais demora a sair do grupo
 * "precisa de atenção" até a que sai primeiro — refletindo as escolas com
 * menor participação/desempenho no cadastro (lib/rede-mock.ts). Combinada com
 * `contagemAtencao`, garante que a rede comece com 8 escolas em atenção na
 * Diagnóstica e termine com 2 na Somativa, à medida que o desempenho melhora.
 */
const ORDEM_PRIORIDADE_ATENCAO = [
  "emef-joao-guimaraes-rosa",
  "em-rural-boa-vista-da-serra",
  "em-rural-corrego-fundo",
  "em-paulo-freire",
  "em-tiradentes",
  "emef-dom-pedro-ii",
  "em-sao-sebastiao",
  "emef-monteiro-lobato",
  "em-anisio-teixeira",
  "em-professora-maria-das-dores",
  "em-cecilia-meireles",
  "em-rural-santo-antonio",
];

/** Quantas escolas devem estar em atenção numa avaliação: 8 na primeira, caindo até 2 na última. */
function contagemAtencao(avaliacaoIndex: number) {
  const inicio = 8;
  const fim = 2;
  const passos = AVALIACOES.length - 1;
  return Math.round(inicio - ((inicio - fim) * avaliacaoIndex) / passos);
}

function escolaEmAtencao(escolaId: string, avaliacaoIndex: number) {
  const posicao = ORDEM_PRIORIDADE_ATENCAO.indexOf(escolaId);
  return posicao !== -1 && posicao < contagemAtencao(avaliacaoIndex);
}

/**
 * Participação insuficiente ou proficiência abaixo da referência nacional
 * numa avaliação específica. Diferente de `motivosAtencao` (lib/rede-mock.ts),
 * que usa o resultado oficial fixo do Saeb, esta versão acompanha a avaliação
 * selecionada: como o desempenho dos estudantes melhora ao longo do ano, o
 * número de escolas em atenção vai diminuindo nas avaliações mais recentes.
 */
export function motivosAtencaoAvaliacao(escola: EscolaRede, avaliacaoIndex: number): MotivoAtencao[] {
  if (!escolaEmAtencao(escola.id, avaliacaoIndex)) return [];

  const motivos: MotivoAtencao[] = etapasDaEscola(escola).flatMap((etapa) => {
    const ano = ANO_POR_ETAPA[etapa];
    const alunos = getTurmas(escola, etapa).flatMap((turma) => turma.alunos);
    const resumo = resumir(alunos, ano, avaliacaoIndex);
    const referencia = redeMock.referenciaNacional[etapa];
    const motivosEtapa: MotivoAtencao[] = [];

    if (resumo.participacao < PARTICIPACAO_MINIMA_SAEB) {
      motivosEtapa.push({ etapa, motivo: `participação abaixo de ${PARTICIPACAO_MINIMA_SAEB}%` });
    }
    if (resumo.media.LP < referencia.proficiencia.LP || resumo.media.MT < referencia.proficiencia.MT) {
      motivosEtapa.push({ etapa, motivo: "Proficiência abaixo da referência nacional" });
    }
    return motivosEtapa;
  });

  if (motivos.length > 0) return motivos;

  // Mesmo com números já próximos da referência, a escola segue no
  // acompanhamento prioritário até concluir o ciclo de recomposição.
  const etapa = etapasDaEscola(escola)[0];
  return etapa ? [{ etapa, motivo: "Acompanhamento prioritário de recomposição" }] : [];
}

export function precisaAtencaoAvaliacao(escola: EscolaRede, avaliacaoIndex: number) {
  return escolaEmAtencao(escola.id, avaliacaoIndex);
}
