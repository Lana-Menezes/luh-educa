import Link from "next/link";
import { GraduationCap } from "lucide-react";

const anos = [5, 6, 7, 8, 9] as const;

export default function TurmasPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
      <p className="mt-2 text-gray-600">
        Selecione o ano para ver as turmas.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {anos.map((ano) => (
          <Link
            key={ano}
            href={`/turmas/${ano}`}
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-brand-muted hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand transition group-hover:bg-brand-muted">
              <GraduationCap className="h-6 w-6" aria-hidden />
            </span>
            <span className="mt-4 text-xl font-semibold text-gray-900">
              {ano}º ano
            </span>
            <span className="mt-1 text-sm text-gray-500">Ver turmas</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
