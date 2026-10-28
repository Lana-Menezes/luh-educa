import { notFound } from "next/navigation";
import {
  agruparPorTipo,
  getAvaliacoes,
  isSerie,
  nomeSerie,
  redeMock,
  type Serie,
} from "@/lib/mock-data";
import { Breadcrumb, CardArquivos } from "../../escolas/ui";

export default async function AvaliacoesSeriePage({
  params,
}: {
  params: Promise<{ serie: string }>;
}) {
  const { serie: serieParam } = await params;

  if (!isSerie(serieParam)) {
    notFound();
  }

  const serie = Number(serieParam) as Serie;
  const avaliacoes = getAvaliacoes(serie);
  const { diagnostica, formativas, somativa } = agruparPorTipo(avaliacoes);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/dashboard" },
          { label: "Avaliações", href: "/avaliacoes" },
          { label: nomeSerie(serie) },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Avaliações · <span className="text-brand">{nomeSerie(serie)}</span>
      </h1>
      <p className="mt-2 text-gray-600">
        Baixe os arquivos das provas para aplicar aos estudantes do {nomeSerie(serie)}.
      </p>

      <div className="mt-6 grid gap-5">
        <CardArquivos titulo="Avaliação diagnóstica" itens={diagnostica} />
        <CardArquivos titulo="Avaliações formativas (1 a 8)" itens={formativas} />
        <CardArquivos titulo="Avaliação somativa" itens={somativa} />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Arquivos e datas de disponibilização de demonstração para fins de desenvolvimento.
        Serão substituídos pelos PDFs e datas oficiais de cada avaliação.
      </p>
    </div>
  );
}
