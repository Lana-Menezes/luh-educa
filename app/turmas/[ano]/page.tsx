import Link from "next/link";
import { notFound } from "next/navigation";

const anosValidos = new Set([5, 6, 7, 8, 9]);

const NOMES = [
  "Ana Souza",
  "Bruno Lima",
  "Carla Mendes",
  "Diego Alves",
  "Eduarda Costa",
  "Felipe Rocha",
  "Gabriela Nunes",
  "Henrique Silva",
  "Isabela Martins",
  "João Pereira",
  "Karen Oliveira",
  "Lucas Ferreira",
  "Marina Santos",
  "Nicolas Barbosa",
  "Olivia Ribeiro",
  "Pedro Carvalho",
  "Rafaela Gomes",
  "Samuel Araujo",
  "Tatiana Moreira",
  "Vinicius Teixeira",
];

function getAlunosMock(ano: number) {
  return NOMES.map((nome, index) => ({
    id: ano * 100 + index + 1,
    nome,
    matricula: `${ano}${String(index + 1).padStart(3, "0")}`,
  }));
}

export default async function TurmaAnoPage({
  params,
}: {
  params: Promise<{ ano: string }>;
}) {
  const { ano: anoParam } = await params;
  const ano = parseInt(anoParam, 10);

  if (!anosValidos.has(ano)) {
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
          Lista de alunos ({alunos.length})
        </p>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
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
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{aluno.nome}</td>
                <td className="px-4 py-3 text-gray-600">{aluno.matricula}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
