import { Check, ChevronDown, Minus, X } from "lucide-react";
import { AVALIACOES, type Aluno } from "@/lib/mock-data";
import { habilidadesDaAvaliacao, resultadoHabilidade, type DesempenhoHabilidade } from "@/lib/habilidades";
import { DISCIPLINAS, formatPercent, formatProficiencia, type AnoSaeb } from "@/lib/saeb";

const ESTADOS = {
  total: { texto: "Acertou", classe: "bg-lime-50 text-lime-700", Icone: Check },
  nao: { texto: "Errou", classe: "bg-pink-50 text-pink-600", Icone: X },
  ausente: { texto: "Sem resultado", classe: "bg-white text-gray-600", Icone: Minus },
};

function Indicador({ status }: { status: DesempenhoHabilidade }) {
  const { texto, classe, Icone } = ESTADOS[status];
  return <span className={`inline-flex rounded-md p-1.5 ${classe}`}><Icone className="h-5 w-5" aria-hidden /><span className="sr-only">{texto}</span></span>;
}

export default function HabilidadesResultados({ alunos, ano, avaliacao, matriz = false }: {
  alunos: Aluno[]; ano: AnoSaeb; avaliacao: number; matriz?: boolean;
}) {
  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Desempenho por habilidade · {ano}º ano</h2>
      <p className="mt-1 text-sm text-gray-700">{AVALIACOES[avaliacao].nome} · Habilidades aplicadas em Língua Portuguesa e Matemática</p>
      <p className="mt-3 text-xs text-gray-700">Cada questão avalia uma habilidade BNCC diferente. Seleção de questões e respostas demonstrativas. Acertar ou errar uma única questão não determina o domínio completo da habilidade.</p>
      {matriz && <ul className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600" aria-label="Legenda de desempenho">
        {(Object.keys(ESTADOS) as DesempenhoHabilidade[]).map((status) => <li key={status} className="flex items-center gap-2"><Indicador status={status} />{ESTADOS[status].texto}</li>)}
      </ul>}
      {DISCIPLINAS.map(({ codigo, nome }) => {
        const habilidades = habilidadesDaAvaliacao(ano, codigo, avaliacao);
        return (
          <details key={codigo} className="group/disciplina mt-6 rounded-lg border border-gray-200 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
              <h3 className="font-semibold text-black">{nome} · {habilidades.length} questões</h3>
              <ChevronDown className="h-5 w-5 shrink-0 text-gray-600 transition-transform group-open/disciplina:rotate-180" aria-hidden />
            </summary>
            {matriz && <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200" tabIndex={0} role="region" aria-label={`Matriz de estudantes e habilidades de ${nome}`}>
              <table className="w-full min-w-[40rem] text-left text-sm text-gray-900">
                <caption className="sr-only">Desempenho individual por habilidade em {nome} · {AVALIACOES[avaliacao].nome}</caption>
                <thead className="bg-brand text-white"><tr>
                  <th scope="col" className="sticky left-0 bg-brand px-4 py-3">Estudante</th>
                  <th scope="col" className="px-3 py-3">Proficiência</th>
                  {habilidades.map((h) => <th key={h.id} scope="col" className="px-3 py-3 text-center" title={h.descricao}><span className="block">Q{String(h.questao).padStart(2, "0")}</span><span className="block whitespace-nowrap text-xs font-normal">{h.id}</span></th>)}
                </tr></thead>
                <tbody>{alunos.map((aluno, index) => <tr key={`${aluno.id}-${index}`} className="border-t border-gray-100">
                  <th scope="row" className="sticky left-0 min-w-52 bg-white px-4 py-3 font-medium text-gray-900">{aluno.nome}</th>
                  <td className="px-3 py-3 font-semibold">{aluno.resultados[avaliacao] ? formatProficiencia(aluno.resultados[avaliacao]![codigo]) : "—"}</td>
                  {habilidades.map((h) => {
                    const r = resultadoHabilidade(aluno, avaliacao, h);
                    return <td key={h.id} className="px-3 py-3 text-center" title={`${h.descricao} ${ESTADOS[r.status].texto}${r.itens ? ` · ${r.acertos}/${r.itens} acertos` : ""}`}><Indicador status={r.status} />{r.itens > 0 && <span className="block text-xs text-gray-700">{r.acertos}/{r.itens}</span>}</td>;
                  })}
                </tr>)}</tbody>
              </table>
              {!alunos.length && <p className="p-4 text-sm text-gray-700">Nenhum estudante encontrado.</p>}
            </div>}
            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200" tabIndex={0} role="region" aria-label={`Resumo de habilidades de ${nome}`}>
              <table className="w-full min-w-[42rem] text-left text-sm text-gray-900">
                <caption className="sr-only">Habilidades aplicadas e desempenho em {nome}</caption>
                
                <thead className="bg-brand-soft text-gray-900"><tr>
                  {["Questão / habilidade aplicada", "% de acertos", "Acertaram", "Erraram", "Sem resultado"].map((titulo) => <th key={titulo} scope="col" className="px-3 py-3 font-semibold">{titulo}</th>)}
                </tr></thead>
                <tbody>{habilidades.map((habilidade) => {
                  const resultados = alunos.map((aluno) => resultadoHabilidade(aluno, avaliacao, habilidade));
                  const itens = resultados.reduce((s, r) => s + r.itens, 0);
                  const acertos = resultados.reduce((s, r) => s + r.acertos, 0);
                  return <tr key={habilidade.id} className="border-t border-gray-100">
                    <th scope="row" className="min-w-64 px-3 py-3 font-normal text-gray-900">
                      <span className="block text-sm font-bold text-gray-900">Questão {String(habilidade.questao).padStart(2, "0")} · {habilidade.id}</span>
                      <span className="block leading-relaxed">{habilidade.descricao}</span>
                      <span className="mt-1 block text-xs text-gray-700">BNCC · {habilidade.anos.map((ano) => `${ano}º`).join(", ")} ano(s) · {habilidade.fonte}</span>
                    </th>
                    <td className="px-3 py-3">{itens ? formatPercent(acertos / itens * 100) : "—"}</td>
                    {(["total", "nao", "ausente"] as const).map((status) => <td key={status} className="px-3 py-3">{resultados.filter((r) => r.status === status).length}</td>)}
                  </tr>;
                })}</tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-700">Contagens por estudante. O percentual de acertos considera somente os itens dos estudantes com resultado.</p>
          </details>
        );
      })}
    </section>
  );
}
