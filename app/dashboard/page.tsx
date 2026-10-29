import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { AlertTriangle, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { authOptions } from "@/auth";
import { AVALIACAO_COOKIE } from "@/lib/avaliacao-cookie";
import { ANOS_SAEB, APROVACAO_MINIMA_VAAR, PARTICIPACAO_MINIMA_SAEB, TETO_VAAR, formatDelta, formatPercent, formatProficiencia } from "@/lib/saeb";
import {
  AVALIACOES,
  getResultadoRede,
  getTurmas,
  indiceAvaliacao,
  motivosAtencaoAvaliacao,
  precisaAtencaoAvaliacao,
  redeMock,
  resumir,
  statusVaarDaEscola,
  statusVaarDaRede,
  type Zona,
} from "@/lib/mock-data";
import AvaliacaoDropdown from "../escolas/AvaliacaoDropdown";
import { CurvaEvolucao, rotuloAvaliacaoCurto } from "../escolas/ui";
import { AvaliacaoSync } from "../AvaliacaoSync";

export const dynamic = "force-dynamic";

/** Hora atual no fuso do Brasil (America/Sao_Paulo), independente do fuso do servidor. */
function horaNoBrasil() {
  return Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
  );
}

/** Saudação conforme o horário: madrugada e manhã (bom dia), tarde (boa tarde), noite (boa noite). */
function saudacao(hora: number) {
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rede = redeMock;
  const session = await getServerSession(authOptions);
  const nomeUsuario = session?.user?.name || session?.user?.email || "professor(a)";
  const resolvedSearchParams = await searchParams;
  const avaliacaoParam =
    typeof resolvedSearchParams.avaliacao === "string" ? resolvedSearchParams.avaliacao : undefined;
  const avaliacaoCookie = (await cookies()).get(AVALIACAO_COOKIE)?.value;
  const avaliacaoIdx = indiceAvaliacao(avaliacaoParam, avaliacaoCookie);
  const avaliacaoSelecionada = AVALIACOES[avaliacaoIdx];

  const todosAlunos = rede.escolas.flatMap((escola) =>
    ANOS_SAEB.flatMap((ano) => getTurmas(escola, ano).flatMap((t) => t.alunos)),
  );
  const matriculados = todosAlunos.length;
  const totalAlunos = todosAlunos.filter((a) => a.resultados[avaliacaoIdx] !== null).length;
  const participacao = matriculados ? (totalAlunos / matriculados) * 100 : 0;

  const evolucaoRede = AVALIACOES.map((avaliacao, k) => {
    const resumo = resumir(todosAlunos, 5, k);
    return {
      id: avaliacao.id,
      rotulo: rotuloAvaliacaoCurto(avaliacao.nome),
      selecionado: k === avaliacaoIdx,
      LP: resumo.media.LP,
      MT: resumo.media.MT,
    };
  });

  const escolasEmAtencao = rede.escolas.filter((escola) => precisaAtencaoAvaliacao(escola, avaliacaoIdx));

  const statusRedeVaar = statusVaarDaRede(rede, avaliacaoIdx);
  const statusEscolasVaar = rede.escolas.map((escola) => ({
    escola,
    status: statusVaarDaEscola(escola, avaliacaoIdx),
  }));
  const elegiveisVaarEscolas = statusEscolasVaar.filter((s) => s.status.elegivel).length;

  const censoPorAno = ANOS_SAEB.map((ano) => ({ ano, resultado: getResultadoRede(ano) }));

  const ZONAS: Zona[] = ["Urbana", "Rural"];
  const censoPorZona = ZONAS.map((zona) => {
    const escolasZona = rede.escolas.filter((escola) => escola.zona === zona);
    const resultadosZona = escolasZona.flatMap((escola) =>
      ANOS_SAEB.flatMap((ano) => escola.resultados[ano] ?? []),
    );
    const alunosZona = resultadosZona.reduce((sum, r) => sum + r.alunosAvaliados, 0);
    const ponderadoZona = (valor: (r: (typeof resultadosZona)[number]) => number) =>
      alunosZona
        ? resultadosZona.reduce((sum, r) => sum + valor(r) * r.alunosAvaliados, 0) / alunosZona
        : 0;
    return {
      zona,
      escolas: escolasZona.length,
      alunosAvaliados: alunosZona,
      aprovacao: ponderadoZona((r) => r.aprovacao),
      participacao: ponderadoZona((r) => r.participacao),
    };
  });

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8">
      <AvaliacaoSync atual={avaliacaoIdx} />
      <div className="flex items-center gap-3">
        <Image
          src="/brasao-mafra.svg"
          alt={`Brasão de ${rede.municipio}`}
          width={48}
          height={41}
          className="h-16 w-auto shrink-0"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            {rede.nome} · {rede.municipio}/{rede.uf}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {saudacao(horaNoBrasil())}, {nomeUsuario}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand">Resumo das avaliações</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Link href={`/escolas?avaliacao=${avaliacaoIdx}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Explorar escolas</Link>
          <Link href="/avaliacoes" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft">Provas</Link>
          <Link href="/planejamento" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft">Planejamento</Link>
        </div>
        <AvaliacaoDropdown avaliacoes={AVALIACOES} atual={avaliacaoIdx} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Escolas da rede</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{rede.escolas.length}</p>
            <p className="mt-1 text-xs text-gray-500">2º, 5º e 9º ano do Ensino Fundamental</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Participação em {avaliacaoSelecionada.nome}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatPercent(participacao)}</p>
            <p className="mt-1 text-xs text-gray-500">
              {totalAlunos.toLocaleString("pt-BR")} de {matriculados.toLocaleString("pt-BR")} estudantes
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Escolas que precisam de atenção</p>
            <p className="mt-2 text-3xl font-bold text-attention">{escolasEmAtencao.length}</p>
            <p className="mt-1 text-xs text-gray-500">Veja os detalhes no painel das escolas</p>
          </div>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Progresso mês a mês · Rede municipal</h2>
          <p className="mt-1 text-sm text-gray-500">
            Média da rede nas avaliações do ano, por Língua Portuguesa e Matemática (escala Saeb)
          </p>
          <div className="mt-4 overflow-x-auto">
            <CurvaEvolucao pontos={evolucaoRede} />
          </div>
        </section>
      </div>

      {escolasEmAtencao.length > 0 && (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Escolas que precisam de atenção</h2>
            <Link href={`/escolas?atencao=1&avaliacao=${avaliacaoIdx}`} className="text-sm font-medium text-brand hover:underline">
              Ver todas →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-gray-100">
            {escolasEmAtencao.slice(0, 5).map((escola) => {
              const motivos = motivosAtencaoAvaliacao(escola, avaliacaoIdx);
              return (
                <li key={escola.id}>
                  <Link
                    href={`/escolas/${escola.id}?avaliacao=${avaliacaoIdx}`}
                    className="group flex items-center gap-3 py-3 hover:bg-gray-50"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-attention" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 group-hover:text-brand">
                        {escola.nome}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {motivos.map((m) => `${m.ano}º ano: ${m.motivo}`).join(" · ")}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-brand" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Censo Escolar</h2>
        <p className="mt-1 text-sm text-gray-500">
          Matrículas, taxa de aprovação e participação no Saeb por ano e por zona (fonte oficial
          Inep).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {censoPorAno.map(({ ano, resultado }) => (
            <div key={ano} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">{ano}º ano</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {resultado.alunosAvaliados.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-gray-500">alunos avaliados no Saeb</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Aprovação</dt>
                  <dd className="font-semibold text-gray-900">{formatPercent(resultado.aprovacao)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Reprovação/abandono</dt>
                  <dd className="font-semibold text-attention">{formatPercent(100 - resultado.aprovacao)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Participação no Saeb</dt>
                  <dd className="font-semibold text-gray-900">{formatPercent(resultado.participacao)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Censo Escolar por zona da rede municipal</caption>
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Zona</th>
                <th className="px-2 py-2 font-medium">Escolas</th>
                <th className="px-2 py-2 text-right font-medium">Alunos avaliados</th>
                <th className="px-2 py-2 text-right font-medium">Aprovação</th>
                <th className="px-2 py-2 text-right font-medium">Participação no Saeb</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {censoPorZona.map((z) => (
                <tr key={z.zona} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 pr-3 font-medium text-gray-900">{z.zona}</td>
                  <td className="px-2 py-2.5">{z.escolas}</td>
                  <td className="px-2 py-2.5 text-right">{z.alunosAvaliados.toLocaleString("pt-BR")}</td>
                  <td className="px-2 py-2.5 text-right">{formatPercent(z.aprovacao)}</td>
                  <td className="px-2 py-2.5 text-right">{formatPercent(z.participacao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Dados de demonstração. &ldquo;Reprovação/abandono&rdquo; é o complemento da aprovação do
          Censo Escolar (100% − aprovação), sem distinguir as duas causas.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Acompanhamento para Redução de Desigualdades
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Metodologia oficial (Nota Técnica nº 2/2026/CGEFE/DIRED-INEP): cruza o Censo Escolar
              (participação no Saeb e aprovação) com a evolução, entre a Diagnóstica e{" "}
              {avaliacaoSelecionada.nome}, da proporção de estudantes do 5º/9º ano em
              vulnerabilidade - pretos, pardos e indígenas (PPI) e baixo nível socioeconômico - com
              desempenho adequado em LP e MT. A habilitação é apurada no nível da rede.
            </p>
          </div>
        </div>

        {statusRedeVaar.condicionalidadeIII.semEstudantesPrioritarios ? (
          <p className="mt-4 text-sm text-gray-600">
            Sem estudantes do 5º/9º ano avaliados nesta rede.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {statusRedeVaar.condicionalidadeIII.grupos.map((g) => (
              <div key={g.grupo} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900">
                  {g.grupo === "ppi" ? "Pretos, pardos e indígenas (PPI)" : "Baixo nível socioeconômico"}
                </p>
                {g.dadosInsuficientes ? (
                  <p className="mt-2 text-sm text-gray-500">
                    Menos de 10 estudantes avaliados — grupo não conta na habilitação.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPercent(g.proporcaoAtual ?? 0)}
                      </span>
                      <span className="text-xs text-gray-500">com desempenho adequado</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatPercent(g.proporcaoAnterior ?? 0)} na Diagnóstica · {g.participantesAtual}{" "}
                      estudantes
                    </p>
                    <p
                      className={`mt-2 inline-flex items-center gap-1 text-sm font-medium ${
                        g.habilitadoGrupo ? "text-success" : "text-attention"
                      }`}
                    >
                      {g.habilitadoGrupo ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden />
                      ) : (
                        <XCircle className="h-4 w-4" aria-hidden />
                      )}
                      {formatDelta(g.indice ?? 0, formatProficiencia)} p.p.
                      {g.tetoOk && (g.indice ?? 0) < 0
                        ? " (efeito teto)"
                        : g.dentroFaixa && (g.indice ?? 0) < 0
                          ? " (dentro da faixa de flutuação)"
                          : ""}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-gray-500">
          Faixa de flutuação aplicada: {statusRedeVaar.condicionalidadeIII.faixaFlutuacaoPP} p.p. (para{" "}
          {statusRedeVaar.condicionalidadeIII.totalEstudantes} estudantes do 5º/9º ano avaliados) ·
          efeito teto a partir de {TETO_VAAR}%.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Acompanhamento por escola</h3>
          <span className="text-xs text-gray-500">
            {elegiveisVaarEscolas}/{rede.escolas.length} escolas dentro das três frentes — referencial;
            a habilitação oficial é apurada pela rede
          </span>
        </div>
        <div className="mt-3 max-h-96 overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="sticky top-0 border-b border-gray-200 bg-white text-gray-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Escola</th>
                <th className="px-2 py-2 font-medium" title={`Participação no Saeb ≥ ${PARTICIPACAO_MINIMA_SAEB}%`}>
                  Participação Saeb
                </th>
                <th className="px-2 py-2 font-medium" title={`Aprovação (Censo Escolar) ≥ ${APROVACAO_MINIMA_VAAR}%`}>
                  Aprovação
                </th>
                <th className="px-2 py-2 font-medium" title="Variação da proporção de estudantes PPI com desempenho adequado">
                  Δ PPI
                </th>
                <th className="px-2 py-2 font-medium" title="Variação da proporção de estudantes de baixo NSE com desempenho adequado">
                  Δ Baixo NSE
                </th>
                <th className="px-2 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {statusEscolasVaar.map(({ escola, status }) => {
                const grupoPpi = status.condicionalidadeIII.grupos.find((g) => g.grupo === "ppi");
                const grupoNse = status.condicionalidadeIII.grupos.find((g) => g.grupo === "baixoNse");
                return (
                  <tr key={escola.id} className="border-b border-gray-100 last:border-0">
                    <td className="max-w-[12rem] truncate py-2.5 pr-3 font-medium text-gray-900">
                      {escola.nome}
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={`inline-flex items-center gap-1 ${status.participacaoSaebOk ? "text-gray-700" : "text-attention"}`}>
                        {status.participacaoSaebOk ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-attention" aria-hidden />
                        )}
                        {formatPercent(status.participacaoSaeb)}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={`inline-flex items-center gap-1 ${status.aprovacaoOk ? "text-gray-700" : "text-attention"}`}>
                        {status.aprovacaoOk ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-attention" aria-hidden />
                        )}
                        {formatPercent(status.aprovacao)}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      {!grupoPpi || grupoPpi.dadosInsuficientes ? (
                        <span className="text-xs text-gray-400">
                          dados insuf. ({grupoPpi?.participantesAtual ?? 0} alunos)
                        </span>
                      ) : (
                        <span className={`inline-flex flex-col ${grupoPpi.habilitadoGrupo ? "text-gray-700" : "text-attention"}`}>
                          <span className="inline-flex items-center gap-1">
                            {grupoPpi.habilitadoGrupo ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-attention" aria-hidden />
                            )}
                            {formatDelta(grupoPpi.indice ?? 0, formatProficiencia)} p.p.
                          </span>
                          <span className="text-xs text-gray-400">{grupoPpi.participantesAtual} alunos</span>
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2.5">
                      {!grupoNse || grupoNse.dadosInsuficientes ? (
                        <span className="text-xs text-gray-400">
                          dados insuf. ({grupoNse?.participantesAtual ?? 0} alunos)
                        </span>
                      ) : (
                        <span className={`inline-flex flex-col ${grupoNse.habilitadoGrupo ? "text-gray-700" : "text-attention"}`}>
                          <span className="inline-flex items-center gap-1">
                            {grupoNse.habilitadoGrupo ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-attention" aria-hidden />
                            )}
                            {formatDelta(grupoNse.indice ?? 0, formatProficiencia)} p.p.
                          </span>
                          <span className="text-xs text-gray-400">{grupoNse.participantesAtual} alunos</span>
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          status.elegivel ? "bg-success-soft text-success" : "bg-attention-soft text-attention-ink"
                        }`}
                      >
                        {status.elegivel ? "No caminho da Cond. III" : "Fora das condicionantes"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Dados de demonstração — pertencimento PPI e nível socioeconômico são ilustrativos. A
          habilitação oficial na Condicionalidade III é apurada no nível da rede, comparando Saeb
          2023 e Saeb 2025; aqui, por escola, usa-se a Diagnóstica e {avaliacaoSelecionada.nome} como
          referência de acompanhamento.
        </p>
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
