import Link from "next/link";
import { ChevronRight, Download, Eye, FileText } from "lucide-react";
import { PADROES, formatPercent, type Padrao } from "@/lib/saeb";
import { formatData } from "@/lib/mock-data";

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

export type ArquivoBaixavel = {
  id: string;
  titulo: string;
  periodo: string;
  disponibilizadaEm: string;
  arquivoUrl: string;
  arquivoNome: string;
};

/** Lista de arquivos para visualizar/baixar (provas ou planejamentos), agrupados por tipo de avaliação. */
export function CardArquivos({ titulo, itens }: { titulo: string; itens: ArquivoBaixavel[] }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">{titulo}</h3>
      <ul className="mt-3 space-y-2">
        {itens.map((arquivo) => (
          <li
            key={arquivo.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
          >
            <a
              href={arquivo.arquivoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 flex-1 items-center gap-2.5"
              title={`Visualizar ${arquivo.titulo}`}
            >
              <FileText className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-brand" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 group-hover:text-brand group-hover:underline">
                  {arquivo.titulo}
                </p>
                <p className="text-xs text-gray-500">
                  {arquivo.periodo} · Disponibilizada em{" "}
                  <time dateTime={arquivo.disponibilizadaEm}>
                    {formatData(arquivo.disponibilizadaEm)}
                  </time>
                </p>
              </div>
            </a>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={arquivo.arquivoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visualizar ${arquivo.titulo}`}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-brand-muted hover:text-brand"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href={arquivo.arquivoUrl}
                download={arquivo.arquivoNome}
                aria-label={`Baixar ${arquivo.titulo}`}
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
