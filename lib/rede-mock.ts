import {
  ANO_POR_ETAPA,
  PARTICIPACAO_MINIMA_SAEB,
  type AnoSaeb,
  type Disciplina,
  type Etapa,
  type ResultadoSaeb,
} from "@/lib/saeb";

export type { Etapa } from "@/lib/saeb";
export type Zona = "Urbana" | "Rural";

export type EscolaRede = {
  id: string;
  nome: string;
  codigoInep: string;
  bairro: string;
  zona: Zona;
  resultados: Partial<Record<Etapa, ResultadoSaeb>>;
};

export type ReferenciaSaeb = { proficiencia: Record<Disciplina, number> };

export type RedeMock = {
  nome: string;
  municipio: string;
  uf: string;
  edicao: string;
  /** Valores de referência fictícios para comparação; não são dados oficiais do Inep. */
  referenciaNacional: Record<Etapa, ReferenciaSaeb>;
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
    "Alfabetização": { proficiencia: { LP: 130, MT: 135 } },
    "Anos Iniciais": { proficiencia: { LP: 210, MT: 220 } },
    "Anos Finais": { proficiencia: { LP: 255, MT: 250 } },
  },
  escolas: [
    {
      id: "em-professora-maria-das-dores",
      nome: "E.M. Professora Maria das Dores",
      codigoInep: "31045821",
      bairro: "Centro",
      zona: "Urbana",
      resultados: {
        "Alfabetização": saeb(2, 230, 93.5, 96.8, 132.9, 141.4),
        "Anos Iniciais": saeb(5, 238, 94.2, 97.1, 214.3, 228.1),
        "Anos Finais": saeb(9, 248, 91.0, 92.4, 262.4, 258.2),
      },
    },
    {
      id: "emef-dom-pedro-ii",
      nome: "E.M.E.F. Dom Pedro II",
      codigoInep: "31045832",
      bairro: "Vila Nova",
      zona: "Urbana",
      resultados: {
        "Alfabetização": saeb(2, 290, 90.8, 95.0, 127.8, 136.0),
        "Anos Iniciais": saeb(5, 301, 91.5, 95.8, 206.2, 219.4),
        "Anos Finais": saeb(9, 311, 88.3, 89.7, 254.1, 249.3),
      },
    },
    {
      id: "em-tiradentes",
      nome: "E.M. Tiradentes",
      codigoInep: "31045845",
      bairro: "Santa Efigênia",
      zona: "Urbana",
      resultados: {
        "Anos Finais": saeb(9, 398, 87.2, 86.5, 246.3, 240.8),
      },
    },
    {
      id: "em-cecilia-meireles",
      nome: "E.M. Cecília Meireles",
      codigoInep: "31045857",
      bairro: "Jardim das Flores",
      zona: "Urbana",
      resultados: {
        "Alfabetização": saeb(2, 265, 95.8, 97.9, 136.0, 143.3),
        "Anos Iniciais": saeb(5, 274, 96.4, 98.2, 219.4, 231.2),
      },
    },
    {
      id: "emef-joao-guimaraes-rosa",
      nome: "E.M.E.F. João Guimarães Rosa",
      codigoInep: "31045869",
      bairro: "São Judas Tadeu",
      zona: "Urbana",
      resultados: {
        "Alfabetização": saeb(2, 250, 80.9, 92.0, 122.8, 128.5),
        "Anos Iniciais": saeb(5, 262, 82.3, 93.4, 198.1, 207.3),
        "Anos Finais": saeb(9, 269, 76.8, 85.1, 241.2, 235.9),
      },
    },
    {
      id: "em-paulo-freire",
      nome: "E.M. Paulo Freire",
      codigoInep: "31045870",
      bairro: "Nova Esperança",
      zona: "Urbana",
      resultados: {
        "Anos Finais": saeb(9, 447, 86.7, 84.2, 238.4, 232.1),
      },
    },
    {
      id: "em-anisio-teixeira",
      nome: "E.M. Anísio Teixeira",
      codigoInep: "31045882",
      bairro: "Bela Vista",
      zona: "Urbana",
      resultados: {
        "Alfabetização": saeb(2, 172, 92.0, 98.0, 138.5, 146.4),
        "Anos Iniciais": saeb(5, 180, 93.1, 98.5, 223.4, 236.2),
        "Anos Finais": saeb(9, 185, 92.6, 94.0, 268.1, 266.4),
      },
    },
    {
      id: "em-sao-sebastiao",
      nome: "E.M. São Sebastião",
      codigoInep: "31045894",
      bairro: "Bairro Industrial",
      zona: "Urbana",
      resultados: {
        "Alfabetização": saeb(2, 210, 89.0, 95.3, 129.1, 133.4),
        "Anos Iniciais": saeb(5, 219, 90.2, 96.0, 208.3, 215.1),
      },
    },
    {
      id: "em-rural-corrego-fundo",
      nome: "E.M. Rural Córrego Fundo",
      codigoInep: "31045903",
      bairro: "Comunidade Córrego Fundo",
      zona: "Rural",
      resultados: {
        "Alfabetização": saeb(2, 60, 87.5, 91.0, 118.5, 123.0),
        "Anos Iniciais": saeb(5, 64, 89.1, 92.7, 191.2, 198.4),
      },
    },
    {
      id: "em-rural-boa-vista-da-serra",
      nome: "E.M. Rural Boa Vista da Serra",
      codigoInep: "31045915",
      bairro: "Distrito de Boa Vista",
      zona: "Rural",
      resultados: {
        "Alfabetização": saeb(2, 58, 78.0, 90.5, 121.8, 126.0),
        "Anos Iniciais": saeb(5, 61, 79.6, 91.8, 196.4, 203.2),
        "Anos Finais": saeb(9, 57, 83.4, 87.9, 239.3, 233.1),
      },
    },
    {
      id: "em-rural-santo-antonio",
      nome: "E.M. Rural Santo Antônio",
      codigoInep: "31045927",
      bairro: "Povoado Santo Antônio",
      zona: "Rural",
      resultados: {
        "Alfabetização": saeb(2, 45, 96.5, 96.3, 126.5, 131.6),
        "Anos Iniciais": saeb(5, 47, 97.9, 97.0, 204.1, 212.3),
      },
    },
    {
      id: "emef-monteiro-lobato",
      nome: "E.M.E.F. Monteiro Lobato",
      codigoInep: "31045939",
      bairro: "Alto da Glória",
      zona: "Urbana",
      resultados: {
        "Alfabetização": saeb(2, 240, 91.5, 96.0, 131.0, 139.1),
        "Anos Iniciais": saeb(5, 249, 92.8, 96.6, 211.2, 224.3),
        "Anos Finais": saeb(9, 254, 90.1, 91.3, 258.3, 255.1),
      },
    },
  ],
};

export const ETAPAS: Etapa[] = ["Alfabetização", "Anos Iniciais", "Anos Finais"];

export function getEscola(id: string) {
  return redeMock.escolas.find((escola) => escola.id === id);
}

export function etapasDaEscola(escola: EscolaRede) {
  return ETAPAS.filter((etapa) => escola.resultados[etapa]);
}

/** Resultado agregado da rede numa etapa (médias ponderadas pelo nº de alunos avaliados). */
export function getResultadoRede(etapa: Etapa, escolas: EscolaRede[] = redeMock.escolas): ResultadoSaeb {
  const resultados = escolas.flatMap((escola) => escola.resultados[etapa] ?? []);
  const alunos = resultados.reduce((sum, r) => sum + r.alunosAvaliados, 0);
  const ponderado = (valor: (r: ResultadoSaeb) => number) =>
    resultados.reduce((sum, r) => sum + valor(r) * r.alunosAvaliados, 0) / Math.max(alunos, 1);

  return {
    ano: ANO_POR_ETAPA[etapa],
    alunosAvaliados: alunos,
    participacao: ponderado((r) => r.participacao),
    aprovacao: ponderado((r) => r.aprovacao),
    proficiencia: {
      LP: ponderado((r) => r.proficiencia.LP),
      MT: ponderado((r) => r.proficiencia.MT),
    },
  };
}

export type MotivoAtencao = { etapa: Etapa; motivo: string };

/** Participação insuficiente no Saeb ou proficiência abaixo da referência nacional. */
export function motivosAtencao(escola: EscolaRede): MotivoAtencao[] {
  return etapasDaEscola(escola).flatMap((etapa) => {
    const resultado = escola.resultados[etapa]!;
    const referencia = redeMock.referenciaNacional[etapa];
    const motivos: MotivoAtencao[] = [];

    if (resultado.participacao < PARTICIPACAO_MINIMA_SAEB) {
      motivos.push({ etapa, motivo: `participação abaixo de ${PARTICIPACAO_MINIMA_SAEB}%` });
    }
    if (resultado.proficiencia.LP < referencia.proficiencia.LP || resultado.proficiencia.MT < referencia.proficiencia.MT) {
      motivos.push({ etapa, motivo: "Proficiência abaixo da referência nacional" });
    }
    return motivos;
  });
}

export function precisaAtencao(escola: EscolaRede) {
  return motivosAtencao(escola).length > 0;
}

/** Comparação acento-insensível, para buscas como "corrego" encontrarem "Córrego". */
export function normalizeBusca(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
