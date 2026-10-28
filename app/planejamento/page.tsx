import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { etapasDaEscola, redeMock } from "@/lib/mock-data";
import { Breadcrumb } from "../escolas/ui";

export default function PlanejamentoPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/dashboard" },
          { label: "Planejamento escolar" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Planejamento escolar</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Organize as intervenções pedagógicas a partir dos resultados de cada avaliação
        LUH. Selecione a escola para ver as prioridades por ano e disciplina.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {redeMock.escolas.map((escola) => (
          <li key={escola.id}>
            <Link
              href={`/planejamento/${escola.id}`}
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-muted hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <CalendarDays className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-brand">
                    {escola.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {etapasDaEscola(escola).join(" · ")}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-gray-400">
        Dados de demonstração. As sugestões devem ser ajustadas pela equipe pedagógica
        após a análise das respostas dos estudantes.
      </p>
    </div>
  );
}
