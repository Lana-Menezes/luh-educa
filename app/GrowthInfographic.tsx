const stages = [
  { label: "Baseline", value: 42, barClass: "bg-danger" },
  { label: "Diagnóstico", value: 58, barClass: "bg-accent" },
  { label: "Intervenção", value: 74, barClass: "bg-brand" },
  { label: "Avanço", value: 91, barClass: "bg-success" },
] as const;

const maxValue = Math.max(...stages.map((stage) => stage.value));

export default function GrowthInfographic() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
            Crescimento da aprendizagem
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
            Evolução esperada de proficiência ao longo do ciclo LUH.
          </p>
        </div>
        <p className="shrink-0 font-[family-name:var(--font-display)] text-3xl font-bold leading-none text-success md:text-4xl">
          +49
          <span className="mt-1 block text-sm font-semibold text-gray-500">
            pontos
          </span>
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-2 grid grid-cols-4 gap-3 sm:gap-4">
          {stages.map((stage) => (
            <p
              key={stage.label}
              className="text-center text-sm font-semibold tabular-nums text-gray-900"
            >
              {stage.value}%
            </p>
          ))}
        </div>

        <div className="relative grid h-48 grid-cols-4 gap-3 rounded-xl bg-[#f4f6ff] px-2 pb-2 pt-4 sm:gap-4">
          {stages.map((stage, index) => (
            <div
              key={stage.label}
              className="flex h-full items-end justify-center"
            >
              <div
                className={`w-full max-w-14 rounded-lg ${stage.barClass} luh-animate-fade-up`}
                style={{
                  height: `${(stage.value / maxValue) * 100}%`,
                  animationDelay: `${index * 0.12}s`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-3 sm:gap-4">
          {stages.map((stage) => (
            <p
              key={stage.label}
              className="text-center text-xs font-medium leading-snug text-gray-600 sm:text-sm"
            >
              {stage.label}
            </p>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm leading-relaxed text-gray-500">
        Da leitura inicial ao avanço com equidade, a decisão pedagógica guiada
        por evidência.
      </p>
    </div>
  );
}
