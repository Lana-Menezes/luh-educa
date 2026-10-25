import { checkPostTableExists } from "@/lib/db-utils";
import { ETAPAS, getResultadoRede, precisaAtencao, redeMock } from "@/lib/rede-mock";
import {
  DISCIPLINAS,
  PARTICIPACAO_MINIMA_IDEB,
  aprendizadoAdequado,
  calcularIdeb,
  formatDelta,
  formatIdeb,
  formatPercent,
  formatProficiencia,
  nivelDaProficiencia,
} from "@/lib/saeb";
import { redirect } from "next/navigation";
import EscolaFinder from "./EscolaFinder";
import { parseFiltros } from "./filtros";

export const dynamic = "force-dynamic";

function deltaClass(value: number) {
  return value >= 0 ? "text-success" : "text-accent-ink";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const tableExists = await checkPostTableExists();
  if (!tableExists) {
    redirect("/setup");
  }

  const rede = redeMock;
  const totalAlunos = rede.escolas.reduce(
    (sum, escola) =>
      sum + ETAPAS.reduce((s, etapa) => s + (escola.resultados[etapa]?.alunosAvaliados ?? 0), 0),
    0,
  );
  const escolasEmAtencao = rede.escolas.filter(precisaAtencao).length;
  const porEtapa = ETAPAS.map((etapa) => {
    const resultado = getResultadoRede(etapa);
    return {
      etapa,
      resultado,
      ideb: calcularIdeb(resultado),
      referencia: rede.referenciaNacional[etapa],
      escolas: rede.escolas.filter((escola) => escola.resultados[etapa]).length,
    };
  });
  const initialFiltros = parseFiltros(await searchParams);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          {rede.nome}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          <span className="text-brand">{rede.municipio}</span>/{rede.uf}
        </h1>
        <p className="mt-2 text-gray-600">
          Resultados das escolas municipais no {rede.edicao} (Sistema de Avaliação da Educação
          Básica) · 5º e 9º ano do Ensino Fundamental
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Escolas avaliadas</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{rede.escolas.length}</p>
          <p className="mt-1 text-xs text-gray-500">
            {totalAlunos.toLocaleString("pt-BR")} alunos avaliados no Saeb
          </p>
        </div>
        {porEtapa.map(({ etapa, resultado, ideb, referencia }) => (
          <div key={etapa} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Ideb da rede · {etapa} ({resultado.ano}º ano)
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatIdeb(ideb.ideb)}</p>
            <p className={`mt-1 text-xs ${deltaClass(ideb.ideb - referencia.ideb)}`}>
              {formatDelta(ideb.ideb - referencia.ideb, formatIdeb)} vs. referência nacional (
              {formatIdeb(referencia.ideb)})
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Escolas que precisam de atenção</p>
          <p className="mt-2 text-3xl font-bold text-accent-ink">{escolasEmAtencao}</p>
          <p className="mt-1 text-xs text-gray-500">
            Ideb abaixo da referência ou participação &lt; {PARTICIPACAO_MINIMA_IDEB}%
          </p>
        </div>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {porEtapa.map(({ etapa, resultado, ideb, referencia, escolas }) => (
          <div key={etapa} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{etapa}</p>
                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  Saeb {resultado.ano}º ano · rede municipal
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {escolas} escolas · {resultado.alunosAvaliados.toLocaleString("pt-BR")} alunos
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>
                  Participação{" "}
                  <span className="font-semibold text-gray-900">
                    {formatPercent(resultado.participacao)}
                  </span>
                </p>
                <p className="mt-1">
                  Aprovação{" "}
                  <span className="font-semibold text-gray-900">
                    {formatPercent(resultado.aprovacao)}
                  </span>
                </p>
              </div>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {DISCIPLINAS.map(({ codigo, nome }) => {
                const media = resultado.proficiencia[codigo];
                const delta = media - referencia.proficiencia[codigo];
                const adequado = aprendizadoAdequado(resultado.ano, codigo, media);

                return (
                  <div key={codigo} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <dt className="text-sm font-medium text-gray-900">{nome}</dt>
                    <dd className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatProficiencia(media)}
                      </span>
                      <span className={`text-xs font-medium ${deltaClass(delta)}`}>
                        {formatDelta(delta)} vs. nacional
                      </span>
                    </dd>
                    <dd className="mt-1 text-xs text-gray-500">
                      Nível {nivelDaProficiencia(resultado.ano, codigo, media)} da escala Saeb
                    </dd>
                    <dd className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Aprendizado adequado</span>
                        <span className="font-semibold text-gray-900">{formatPercent(adequado)}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${adequado}%` }} />
                      </div>
                    </dd>
                  </div>
                );
              })}
            </dl>

            <p className="mt-4 text-xs text-gray-500">
              Ideb {formatIdeb(ideb.ideb)} = nota padronizada {formatIdeb(ideb.N)} × aprovação{" "}
              {ideb.P.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </section>

      <EscolaFinder
        escolas={rede.escolas}
        referenciaNacional={rede.referenciaNacional}
        initialFiltros={initialFiltros}
      />

      <p className="mt-6 text-xs text-gray-400">
        Dados fictícios para demonstração. Proficiências na escala Saeb, estimadas pela TRI
        (Teoria de Resposta ao Item); referências nacionais ilustrativas.
      </p>
    </div>
  );
}
