import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ANOS_VALIDOS,
  getAlunoMock,
  getMetricasMock,
} from "@/lib/alunos-mock";

function formatMedia(value: number) {
  return value.toFixed(1).replace(".", ",");
}

export default async function AlunoDashboardPage({
  params,
}: {
  params: Promise<{ ano: string; alunoId: string }>;
}) {
  const { ano: anoParam, alunoId: alunoIdParam } = await params;
  const ano = parseInt(anoParam, 10);
  const alunoId = parseInt(alunoIdParam, 10);

  if (!ANOS_VALIDOS.has(ano) || Number.isNaN(alunoId)) {
    notFound();
  }

  const aluno = getAlunoMock(ano, alunoId);
  if (!aluno) {
    notFound();
  }

  const metricas = getMetricasMock(aluno.id);
  const maxEvolucao = Math.max(...metricas.evolucao.map((item) => item.media), 10);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Link
        href={`/turmas/${ano}`}
        className="text-sm font-medium text-brand hover:underline"
      >
        ← Voltar para {ano}º ano
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold text-gray-900">{aluno.nome}</h1>
        <p className="mt-1 text-gray-600">
          {ano}º ano · Matrícula {aluno.matricula} · Dashboard de desempenho
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Média geral</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatMedia(metricas.mediaGeral)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Escala 0–10</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Frequência</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metricas.frequencia}%
          </p>
          <p className="mt-1 text-xs text-gray-500">Presença no período</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Atividades</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metricas.atividadesConcluidas}/{metricas.atividadesTotais}
          </p>
          <p className="mt-1 text-xs text-gray-500">Concluídas neste bimestre</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Ranking na turma</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metricas.rankingTurma}º
          </p>
          <p className="mt-1 text-xs text-gray-500">
            de {metricas.totalAlunosTurma} alunos
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Desempenho por disciplina
          </h2>
          <ul className="mt-4 space-y-4">
            {metricas.disciplinas.map((disciplina) => (
              <li key={disciplina.nome}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">
                    {disciplina.nome}
                  </span>
                  <span className="text-gray-600">
                    média {formatMedia(disciplina.media)} · {disciplina.progresso}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${disciplina.progresso}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Evolução da média
          </h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {metricas.evolucao.map((item) => (
              <div
                key={item.mes}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-medium text-gray-600">
                  {formatMedia(item.media)}
                </span>
                <div
                  className="w-full rounded-t-md bg-brand"
                  style={{
                    height: `${(item.media / maxEvolucao) * 100}%`,
                    minHeight: "8px",
                  }}
                  title={`${item.mes}: ${formatMedia(item.media)}`}
                />
                <span className="text-xs text-gray-500">{item.mes}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Alertas e recomendações</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          {metricas.alertas.map((alerta) => (
            <li key={alerta}>{alerta}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
