import Link from "next/link";
import { notFound } from "next/navigation";
import { ANOS_VALIDOS, getAlunosMock } from "@/lib/alunos-mock";
import {
  formatPercent,
  formatTRI,
  getTurmaMetricasMock,
} from "@/lib/turma-tri-mock";

export default async function TurmaAnoPage({
  params,
}: {
  params: Promise<{ ano: string }>;
}) {
  const { ano: anoParam } = await params;
  const ano = parseInt(anoParam, 10);

  if (!ANOS_VALIDOS.has(ano)) {
    notFound();
  }

  const alunos = getAlunosMock(ano);
  const metricas = getTurmaMetricasMock(ano);
  const deltaEscola = metricas.mediaTRI - metricas.mediaEscola;
  const maxFaixa = Math.max(...metricas.faixas.map((item) => item.percentual), 1);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <div>
        <Link
          href="/turmas"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Voltar para turmas
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {ano}º ano{" "}
          <span className="text-brand">Colégio Bom Jesus</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Dashboard TRI da turma · {alunos.length} alunos
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Média TRI da turma</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatTRI(metricas.mediaTRI)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Escala de proficiência (régua TRI)
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">vs. média da escola</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                deltaEscola >= 0 ? "text-success" : "text-accent-ink"
              }`}
            >
              {deltaEscola >= 0 ? "+" : ""}
              {formatTRI(deltaEscola)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Escola: {formatTRI(metricas.mediaEscola)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Frequência média</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatPercent(metricas.frequenciaMedia)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Participação: {formatPercent(metricas.taxaParticipacao)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Nível adequado+</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {metricas.alunosAdequadoOuAcima}/{metricas.totalAlunos}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Coerência TRI:{" "}
              {metricas.indiceCoerencia.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Proficiência por área (TRI)
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {metricas.areas.map((area) => (
                <li
                  key={area.codigo}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    {area.codigo}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-600">{area.nome}</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatTRI(area.media)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Distribuição na régua TRI
            </h2>
            <ul className="mt-3 space-y-2.5">
              {metricas.faixas.map((faixa) => (
                <li key={faixa.faixa}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-800">{faixa.faixa}</span>
                    <span className="text-gray-500">
                      {formatPercent(faixa.percentual)} · {faixa.alunos}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{
                        width: `${(faixa.percentual / maxFaixa) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">
            Leituras da turma
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {metricas.destaques.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm text-gray-600">
          Lista de alunos — clique em um aluno para ver o desempenho individual
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full table-fixed text-left text-sm">
            <colgroup>
              <col className="w-1/3" />
              <col className="w-1/3" />
              <col className="w-1/3" />
            </colgroup>
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Matrícula</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno, index) => (
                <tr
                  key={aluno.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-brand-soft"
                >
                  <td className="p-0">
                    <Link
                      href={`/turmas/${ano}/${aluno.id}`}
                      className="block px-4 py-3 text-gray-500"
                    >
                      {index + 1}
                    </Link>
                  </td>
                  <td className="p-0">
                    <Link
                      href={`/turmas/${ano}/${aluno.id}`}
                      className="block px-4 py-3 font-medium text-gray-900"
                    >
                      {aluno.nome}
                    </Link>
                  </td>
                  <td className="p-0">
                    <Link
                      href={`/turmas/${ano}/${aluno.id}`}
                      className="block px-4 py-3 text-gray-600"
                    >
                      {aluno.matricula}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
