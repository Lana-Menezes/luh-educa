"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, School, Search, X } from "lucide-react";
import {
  etapasDaEscola,
  motivosAtencao,
  normalizeBusca,
  precisaAtencao,
  type EscolaRede,
  type Etapa,
  type ReferenciaSaeb,
} from "@/lib/rede-mock";
import {
  ANO_POR_ETAPA,
  PARTICIPACAO_MINIMA_SAEB,
  formatPercent,
  formatProficiencia,
} from "@/lib/saeb";
import {
  etapas,
  ordenacoes,
  zonas,
  type EscolaFinderFiltros,
  type Ordenacao,
} from "./filtros";

/** Com etapas filtradas, ordena pela média delas; senão, pela média das etapas da escola. */
function chaveOrdenacao(escola: EscolaRede, etapa: Etapa[], campo: "proficiencia" | "participacao") {
  const valores = (etapa.length > 0 ? etapa.filter((e) => escola.resultados[e]) : etapasDaEscola(escola)).map(
    (e) => {
      const resultado = escola.resultados[e]!;
      return campo === "proficiencia"
        ? (resultado.proficiencia.LP + resultado.proficiencia.MT) / 2
        : resultado.participacao;
    },
  );
  return valores.length > 0 ? valores.reduce((sum, v) => sum + v, 0) / valores.length : -Infinity;
}

/** Dropdown de seleção múltipla (checkboxes), ex.: Etapa Saeb, Zona. */
function MultiSelectDropdown<T extends string>({
  label,
  options,
  optionLabel,
  selected,
  onChange,
}: {
  label: string;
  options: readonly T[];
  optionLabel: (value: T) => string;
  selected: T[];
  onChange: (value: T[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function toggle(value: T) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  const resumo =
    selected.length === 0
      ? "Todos"
      : selected.length === 1
        ? optionLabel(selected[0])
        : `${selected.length} selecionadas`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          selected.length > 0
            ? "border-brand bg-brand-soft text-brand"
            : "border-gray-200 bg-white text-gray-700 hover:border-brand-muted hover:text-gray-900"
        }`}
      >
        {label}: {resumo}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              {optionLabel(option)}
            </label>
          ))}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-xs font-medium text-brand hover:bg-gray-50"
            >
              Limpar seleção
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function EscolaFinder({
  escolas,
  referenciaNacional,
  initialFiltros,
}: {
  escolas: EscolaRede[];
  referenciaNacional: Record<Etapa, ReferenciaSaeb>;
  initialFiltros: EscolaFinderFiltros;
}) {
  const [filtros, setFiltros] = useState(initialFiltros);
  const { q, zona, etapa, atencao, ordem } = filtros;

  function update(patch: Partial<EscolaFinderFiltros>) {
    setFiltros((current) => ({ ...current, ...patch }));
  }

  // Mantém os filtros na URL para que o "voltar" da escola restaure a busca.
  useEffect(() => {
    const params = new URLSearchParams();
    const avaliacaoAtual = new URLSearchParams(window.location.search).get("avaliacao");
    if (avaliacaoAtual) params.set("avaliacao", avaliacaoAtual);
    if (q.trim()) params.set("q", q.trim());
    if (zona.length > 0) params.set("zona", zona.join(","));
    if (etapa.length > 0) params.set("etapa", etapa.join(","));
    if (atencao) params.set("atencao", "1");
    if (ordem !== "nome") params.set("ordem", ordem);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [q, zona, etapa, atencao, ordem]);

  const resultados = useMemo(() => {
    const termo = normalizeBusca(q);
    const termoDigitos = q.replace(/\D/g, "");

    const filtradas = escolas.filter((escola) => {
      if (zona.length > 0 && !zona.includes(escola.zona)) return false;
      if (etapa.length > 0 && !etapa.some((e) => escola.resultados[e])) return false;
      if (atencao && !precisaAtencao(escola)) return false;
      if (!termo) return true;
      return (
        normalizeBusca(escola.nome).includes(termo) ||
        normalizeBusca(escola.bairro).includes(termo) ||
        (termoDigitos.length > 0 && escola.codigoInep.includes(termoDigitos))
      );
    });

    return filtradas.sort((a, b) => {
      switch (ordem) {
        case "maior-proficiencia":
          return chaveOrdenacao(b, etapa, "proficiencia") - chaveOrdenacao(a, etapa, "proficiencia");
        case "menor-proficiencia":
          return chaveOrdenacao(a, etapa, "proficiencia") - chaveOrdenacao(b, etapa, "proficiencia");
        case "menor-participacao":
          return chaveOrdenacao(a, etapa, "participacao") - chaveOrdenacao(b, etapa, "participacao");
        default:
          return a.nome.localeCompare(b.nome, "pt-BR");
      }
    });
  }, [escolas, q, zona, etapa, atencao, ordem]);

  const temFiltros = Boolean(q || zona.length > 0 || etapa.length > 0 || atencao);

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Escolas da rede</h2>
          <p className="mt-1 text-sm text-gray-500">
            Busque pelo nome, código INEP ou bairro/localidade
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Ordenar por
          <span className="relative">
            <select
              value={ordem}
              onChange={(event) => update({ ordem: event.target.value as Ordenacao })}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 focus:border-brand focus:outline-none"
            >
              {ordenacoes.map((o) => (
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

      <div className="relative mt-5">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(event) => update({ q: event.target.value })}
          placeholder="Ex.: Tiradentes, 31045845 ou Córrego Fundo"
          aria-label="Buscar escola"
          autoFocus
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand focus:bg-white focus:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => update({ q: "" })}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <MultiSelectDropdown
          label="Ano Escolar"
          options={etapas}
          optionLabel={(e) => `${ANO_POR_ETAPA[e]}º ano · ${e}`}
          selected={etapa}
          onChange={(value) => update({ etapa: value })}
        />

        <MultiSelectDropdown
          label="Zona"
          options={zonas}
          optionLabel={(z) => z}
          selected={zona}
          onChange={(value) => update({ zona: value })}
        />

        <button
          type="button"
          aria-pressed={atencao}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            atencao
              ? "border-attention bg-attention-soft text-attention"
              : "border-gray-200 bg-white text-gray-700 hover:border-attention hover:text-gray-900"
          }`}
          onClick={() => update({ atencao: !atencao })}
          title={`Proficiência abaixo da referência nacional ou participação inferior a ${PARTICIPACAO_MINIMA_SAEB}%`}
        >
          Precisam de atenção
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-gray-500" aria-live="polite">
        <span>
          {resultados.length} de {escolas.length} escolas
        </span>
        {temFiltros && (
          <button
            type="button"
            onClick={() => setFiltros({ ...filtros, q: "", zona: [], etapa: [], atencao: false })}
            className="font-medium text-brand hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {resultados.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-gray-200 px-6 py-10 text-center">
          <p className="font-medium text-gray-900">Nenhuma escola encontrada</p>
          <p className="mt-1 text-sm text-gray-500">
            Confira a grafia ou busque pelo código INEP de 8 dígitos.
          </p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-100">
          {resultados.map((escola) => {
            const motivos = motivosAtencao(escola);
            const etapasVisiveis =
              etapa.length > 0 ? etapa.filter((e) => escola.resultados[e]) : etapasDaEscola(escola);
            const etapaLink = etapa.length === 1 ? etapa[0] : undefined;

            return (
              <li key={escola.id}>
                <Link
                  href={`/escolas/${escola.id}${etapaLink ? `?etapa=${encodeURIComponent(etapaLink)}` : ""}`}
                  className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gray-50"
                >
                  <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand sm:flex">
                    <School className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-medium text-gray-900 group-hover:text-brand">
                      <span className="truncate">{escola.nome}</span>
                      {motivos.length > 0 && (
                        <span
                          role="img"
                          aria-label="Precisa de atenção"
                          title={motivos
                            .map((m) => `${ANO_POR_ETAPA[m.etapa]}º ano: ${m.motivo}`)
                            .join("\n")}
                        >
                          <AlertTriangle className="h-4 w-4 shrink-0 text-attention" aria-hidden />
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      INEP {escola.codigoInep} · {escola.bairro} · {escola.zona}
                    </p>
                  </div>

                  <div className="shrink-0 space-y-1.5 text-sm">
                    {etapasVisiveis.map((e) => {
                      const resultado = escola.resultados[e]!;
                      const referencia = referenciaNacional[e];
                      const abaixoLP = resultado.proficiencia.LP < referencia.proficiencia.LP;
                      const abaixoMT = resultado.proficiencia.MT < referencia.proficiencia.MT;

                      return (
                        <div key={e} className="flex items-baseline justify-end gap-4">
                          <span className="w-12 text-xs text-gray-500">{resultado.ano}º ano</span>
                          <span className="w-20 text-right">
                            <span className="text-xs text-gray-500">LP </span>
                            <span className={`font-semibold ${abaixoLP ? "text-attention" : "text-gray-900"}`}>
                              {formatProficiencia(resultado.proficiencia.LP)}
                            </span>
                          </span>
                          <span className="hidden w-20 text-right md:inline">
                            <span className="text-xs text-gray-500">MT </span>
                            <span className={`font-medium ${abaixoMT ? "text-attention" : "text-gray-900"}`}>
                              {formatProficiencia(resultado.proficiencia.MT)}
                            </span>
                          </span>
                          <span className="hidden w-20 text-right lg:inline" title="Participação no Saeb">
                            <span className="text-xs text-gray-500">Part. </span>
                            <span
                              className={`font-medium ${
                                resultado.participacao < PARTICIPACAO_MINIMA_SAEB
                                  ? "text-attention"
                                  : "text-gray-600"
                              }`}
                            >
                              {formatPercent(resultado.participacao)}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-brand" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
