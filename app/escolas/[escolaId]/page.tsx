import HabilidadesResultados from "@/app/escolas/HabilidadesResultados";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AVALIACOES,
  etapasDaEscola,
  formatData,
  getEscola,
  getResultadoRede,
  getTurmas,
  indiceAvaliacao,
  redeMock,
  resumir,
} from "@/lib/mock-data";
import {
  DISCIPLINAS,
  PARTICIPACAO_MINIMA_SAEB,
  aprendizadoAdequado,
  distribuicaoNiveis,
  distribuicaoPadroes,
  formatDelta,
  formatPercent,
  formatProficiencia,
  nivelDaProficiencia,
} from "@/lib/saeb";
import { ChevronRight } from "lucide-react";
import { AvaliacaoSeletor, Breadcrumb, PadroesBarra, corPadrao, deltaClass } from "../ui";

export default async function EscolaPage({
  params,
  searchParams,
}: {
  params: Promise<{ escolaId: string }>;
  searchParams: Promise<{ etapa?: string; avaliacao?: string }>;
}) {
  const { escolaId } = await params;
  const escola = getEscola(escolaId);

  if (!escola) {
    notFound();
  }

  const etapas = etapasDaEscola(escola);
  const { etapa: etapaParam, avaliacao: avaliacaoParam } = await searchParams;
  const etapa = etapas.find((e) => e === etapaParam) ?? etapas[0];
  const resultado = escola.resultados[etapa]!;
  const rede = getResultadoRede(etapa);
  const referencia = redeMock.referenciaNacional[etapa];
  const ano = resultado.ano;
  const turmas = getTurmas(escola, etapa);
  const avaliacaoIdx = indiceAvaliacao(avaliacaoParam);
  const avaliacaoSelecionada = AVALIACOES[avaliacaoIdx];
  const resumoAno = resumir(turmas.flatMap((t) => t.alunos), ano, avaliacaoIdx);

  const leituras = [
    resultado.participacao >= PARTICIPACAO_MINIMA_SAEB
      ? `Com ${formatPercent(resultado.participacao)} de participação, o resultado da escola no Saeb é representativo.`
      : `Com ${formatPercent(resultado.participacao)} de participação, a escola não atinge os ${PARTICIPACAO_MINIMA_SAEB}% recomendados. Priorize a mobilização para a próxima aplicação.`,
    ...DISCIPLINAS.map(({ codigo, nome }) => {
      const insuficiente = distribuicaoPadroes(ano, codigo, resultado.proficiencia[codigo])[0];
      return `${nome}: ${formatPercent(insuficiente.percentual)} dos alunos estão no padrão Abaixo do Básico — foco de recomposição das habilidades dos níveis iniciais da escala.`;
    }),
  ];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <div>
        <Breadcrumb
          itens={[
            { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/escolas" },
            { label: escola.nome },
          ]}
        />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          <span className="text-brand">{escola.nome}</span>
        </h1>
        <p className="mt-2 text-gray-600">
          INEP {escola.codigoInep} · {escola.bairro} · Zona {escola.zona.toLowerCase()} ·{" "}
          {redeMock.municipio}/{redeMock.uf}
        </p>
        <p className="mt-1 text-gray-600">Resultados no {redeMock.edicao} e acompanhamento pelo método LUH</p>
      </div>

      {etapas.length > 1 && (
        <nav className="mt-6 flex gap-2" aria-label="Etapa avaliada">
          {etapas.map((e) => {
            const active = e === etapa;
            return (
              <Link
                key={e}
                href={`/escolas/${escola.id}?etapa=${encodeURIComponent(e)}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-gray-200 bg-white text-gray-700 hover:border-brand-muted"
                }`}
              >
                {escola.resultados[e]!.ano}º ano · {e}
              </Link>
            );
          })}
        </nav>
      )}

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{redeMock.edicao} × Método LUH</h2>
        <p className="mt-1 text-sm text-gray-500">
          {ano}º ano · Compare a referência do Saeb com a avaliação LUH selecionada.
        </p>
        <div className="mt-4">
          <AvaliacaoSeletor
            avaliacoes={AVALIACOES}
            atual={avaliacaoIdx}
            hrefFor={(i) =>
              `/escolas/${escola.id}?etapa=${encodeURIComponent(etapa)}&avaliacao=${i}`
            }
          />
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Método LUH · {avaliacaoSelecionada.nome} · {formatData(avaliacaoSelecionada.data)}
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Comparação dos resultados da escola no Saeb e na avaliação LUH selecionada</caption>
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th scope="col" className="py-2 pr-3 font-medium">Indicador</th>
                <th scope="col" className="px-2 py-2 text-right font-medium">{redeMock.edicao}</th>
                <th scope="col" className="px-2 py-2 text-right font-medium">Método LUH</th>
                <th scope="col" className="px-2 py-2 text-right font-medium">Diferença (LUH − Saeb)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {DISCIPLINAS.map(({ codigo, nome }) => {
                const delta = resumoAno.media[codigo] - resultado.proficiencia[codigo];
                return (
                  <tr key={codigo} className="border-b border-gray-100">
                    <th scope="row" className="py-3 pr-3 font-medium text-gray-900">Proficiência em {nome}</th>
                    <td className="px-2 py-3 text-right">{formatProficiencia(resultado.proficiencia[codigo])}</td>
                    <td className="px-2 py-3 text-right">{resumoAno.avaliados ? formatProficiencia(resumoAno.media[codigo]) : "—"}</td>
                    <td className={`px-2 py-3 text-right ${resumoAno.avaliados ? deltaClass(delta) : "text-gray-400"}`}>
                      {resumoAno.avaliados ? `${formatDelta(delta)} pontos` : "—"}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-b border-gray-100">
                <th scope="row" className="py-3 pr-3 font-medium text-gray-900">Participação</th>
                <td className="px-2 py-3 text-right">{formatPercent(resultado.participacao)}</td>
                <td className="px-2 py-3 text-right">{formatPercent(resumoAno.participacao)}</td>
                <td className="px-2 py-3 text-right">{formatDelta(resumoAno.participacao - resultado.participacao)} p.p.</td>
              </tr>
              <tr>
                <th scope="row" className="py-3 pr-3 font-medium text-gray-900">Estudantes avaliados</th>
                <td className="px-2 py-3 text-right">{resultado.alunosAvaliados}</td>
                <td className="px-2 py-3 text-right">{resumoAno.avaliados}</td>
                <td className="px-2 py-3 text-right">{formatDelta(resumoAno.avaliados - resultado.alunosAvaliados, String)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Dados de demonstração. As avaliações podem envolver estudantes e períodos diferentes;
          a diferença apresentada não mede, isoladamente, o efeito do método LUH.
        </p>
      </section>

      <HabilidadesResultados alunos={turmas.flatMap((turma) => turma.alunos)} ano={ano} avaliacao={avaliacaoIdx} />

      <h2 className="mt-6 text-lg font-semibold text-gray-900">Resultados no {redeMock.edicao}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DISCIPLINAS.map(({ codigo, nome }) => {
          const media = resultado.proficiencia[codigo];
          const delta = media - rede.proficiencia[codigo];
          return (
            <div key={codigo} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Proficiência em {nome}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatProficiencia(media)}</p>
              <p className="mt-1 text-xs text-gray-500">
                Nível {nivelDaProficiencia(ano, codigo, media)} ·{" "}
                <span className={deltaClass(delta)}>{formatDelta(delta)} vs. rede</span>
              </p>
            </div>
          );
        })}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Participação no Saeb</p>
          <p
            className={`mt-2 text-3xl font-bold ${
              resultado.participacao >= PARTICIPACAO_MINIMA_SAEB ? "text-gray-900" : "text-attention"
            }`}
          >
            {formatPercent(resultado.participacao)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {resultado.alunosAvaliados} alunos avaliados · mínimo {PARTICIPACAO_MINIMA_SAEB}%
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Método LUH · Turmas do {ano}º ano</h2>
            <p className="mt-1 text-sm text-gray-500">
              {avaliacaoSelecionada.nome} LUH ({formatData(avaliacaoSelecionada.data)}) ·{" "}
              {resumoAno.avaliados} de {resumoAno.matriculados} estudantes avaliados
            </p>
          </div>
          <Link
            href={`/escolas/${escola.id}/anos/${ano}`}
            className="text-sm font-medium text-brand hover:underline"
          >
            Ver o {ano}º ano completo →
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {turmas.map((turma) => {
            const r = resumir(turma.alunos, ano, avaliacaoIdx);
            return (
              <li key={turma.id}>
                <Link
                  href={`/escolas/${escola.id}/anos/${ano}/turmas/${turma.id}`}
                  className="group block rounded-lg border border-gray-200 p-4 transition hover:border-brand-muted hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 group-hover:text-brand">{turma.nome}</p>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand" aria-hidden />
                  </div>
                  <p className="text-xs text-gray-500">
                    {turma.turno} · {turma.alunos.length} estudantes · participação{" "}
                    {formatPercent(r.participacao)}
                  </p>
                  <div className="mt-3 space-y-2">
                    {DISCIPLINAS.map(({ codigo }) => (
                      <div key={codigo} className="flex items-center gap-3 text-xs">
                        <span className="w-6 text-gray-500">{codigo}</span>
                        <div className="flex-1">
                          <PadroesBarra contagem={r.padroes[codigo]} compacta />
                        </div>
                        <span className="w-12 text-right font-medium text-gray-900">
                          {formatProficiencia(r.media[codigo])}
                        </span>
                      </div>
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Padrões de desempenho · Saeb</h2>
        <p className="mt-1 text-sm text-gray-500">
          Distribuição dos alunos do {ano}º ano nos padrões da escala Saeb
        </p>
        <div className="mt-5 space-y-6">
          {DISCIPLINAS.map(({ codigo, nome }) => {
            const media = resultado.proficiencia[codigo];
            const padroes = distribuicaoPadroes(ano, codigo, media);
            return (
              <div key={codigo}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-gray-900">{nome}</span>
                  <span className="text-gray-600">
                    Aprendizado adequado:{" "}
                    <span className="font-semibold text-gray-900">
                      {formatPercent(aprendizadoAdequado(ano, codigo, media))}
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex h-4 overflow-hidden rounded-full bg-gray-100">
                  {padroes.map((p) => (
                    <div
                      key={p.padrao}
                      className={corPadrao[p.padrao]}
                      style={{ width: `${p.percentual}%` }}
                      title={`${p.padrao}: ${formatPercent(p.percentual)}`}
                    />
                  ))}
                </div>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
                  {padroes.map((p) => (
                    <li key={p.padrao} className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-sm ${corPadrao[p.padrao]}`} aria-hidden />
                      {p.padrao} ({p.intervalo}):{" "}
                      <span className="font-medium text-gray-900">{formatPercent(p.percentual)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {DISCIPLINAS.map(({ codigo, nome }) => {
          const media = resultado.proficiencia[codigo];
          const niveis = distribuicaoNiveis(ano, codigo, media);
          const max = Math.max(...niveis.map((n) => n.percentual), 1);
          const nivelMedio = nivelDaProficiencia(ano, codigo, media);
          return (
            <div key={codigo} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Níveis da escala · {nome}</h2>
              <p className="mt-1 text-sm text-gray-500">
                % de alunos por nível de proficiência ({ano}º ano). Média da escola no Nível{" "}
                {nivelMedio}.
              </p>
              <ul className="mt-5 space-y-2">
                {niveis.map((n) => (
                  <li key={n.nivel} className="flex items-center gap-3 text-sm">
                    <span
                      className={`w-16 shrink-0 ${
                        n.nivel === nivelMedio ? "font-semibold text-brand" : "text-gray-700"
                      }`}
                    >
                      Nível {n.nivel}
                    </span>
                    <span className="w-16 shrink-0 text-xs text-gray-400">{n.intervalo}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${
                          n.nivel === nivelMedio ? "bg-brand" : "bg-brand-muted"
                        }`}
                        style={{ width: `${(n.percentual / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-xs text-gray-600">
                      {formatPercent(n.percentual)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Fluxo escolar</h2>
          <p className="mt-1 text-sm text-gray-500">
            Taxa de aprovação (Censo Escolar) e participação no Saeb
          </p>
          <dl className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <dt className="text-sm text-gray-700">Taxa de aprovação</dt>
              <dd className="text-lg font-bold text-gray-900">{formatPercent(resultado.aprovacao)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-brand-soft px-4 py-3">
              <dt className="text-sm font-medium text-brand">Participação no Saeb</dt>
              <dd className="text-lg font-bold text-brand">
                {formatPercent(resultado.participacao)}
                {resultado.participacao < PARTICIPACAO_MINIMA_SAEB && (
                  <span className="ml-1 text-xs font-normal">(abaixo do mínimo)</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Escola, rede e referência nacional</h2>
          <p className="mt-1 text-sm text-gray-500">{ano}º ano · {etapa}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[24rem] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="py-2 pr-3 font-medium">Indicador</th>
                  <th className="px-2 py-2 text-right font-medium">Escola</th>
                  <th className="px-2 py-2 text-right font-medium">Rede</th>
                  <th className="px-2 py-2 text-right font-medium">Nacional</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {DISCIPLINAS.map(({ codigo, nome }) => (
                  <tr key={codigo} className="border-b border-gray-100">
                    <td className="py-3 pr-3 font-medium text-gray-900">{nome}</td>
                    <td className="px-2 py-3 text-right">{formatProficiencia(resultado.proficiencia[codigo])}</td>
                    <td className="px-2 py-3 text-right">{formatProficiencia(rede.proficiencia[codigo])}</td>
                    <td className="px-2 py-3 text-right">{formatProficiencia(referencia.proficiencia[codigo])}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-3 font-medium text-gray-900">Participação</td>
                  <td className="px-2 py-3 text-right">{formatPercent(resultado.participacao)}</td>
                  <td className="px-2 py-3 text-right">{formatPercent(rede.participacao)}</td>
                  <td className="px-2 py-3 text-right text-gray-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Leituras pedagógicas</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          {leituras.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-xs text-gray-400">
        Dados fictícios para demonstração. Distribuições por nível e padrão são aproximações.
      </p>
    </div>
  );
}
