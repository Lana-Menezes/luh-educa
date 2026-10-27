import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PADROES, formatPercent, type Padrao } from "@/lib/saeb";

export const corPadrao: Record<Padrao, string> = {
  "Abaixo do Básico": "bg-danger",
  Básico: "bg-attention",
  Adequado: "bg-brand",
  Avançado: "bg-success",
};

const badgePadrao: Record<Padrao, string> = {
  "Abaixo do Básico": "bg-danger-soft text-danger",
  Básico: "bg-attention-soft text-attention-ink",
  Adequado: "bg-brand-soft text-brand",
  Avançado: "bg-success-soft text-success",
};

export function deltaClass(value: number) {
  return value >= 0 ? "text-success" : "text-attention";
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

/** Rótulo curto de uma avaliação para eixos e legendas (ex.: "Diagnóstica" → "Diag."). */
export function rotuloAvaliacaoCurto(nome: string) {
  if (nome === "Diagnóstica") return "Diag.";
  if (nome === "Somativa") return "Som.";
  return nome.replace("Formativa ", "F");
}

export type { PontoEvolucao } from "./CurvaEvolucao";
export { CurvaEvolucao } from "./CurvaEvolucao";

/** Seletor de avaliação (Diagnóstica, Formativa 1–8, Somativa) para acompanhar o progresso mês a mês. */
export function AvaliacaoSeletor({
  avaliacoes,
  atual,
  hrefFor,
}: {
  avaliacoes: readonly { id: string; nome: string; periodo: string }[];
  atual: number;
  hrefFor: (indice: number) => string;
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Avaliação">
      {avaliacoes.map((avaliacao, i) => {
        const active = i === atual;
        return (
          <Link
            key={avaliacao.id}
            href={hrefFor(i)}
            title={avaliacao.periodo}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-brand bg-brand-soft text-brand"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand-muted"
            }`}
          >
            {avaliacao.nome}
          </Link>
        );
      })}
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
