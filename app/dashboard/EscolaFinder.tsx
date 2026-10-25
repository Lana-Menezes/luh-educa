"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  PARTICIPACAO_MINIMA_IDEB,
  calcularIdeb,
  formatIdeb,
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

function chipClass(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
    active
      ? "border-brand bg-brand-soft text-brand"
      : "border-gray-200 bg-white text-gray-700 hover:border-brand-muted hover:text-gray-900"
  }`;
}

/** Com uma etapa filtrada, ordena por ela; senão, pela média das etapas da escola. */
function chaveOrdenacao(escola: EscolaRede, etapa: Etapa | "", campo: "ideb" | "participacao") {
  const valores = (etapa ? [etapa] : etapasDaEscola(escola)).map((e) => {
    const resultado = escola.resultados[e]!;
    return campo === "ideb" ? calcularIdeb(resultado).ideb : resultado.participacao;
  });
  return valores.reduce((sum, v) => sum + v, 0) / valores.length;
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
    if (q.trim()) params.set("q", q.trim());
    if (zona) params.set("zona", zona);
    if (etapa) params.set("etapa", etapa);
    if (atencao) params.set("atencao", "1");
    if (ordem !== "nome") params.set("ordem", ordem);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [q, zona, etapa, atencao, ordem]);

  const resultados = useMemo(() => {
    const termo = normalizeBusca(q);
    const termoDigitos = q.replace(/\D/g, "");

    const filtradas = escolas.filter((escola) => {
      if (zona && escola.zona !== zona) return false;
      if (etapa && !escola.resultados[etapa]) return false;
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
        case "maior-ideb":
          return chaveOrdenacao(b, etapa, "ideb") - chaveOrdenacao(a, etapa, "ideb");
        case "menor-ideb":
          return chaveOrdenacao(a, etapa, "ideb") - chaveOrdenacao(b, etapa, "ideb");
        case "menor-participacao":
          return chaveOrdenacao(a, etapa, "participacao") - chaveOrdenacao(b, etapa, "participacao");
        default:
          return a.nome.localeCompare(b.nome, "pt-BR");
      }
    });
  }, [escolas, q, zona, etapa, atencao, ordem]);

  const temFiltros = Boolean(q || zona || etapa || atencao);

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
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Etapa Saeb
        </span>
        <button type="button" className={chipClass(etapa === "")} onClick={() => update({ etapa: "" })}>
          Todas
        </button>
        {etapas.map((e) => (
          <button key={e} type="button" className={chipClass(etapa === e)} onClick={() => update({ etapa: e })}>
            {ANO_POR_ETAPA[e]}º ano · {e}
          </button>
        ))}

        <span className="ml-3 mr-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Zona
        </span>
        <button type="button" className={chipClass(zona === "")} onClick={() => update({ zona: "" })}>
          Todas
        </button>
        {zonas.map((z) => (
          <button key={z} type="button" className={chipClass(zona === z)} onClick={() => update({ zona: z })}>
            {z}
          </button>
        ))}

        <button
          type="button"
          aria-pressed={atencao}
          className={`ml-3 ${chipClass(atencao)}`}
          onClick={() => update({ atencao: !atencao })}
          title={`Ideb abaixo da referência nacional ou participação inferior a ${PARTICIPACAO_MINIMA_IDEB}%`}
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
            onClick={() => setFiltros({ ...filtros, q: "", zona: "", etapa: "", atencao: false })}
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
            const etapasVisiveis = etapa ? [etapa] : etapasDaEscola(escola);

            return (
              <li key={escola.id}>
                <Link
                  href={`/escolas/${escola.id}${etapa ? `?etapa=${encodeURIComponent(etapa)}` : ""}`}
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
                          <AlertTriangle className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
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
                      const { ideb, divulgado } = calcularIdeb(resultado);
                      const abaixo = ideb < referenciaNacional[e].ideb;

                      return (
                        <div key={e} className="flex items-baseline justify-end gap-4">
                          <span className="w-12 text-xs text-gray-500">{resultado.ano}º ano</span>
                          <span className="w-20 text-right">
                            <span className="text-xs text-gray-500">Ideb </span>
                            {divulgado ? (
                              <span className={`font-semibold ${abaixo ? "text-accent-ink" : "text-gray-900"}`}>
                                {formatIdeb(ideb)}
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-400" title="Ideb não divulgado: participação abaixo de 80%">
                                —
                              </span>
                            )}
                          </span>
                          <span className="hidden w-20 text-right md:inline">
                            <span className="text-xs text-gray-500">LP </span>
                            <span className="font-medium text-gray-900">
                              {formatProficiencia(resultado.proficiencia.LP)}
                            </span>
                          </span>
                          <span className="hidden w-20 text-right md:inline">
                            <span className="text-xs text-gray-500">MT </span>
                            <span className="font-medium text-gray-900">
                              {formatProficiencia(resultado.proficiencia.MT)}
                            </span>
                          </span>
                          <span
                            className={`hidden w-14 text-right font-medium lg:inline ${
                              resultado.participacao < PARTICIPACAO_MINIMA_IDEB ? "text-accent-ink" : "text-gray-600"
                            }`}
                            title="Participação no Saeb"
                          >
                            {formatPercent(resultado.participacao)}
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
