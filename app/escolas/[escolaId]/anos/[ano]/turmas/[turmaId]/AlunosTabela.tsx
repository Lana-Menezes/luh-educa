"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { estaInsuficiente, normalizeBusca, type Aluno } from "@/lib/mock-data";
import {
  DISCIPLINAS,
  formatDelta,
  formatProficiencia,
  padraoDaProficiencia,
  type AnoSaeb,
  type Disciplina,
} from "@/lib/saeb";
import { PadraoBadge, deltaClass } from "@/app/escolas/ui";

type Ordem = "nome" | "menor-LP" | "menor-MT" | "maior-evolucao";

const ordens: { value: Ordem; label: string }[] = [
  { value: "nome", label: "Nome (A–Z)" },
  { value: "menor-LP", label: "Menor proficiência em LP" },
  { value: "menor-MT", label: "Menor proficiência em MT" },
  { value: "maior-evolucao", label: "Maior evolução" },
];

/**
 * Evolução em LP e MT da primeira avaliação até a avaliação selecionada.
 * Sem resultado nela, o estudante está ausente e não há evolução a mostrar.
 */
function evolucao(aluno: Aluno, avaliacaoIndex: number): { LP: number; MT: number } | null {
  const atual = aluno.resultados[avaliacaoIndex];
  if (!atual) return null;
  const presentes = aluno.resultados.slice(0, avaliacaoIndex + 1).filter((r) => r !== null);
  if (presentes.length < 2) return null;
  const primeira = presentes[0];
  return { LP: atual.LP - primeira.LP, MT: atual.MT - primeira.MT };
}

/** Média de LP e MT, usada para ordenar por "Maior evolução". */
function evolucaoMedia(ev: { LP: number; MT: number } | null) {
  return ev === null ? -Infinity : (ev.LP + ev.MT) / 2;
}

export default function AlunosTabela({
  alunos,
  ano,
  baseHref,
  avaliacaoIndex,
  avaliacaoNome,
}: {
  alunos: Aluno[];
  ano: AnoSaeb;
  baseHref: string;
  avaliacaoIndex: number;
  avaliacaoNome: string;
}) {
  const [busca, setBusca] = useState("");
  const [somenteInsuficiente, setSomenteInsuficiente] = useState(false);
  const [ordem, setOrdem] = useState<Ordem>("nome");

  const linhas = useMemo(() => {
    const termo = normalizeBusca(busca);
    const valor = (aluno: Aluno, disciplina: Disciplina) =>
      aluno.resultados[avaliacaoIndex]?.[disciplina] ?? Infinity;

    return alunos
      .filter((aluno) => !termo || normalizeBusca(aluno.nome).includes(termo) || aluno.id.includes(termo))
      .filter((aluno) => !somenteInsuficiente || estaInsuficiente(aluno, ano, avaliacaoIndex))
      .sort((a, b) => {
        switch (ordem) {
          case "menor-LP":
            return valor(a, "LP") - valor(b, "LP");
          case "menor-MT":
            return valor(a, "MT") - valor(b, "MT");
          case "maior-evolucao":
            return (
              evolucaoMedia(evolucao(b, avaliacaoIndex)) - evolucaoMedia(evolucao(a, avaliacaoIndex))
            );
          default:
            return a.nome.localeCompare(b.nome, "pt-BR");
        }
      });
  }, [alunos, ano, avaliacaoIndex, busca, somenteInsuficiente, ordem]);

  return (
    <details className="group mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
        <span className="text-lg font-semibold text-gray-900">Estudantes <span className="text-sm font-normal text-gray-600">({alunos.length})</span></span>
        <ChevronDown className="h-5 w-5 shrink-0 text-gray-600 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mt-1 text-sm text-gray-500">
            Resultado na avaliação {avaliacaoNome} · clique para ver o histórico do estudante
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Ordenar por
          <span className="relative">
            <select
              value={ordem}
              onChange={(event) => setOrdem(event.target.value as Ordem)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 focus:border-brand focus:outline-none"
            >
              {ordens.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              aria-hidden
            />
          </span>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por nome ou matrícula"
            aria-label="Buscar estudante"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:bg-white focus:outline-none"
          />
        </div>
        <button
          type="button"
          aria-pressed={somenteInsuficiente}
          onClick={() => setSomenteInsuficiente((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            somenteInsuficiente
              ? "border-danger bg-danger-soft text-danger"
              : "border-gray-200 bg-white text-gray-700 hover:border-brand-muted"
          }`}
        >
          Somente com padrão Abaixo do Básico
        </button>
        <span className="text-sm text-gray-500" aria-live="polite">
          {linhas.length} de {alunos.length}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="py-2 pr-3 font-medium">Estudante</th>
              {DISCIPLINAS.map(({ codigo, nome }) => (
                <th key={codigo} className="px-2 py-2 font-medium">
                  {nome}
                </th>
              ))}
              {DISCIPLINAS.map(({ codigo }) => (
                <th key={codigo} className="px-2 py-2 text-right font-medium">
                  Evolução {codigo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((aluno) => {
              const atual = aluno.resultados[avaliacaoIndex] ?? null;
              const ev = evolucao(aluno, avaliacaoIndex);
              const href = `${baseHref}/alunos/${aluno.id}?avaliacao=${avaliacaoIndex}`;
              return (
                <tr key={aluno.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-3 pr-3">
                    <Link href={href} className="font-medium text-gray-900 hover:text-brand">
                      {aluno.nome}
                    </Link>
                    <p className="text-xs text-gray-500">Matrícula {aluno.id}</p>
                  </td>
                  {DISCIPLINAS.map(({ codigo }) => (
                    <td key={codigo} className="px-2 py-3">
                      {atual ? (
                        <div className="flex items-center gap-2">
                          <span className="w-12 font-semibold text-gray-900">
                            {formatProficiencia(atual[codigo])}
                          </span>
                          <PadraoBadge padrao={padraoDaProficiencia(ano, codigo, atual[codigo])} />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Ausente</span>
                      )}
                    </td>
                  ))}
                  {DISCIPLINAS.map(({ codigo }) => (
                    <td key={codigo} className="px-2 py-3 text-right">
                      {ev === null ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <span className={`font-medium ${deltaClass(ev[codigo])}`}>{formatDelta(ev[codigo])}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {linhas.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">Nenhum estudante encontrado.</p>
        )}
      </div>
      </div>
    </details>
  );
}
