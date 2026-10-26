import { notFound } from "next/navigation";
import { getEscola, redeMock } from "@/lib/rede-mock";
import {
  DISCIPLINAS,
  formatDelta,
  formatPercent,
  formatProficiencia,
  nivelDaProficiencia,
} from "@/lib/saeb";
import {
  AVALIACOES,
  AVALIACAO_ATUAL,
  estaInsuficiente,
  formatData,
  getTurma,
  getTurmas,
  resultadoAtual,
  resumir,
} from "@/lib/turmas-mock";
import { Breadcrumb, PadroesBarra, StatCard, deltaClass } from "../../../../../ui";
import AlunosTabela from "./AlunosTabela";

export default async function TurmaPage({
  params,
}: {
  params: Promise<{ escolaId: string; ano: string; turmaId: string }>;
}) {
  const { escolaId, ano: anoParam, turmaId } = await params;
  const escola = getEscola(escolaId);
  const turma = escola && getTurma(escola, Number(anoParam), turmaId);

  if (!escola || !turma) {
    notFound();
  }

  const { ano, etapa } = turma;
  const resumo = resumir(turma.alunos, ano);
  const resumoAno = resumir(getTurmas(escola, etapa).flatMap((t) => t.alunos), ano);
  const evolucao = AVALIACOES.map((avaliacao, i) => ({ avaliacao, resumo: resumir(turma.alunos, ano, i) }));
  const ausentes = turma.alunos.filter((a) => resultadoAtual(a) === null);
  const anoHref = `/escolas/${escola.id}/anos/${ano}`;
  const maxEvolucao = Math.max(...evolucao.flatMap(({ resumo: r }) => [r.media.LP, r.media.MT]));

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/dashboard" },
          { label: escola.nome, href: `/escolas/${escola.id}?etapa=${encodeURIComponent(etapa)}` },
          { label: `${ano}º ano`, href: anoHref },
          { label: turma.nome },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        {turma.nome} <span className="text-brand">{escola.nome}</span>
      </h1>
      <p className="mt-2 text-gray-600">
        Turno da {turma.turno.toLowerCase()} · {turma.alunos.length} estudantes · {AVALIACAO_ATUAL.nome} (
        {formatData(AVALIACAO_ATUAL.data)})
      </p>

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
          label="Com padrão Insuficiente"
          value={turma.alunos.filter((a) => estaInsuficiente(a, ano)).length}
          valueClassName="text-danger"
          detail="Em Língua Portuguesa ou Matemática"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Padrões de desempenho da turma</h2>
          <div className="mt-5 space-y-6">
            {DISCIPLINAS.map(({ codigo, nome }) => (
              <PadroesBarra key={codigo} titulo={nome} contagem={resumo.padroes[codigo]} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Evolução da turma</h2>
          <p className="mt-1 text-sm text-gray-500">Média nas avaliações do ano (escala Saeb)</p>
          <div className="mt-5 space-y-4">
            {evolucao.map(({ avaliacao, resumo: r }) => (
              <div key={avaliacao.id}>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{avaliacao.nome}</span>{" "}
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
        </section>
      </div>

      <AlunosTabela alunos={turma.alunos} ano={ano} baseHref={`${anoHref}/turmas/${turma.id}`} />
    </div>
  );
}
