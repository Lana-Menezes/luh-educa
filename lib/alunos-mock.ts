export const ANOS_VALIDOS = new Set([5, 6, 7, 8, 9]);

const NOMES = [
  "Ana Souza",
  "Bruno Lima",
  "Carla Mendes",
  "Diego Alves",
  "Eduarda Costa",
  "Felipe Rocha",
  "Gabriela Nunes",
  "Henrique Silva",
  "Isabela Martins",
  "João Pereira",
  "Karen Oliveira",
  "Lucas Ferreira",
  "Marina Santos",
  "Nicolas Barbosa",
  "Olivia Ribeiro",
  "Pedro Carvalho",
  "Rafaela Gomes",
  "Samuel Araujo",
  "Tatiana Moreira",
  "Vinicius Teixeira",
];

export type AlunoMock = {
  id: number;
  nome: string;
  matricula: string;
  ano: number;
};

export function getAlunosMock(ano: number): AlunoMock[] {
  return NOMES.map((nome, index) => ({
    id: ano * 100 + index + 1,
    nome,
    matricula: `${ano}${String(index + 1).padStart(3, "0")}`,
    ano,
  }));
}

export function getAlunoMock(ano: number, alunoId: number): AlunoMock | undefined {
  return getAlunosMock(ano).find((aluno) => aluno.id === alunoId);
}

function seedFromId(id: number) {
  let value = id * 9301 + 49297;
  return () => {
    value = (value * 193 + 233) % 1000;
    return value / 1000;
  };
}

export type MetricasAluno = {
  mediaGeral: number;
  frequencia: number;
  atividadesConcluidas: number;
  atividadesTotais: number;
  rankingTurma: number;
  totalAlunosTurma: number;
  disciplinas: { nome: string; media: number; progresso: number }[];
  evolucao: { mes: string; media: number }[];
  alertas: string[];
};

export function getMetricasMock(alunoId: number): MetricasAluno {
  const rand = seedFromId(alunoId);
  const mediaGeral = Math.round((5.5 + rand() * 4.5) * 10) / 10;
  const frequencia = Math.round(75 + rand() * 25);
  const atividadesTotais = 20;
  const atividadesConcluidas = Math.round(10 + rand() * 10);
  const rankingTurma = Math.max(1, Math.round(1 + rand() * 19));

  const disciplinasBase = [
    "Português",
    "Matemática",
    "História",
    "Geografia",
    "Ciências",
  ];

  const disciplinas = disciplinasBase.map((nome) => ({
    nome,
    media: Math.round((5 + rand() * 5) * 10) / 10,
    progresso: Math.round(50 + rand() * 50),
  }));

  const meses = ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];
  const evolucao = meses.map((mes) => ({
    mes,
    media: Math.round((5 + rand() * 5) * 10) / 10,
  }));

  const alertas: string[] = [];
  if (frequencia < 85) {
    alertas.push("Frequência abaixo da meta de 85%.");
  }
  if (mediaGeral < 7) {
    alertas.push("Média geral abaixo de 7,0 — recomenda-se reforço.");
  }
  if (atividadesConcluidas / atividadesTotais < 0.7) {
    alertas.push("Há atividades pendentes neste bimestre.");
  }
  if (alertas.length === 0) {
    alertas.push("Desempenho dentro do esperado. Continue acompanhando.");
  }

  return {
    mediaGeral,
    frequencia,
    atividadesConcluidas,
    atividadesTotais,
    rankingTurma,
    totalAlunosTurma: 20,
    disciplinas,
    evolucao,
    alertas,
  };
}
