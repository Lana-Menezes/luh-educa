export type AreaTRI = {
  codigo: "LC" | "MT" | "CN" | "CH";
  nome: string;
  mediaProficiencia: number;
  desvioPadrao: number;
  minimo: number;
  maximo: number;
  mediaNacional: number;
};

export type FaixaProficiencia = {
  faixa: string;
  intervalo: string;
  percentual: number;
  alunos: number;
};

export type DesempenhoPorAno = {
  ano: number;
  mediaTRI: number;
  participacao: number;
};

export type ParametrosItens = {
  discriminacaoMedia: number; // parâmetro a
  dificuldadeMedia: number; // parâmetro b (na escala)
  acertoCasualMedio: number; // parâmetro c
};

export type AvaliacaoRecente = {
  nome: string;
  data: string;
  areas: { codigo: AreaTRI["codigo"]; media: number }[];
};

export type EscolaTRIMock = {
  escola: string;
  periodo: string;
  totalAlunosAvaliados: number;
  mediaGeralTRI: number;
  mediaNacional: number;
  indiceCoerencia: number;
  taxaParticipacao: number;
  areas: AreaTRI[];
  distribuicaoFaixas: FaixaProficiencia[];
  desempenhoPorAno: DesempenhoPorAno[];
  parametrosItens: ParametrosItens;
  avaliacoesRecentes: AvaliacaoRecente[];
  destaques: string[];
};

export const escolaTRIMock: EscolaTRIMock = {
  escola: "Colégio Bom Jesus",
  periodo: "1º semestre 2026",
  totalAlunosAvaliados: 486,
  mediaGeralTRI: 542.3,
  mediaNacional: 518.7,
  indiceCoerencia: 0.81,
  taxaParticipacao: 94.2,
  areas: [
    {
      codigo: "LC",
      nome: "Linguagens, Códigos e suas Tecnologias",
      mediaProficiencia: 548.6,
      desvioPadrao: 82.1,
      minimo: 312.4,
      maximo: 781.9,
      mediaNacional: 522.1,
    },
    {
      codigo: "MT",
      nome: "Matemática e suas Tecnologias",
      mediaProficiencia: 531.2,
      desvioPadrao: 95.4,
      minimo: 289.7,
      maximo: 812.3,
      mediaNacional: 509.8,
    },
    {
      codigo: "CN",
      nome: "Ciências da Natureza e suas Tecnologias",
      mediaProficiencia: 539.8,
      desvioPadrao: 88.6,
      minimo: 301.2,
      maximo: 768.5,
      mediaNacional: 514.3,
    },
    {
      codigo: "CH",
      nome: "Ciências Humanas e suas Tecnologias",
      mediaProficiencia: 549.6,
      desvioPadrao: 79.3,
      minimo: 328.1,
      maximo: 755.0,
      mediaNacional: 528.6,
    },
  ],
  distribuicaoFaixas: [
    { faixa: "Abaixo do básico", intervalo: "< 400", percentual: 8.2, alunos: 40 },
    { faixa: "Básico", intervalo: "400–499", percentual: 24.5, alunos: 119 },
    { faixa: "Adequado", intervalo: "500–599", percentual: 41.8, alunos: 203 },
    { faixa: "Avançado", intervalo: "600–699", percentual: 19.3, alunos: 94 },
    { faixa: "Avançado superior", intervalo: "≥ 700", percentual: 6.2, alunos: 30 },
  ],
  desempenhoPorAno: [
    { ano: 5, mediaTRI: 498.4, participacao: 96.1 },
    { ano: 6, mediaTRI: 521.7, participacao: 95.0 },
    { ano: 7, mediaTRI: 538.2, participacao: 93.8 },
    { ano: 8, mediaTRI: 556.9, participacao: 92.4 },
    { ano: 9, mediaTRI: 574.1, participacao: 93.7 },
  ],
  parametrosItens: {
    discriminacaoMedia: 1.24,
    dificuldadeMedia: 512.8,
    acertoCasualMedio: 0.18,
  },
  avaliacoesRecentes: [
    {
      nome: "Simulado TRI — Março",
      data: "2026-03-12",
      areas: [
        { codigo: "LC", media: 536.2 },
        { codigo: "MT", media: 518.4 },
        { codigo: "CN", media: 527.1 },
        { codigo: "CH", media: 540.8 },
      ],
    },
    {
      nome: "Simulado TRI — Maio",
      data: "2026-05-08",
      areas: [
        { codigo: "LC", media: 544.9 },
        { codigo: "MT", media: 526.7 },
        { codigo: "CN", media: 534.5 },
        { codigo: "CH", media: 546.3 },
      ],
    },
    {
      nome: "Simulado TRI — Julho",
      data: "2026-07-10",
      areas: [
        { codigo: "LC", media: 548.6 },
        { codigo: "MT", media: 531.2 },
        { codigo: "CN", media: 539.8 },
        { codigo: "CH", media: 549.6 },
      ],
    },
  ],
  destaques: [
    "A média TRI da escola está 23,6 pontos acima da referência nacional.",
    "Matemática concentra o maior desvio-padrão — há maior heterogeneidade de proficiência.",
    "O índice de coerência de resposta (0,81) indica padrão consistente com o modelo TRI 3PL.",
    "Do 5º ao 9º ano, a média TRI sobe de forma cumulativa, alinhada à lógica da escala.",
  ],
};

export function formatTRI(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatPercent(value: number) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}
