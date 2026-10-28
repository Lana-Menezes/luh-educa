import { notFound } from "next/navigation";
import { agruparPorTipo, anosDaEscola, getEscola, getPlanejamentos, redeMock } from "@/lib/mock-data";
import { Breadcrumb, CardArquivos } from "../../escolas/ui";

export default async function PlanejamentoEscolaPage({
  params,
}: {
  params: Promise<{ escolaId: string }>;
}) {
  const { escolaId } = await params;
  const escola = getEscola(escolaId);

  if (!escola) {
    notFound();
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/dashboard" },
          { label: "Planejamento escolar", href: "/planejamento" },
          { label: escola.nome },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Planejamento · <span className="text-brand">{escola.nome}</span>
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Baixe os arquivos de planejamento pedagógico de cada avaliação, por ano e
        disciplina, para orientar as intervenções da equipe.
      </p>

      <div className="mt-6 grid gap-6">
        {anosDaEscola(escola).map((ano) => {
          const { diagnostica, formativas, somativa } = agruparPorTipo(
            getPlanejamentos(escola.id, ano),
          );
          return (
            <section key={ano}>
              <h2 className="text-lg font-semibold text-gray-900">{ano}º ano</h2>
              <div className="mt-3 grid gap-5">
                <CardArquivos titulo="Planejamento · Diagnóstica" itens={diagnostica} />
                <CardArquivos titulo="Planejamento · Formativas (1 a 8)" itens={formativas} />
                <CardArquivos titulo="Planejamento · Somativa" itens={somativa} />
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Arquivos e datas de disponibilização de demonstração para fins de desenvolvimento.
        Serão substituídos pelos PDFs oficiais de planejamento de cada avaliação.
      </p>
    </div>
  );
}
