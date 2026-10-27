import type { Aluno } from "./mock-data";
import type { AnoSaeb, Disciplina } from "./saeb";

import catalogoBncc from "./bncc-questoes.json";

// Recorte de habilidades oficiais, incluindo os blocos de anos aplicáveis.
const CATALOGO = catalogoBncc;

export function habilidadesDaAvaliacao(ano: AnoSaeb, disciplina: Disciplina, avaliacao: number) {
  return Array.from({ length: 13 + avaliacao % 3 }, (_, i) => {
    const indice = (avaliacao * 2 + i) % CATALOGO[ano][disciplina].length;
    return { ...CATALOGO[ano][disciplina][indice], questao: i + 1 };
  });
}

export type DesempenhoHabilidade = "total" | "nao" | "ausente";

/** Respostas fictícias por habilidade, independentes da proficiência e reproduzíveis. */
export function resultadoHabilidade(
  aluno: Aluno,
  avaliacao: number,
  habilidade: { id: string; questao: number },
) {
  if (!aluno.resultados[avaliacao]) return { status: "ausente" as const, acertos: 0, itens: 0 };
  let hash = 2166136261;
  for (const letra of `${aluno.id}:${aluno.nome}:${avaliacao}:${habilidade.id}`) {
    hash = Math.imul(hash ^ letra.charCodeAt(0), 16777619) >>> 0;
  }
  // Questão 1: toda a turma erra. Questão 2: maioria acerta. Demais: resultado aleatório reproduzível.
  const acertos =
    habilidade.questao === 1 ? 0 : habilidade.questao === 2 ? (hash % 10 < 8 ? 1 : 0) : hash % 2;
  const status: DesempenhoHabilidade = acertos === 1 ? "total" : "nao";
  return { status, acertos, itens: 1 };
}
