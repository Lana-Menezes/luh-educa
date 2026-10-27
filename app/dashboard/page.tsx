import Link from "next/link";
import { ETAPAS, getResultadoRede, redeMock } from "@/lib/rede-mock";
import { DISCIPLINAS, formatDelta, formatPercent, formatProficiencia, nivelDaProficiencia } from "@/lib/saeb";
import { AVALIACOES, getTurmas, indiceAvaliacao, resumir } from "@/lib/turmas-mock";
import AvaliacaoDropdown from "../escolas/AvaliacaoDropdown";

export const dynamic = "force-dynamic";

function deltaClass(value: number) {
  return value >= 0 ? "text-success" : "text-attention";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rede = redeMock;
  const resolvedSearchParams = await searchParams;
  const avaliacaoParam =
    typeof resolvedSearchParams.avaliacao === "string" ? resolvedSearchParams.avaliacao : undefined;
  const avaliacaoIdx = indiceAvaliacao(avaliacaoParam);
  const avaliacaoSelecionada = AVALIACOES[avaliacaoIdx];

  const porEtapa = ETAPAS.map((etapa) => {
    const resultado = getResultadoRede(etapa);
    const alunosEtapa = rede.escolas.flatMap((escola) => getTurmas(escola, etapa).flatMap((t) => t.alunos));
    const resumoAvaliacao = resumir(alunosEtapa, resultado.ano, avaliacaoIdx);
    return {
      etapa,
      resultado,
      resumoAvaliacao,
      referencia: rede.referenciaNacional[etapa],
      escolas: rede.escolas.filter((escola) => escola.resultados[etapa]).length,
    };
  });
  const totalAlunos = porEtapa.reduce((total, item) => total + item.resumoAvaliacao.avaliados, 0);
  const matriculados = porEtapa.reduce((total, item) => total + item.resumoAvaliacao.matriculados, 0);
  const participacao = matriculados ? (totalAlunos / matriculados) * 100 : 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          {rede.nome}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Resumo das avaliações
        </h1>
        <p className="mt-2 text-gray-600">
          Acompanhe a aprendizagem em {rede.municipio}/{rede.uf} · 2º, 5º e 9º ano do Ensino Fundamental
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Link href={`/escolas?avaliacao=${avaliacaoIdx}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Explorar escolas</Link>
          <Link href="/avaliacoes" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft">Ver provas</Link>
        </div>
        <AvaliacaoDropdown avaliacoes={AVALIACOES} atual={avaliacaoIdx} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Escolas avaliadas</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{rede.escolas.length}</p>
          <p className="mt-1 text-xs text-gray-500">
            {totalAlunos.toLocaleString("pt-BR")} alunos em {avaliacaoSelecionada.nome}
          </p>
        </div>
        {porEtapa.map(({ etapa, resumoAvaliacao, referencia }) => {
          const mediaRede = (resumoAvaliacao.media.LP + resumoAvaliacao.media.MT) / 2;
          const mediaReferencia = (referencia.proficiencia.LP + referencia.proficiencia.MT) / 2;
          return (
            <div key={etapa} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Proficiência média · {etapa} ({avaliacaoSelecionada.nome})
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatProficiencia(mediaRede)}</p>
              <p className={`mt-1 text-xs ${deltaClass(mediaRede - mediaReferencia)}`}>
                {formatDelta(mediaRede - mediaReferencia)} vs. referência nacional (
                {formatProficiencia(mediaReferencia)})
              </p>
            </div>
          );
        })}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Participação na avaliação</p>
          <p className="mt-2 text-3xl font-bold text-attention">{formatPercent(participacao)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {totalAlunos.toLocaleString("pt-BR")} de {matriculados.toLocaleString("pt-BR")} estudantes
          </p>
        </div>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {porEtapa.map(({ etapa, resultado, resumoAvaliacao, referencia, escolas }) => (
          <div key={etapa} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{etapa}</p>
                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  {avaliacaoSelecionada.nome} · {resultado.ano}º ano · rede municipal
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {escolas} escolas · {resumoAvaliacao.avaliados.toLocaleString("pt-BR")} alunos avaliados
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>
                  Participação{" "}
                  <span className="font-semibold text-gray-900">
                    {formatPercent(resumoAvaliacao.participacao)}
                  </span>
                </p>
                <p className="mt-1">
                  Aprovação (Censo Escolar){" "}
                  <span className="font-semibold text-gray-900">
                    {formatPercent(resultado.aprovacao)}
                  </span>
                </p>
              </div>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {DISCIPLINAS.map(({ codigo, nome }) => {
                const media = resumoAvaliacao.media[codigo];
                const delta = media - referencia.proficiencia[codigo];
                const adequado = resumoAvaliacao.adequado[codigo];

                return (
                  <div key={codigo} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <dt className="text-sm font-medium text-gray-900">{nome}</dt>
                    <dd className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatProficiencia(media)}
                      </span>
                      <span className={`text-xs font-medium ${deltaClass(delta)}`}>
                        {formatDelta(delta)} vs. nacional
                      </span>
                    </dd>
                    <dd className="mt-1 text-xs text-gray-500">
                      Nível {nivelDaProficiencia(resultado.ano, codigo, media)} da escala Saeb
                    </dd>
                    <dd className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Aprendizado adequado</span>
                        <span className="font-semibold text-gray-900">{formatPercent(adequado)}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${adequado}%` }} />
                      </div>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Calendário de avaliações</h2>
        <p className="mt-1 text-sm text-gray-500">Ciclo demonstrativo de 2026 · 1 diagnóstica, 8 formativas e 1 somativa. Selecione uma avaliação para consultar o resumo.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {AVALIACOES.map((avaliacao, index) => (
            <Link key={avaliacao.id} href={`/dashboard?avaliacao=${index}`} aria-current={index === avaliacaoIdx ? "page" : undefined}
              className={`rounded-lg border p-4 transition hover:border-brand ${index === avaliacaoIdx ? "border-brand bg-brand-soft" : "border-gray-200"}`}>
              <p className="text-xs text-gray-500">{avaliacao.periodo}</p>
              <p className="mt-1 text-sm font-semibold text-brand">{avaliacao.nome}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-6 text-xs text-gray-400">
        Dados fictícios para demonstração. Referências nacionais ilustrativas.
      </p>
    </div>
  );
}
