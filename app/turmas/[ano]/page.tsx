import Link from "next/link";
import { notFound } from "next/navigation";
import { ANOS_VALIDOS, getAlunosMock } from "@/lib/alunos-mock";

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

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gray-50 p-8">
      <div className="shrink-0">
        <Link
          href="/turmas"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Voltar para turmas
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{ano}º ano</h1>
        <p className="mt-2 text-gray-600">
          Lista de alunos ({alunos.length}) — clique em um aluno para ver o desempenho
        </p>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-1/3" />
            <col className="w-1/3" />
            <col className="w-1/3" />
          </colgroup>
          <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 text-gray-600">
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
                className="border-b border-gray-100 last:border-0 hover:bg-blue-50"
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
  );
}
