import { notFound } from "next/navigation";
import { Download, Eye, FileText } from "lucide-react";
import {
  agruparPorTipo,
  getAvaliacoes,
  isSerie,
  nomeSerie,
  redeMock,
  type Avaliacao,
  type Serie,
} from "@/lib/mock-data";
import { Breadcrumb } from "../../escolas/ui";

function CardAvaliacao({ titulo, itens }: { titulo: string; itens: Avaliacao[] }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">{titulo}</h3>
      <ul className="mt-3 space-y-2">
        {itens.map((avaliacao) => (
          <li
            key={avaliacao.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
          >
            <a
              href={avaliacao.arquivoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 flex-1 items-center gap-2.5"
              title={`Visualizar ${avaliacao.titulo}`}
            >
              <FileText className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-brand" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 group-hover:text-brand group-hover:underline">
                  {avaliacao.titulo}
                </p>
                <p className="text-xs text-gray-500">{avaliacao.periodo}</p>
              </div>
            </a>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={avaliacao.arquivoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visualizar ${avaliacao.titulo}`}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-brand-muted hover:text-brand"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href={avaliacao.arquivoUrl}
                download={avaliacao.arquivoNome}
                aria-label={`Baixar ${avaliacao.titulo}`}
                className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-hover"
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                Baixar
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

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

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <CardAvaliacao titulo="Avaliação diagnóstica" itens={diagnostica} />
        <CardAvaliacao titulo="Avaliação somativa" itens={somativa} />
      </div>

      <div className="mt-5">
        <CardAvaliacao titulo="Avaliações formativas (1 a 8)" itens={formativas} />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Arquivos de demonstração para fins de desenvolvimento. Serão substituídos pelos
        PDFs oficiais de cada avaliação.
      </p>
    </div>
  );
}
