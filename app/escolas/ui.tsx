import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PADROES, formatPercent, type Padrao } from "@/lib/saeb";

export const corPadrao: Record<Padrao, string> = {
  Insuficiente: "bg-danger",
  Básico: "bg-accent",
  Proficiente: "bg-brand",
  Avançado: "bg-success",
};

const badgePadrao: Record<Padrao, string> = {
  Insuficiente: "bg-danger-soft text-danger",
  Básico: "bg-accent-soft text-accent-ink",
  Proficiente: "bg-brand-soft text-brand",
  Avançado: "bg-success-soft text-success",
};

export function deltaClass(value: number) {
  return value >= 0 ? "text-success" : "text-accent-ink";
}

export type Migalha = { label: string; href?: string };

/** Trilha Rede › Escola › Ano › Turma › Estudante. */
export function Breadcrumb({ itens }: { itens: Migalha[] }) {
  return (
    <nav aria-label="Navegação estrutural">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {itens.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="font-medium text-brand hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-gray-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function StatCard({
  label,
  value,
  detail,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</p>
      {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
    </div>
  );
}

export function PadraoBadge({ padrao }: { padrao: Padrao }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgePadrao[padrao]}`}>
      {padrao}
    </span>
  );
}

/** Barra empilhada com a contagem de estudantes em cada padrão de desempenho. */
export function PadroesBarra({
  titulo,
  contagem,
  compacta = false,
}: {
  titulo?: string;
  contagem: Record<Padrao, number>;
  compacta?: boolean;
}) {
  const total = Math.max(
    PADROES.reduce((sum, p) => sum + contagem[p], 0),
    1,
  );

  return (
    <div>
      {titulo && <p className="text-sm font-medium text-gray-900">{titulo}</p>}
      <div className={`flex overflow-hidden rounded-full bg-gray-100 ${compacta ? "h-2" : "mt-2 h-4"}`}>
        {PADROES.map((p) => (
          <div
            key={p}
            className={corPadrao[p]}
            style={{ width: `${(contagem[p] / total) * 100}%` }}
            title={`${p}: ${contagem[p]} (${formatPercent((contagem[p] / total) * 100)})`}
          />
        ))}
      </div>
      {!compacta && (
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
          {PADROES.map((p) => (
            <li key={p} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-sm ${corPadrao[p]}`} aria-hidden />
              {p}:{" "}
              <span className="font-medium text-gray-900">
                {contagem[p]} ({formatPercent((contagem[p] / total) * 100)})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
