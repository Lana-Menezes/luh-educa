import Link from "next/link";
import { notFound } from "next/navigation";
import { AVALIACOES, etapasDaEscola, formatData, getEscola, getTurmas, redeMock, resumir } from "@/lib/mock-data";
import { ANO_POR_ETAPA, DISCIPLINAS, formatPercent, formatProficiencia } from "@/lib/saeb";
import { AvaliacaoSeletor, Breadcrumb } from "../../escolas/ui";

export const dynamic = "force-dynamic";

export default async function PlanejamentoEscolaPage({
  params,
  searchParams,
}: {
  params: Promise<{ escolaId: string }>;
  searchParams: Promise<{ avaliacao?: string }>;
}) {
  const { escolaId } = await params;
  const escola = getEscola(escolaId);

  if (!escola) {
    notFound();
  }

  const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const realizadas = AVALIACOES.map((avaliacao, indice) => ({ ...avaliacao, indice }))
    .filter((avaliacao) => avaliacao.data <= hoje);
  const { avaliacao: avaliacaoParam } = await searchParams;
  const selecionada = realizadas.find((avaliacao) => String(avaliacao.indice) === avaliacaoParam)
    ?? realizadas.at(-1);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <Breadcrumb
        itens={[
          { label: `${redeMock.municipio}/${redeMock.uf}`, href: "/dashboard" },
          { label: "Planejamento escolar", href: "/planejamento" },
          { label: escola.nome },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Planejamento · <span className="text-brand">{escola.nome}</span>
      </h1>
      <p className="mt-2 text-gray-600">
        Prioridades de intervenção pedagógica a partir dos resultados de cada avaliação LUH.
      </p>

      {!selecionada ? (
        <p className="mt-6 text-gray-600">O planejamento estará disponível após a primeira avaliação do calendário.</p>
      ) : (
        <>
          <div className="mt-6">
            <AvaliacaoSeletor
              avaliacoes={realizadas}
              atual={selecionada.indice}
              hrefFor={(i) => `/planejamento/${escola.id}?avaliacao=${i}`}
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">{selecionada.nome} · {formatData(selecionada.data)}</p>

          {etapasDaEscola(escola).map((etapa) => {
            const ano = ANO_POR_ETAPA[etapa];
            const turmas = getTurmas(escola, etapa);
            const resumo = resumir(turmas.flatMap((turma) => turma.alunos), ano, selecionada.indice);
            return (
              <section key={etapa} className="mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{ano}º ano · {etapa}</h3>
                    <p className="mt-1 text-sm text-gray-500">{resumo.avaliados} de {resumo.matriculados} estudantes avaliados · participação de {formatPercent(resumo.participacao)}</p>
                  </div>
                  <Link href={`/escolas/${escola.id}/anos/${ano}?avaliacao=${selecionada.indice}`} className="text-sm font-medium text-brand hover:underline">Consultar resultados →</Link>
                </div>
                {!resumo.avaliados ? <p className="mt-4 text-sm text-gray-600">Sem resultados para orientar o planejamento nesta avaliação.</p> : (
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {DISCIPLINAS.map(({ codigo, nome }) => {
                      const abaixo = resumo.padroes[codigo]["Abaixo do Básico"];
                      return (
                        <article key={codigo} className="rounded-lg border border-gray-200 p-4">
                          <h4 className="font-semibold text-gray-900">{nome}</h4>
                          <p className="mt-2 text-sm text-gray-600">Proficiência média: {formatProficiencia(resumo.media[codigo])} · {abaixo} estudantes abaixo do básico ({formatPercent(abaixo / resumo.avaliados * 100)}).</p>
                          <p className="mt-3 text-sm font-semibold text-brand">{abaixo > 0 ? "Prioridade: recomposição da aprendizagem" : "Prioridade: consolidação e aprofundamento"}</p>
                          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-gray-700">
                            <li>Na primeira semana, revisar os erros da avaliação em {nome} e identificar as habilidades que precisam de retomada.</li>
                            <li>{abaixo > 0 ? `Organizar grupos de apoio para os ${abaixo} estudantes abaixo do básico, com atividades orientadas e acompanhamento semanal.` : "Propor atividades de consolidação e desafios de aplicação, com acompanhamento dos estudantes que ainda apresentam dificuldades."}</li>
                            <li>Após duas semanas de intervenção, aplicar uma atividade de verificação e registrar os avanços por estudante.</li>
                            <li>Revisar as estratégias com a coordenação antes da próxima avaliação.</li>
                          </ol>
                          <p className="mt-3 text-xs text-gray-500">Responsáveis sugeridos: professor da disciplina e coordenação pedagógica.</p>
                        </article>
                      );
                    })}
                  </div>
                )}
                {resumo.avaliados < resumo.matriculados && <p className="mt-4 text-sm text-gray-600">Ação de participação: verificar a situação dos {resumo.matriculados - resumo.avaliados} estudantes sem resultado e organizar a reposição da avaliação.</p>}
              </section>
            );
          })}
        </>
      )}
      <p className="mt-6 text-xs text-gray-400">Dados de demonstração. Avaliações exibidas conforme as datas do calendário. As sugestões devem ser ajustadas pela equipe pedagógica após a análise das respostas dos estudantes.</p>
    </div>
  );
}
