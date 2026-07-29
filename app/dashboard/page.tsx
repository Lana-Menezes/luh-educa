import {
  escolaTRIMock,
  formatPercent,
  formatTRI,
} from "@/lib/escola-tri-mock";

export default function DashboardPage() {
  const data = escolaTRIMock;
  const maxMediaAno = Math.max(...data.desempenhoPorAno.map((item) => item.mediaTRI));
  const maxFaixa = Math.max(...data.distribuicaoFaixas.map((item) => item.percentual));
  const deltaNacional = data.mediaGeralTRI - data.mediaNacional;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard{" "}
          <span className="text-blue-600">Colégio Bom Jesus</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Métricas escolares de desempenho pela TRI (Teoria de Resposta ao Item) · {data.periodo}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Média TRI da escola</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatTRI(data.mediaGeralTRI)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Escala de proficiência (régua Inep/ENEM)
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">vs. média nacional</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">
            +{formatTRI(deltaNacional)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Referência nacional mock: {formatTRI(data.mediaNacional)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Índice de coerência</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.indiceCoerencia.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Padrão de resposta (modelo 3PL)
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Participação</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatPercent(data.taxaParticipacao)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {data.totalAlunosAvaliados} alunos avaliados
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Proficiência por área do conhecimento
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Quatro escalas TRI, no padrão das áreas do ENEM
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {data.areas.map((area) => {
            const delta = area.mediaProficiencia - area.mediaNacional;
            return (
              <div
                key={area.codigo}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {area.codigo}
                    </p>
                    <h3 className="mt-1 text-sm font-medium text-gray-900">
                      {area.nome}
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTRI(area.mediaProficiencia)}
                  </p>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:grid-cols-4">
                  <div>
                    <dt>Nacional</dt>
                    <dd className="font-medium text-gray-900">
                      {formatTRI(area.mediaNacional)}
                    </dd>
                  </div>
                  <div>
                    <dt>Δ escola</dt>
                    <dd className="font-medium text-emerald-700">
                      +{formatTRI(delta)}
                    </dd>
                  </div>
                  <div>
                    <dt>Desvio-padrão</dt>
                    <dd className="font-medium text-gray-900">
                      {formatTRI(area.desvioPadrao)}
                    </dd>
                  </div>
                  <div>
                    <dt>Amplitude</dt>
                    <dd className="font-medium text-gray-900">
                      {formatTRI(area.minimo)}–{formatTRI(area.maximo)}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Distribuição por faixas de proficiência
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Alunos posicionados na régua TRI da escola
          </p>
          <ul className="mt-5 space-y-4">
            {data.distribuicaoFaixas.map((faixa) => (
              <li key={faixa.faixa}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">
                    {faixa.faixa}{" "}
                    <span className="font-normal text-gray-500">
                      ({faixa.intervalo})
                    </span>
                  </span>
                  <span className="text-gray-600">
                    {formatPercent(faixa.percentual)} · {faixa.alunos} alunos
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${(faixa.percentual / maxFaixa) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Média TRI por ano escolar
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Evolução cumulativa do 5º ao 9º ano
          </p>
          <div className="mt-6 flex h-52 items-end gap-3">
            {data.desempenhoPorAno.map((item) => (
              <div
                key={item.ano}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-medium text-gray-600">
                  {formatTRI(item.mediaTRI)}
                </span>
                <div
                  className="w-full rounded-t-md bg-blue-500"
                  style={{
                    height: `${(item.mediaTRI / maxMediaAno) * 100}%`,
                    minHeight: "12px",
                  }}
                  title={`${item.ano}º ano: ${formatTRI(item.mediaTRI)}`}
                />
                <span className="text-xs text-gray-500">{item.ano}º</span>
                <span className="text-[10px] text-gray-400">
                  {formatPercent(item.participacao)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Parâmetros médios dos itens (TRI 3PL)
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumo do banco de itens utilizado nos simulados
          </p>
          <dl className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div>
                <dt className="text-sm font-medium text-gray-900">
                  Discriminação (a)
                </dt>
                <dd className="text-xs text-gray-500">
                  Capacidade do item de diferenciar níveis de proficiência
                </dd>
              </div>
              <dd className="text-lg font-bold text-gray-900">
                {data.parametrosItens.discriminacaoMedia.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div>
                <dt className="text-sm font-medium text-gray-900">
                  Dificuldade (b)
                </dt>
                <dd className="text-xs text-gray-500">
                  Posição do item na mesma régua dos estudantes
                </dd>
              </div>
              <dd className="text-lg font-bold text-gray-900">
                {formatTRI(data.parametrosItens.dificuldadeMedia)}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div>
                <dt className="text-sm font-medium text-gray-900">
                  Acerto casual (c)
                </dt>
                <dd className="text-xs text-gray-500">
                  Probabilidade estimada de acerto por chute
                </dd>
              </div>
              <dd className="text-lg font-bold text-gray-900">
                {data.parametrosItens.acertoCasualMedio.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Evolução dos simulados TRI
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Médias por área ao longo do semestre
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="py-2 pr-3 font-medium">Avaliação</th>
                  <th className="px-2 py-2 font-medium">LC</th>
                  <th className="px-2 py-2 font-medium">MT</th>
                  <th className="px-2 py-2 font-medium">CN</th>
                  <th className="px-2 py-2 font-medium">CH</th>
                </tr>
              </thead>
              <tbody>
                {data.avaliacoesRecentes.map((avaliacao) => (
                  <tr
                    key={avaliacao.nome}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 pr-3">
                      <p className="font-medium text-gray-900">{avaliacao.nome}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(avaliacao.data + "T12:00:00").toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </td>
                    {avaliacao.areas.map((area) => (
                      <td key={area.codigo} className="px-2 py-3 text-gray-700">
                        {formatTRI(area.media)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Leituras pedagógicas
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          {data.destaques.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );  
}
