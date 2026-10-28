import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { authOptions } from "@/auth";
import { AVALIACAO_COOKIE } from "@/lib/avaliacao-cookie";
import { formatPercent } from "@/lib/saeb";
import {
  AVALIACOES,
  ETAPAS,
  getTurmas,
  indiceAvaliacao,
  motivosAtencaoAvaliacao,
  precisaAtencaoAvaliacao,
  redeMock,
  resumir,
} from "@/lib/mock-data";
import AvaliacaoDropdown from "../escolas/AvaliacaoDropdown";
import { CurvaEvolucao, rotuloAvaliacaoCurto } from "../escolas/ui";
import { AvaliacaoSync } from "../AvaliacaoSync";

export const dynamic = "force-dynamic";

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
    ETAPAS.flatMap((etapa) => getTurmas(escola, etapa).flatMap((t) => t.alunos)),
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
            {saudacao(new Date().getHours())}, {nomeUsuario}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand">Resumo das avaliações</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Link href={`/escolas?avaliacao=${avaliacaoIdx}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Explorar escolas</Link>
          <Link href="/avaliacoes" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft">Ver provas</Link>
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
          <h2 className="text-lg font-semibold text-gray-900">Progresso mês a mês · rede municipal</h2>
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
                        {motivos.map((m) => `${m.etapa}: ${m.motivo}`).join(" · ")}
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
