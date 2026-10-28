import Link from "next/link";
import { ChevronRight, ClipboardList } from "lucide-react";
import { SERIES, TOTAL_AVALIACOES_POR_SERIE, nomeSerie, redeMock } from "@/lib/mock-data";
import { Breadcrumb } from "../escolas/ui";

export default function AvaliacoesPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/dashboard" },
          { label: "Avaliações" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Avaliações</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Avaliações LUH Educa por ano: 1 diagnóstica, 8 formativas e 1 somativa, em
        Língua Portuguesa e Matemática. Selecione o ano para ver e baixar os arquivos a
        serem aplicados aos estudantes.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SERIES.map((serie) => (
          <li key={serie}>
            <Link
              href={`/avaliacoes/${serie}`}
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-muted hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <ClipboardList className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-brand">
                    {nomeSerie(serie)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {TOTAL_AVALIACOES_POR_SERIE} avaliações · LP e MT
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-gray-400">
        Arquivos de demonstração para fins de desenvolvimento. Serão substituídos pelos
        PDFs oficiais de cada avaliação.
      </p>
    </div>
  );
}
