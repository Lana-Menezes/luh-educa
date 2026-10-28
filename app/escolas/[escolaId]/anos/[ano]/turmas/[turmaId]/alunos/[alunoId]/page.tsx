import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import HabilidadesResultados from "@/app/escolas/HabilidadesResultados";
import AvaliacaoDropdown from "@/app/escolas/AvaliacaoDropdown";
import {
  AVALIACAO_ATUAL,
  AVALIACOES,
  formatData,
  getEscola,
  getTurma,
  indiceAvaliacao,
  redeMock,
  resultadoAtual,
  resumir,
} from "@/lib/mock-data";
import {
  DISCIPLINAS,
  ESCALA_SAEB,
  PADROES,
  formatDelta,
  formatProficiencia,
  nivelDaProficiencia,
  padraoDaProficiencia,
} from "@/lib/saeb";
import {
  Breadcrumb,
  CurvaEvolucao,
  PadraoBadge,
  corPadrao,
  deltaClass,
  rotuloAvaliacaoCurto,
} from "../../../../../../../ui";
import { AvaliacaoSync } from "../../../../../../../../AvaliacaoSync";
import { AVALIACAO_COOKIE } from "@/lib/avaliacao-cookie";

export default async function AlunoPage({
  params,
  searchParams,
}: {
  params: Promise<{ escolaId: string; ano: string; turmaId: string; alunoId: string }>;
  searchParams: Promise<{ avaliacao?: string }>;
}) {
  const { avaliacao } = await searchParams;
  const avaliacaoCookie = (await cookies()).get(AVALIACAO_COOKIE)?.value;
  const avaliacaoIdx = indiceAvaliacao(avaliacao, avaliacaoCookie);
  const { escolaId, ano: anoParam, turmaId, alunoId } = await params;
  const escola = getEscola(escolaId);
  const turma = escola && getTurma(escola, Number(anoParam), turmaId);
  const aluno = turma?.alunos.find((a) => a.id === alunoId);

  if (!escola || !turma || !aluno) {
    notFound();
  }

  const { ano } = turma;
  const atual = resultadoAtual(aluno);
  const resumoTurma = resumir(turma.alunos, ano);
  const presentes = aluno.resultados.flatMap((r, i) => (r ? [{ ...r, avaliacao: AVALIACOES[i] }] : []));
  const primeira = presentes[0];
  const ultima = presentes[presentes.length - 1];
  const anoHref = `/escolas/${escola.id}/anos/${ano}?avaliacao=${avaliacaoIdx}`;
  const turmaHref = `/escolas/${escola.id}/anos/${ano}/turmas/${turma.id}?avaliacao=${avaliacaoIdx}`;

  const recomendacoes: string[] = [];
  if (!atual) {
    recomendacoes.push(
      "Estudante ausente no simulado mais recente: agende a segunda chamada para não perder o acompanhamento.",
    );
  }
  for (const { codigo, nome } of DISCIPLINAS) {
    if (!ultima) break;
    const padrao = padraoDaProficiencia(ano, codigo, ultima[codigo]);
    if (padrao === "Abaixo do Básico") {
      recomendacoes.push(
        `${nome}: padrão Abaixo do Básico. Inclua o estudante no grupo de recomposição das habilidades dos níveis iniciais da escala.`,
      );
    } else if (padrao === "Básico") {
      recomendacoes.push(
        `${nome}: padrão Básico, a ${formatProficiencia(
          ESCALA_SAEB[ano][codigo].cortesPadroes[1] - ultima[codigo],
        )} pontos do Adequado. Priorize as habilidades do nível seguinte.`,
      );
    }
  }
  if (recomendacoes.length === 0) {
    recomendacoes.push("Aprendizado adequado nas duas disciplinas: ofereça atividades de aprofundamento.");
  }

  const evolucaoPontos = presentes.map((r) => ({
    id: r.avaliacao.id,
    rotulo: rotuloAvaliacaoCurto(r.avaliacao.nome),
    selecionado: r === ultima,
    LP: r.LP,
    MT: r.MT,
  }));

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <AvaliacaoSync atual={avaliacaoIdx} />
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/escolas" },
          { label: escola.nome, href: `/escolas/${escola.id}?ano=${ano}&avaliacao=${avaliacaoIdx}` },
          { label: `${ano}º ano`, href: anoHref },
          { label: turma.nome, href: turmaHref },
          { label: aluno.nome },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{aluno.nome}</h1>
      <p className="mt-2 text-gray-600">
        Matrícula {aluno.id} · {turma.nome} ({turma.turno.toLowerCase()}) · {escola.nome}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {DISCIPLINAS.map(({ codigo, nome }) => {
          const valor = ultima?.[codigo];
          const { cortesPadroes } = ESCALA_SAEB[ano][codigo];
          const limites = [cortesPadroes[0] - 75, ...cortesPadroes, cortesPadroes[2] + 75];
          const posicao = (v: number) =>
            Math.min(100, Math.max(0, ((v - limites[0]) / (limites[4] - limites[0])) * 100));

          return (
            <section key={codigo} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{nome}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {atual ? `${AVALIACAO_ATUAL.nome} (mais recente)` : `Última avaliação: ${ultima?.avaliacao.nome ?? "—"}`}
                  </p>
                </div>
                {valor !== undefined && <PadraoBadge padrao={padraoDaProficiencia(ano, codigo, valor)} />}
              </div>

              {valor === undefined ? (
                <p className="mt-6 text-sm text-gray-500">Sem avaliações registradas.</p>
              ) : (
                <>
                  <p className="mt-4 text-4xl font-bold text-gray-900">{formatProficiencia(valor)}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Nível {nivelDaProficiencia(ano, codigo, valor)} da escala Saeb ·{" "}
                    <span className={deltaClass(valor - resumoTurma.media[codigo])}>
                      {formatDelta(valor - resumoTurma.media[codigo])} vs. média da turma
                    </span>
                    {primeira && primeira !== ultima && (
                      <>
                        {" "}
                        ·{" "}
                        <span className={deltaClass(valor - primeira[codigo])}>
                          {formatDelta(valor - primeira[codigo])} desde a {primeira.avaliacao.nome.toLowerCase()}
                        </span>
                      </>
                    )}
                  </p>

                  <div className="relative mt-6 pb-6">
                    <div className="flex h-3 overflow-hidden rounded-full">
                      {PADROES.map((p, i) => (
                        <div
                          key={p}
                          className={`${corPadrao[p]} opacity-80`}
                          style={{ width: `${posicao(limites[i + 1]) - posicao(limites[i])}%` }}
                          title={p}
                        />
                      ))}
                    </div>
                    <div
                      className="absolute top-[-4px] h-5 w-1 -translate-x-1/2 rounded-full bg-gray-900"
                      style={{ left: `${posicao(valor)}%` }}
                      title={`Estudante: ${formatProficiencia(valor)}`}
                    />
                    <div
                      className="absolute top-0 h-3 w-0.5 -translate-x-1/2 bg-white"
                      style={{ left: `${posicao(resumoTurma.media[codigo])}%` }}
                      title={`Média da turma: ${formatProficiencia(resumoTurma.media[codigo])}`}
                    />
                    <div className="mt-2 flex text-center text-[11px] text-gray-500">
                      {PADROES.map((p, i) => (
                        <span
                          key={p}
                          className="truncate"
                          style={{ width: `${posicao(limites[i + 1]) - posicao(limites[i])}%` }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>

      {evolucaoPontos.length > 0 && (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Progresso mês a mês</h2>
          <p className="mt-1 text-sm text-gray-500">
            Evolução do estudante nas avaliações do ano, por Língua Portuguesa e Matemática (escala Saeb)
          </p>
          <div className="mt-4 overflow-x-auto">
            <CurvaEvolucao pontos={evolucaoPontos} />
          </div>
        </section>
      )}

      <div className="mt-6">
        <AvaliacaoDropdown avaliacoes={AVALIACOES} atual={avaliacaoIdx} />
        <HabilidadesResultados alunos={[aluno]} ano={ano} avaliacao={avaliacaoIdx} matriz />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Histórico de avaliações</h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Avaliação</th>
                {DISCIPLINAS.map(({ codigo }) => (
                  <th key={codigo} className="px-2 py-2 font-medium">
                    {codigo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AVALIACOES.map((avaliacao, i) => {
                const r = aluno.resultados[i];
                return (
                  <tr key={avaliacao.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-gray-900">{avaliacao.nome}</p>
                      <p className="text-xs text-gray-500">{formatData(avaliacao.data)}</p>
                    </td>
                    {DISCIPLINAS.map(({ codigo }) => (
                      <td key={codigo} className="px-2 py-3">
                        {r ? (
                          <div className="flex items-center gap-2">
                            <span className="w-12 font-medium text-gray-900">
                              {formatProficiencia(r[codigo])}
                            </span>
                            <PadraoBadge padrao={padraoDaProficiencia(ano, codigo, r[codigo])} />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Ausente</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Recomendações pedagógicas</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {recomendacoes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Dados fictícios para demonstração. Resultados individuais das avaliações LUH Educa na escala Saeb.
      </p>
    </div>
  );
}
