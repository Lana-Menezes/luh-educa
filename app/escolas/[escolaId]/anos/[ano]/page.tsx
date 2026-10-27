import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  AVALIACOES,
  etapaDoAno,
  formatData,
  getEscola,
  getTurmas,
  indiceAvaliacao,
  redeMock,
  resumir,
} from "@/lib/mock-data";
import {
  DISCIPLINAS,
  formatDelta,
  formatPercent,
  formatProficiencia,
  nivelDaProficiencia,
} from "@/lib/saeb";
import {
  AvaliacaoSeletor,
  Breadcrumb,
  CurvaEvolucao,
  PadroesBarra,
  StatCard,
  deltaClass,
  rotuloAvaliacaoCurto,
} from "../../../ui";

export default async function AnoPage({
  params,
  searchParams,
}: {
  params: Promise<{ escolaId: string; ano: string }>;
  searchParams: Promise<{ avaliacao?: string }>;
}) {
  const { escolaId, ano: anoParam } = await params;
  const escola = getEscola(escolaId);
  const etapa = escola && etapaDoAno(escola, Number(anoParam));

  if (!escola || !etapa) {
    notFound();
  }

  const turmas = getTurmas(escola, etapa);
  const ano = turmas[0].ano;
  const todos = turmas.flatMap((turma) => turma.alunos);
  const { avaliacao: avaliacaoParam } = await searchParams;
  const avaliacaoIdx = indiceAvaliacao(avaliacaoParam);
  const avaliacaoSelecionada = AVALIACOES[avaliacaoIdx];
  const resumo = resumir(todos, ano, avaliacaoIdx);
  const evolucao = AVALIACOES.map((avaliacao, i) => ({ avaliacao, resumo: resumir(todos, ano, i) }));
  const saeb = escola.resultados[etapa]!;
  const escolaHref = `/escolas/${escola.id}?etapa=${encodeURIComponent(etapa)}`;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/escolas" },
          { label: escola.nome, href: escolaHref },
          { label: `${ano}º ano` },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        {ano}º ano <span className="text-brand">{escola.nome}</span>
      </h1>
      <p className="mt-2 text-gray-600">
        {etapa} · {turmas.length} {turmas.length === 1 ? "turma" : "turmas"} · {avaliacaoSelecionada.nome} (
        {formatData(avaliacaoSelecionada.data)})
      </p>

      <div className="mt-4">
        <AvaliacaoSeletor
          avaliacoes={AVALIACOES}
          atual={avaliacaoIdx}
          hrefFor={(i) => `/escolas/${escola.id}/anos/${ano}?avaliacao=${i}`}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Estudantes avaliados"
          value={`${resumo.avaliados}/${resumo.matriculados}`}
          detail={`Participação de ${formatPercent(resumo.participacao)}`}
        />
        {DISCIPLINAS.map(({ codigo, nome }) => (
          <StatCard
            key={codigo}
            label={`Média em ${nome}`}
            value={formatProficiencia(resumo.media[codigo])}
            detail={
              <>
                Nível {nivelDaProficiencia(ano, codigo, resumo.media[codigo])} · Saeb oficial da escola:{" "}
                {formatProficiencia(saeb.proficiencia[codigo])}
              </>
            }
          />
        ))}
        <StatCard
          label="Aprendizado adequado (LP / MT)"
          value={
            <>
              {formatPercent(resumo.adequado.LP)} <span className="text-lg text-gray-400">/</span>{" "}
              {formatPercent(resumo.adequado.MT)}
            </>
          }
          detail="Estudantes em Adequado ou Avançado"
        />
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Turmas do {ano}º ano</h2>
        <p className="mt-1 text-sm text-gray-500">
          Compare as turmas e abra uma delas para ver os estudantes
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Turma</th>
                <th className="px-2 py-2 font-medium">Participação</th>
                {DISCIPLINAS.map(({ codigo, nome }) => (
                  <th key={codigo} className="px-2 py-2 font-medium">
                    {nome}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => {
                const r = resumir(turma.alunos, ano, avaliacaoIdx);
                const href = `/escolas/${escola.id}/anos/${ano}/turmas/${turma.id}`;
                return (
                  <tr key={turma.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3 pr-3">
                      <Link href={href} className="font-medium text-gray-900 hover:text-brand">
                        {turma.nome}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {turma.turno} · {turma.alunos.length} estudantes
                      </p>
                    </td>
                    <td className="px-2 py-3 text-gray-700">{formatPercent(r.participacao)}</td>
                    {DISCIPLINAS.map(({ codigo }) => {
                      const delta = r.media[codigo] - resumo.media[codigo];
                      return (
                        <td key={codigo} className="px-2 py-3">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-gray-900">
                              {formatProficiencia(r.media[codigo])}
                            </span>
                            <span className={`text-xs ${deltaClass(delta)}`}>{formatDelta(delta)}</span>
                          </div>
                          <div className="mt-1.5 w-40">
                            <PadroesBarra contagem={r.padroes[codigo]} compacta />
                          </div>
                        </td>
                      );
                    })}
                    <td>
                      <Link href={href} aria-label={`Abrir ${turma.nome}`}>
                        <ChevronRight className="h-5 w-5 text-gray-300 hover:text-brand" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Diferença em relação à média do {ano}º ano. Barras: Abaixo do Básico, Básico, Adequado e Avançado.
        </p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Padrões de desempenho do ano</h2>
          <div className="mt-5 space-y-6">
            {DISCIPLINAS.map(({ codigo, nome }) => (
              <PadroesBarra key={codigo} titulo={nome} contagem={resumo.padroes[codigo]} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Progresso mês a mês</h2>
          <p className="mt-1 text-sm text-gray-500">
            Média do {ano}º ano na escala Saeb, avaliação a avaliação
          </p>
          <div className="mt-4 overflow-x-auto">
            <CurvaEvolucao
              pontos={evolucao.map(({ avaliacao, resumo: r }, i) => ({
                id: avaliacao.id,
                rotulo: rotuloAvaliacaoCurto(avaliacao.nome),
                selecionado: i === avaliacaoIdx,
                LP: r.media.LP,
                MT: r.media.MT,
              }))}
            />
          </div>
          <table className="mt-6 w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Avaliação</th>
                {DISCIPLINAS.map(({ codigo }) => (
                  <th key={codigo} className="px-2 py-2 text-right font-medium">
                    {codigo}
                  </th>
                ))}
                <th className="px-2 py-2 text-right font-medium">Participação</th>
              </tr>
            </thead>
            <tbody>
              {evolucao.map(({ avaliacao, resumo: r }, i) => (
                <tr
                  key={avaliacao.id}
                  className={`border-b border-gray-100 last:border-0 ${
                    i === avaliacaoIdx ? "bg-brand-soft/60" : ""
                  }`}
                >
                  <td className="py-3 pr-3">
                    <p
                      className={`font-medium ${
                        i === avaliacaoIdx ? "text-brand" : "text-gray-900"
                      }`}
                    >
                      {avaliacao.nome}
                    </p>
                    <p className="text-xs text-gray-500">{formatData(avaliacao.data)}</p>
                  </td>
                  {DISCIPLINAS.map(({ codigo }) => (
                    <td key={codigo} className="px-2 py-3 text-right text-gray-700">
                      {formatProficiencia(r.media[codigo])}
                    </td>
                  ))}
                  <td className="px-2 py-3 text-right text-gray-700">{formatPercent(r.participacao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
