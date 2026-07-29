import { escolaTRIMock, formatPercent, formatTRI } from "@/lib/escola-tri-mock";

export type TurmaMetricasMock = {
  ano: number;
  totalAlunos: number;
  mediaTRI: number;
  mediaEscola: number;
  mediaNacional: number;
  frequenciaMedia: number;
  taxaParticipacao: number;
  indiceCoerencia: number;
  alunosAdequadoOuAcima: number;
  areas: {
    codigo: "LC" | "MT" | "CN" | "CH";
    nome: string;
    media: number;
  }[];
  faixas: {
    faixa: string;
    percentual: number;
    alunos: number;
  }[];
  destaques: string[];
};

const AREA_NOMES = {
  LC: "Linguagens",
  MT: "Matemática",
  CN: "Ciências da Natureza",
  CH: "Ciências Humanas",
} as const;

function seed(ano: number) {
  let value = ano * 7919 + 104729;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
}

export function getTurmaMetricasMock(ano: number): TurmaMetricasMock {
  const rand = seed(ano);
  const desempenhoAno = escolaTRIMock.desempenhoPorAno.find(
    (item) => item.ano === ano
  );

  const mediaTRI = desempenhoAno?.mediaTRI ?? 520 + ano * 8;
  const taxaParticipacao = desempenhoAno?.participacao ?? 93;
  const mediaEscola = escolaTRIMock.mediaGeralTRI;
  const mediaNacional = escolaTRIMock.mediaNacional;
  const frequenciaMedia = Math.round(86 + rand() * 10);
  const indiceCoerencia = Math.round((0.72 + rand() * 0.2) * 100) / 100;
  const totalAlunos = 20;

  const areas = (["LC", "MT", "CN", "CH"] as const).map((codigo) => {
    const base = escolaTRIMock.areas.find((area) => area.codigo === codigo);
    const offset = (ano - 7) * 6 + (rand() - 0.5) * 18;
    return {
      codigo,
      nome: AREA_NOMES[codigo],
      media: Math.round(((base?.mediaProficiencia ?? 520) + offset) * 10) / 10,
    };
  });

  const faixasRaw = [
    { faixa: "Abaixo do básico", peso: 0.06 + rand() * 0.06 },
    { faixa: "Básico", peso: 0.18 + rand() * 0.1 },
    { faixa: "Adequado", peso: 0.35 + rand() * 0.1 },
    { faixa: "Avançado", peso: 0.18 + rand() * 0.08 },
    { faixa: "Avançado superior", peso: 0.04 + rand() * 0.05 },
  ];
  const somaPesos = faixasRaw.reduce((acc, item) => acc + item.peso, 0);
  let alunosAlocados = 0;
  const faixas = faixasRaw.map((item, index) => {
    const isLast = index === faixasRaw.length - 1;
    const alunos = isLast
      ? totalAlunos - alunosAlocados
      : Math.max(0, Math.round((item.peso / somaPesos) * totalAlunos));
    alunosAlocados += isLast ? 0 : alunos;
    return {
      faixa: item.faixa,
      alunos,
      percentual: Math.round((alunos / totalAlunos) * 1000) / 10,
    };
  });

  const alunosAdequadoOuAcima = faixas
    .filter((item) =>
      ["Adequado", "Avançado", "Avançado superior"].includes(item.faixa)
    )
    .reduce((acc, item) => acc + item.alunos, 0);

  const melhorArea = [...areas].sort((a, b) => b.media - a.media)[0];
  const piorArea = [...areas].sort((a, b) => a.media - b.media)[0];

  return {
    ano,
    totalAlunos,
    mediaTRI,
    mediaEscola,
    mediaNacional,
    frequenciaMedia,
    taxaParticipacao,
    indiceCoerencia,
    alunosAdequadoOuAcima,
    areas,
    faixas,
    destaques: [
      `A turma do ${ano}º ano está ${mediaTRI >= mediaEscola ? "acima" : "abaixo"} da média TRI da escola (${formatTRI(mediaEscola)}).`,
      `${melhorArea.nome} é a área com maior média na turma (${formatTRI(melhorArea.media)}).`,
      `${piorArea.nome} concentra a maior oportunidade de reforço (${formatTRI(piorArea.media)}).`,
      `${alunosAdequadoOuAcima} de ${totalAlunos} alunos estão no nível adequado ou acima na régua TRI.`,
    ],
  };
}

export { formatPercent, formatTRI };
