import {
  ANOS_SAEB,
  APROVACAO_MINIMA_VAAR,
  DISCIPLINAS,
  PADROES,
  PARTICIPACAO_MINIMA_SAEB,
  PONTO_CORTE_ADEQUADO_VAAR,
  TETO_VAAR,
  faixaFlutuacaoVaar,
  padraoDaProficiencia,
  type AnoSaeb,
  type AnoVaar,
  type Disciplina,
  type ResultadoSaeb,
  type Padrao,
} from "@/lib/saeb";

export type { AnoSaeb } from "@/lib/saeb";

/**
 * Fonte única dos dados mockados da rede: provas por série (avaliacoesPorSerie),
 * escolas e resultados oficiais do Saeb (redeMock), e turmas/estudantes com o
 * acompanhamento mês a mês das avaliações LUH (getTurmas/resumir). Mantidos
 * num só arquivo para que todas as telas usem exatamente os mesmos dados e
 * funções — sem divergência entre painéis.
 */

// ---------------------------------------------------------------------------
// Avaliações (provas) por série — calendário do ano letivo
// ---------------------------------------------------------------------------

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
 * turma/estudante, para manter os nomes e meses alinhados.
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
  /** Data de disponibilização online (YYYY-MM-DD). */
  disponibilizadaEm: string;
  arquivoUrl: string;
  arquivoNome: string;
};

function construirAvaliacoes(serie: Serie): Avaliacao[] {
  return CICLOS_AVALIATIVOS.flatMap(({ tipo, ordem, periodo, mes }) =>
    DISCIPLINAS.map(({ codigo, nome }) => ({
      id: `${serie}-${tipo.toLowerCase()}-${ordem}-${codigo.toLowerCase()}`,
      serie,
      tipo,
      ordem,
      disciplina: codigo,
      titulo: `${tituloCiclo({ tipo, ordem })} · ${nome}`,
      periodo,
      // Datas de exemplo: publicação no início do mês de cada ciclo letivo.
      disponibilizadaEm: `2026-${String(mes).padStart(2, "0")}-01`,
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

export function agruparPorTipo<T extends { tipo: TipoAvaliacao; ordem: number }>(itens: T[]) {
  const porOrdem = (a: T, b: T) => a.ordem - b.ordem;

  return {
    diagnostica: itens.filter((a) => a.tipo === "Diagnóstica").sort(porOrdem),
    formativas: itens.filter((a) => a.tipo === "Formativa").sort(porOrdem),
    somativa: itens.filter((a) => a.tipo === "Somativa").sort(porOrdem),
  };
}

export function isSerie(value: string): value is `${Serie}` {
  return SERIES.some((serie) => String(serie) === value);
}

export const TOTAL_AVALIACOES_POR_SERIE = 10;

// ---------------------------------------------------------------------------
// Planejamento pedagógico (arquivos) por escola e ano — mesma estrutura das
// provas: 1 diagnóstica, 8 formativas e 1 somativa, em LP e MT.
// ---------------------------------------------------------------------------

export type Planejamento = {
  id: string;
  escolaId: string;
  ano: AnoSaeb;
  tipo: TipoAvaliacao;
  /** 1 para Diagnóstica/Somativa; 1–8 para Formativa. */
  ordem: number;
  disciplina: Disciplina;
  titulo: string;
  periodo: string;
  /** Data de disponibilização online (YYYY-MM-DD). */
  disponibilizadaEm: string;
  arquivoUrl: string;
  arquivoNome: string;
};

/**
 * Arquivos de planejamento pedagógico de uma escola, por ano, a partir dos
 * resultados de cada avaliação. Os PDFs são um modelo de demonstração até a
 * integração com os arquivos reais de planejamento.
 */
export function getPlanejamentos(escolaId: string, ano: AnoSaeb): Planejamento[] {
  return CICLOS_AVALIATIVOS.flatMap(({ tipo, ordem, periodo, mes }) =>
    DISCIPLINAS.map(({ codigo, nome }) => ({
      id: `${escolaId}-${ano}-${tipo.toLowerCase()}-${ordem}-${codigo.toLowerCase()}`,
      escolaId,
      ano,
      tipo,
      ordem,
      disciplina: codigo,
      titulo: `${tituloCiclo({ tipo, ordem })} · ${nome}`,
      periodo,
      disponibilizadaEm: `2026-${String(mes).padStart(2, "0")}-01`,
      arquivoUrl: "/provas/modelo-prova.pdf",
      arquivoNome: `${escolaId}-${ano}ano-${tipo.toLowerCase()}${tipo === "Formativa" ? ordem : ""}-${codigo.toLowerCase()}-planejamento.pdf`,
    })),
  );
}

// ---------------------------------------------------------------------------
// Rede, escolas e resultados oficiais do Saeb
// ---------------------------------------------------------------------------

export type Zona = "Urbana" | "Rural";

export type EscolaRede = {
  id: string;
  nome: string;
  codigoInep: string;
  bairro: string;
  zona: Zona;
  resultados: Partial<Record<AnoSaeb, ResultadoSaeb>>;
};

export type ReferenciaSaeb = { proficiencia: Record<Disciplina, number> };

export type RedeMock = {
  nome: string;
  municipio: string;
  uf: string;
  edicao: string;
  /** Valores de referência fictícios para comparação; não são dados oficiais do Inep. */
  referenciaNacional: Record<AnoSaeb, ReferenciaSaeb>;
  escolas: EscolaRede[];
};

function saeb(
  ano: AnoSaeb,
  alunosAvaliados: number,
  participacao: number,
  aprovacao: number,
  LP: number,
  MT: number,
): ResultadoSaeb {
  return { ano, alunosAvaliados, participacao, aprovacao, proficiencia: { LP, MT } };
}

export const redeMock: RedeMock = {
  nome: "Rede Municipal de Ensino",
  municipio: "Mafra",
  uf: "SC",
  edicao: "Saeb 2025",
  referenciaNacional: {
    2: { proficiencia: { LP: 130, MT: 135 } },
    5: { proficiencia: { LP: 210, MT: 220 } },
    9: { proficiencia: { LP: 255, MT: 250 } },
  },
  escolas: [
    {
      id: "em-professora-maria-das-dores",
      nome: "E.M. Professora Maria das Dores",
      codigoInep: "31045821",
      bairro: "Centro",
      zona: "Urbana",
      resultados: {
        2: saeb(2, 230, 93.5, 96.8, 132.9, 141.4),
        5: saeb(5, 238, 94.2, 97.1, 214.3, 228.1),
        9: saeb(9, 248, 91.0, 92.4, 262.4, 258.2),
      },
    },
    {
      id: "emef-dom-pedro-ii",
      nome: "E.M.E.F. Dom Pedro II",
      codigoInep: "31045832",
      bairro: "Vila Nova",
      zona: "Urbana",
      resultados: {
        2: saeb(2, 290, 90.8, 95.0, 127.8, 136.0),
        5: saeb(5, 301, 91.5, 95.8, 206.2, 219.4),
        9: saeb(9, 311, 88.3, 89.7, 254.1, 249.3),
      },
    },
    {
      id: "em-tiradentes",
      nome: "E.M. Tiradentes",
      codigoInep: "31045845",
      bairro: "Santa Efigênia",
      zona: "Urbana",
      resultados: {
        9: saeb(9, 398, 87.2, 86.5, 246.3, 240.8),
      },
    },
    {
      id: "em-cecilia-meireles",
      nome: "E.M. Cecília Meireles",
      codigoInep: "31045857",
      bairro: "Jardim das Flores",
      zona: "Urbana",
      resultados: {
        2: saeb(2, 265, 95.8, 97.9, 136.0, 143.3),
        5: saeb(5, 274, 96.4, 98.2, 219.4, 231.2),
      },
    },
    {
      id: "emef-joao-guimaraes-rosa",
      nome: "E.M.E.F. João Guimarães Rosa",
      codigoInep: "31045869",
      bairro: "São Judas Tadeu",
      zona: "Urbana",
      resultados: {
        2: saeb(2, 250, 80.9, 92.0, 122.8, 128.5),
        5: saeb(5, 262, 82.3, 93.4, 198.1, 207.3),
        9: saeb(9, 269, 76.8, 85.1, 241.2, 235.9),
      },
    },
    {
      id: "em-paulo-freire",
      nome: "E.M. Paulo Freire",
      codigoInep: "31045870",
      bairro: "Nova Esperança",
      zona: "Urbana",
      resultados: {
        9: saeb(9, 447, 86.7, 84.2, 238.4, 232.1),
      },
    },
    {
      id: "em-anisio-teixeira",
      nome: "E.M. Anísio Teixeira",
      codigoInep: "31045882",
      bairro: "Bela Vista",
      zona: "Urbana",
      resultados: {
        2: saeb(2, 172, 92.0, 98.0, 138.5, 146.4),
        5: saeb(5, 180, 93.1, 98.5, 223.4, 236.2),
        9: saeb(9, 185, 92.6, 94.0, 268.1, 266.4),
      },
    },
    {
      id: "em-sao-sebastiao",
      nome: "E.M. São Sebastião",
      codigoInep: "31045894",
      bairro: "Bairro Industrial",
      zona: "Urbana",
      resultados: {
        2: saeb(2, 210, 89.0, 95.3, 129.1, 133.4),
        5: saeb(5, 219, 90.2, 96.0, 208.3, 215.1),
      },
    },
    {
      id: "em-rural-corrego-fundo",
      nome: "E.M. Rural Córrego Fundo",
      codigoInep: "31045903",
      bairro: "Comunidade Córrego Fundo",
      zona: "Rural",
      resultados: {
        2: saeb(2, 60, 87.5, 91.0, 118.5, 123.0),
        5: saeb(5, 64, 89.1, 92.7, 191.2, 198.4),
      },
    },
    {
      id: "em-rural-boa-vista-da-serra",
      nome: "E.M. Rural Boa Vista da Serra",
      codigoInep: "31045915",
      bairro: "Distrito de Boa Vista",
      zona: "Rural",
      resultados: {
        2: saeb(2, 58, 78.0, 90.5, 121.8, 126.0),
        5: saeb(5, 61, 79.6, 91.8, 196.4, 203.2),
        9: saeb(9, 57, 83.4, 87.9, 239.3, 233.1),
      },
    },
    {
      id: "em-rural-santo-antonio",
      nome: "E.M. Rural Santo Antônio",
      codigoInep: "31045927",
      bairro: "Povoado Santo Antônio",
      zona: "Rural",
      resultados: {
        2: saeb(2, 45, 96.5, 96.3, 126.5, 131.6),
        5: saeb(5, 47, 97.9, 97.0, 204.1, 212.3),
      },
    },
    {
      id: "emef-monteiro-lobato",
      nome: "E.M.E.F. Monteiro Lobato",
      codigoInep: "31045939",
      bairro: "Alto da Glória",
      zona: "Urbana",
      resultados: {
        2: saeb(2, 240, 91.5, 96.0, 131.0, 139.1),
        5: saeb(5, 249, 92.8, 96.6, 211.2, 224.3),
        9: saeb(9, 254, 90.1, 91.3, 258.3, 255.1),
      },
    },
  ],
};

export function getEscola(id: string) {
  return redeMock.escolas.find((escola) => escola.id === id);
}

export function anosDaEscola(escola: EscolaRede) {
  return ANOS_SAEB.filter((ano) => escola.resultados[ano]);
}

/** Resultado agregado da rede num ano (médias ponderadas pelo nº de alunos avaliados). */
export function getResultadoRede(ano: AnoSaeb, escolas: EscolaRede[] = redeMock.escolas): ResultadoSaeb {
  const resultados = escolas.flatMap((escola) => escola.resultados[ano] ?? []);
  const alunos = resultados.reduce((sum, r) => sum + r.alunosAvaliados, 0);
  const ponderado = (valor: (r: ResultadoSaeb) => number) =>
    resultados.reduce((sum, r) => sum + valor(r) * r.alunosAvaliados, 0) / Math.max(alunos, 1);

  return {
    ano,
    alunosAvaliados: alunos,
    participacao: ponderado((r) => r.participacao),
    aprovacao: ponderado((r) => r.aprovacao),
    proficiencia: {
      LP: ponderado((r) => r.proficiencia.LP),
      MT: ponderado((r) => r.proficiencia.MT),
    },
  };
}

/** Comparação acento-insensível, para buscas como "corrego" encontrarem "Córrego". */
export function normalizeBusca(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// ---------------------------------------------------------------------------
// Turmas, estudantes e acompanhamento mês a mês das avaliações LUH
// ---------------------------------------------------------------------------

/**
 * Avaliações aplicadas pela LUH Educa na rede, com resultados por estudante
 * na escala Saeb: 1 diagnóstica, 8 formativas e 1 somativa, no mesmo
 * calendário das provas. O Saeb oficial (Inep) só divulga resultados por
 * escola; o acompanhamento mês a mês por turma e estudante vem destas
 * avaliações.
 */
export const AVALIACOES = CICLOS_AVALIATIVOS.map((ciclo) => ({
  id: `${ciclo.tipo.toLowerCase()}-${ciclo.ordem}`,
  nome: tituloCiclo(ciclo),
  periodo: ciclo.periodo,
  data: `2026-${String(ciclo.mes).padStart(2, "0")}-15`,
}));

export const AVALIACAO_ATUAL = AVALIACOES[AVALIACOES.length - 1];

function indiceAvaliacaoValido(valor?: string) {
  const i = Number(valor);
  return Number.isInteger(i) && i >= 0 && i < AVALIACOES.length ? i : undefined;
}

/**
 * Índice válido de AVALIACOES a partir do parâmetro de busca `?avaliacao=`.
 * Se ausente/invalido, usa `fallback` (ex.: o cookie da última avaliação
 * selecionada); sem nenhum dos dois, usa a mais recente.
 */
export function indiceAvaliacao(param?: string, fallback?: string) {
  return indiceAvaliacaoValido(param) ?? indiceAvaliacaoValido(fallback) ?? AVALIACOES.length - 1;
}

export type Proficiencias = Record<Disciplina, number>;

export type Aluno = {
  id: string;
  nome: string;
  /** Proficiência em cada avaliação (mesma ordem de AVALIACOES); null = ausente. */
  resultados: (Proficiencias | null)[];
  /** Pertencimento ao grupo preto, pardo ou indígena (dado do Censo Escolar/Saeb, mock ilustrativo). */
  ppi: boolean;
  /** Escore de nível socioeconômico (Inse, mock ilustrativo, 0–100). */
  nse: number;
};

export type Turma = {
  id: string;
  nome: string;
  ano: AnoSaeb;
  turno: "Manhã" | "Tarde";
  escolaId: string;
  alunos: Aluno[];
};

const ALUNOS_POR_TURMA = 25;

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

/**
 * Oscilação compartilhada por toda a rede em cada avaliação (prova mais
 * difícil, período de provas, etc.), para que o progresso, mesmo agregado
 * por escola ou pela rede inteira, não seja estritamente crescente a cada
 * avaliação — só de modo geral ao longo do ano.
 */
const randRede = rng("oscilacoes-rede");
const ULTIMA_AVALIACAO = AVALIACOES.length - 1;
// Na última avaliação (Somativa), a oscilação nunca é negativa: o fechamento
// do ciclo não deve regredir em relação à avaliação anterior, para o "Progresso
// mês a mês" e a contagem de "escolas que precisam de atenção" não divergirem.
const OSCILACOES_REDE = AVALIACOES.map((_, k) => {
  if (k === 0) return 0;
  const oscilacao = normal(randRede) * 2;
  return k === ULTIMA_AVALIACAO ? Math.max(0, oscilacao) : oscilacao;
});

/** Turmas do ano avaliado, derivadas do resultado Saeb da escola. */
export function getTurmas(escola: EscolaRede, ano: AnoSaeb): Turma[] {
  const key = `${escola.id}:${ano}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const resultado = escola.resultados[ano];
  if (!resultado) return [];

  const matriculados = Math.round(resultado.alunosAvaliados / (resultado.participacao / 100));
  // Amostra demonstrativa de até três turmas, sem reproduzir todas as matrículas do Saeb.
  const quantidade = Math.min(3, Math.max(1, Math.round(matriculados / ALUNOS_POR_TURMA)));
  const rand = rng(key);

  const turmas = Array.from({ length: quantidade }, (_, i): Turma => {
    const letra = String.fromCharCode(65 + i);
    const tamanho = 20 + Math.floor(rand() * 11);
    const efeitoTurma = normal(rand) * 10;
    const participacaoTurma = Math.min(1, resultado.participacao / 100 + (rand() - 0.5) * 0.08);
    // Oscilação compartilhada por avaliação (prova mais difícil, período de provas, etc.):
    // afeta a turma inteira, para o progresso agregado não ser estritamente crescente.
    // Na Somativa (fechamento do ciclo) a oscilação nunca é negativa.
    const oscilacoes = AVALIACOES.map((_, k) => {
      if (k === 0) return 0;
      const oscilacao = normal(rand) * 2.5;
      return k === ULTIMA_AVALIACAO ? Math.max(0, oscilacao) : oscilacao;
    });

    const alunos = Array.from({ length: tamanho }, (_, j): Aluno => {
      const habilidade = normal(rand) * 40;
      // Ponto de partida (Diagnóstica) abaixo do nível final, para haver espaço de recomposição.
      const atraso = 4 + rand() * 5;
      let atualLP = resultado.proficiencia.LP + efeitoTurma + habilidade - atraso;
      let atualMT = resultado.proficiencia.MT + efeitoTurma + habilidade - atraso;

      const resultados = AVALIACOES.map((_, k) => {
        const ultima = k === ULTIMA_AVALIACAO;
        if (k > 0) {
          // Caminhada com viés positivo (melhora no ano), mas com oscilação de turma
          // por avaliação: nem toda avaliação vem melhor que a anterior. Na Somativa,
          // nem o ruído por estudante pode ser negativo — o fechamento do ciclo não regride.
          const ruidoLP = normal(rand) * 1.2;
          const ruidoMT = normal(rand) * 1.2;
          atualLP += 1.9 + rand() * 3.5 + OSCILACOES_REDE[k] + oscilacoes[k] + (ultima ? Math.max(0, ruidoLP) : ruidoLP);
          atualMT += 1.9 + rand() * 3.5 + OSCILACOES_REDE[k] + oscilacoes[k] + (ultima ? Math.max(0, ruidoMT) : ruidoMT);
        }

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
        // Pertencimento racial e escore socioeconômico (mock ilustrativo, gerados
        // após os resultados para não alterar a trajetória de proficiência já calculada).
        ppi: rand() < 0.42,
        nse: Math.round(rand() * 1000) / 10,
      };
    });

    return {
      id: `${ano}${letra.toLowerCase()}`,
      nome: `${ano}º ano ${letra}`,
      ano,
      turno: i % 2 === 0 ? "Manhã" : "Tarde",
      escolaId: escola.id,
      alunos: alunos.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    };
  });

  cache.set(key, turmas);
  return turmas;
}

function isAnoSaeb(ano: number): ano is AnoSaeb {
  return ANOS_SAEB.includes(ano as AnoSaeb);
}

export function anoValidoDaEscola(escola: EscolaRede, ano: number): AnoSaeb | undefined {
  return isAnoSaeb(ano) && anosDaEscola(escola).includes(ano) ? ano : undefined;
}

export function getTurma(escola: EscolaRede, ano: number, turmaId: string) {
  const anoValido = anoValidoDaEscola(escola, ano);
  return anoValido ? getTurmas(escola, anoValido).find((turma) => turma.id === turmaId) : undefined;
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

export type MotivoAtencao = { ano: AnoSaeb; motivo: string };

/**
 * Única fonte de verdade de "precisa de atenção" no app: participação
 * insuficiente ou proficiência abaixo da referência nacional numa avaliação
 * específica, calculada a partir dos mesmos dados (resumir/getTurmas) usados
 * para exibir os números nas telas. Como o desempenho dos estudantes melhora
 * ao longo do ano, o número de escolas em atenção tende a diminuir nas
 * avaliações mais recentes — mas sempre de acordo com os números realmente
 * mostrados, nunca uma contagem separada.
 */
export function motivosAtencaoAvaliacao(escola: EscolaRede, avaliacaoIndex: number): MotivoAtencao[] {
  return anosDaEscola(escola).flatMap((ano) => {
    const alunos = getTurmas(escola, ano).flatMap((turma) => turma.alunos);
    const resumo = resumir(alunos, ano, avaliacaoIndex);
    const referencia = redeMock.referenciaNacional[ano];
    const motivosAno: MotivoAtencao[] = [];

    if (resumo.participacao < PARTICIPACAO_MINIMA_SAEB) {
      motivosAno.push({ ano, motivo: `participação abaixo de ${PARTICIPACAO_MINIMA_SAEB}%` });
    }
    if (resumo.media.LP < referencia.proficiencia.LP || resumo.media.MT < referencia.proficiencia.MT) {
      motivosAno.push({ ano, motivo: "Proficiência abaixo da referência nacional" });
    }
    return motivosAno;
  });
}

export function precisaAtencaoAvaliacao(escola: EscolaRede, avaliacaoIndex: number) {
  return motivosAtencaoAvaliacao(escola, avaliacaoIndex).length > 0;
}

// ---------------------------------------------------------------------------
// Condicionalidade III do VAAR — redução das desigualdades educacionais
// (metodologia da Nota Técnica nº 2/2026/CGEFE/DIRED-INEP), cruzada com o
// Censo Escolar (participação no Saeb e aprovação) para o acompanhamento
// pelas escolas.
// ---------------------------------------------------------------------------

export type GrupoVulnerabilidade = "ppi" | "baixoNse";

export type AlunoComAno = { aluno: Aluno; ano: AnoSaeb };

/** Alunos do 2º, 5º e 9º ano da escola, cada um com o ano a que pertence. */
export function alunosComAnoDaEscola(escola: EscolaRede): AlunoComAno[] {
  return anosDaEscola(escola).flatMap((ano) =>
    getTurmas(escola, ano).flatMap((turma) => turma.alunos.map((aluno) => ({ aluno, ano }))),
  );
}

/** Alunos do 2º, 5º e 9º ano de toda a rede. */
export function alunosComAnoDaRede(rede: RedeMock = redeMock): AlunoComAno[] {
  return rede.escolas.flatMap((escola) => alunosComAnoDaEscola(escola));
}

/** Quantil (método Tipo I/Hyndman-Fan) de uma lista de valores. */
function quantil(valores: number[], fracao: number) {
  if (valores.length === 0) return 0;
  const ordenados = [...valores].sort((a, b) => a - b);
  const posicao = (ordenados.length - 1) * fracao;
  const base = Math.floor(posicao);
  const resto = posicao - base;
  const proximo = ordenados[Math.min(base + 1, ordenados.length - 1)];
  return ordenados[base] + (proximo - ordenados[base]) * resto;
}

function pertenceAoGrupo(item: AlunoComAno, grupo: GrupoVulnerabilidade, limiarNse: number) {
  return grupo === "ppi" ? item.aluno.ppi : item.aluno.nse <= limiarNse;
}

/**
 * Proporção (0–100) de um grupo de estudantes do 5º/9º ano com desempenho
 * adequado (Tabela 1 da Nota Técnica), média entre LP e MT — equações (1) e
 * (2) da metodologia (sem pesos amostrais, dado mockado).
 */
function proporcaoAdequada(itens: AlunoComAno[], avaliacaoIndex: number) {
  let participantes = 0;
  let adequadosLP = 0;
  let adequadosMT = 0;

  for (const { aluno, ano } of itens) {
    if (ano === 2) continue; // Condicionalidade III considera só 5º e 9º do EF
    const resultado = aluno.resultados[avaliacaoIndex];
    if (!resultado) continue;
    const corte = PONTO_CORTE_ADEQUADO_VAAR[ano as AnoVaar];
    participantes++;
    if (resultado.LP > corte.LP) adequadosLP++;
    if (resultado.MT > corte.MT) adequadosMT++;
  }

  if (participantes === 0) return null;
  return {
    participantes,
    proporcao: ((adequadosLP / participantes) * 100 + (adequadosMT / participantes) * 100) / 2,
  };
}

export type VaarGrupoResultado = {
  grupo: GrupoVulnerabilidade;
  participantesAnterior: number;
  participantesAtual: number;
  proporcaoAnterior: number | null;
  proporcaoAtual: number | null;
  /** p̄atual − p̄anterior, em pontos percentuais (IDPPI/IDNSE da metodologia). */
  indice: number | null;
  /** Proporção atual já no "efeito teto" (≥ TETO_VAAR): queda não conta. */
  tetoOk: boolean;
  /** Índice dentro da faixa de flutuação (Tabela 2), tratado como estabilidade. */
  dentroFaixa: boolean;
  /** Menos de 10 participantes num dos ciclos — grupo não usado na habilitação. */
  dadosInsuficientes: boolean;
  habilitadoGrupo: boolean;
};

export type CondicionalidadeIIIResultado = {
  totalEstudantes: number;
  faixaFlutuacaoPP: number;
  grupos: VaarGrupoResultado[];
  habilitado: boolean;
  /** Sem estudantes do 5º/9º ano em nenhum dos ciclos — habilitado automaticamente (regra i). */
  semEstudantesPrioritarios: boolean;
};

/**
 * Aplica a metodologia oficial da Condicionalidade III do VAAR (Nota Técnica
 * nº 2/2026/CGEFE/DIRED-INEP, Lei do Fundeb art. 14 § 1º III): compara, entre
 * a avaliação anterior e a selecionada, a proporção de estudantes PPI
 * (pretos, pardos e indígenas) e de baixo nível socioeconômico (quartil
 * inferior) do 5º/9º ano com desempenho adequado (Tabela 1) em LP e MT.
 * Habilitado quando os dois grupos mantêm ou melhoram essa proporção —
 * dentro da faixa de flutuação (Tabela 2) ou do "efeito teto" (≥ 90%).
 */
export function condicionalidadeIII(
  alunosComAno: AlunoComAno[],
  avaliacaoIndexAnterior: number,
  avaliacaoIndexAtual: number,
): CondicionalidadeIIIResultado {
  const prioritarios = alunosComAno.filter((item) => item.ano !== 2);

  if (prioritarios.length === 0) {
    return {
      totalEstudantes: 0,
      faixaFlutuacaoPP: 0,
      grupos: [],
      habilitado: true,
      semEstudantesPrioritarios: true,
    };
  }

  const limiarNse = quantil(prioritarios.map((item) => item.aluno.nse), 0.25);
  const faixaFlutuacaoPP = faixaFlutuacaoVaar(prioritarios.length);

  const grupos = (["ppi", "baixoNse"] as const).map((grupo): VaarGrupoResultado => {
    const itensGrupo = prioritarios.filter((item) => pertenceAoGrupo(item, grupo, limiarNse));
    const anterior = proporcaoAdequada(itensGrupo, avaliacaoIndexAnterior);
    const atual = proporcaoAdequada(itensGrupo, avaliacaoIndexAtual);
    const dadosInsuficientes = (anterior?.participantes ?? 0) < 10 || (atual?.participantes ?? 0) < 10;
    const indice = anterior && atual ? atual.proporcao - anterior.proporcao : null;
    const tetoOk = (atual?.proporcao ?? 0) >= TETO_VAAR;
    const dentroFaixa = indice !== null && indice >= faixaFlutuacaoPP;

    return {
      grupo,
      participantesAnterior: anterior?.participantes ?? 0,
      participantesAtual: atual?.participantes ?? 0,
      proporcaoAnterior: anterior?.proporcao ?? null,
      proporcaoAtual: atual?.proporcao ?? null,
      indice,
      tetoOk,
      dentroFaixa,
      dadosInsuficientes,
      habilitadoGrupo: dadosInsuficientes || dentroFaixa || tetoOk,
    };
  });

  // Regras (ii)-(iv): grupo com dados insuficientes não entra na habilitação;
  // se os dois faltarem, habilita automaticamente.
  const gruposComDados = grupos.filter((g) => !g.dadosInsuficientes);
  const habilitado = gruposComDados.length === 0 || gruposComDados.every((g) => g.habilitadoGrupo);

  return {
    totalEstudantes: prioritarios.length,
    faixaFlutuacaoPP,
    grupos,
    habilitado,
    semEstudantesPrioritarios: false,
  };
}

/** Participação no Saeb e aprovação (Censo Escolar) ponderadas pelos alunos avaliados do grupo de escolas. */
function resumoCensoEscolas(escolas: EscolaRede[]) {
  const resultados = escolas.flatMap((escola) => ANOS_SAEB.flatMap((ano) => escola.resultados[ano] ?? []));
  const alunos = resultados.reduce((sum, r) => sum + r.alunosAvaliados, 0);
  const ponderado = (valor: (r: ResultadoSaeb) => number) =>
    alunos ? resultados.reduce((sum, r) => sum + valor(r) * r.alunosAvaliados, 0) / alunos : 0;
  return {
    participacao: ponderado((r) => r.participacao),
    aprovacao: ponderado((r) => r.aprovacao),
  };
}

export type StatusVaar = {
  /** Participação no Saeb (Censo Escolar/Inep) ≥ PARTICIPACAO_MINIMA_SAEB. */
  participacaoSaebOk: boolean;
  participacaoSaeb: number;
  /** Taxa de aprovação (Censo Escolar) ≥ APROVACAO_MINIMA_VAAR. */
  aprovacaoOk: boolean;
  aprovacao: number;
  condicionalidadeIII: CondicionalidadeIIIResultado;
  /** Atende às três frentes simultaneamente (Censo + Condicionalidade III). */
  elegivel: boolean;
};

function statusVaar(
  escolas: EscolaRede[],
  alunosComAno: AlunoComAno[],
  avaliacaoIndexAtual: number,
  avaliacaoIndexAnterior: number,
): StatusVaar {
  const censo = resumoCensoEscolas(escolas);
  const participacaoSaebOk = censo.participacao >= PARTICIPACAO_MINIMA_SAEB;
  const aprovacaoOk = censo.aprovacao >= APROVACAO_MINIMA_VAAR;
  const condIII = condicionalidadeIII(alunosComAno, avaliacaoIndexAnterior, avaliacaoIndexAtual);

  return {
    participacaoSaebOk,
    participacaoSaeb: censo.participacao,
    aprovacaoOk,
    aprovacao: censo.aprovacao,
    condicionalidadeIII: condIII,
    elegivel: participacaoSaebOk && aprovacaoOk && condIII.habilitado,
  };
}

/** Status do VAAR da escola (Censo + Condicionalidade III), na avaliação LUH selecionada vs. a Diagnóstica. */
export function statusVaarDaEscola(
  escola: EscolaRede,
  avaliacaoIndexAtual: number,
  avaliacaoIndexAnterior = 0,
): StatusVaar {
  return statusVaar([escola], alunosComAnoDaEscola(escola), avaliacaoIndexAtual, avaliacaoIndexAnterior);
}

/** Status do VAAR de toda a rede (Censo + Condicionalidade III) — é neste nível que o Fundeb apura a habilitação. */
export function statusVaarDaRede(
  rede: RedeMock,
  avaliacaoIndexAtual: number,
  avaliacaoIndexAnterior = 0,
): StatusVaar {
  return statusVaar(rede.escolas, alunosComAnoDaRede(rede), avaliacaoIndexAtual, avaliacaoIndexAnterior);
}
