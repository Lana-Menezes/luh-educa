import { checkPostTableExists } from "@/lib/db-utils";
import { ANO_POR_ETAPA, DISCIPLINAS, PARTICIPACAO_MINIMA_SAEB, formatDelta, formatPercent, formatProficiencia, nivelDaProficiencia } from "@/lib/saeb";
import {
  AVALIACOES,
  ETAPAS,
  etapasDaEscola,
  getResultadoRede,
  getTurmas,
  indiceAvaliacao,
  motivosAtencaoAvaliacao,
  redeMock,
  resumir,
  type Etapa,
  type MotivoAtencao,
  type ResumoAvaliacao,
} from "@/lib/mock-data";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import EscolaFinder from "./EscolaFinder";
import AvaliacaoDropdown from "./AvaliacaoDropdown";
import { parseFiltros } from "./filtros";
import { AvaliacaoSync } from "../AvaliacaoSync";
import { AVALIACAO_COOKIE } from "@/lib/avaliacao-cookie";

export const dynamic = "force-dynamic";

function deltaClass(value: number) {
  return value >= 0 ? "text-success" : "text-attention";
}

export default async function EscolasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const tableExists = await checkPostTableExists();
  if (!tableExists) {
    redirect("/setup");
  }

  const rede = redeMock;
  const resolvedSearchParams = await searchParams;
  const avaliacaoParam =
    typeof resolvedSearchParams.avaliacao === "string" ? resolvedSearchParams.avaliacao : undefined;
  const avaliacaoCookie = (await cookies()).get(AVALIACAO_COOKIE)?.value;
  const avaliacaoIdx = indiceAvaliacao(avaliacaoParam, avaliacaoCookie);
  const avaliacaoSelecionada = AVALIACOES[avaliacaoIdx];

  const totalAlunos = rede.escolas.reduce(
    (sum, escola) =>
      sum + ETAPAS.reduce((s, etapa) => s + (escola.resultados[etapa]?.alunosAvaliados ?? 0), 0),
    0,
  );
  const resumosPorEscola: Record<string, Partial<Record<Etapa, ResumoAvaliacao>>> = {};
  const motivosPorEscola: Record<string, MotivoAtencao[]> = {};
  for (const escola of rede.escolas) {
    const porEtapaEscola: Partial<Record<Etapa, ResumoAvaliacao>> = {};
    for (const etapa of etapasDaEscola(escola)) {
      const alunos = getTurmas(escola, etapa).flatMap((t) => t.alunos);
      porEtapaEscola[etapa] = resumir(alunos, ANO_POR_ETAPA[etapa], avaliacaoIdx);
    }
    resumosPorEscola[escola.id] = porEtapaEscola;
    motivosPorEscola[escola.id] = motivosAtencaoAvaliacao(escola, avaliacaoIdx);
  }
  const escolasEmAtencao = Object.values(motivosPorEscola).filter((m) => m.length > 0).length;
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
  const initialFiltros = parseFiltros(resolvedSearchParams);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <AvaliacaoSync atual={avaliacaoIdx} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          {rede.nome}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Escolas · <span className="text-brand">{rede.municipio}</span>/{rede.uf}
        </h1>
        <p className="mt-2 text-gray-600">
          Resultados das escolas municipais no {rede.edicao} (Sistema de Avaliação da Educação
          Básica) · 2º, 5º e 9º ano do Ensino Fundamental
        </p>
      </div>

      <div className="mt-4">
        <AvaliacaoDropdown avaliacoes={AVALIACOES} atual={avaliacaoIdx} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Escolas avaliadas</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{rede.escolas.length}</p>
          <p className="mt-1 text-xs text-gray-500">
            {totalAlunos.toLocaleString("pt-BR")} alunos avaliados no Saeb
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
          <p className="text-sm text-gray-500">Escolas que precisam de atenção</p>
          <p className="mt-2 text-3xl font-bold text-attention">{escolasEmAtencao}</p>
          <p className="mt-1 text-xs text-gray-500">
            Proficiência abaixo da referência ou participação &lt; {PARTICIPACAO_MINIMA_SAEB}%
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

      <EscolaFinder
        escolas={rede.escolas}
        referenciaNacional={rede.referenciaNacional}
        initialFiltros={initialFiltros}
        resumosPorEscola={resumosPorEscola}
        motivosPorEscola={motivosPorEscola}
        avaliacaoIdx={avaliacaoIdx}
      />

      <p className="mt-6 text-xs text-gray-400">
        Dados fictícios para demonstração. Referências nacionais ilustrativas.
      </p>
    </div>
  );
}
