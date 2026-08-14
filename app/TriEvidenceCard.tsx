const areas = [
  { label: "Português", value: 72, barClass: "bg-brand" },
  { label: "Matemática", value: 58, barClass: "bg-accent" },
] as const;

const insights = [
  { label: "Descritores analisados", value: "D03, D11, D24" },
  { label: "Lacuna detectada", value: "EF06MA13" },
  { label: "Sugestão de intervenção", value: "trilha personalizada" },
] as const;

export default function TriEvidenceCard() {
  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid md:grid-cols-2">
        <div className="p-6 md:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            TRI como instrumento
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Leitura de evidências com precisão estatística
          </h3>
          <p className="mt-4 leading-relaxed text-gray-600">
            A Teoria de Resposta ao Item é um dos instrumentos que usamos para
            gerar evidência. A mesma lógica usada pelo INEP no SAEB e no Enem,
            que considera a dificuldade e a coerência das respostas, não apenas
            o número de acertos.
          </p>
        </div>

        <div className="bg-[#eef1ff] p-6 md:p-8 lg:p-10">
          <div className="space-y-5">
            {areas.map((area) => (
              <div key={area.label}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {area.label}
                  </span>
                  <span className="text-sm text-gray-500">{area.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/80">
                  <div
                    className={`h-full rounded-full ${area.barClass}`}
                    style={{ width: `${area.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-brand/20 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-brand/10 bg-brand-soft/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-success"
                  aria-hidden
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
                  luh · resposta
                </p>
              </div>
              <p className="font-mono text-[11px] text-gray-400" aria-live="polite">
                Analisando
                <span className="loading-dots" aria-hidden>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
            </div>

            <div className="space-y-3 px-4 py-4 font-mono text-[13px] leading-relaxed">
              <p className="text-gray-400">
                <span className="text-brand">&gt;</span> analise_evidencias(turma)
              </p>
              {insights.map((insight) => (
                <p key={insight.label} className="text-gray-700">
                  <span className="text-gray-400">{insight.label}:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {insight.value}
                  </span>
                </p>
              ))}
              <p className="animate-pulse text-brand" aria-hidden>
                ▍
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
