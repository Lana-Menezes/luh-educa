import HabilidadesResultados from "@/app/escolas/HabilidadesResultados";
import { notFound } from "next/navigation";
import {
  AVALIACOES,
  estaInsuficiente,
  formatData,
  getEscola,
  getTurma,
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
} from "../../../../../ui";
import AlunosTabela from "./AlunosTabela";

export default async function TurmaPage({
  params,
  searchParams,
}: {
  params: Promise<{ escolaId: string; ano: string; turmaId: string }>;
  searchParams: Promise<{ avaliacao?: string }>;
}) {
  const { escolaId, ano: anoParam, turmaId } = await params;
  const escola = getEscola(escolaId);
  const turma = escola && getTurma(escola, Number(anoParam), turmaId);

  if (!escola || !turma) {
    notFound();
  }

  const { ano, etapa } = turma;
  const { avaliacao: avaliacaoParam } = await searchParams;
  const avaliacaoIdx = indiceAvaliacao(avaliacaoParam);
  const avaliacaoSelecionada = AVALIACOES[avaliacaoIdx];
  const resumo = resumir(turma.alunos, ano, avaliacaoIdx);
  const resumoAno = resumir(getTurmas(escola, etapa).flatMap((t) => t.alunos), ano, avaliacaoIdx);
  const evolucao = AVALIACOES.map((avaliacao, i) => ({ avaliacao, resumo: resumir(turma.alunos, ano, i) }));
  const ausentes = turma.alunos.filter((a) => (a.resultados[avaliacaoIdx] ?? null) === null);
  const anoHref = `/escolas/${escola.id}/anos/${ano}`;
  const maxEvolucao = Math.max(...evolucao.flatMap(({ resumo: r }) => [r.media.LP, r.media.MT]));

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-none bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/escolas" },
          { label: escola.nome, href: `/escolas/${escola.id}?etapa=${encodeURIComponent(etapa)}` },
          { label: `${ano}º ano`, href: anoHref },
          { label: turma.nome },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        {turma.nome} <span className="text-brand">{escola.nome}</span>
      </h1>
      <p className="mt-2 text-gray-600">
        Turno da {turma.turno.toLowerCase()} · {turma.alunos.length} estudantes · {avaliacaoSelecionada.nome} (
        {formatData(avaliacaoSelecionada.data)})
      </p>

      <div className="mt-4">
        <AvaliacaoSeletor
          avaliacoes={AVALIACOES}
          atual={avaliacaoIdx}
          hrefFor={(i) => `${anoHref}/turmas/${turma.id}?avaliacao=${i}`}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Estudantes avaliados"
          value={`${resumo.avaliados}/${resumo.matriculados}`}
          detail={
            ausentes.length > 0
              ? `${ausentes.length} ausente${ausentes.length > 1 ? "s" : ""} · participação de ${formatPercent(resumo.participacao)}`
              : "Todos os estudantes participaram"
          }
        />
        {DISCIPLINAS.map(({ codigo, nome }) => {
          const delta = resumo.media[codigo] - resumoAno.media[codigo];
          return (
            <StatCard
              key={codigo}
              label={`Média em ${nome}`}
              value={formatProficiencia(resumo.media[codigo])}
              detail={
                <>
                  Nível {nivelDaProficiencia(ano, codigo, resumo.media[codigo])} ·{" "}
                  <span className={deltaClass(delta)}>{formatDelta(delta)} vs. {ano}º ano</span>
                </>
              }
            />
          );
        })}
        <StatCard
          label="Com padrão Abaixo do Básico"
          value={turma.alunos.filter((a) => estaInsuficiente(a, ano, avaliacaoIdx)).length}
          valueClassName="text-danger"
          detail="Em Língua Portuguesa ou Matemática"
        />
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Padrões de desempenho da turma</h2>
          <div className="mt-5 space-y-6">
            {DISCIPLINAS.map(({ codigo, nome }) => (
              <PadroesBarra key={codigo} titulo={nome} contagem={resumo.padroes[codigo]} />
            ))}
          </div>
        </section>

        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Progresso mês a mês</h2>
          <p className="mt-1 text-sm text-gray-500">Média da turma nas avaliações do ano (escala Saeb)</p>
          <div className="mt-4 w-full overflow-x-auto">
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

        </section>
        <section id="estudantes" className="col-span-full min-w-0 w-full [&>details]:mt-0">
          <AlunosTabela
            alunos={turma.alunos}
            ano={ano}
            baseHref={`${anoHref}/turmas/${turma.id}`}
            avaliacaoIndex={avaliacaoIdx}
            avaliacaoNome={avaliacaoSelecionada.nome}
          />
        </section>

        {/* <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Detalhe por avaliação</h2>
          <p className="mt-1 text-sm text-gray-500">Média da turma nas avaliações do ano (escala Saeb)</p>
          <div className="mt-5 space-y-4">
            {evolucao.map(({ avaliacao, resumo: r }, i) => (
              <div key={avaliacao.id} className={i === avaliacaoIdx ? "-mx-2 rounded-lg bg-brand-soft/60 px-2 py-1" : ""}>
                <p className="text-sm text-gray-700">
                  <span className={`font-medium ${i === avaliacaoIdx ? "text-brand" : "text-gray-900"}`}>
                    {avaliacao.nome}
                  </span>{" "}
                  <span className="text-xs text-gray-500">· {formatData(avaliacao.data)}</span>
                </p>
                {DISCIPLINAS.map(({ codigo }) => (
                  <div key={codigo} className="mt-1.5 flex items-center gap-3 text-xs">
                    <span className="w-6 text-gray-500">{codigo}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${codigo === "LP" ? "bg-brand" : "bg-brand-muted"}`}
                        style={{ width: `${(r.media[codigo] / maxEvolucao) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-medium text-gray-900">
                      {formatProficiencia(r.media[codigo])}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section> */}
      </div>

      <HabilidadesResultados alunos={turma.alunos} ano={ano} avaliacao={avaliacaoIdx} matriz />


    </div>
  );
}
