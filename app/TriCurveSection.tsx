"use client";

import { useMemo, useState, type CSSProperties } from "react";

const CURVE = "#173efd";
const INFO = "#00b800";
const THETA_MIN = -3;
const THETA_MAX = 3;
const POINTS = 120;

function enemToTheta(score: number) {
  return (score - 500) / 100;
}

function thetaToEnem(theta: number) {
  return Math.round(500 + 100 * theta);
}

function formatBr(value: number, digits = 2) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** 3PL: P(θ) = c + (1 − c) / (1 + e^(−a(θ − b))) */
function probability(theta: number, a: number, b: number, c: number) {
  const exp = Math.exp(-a * (theta - b));
  return c + (1 - c) / (1 + exp);
}

/** Informação do item (3PL), normalizada depois ao pico */
function information(theta: number, a: number, b: number, c: number) {
  const p = probability(theta, a, b, c);
  if (p <= 0 || p >= 1 || c >= 1) return 0;
  const num = a * a * (1 - p) * Math.pow(p - c, 2);
  const den = Math.pow(1 - c, 2) * p;
  return den === 0 ? 0 : num / den;
}

function classifyDifficulty(bEnem: number) {
  if (bEnem < 450) return "Item de dificuldade fácil";
  if (bEnem < 550) return "Item de dificuldade média";
  if (bEnem < 650) return "Item de dificuldade difícil";
  return "Item de dificuldade muito difícil";
}

function buildPath(
  values: number[],
  x0: number,
  y0: number,
  width: number,
  height: number,
) {
  return values
    .map((y, i) => {
      const x = x0 + (i / (values.length - 1)) * width;
      const py = y0 + height * (1 - y);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${py.toFixed(2)}`;
    })
    .join(" ");
}

export default function TriCurveSection() {
  const [a, setA] = useState(1.6);
  const [bEnem, setBEnem] = useState(540);
  const [c, setC] = useState(0.18);
  const [thetaEnem, setThetaEnem] = useState(580);

  const b = enemToTheta(bEnem);
  const theta = enemToTheta(thetaEnem);

  const chart = useMemo(() => {
    const thetas = Array.from(
      { length: POINTS },
      (_, i) => THETA_MIN + (i / (POINTS - 1)) * (THETA_MAX - THETA_MIN),
    );

    const pCurve = thetas.map((t) => probability(t, a, b, c));
    const iRaw = thetas.map((t) => information(t, a, b, c));
    const iMax = Math.max(...iRaw, 1e-9);
    const iNorm = iRaw.map((v) => v / iMax);

    let bestIdx = 0;
    for (let i = 1; i < iRaw.length; i++) {
      if (iRaw[i] > iRaw[bestIdx]) bestIdx = i;
    }

    const pAtTheta = probability(theta, a, b, c);
    const iAtTheta = information(theta, a, b, c) / iMax;

    return {
      pCurve,
      iNorm,
      pAtTheta,
      iAtTheta,
      bestEnem: thetaToEnem(thetas[bestIdx]),
    };
  }, [a, b, c, theta]);

  const width = 640;
  const height = 262;
  const pad = { top: 12, right: 12, bottom: 44, left: 36 };
  const plotW = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const pPath = buildPath(chart.pCurve, pad.left, pad.top, plotW, plotHeight);
  const iPath = buildPath(chart.iNorm, pad.left, pad.top, plotW, plotHeight);

  const thetaX =
    pad.left + ((theta - THETA_MIN) / (THETA_MAX - THETA_MIN)) * plotW;
  const markerY = pad.top + plotHeight * (1 - chart.pAtTheta);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <section id="curva-tri" className="bg-[#f7f5f0]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Sistema
        </p>
        <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          A IA a favor dos resultados da sua rede.
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-600">
          Não geramos apenas relatórios. Nossa tecnologia integra dados
          educacionais para identificar padrões de aprendizagem, apoiar a
          identificação de situações que demandam atenção e subsidiar a tomada
          de decisão pedagógica.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.65fr)] lg:gap-8">
          <div>
            <div className="overflow-hidden rounded-lg bg-white/60 p-2 shadow-sm ring-1 ring-gray-200/80 sm:p-3">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full"
                role="img"
                aria-label="Curva característica e curva de informação do item"
              >
                {yTicks.map((tick) => {
                  const y = pad.top + plotHeight * (1 - tick);
                  return (
                    <g key={tick}>
                      <line
                        x1={pad.left}
                        x2={pad.left + plotW}
                        y1={y}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeWidth={1}
                      />
                      <text
                        x={pad.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="fill-gray-400"
                        fontSize={10}
                      >
                        {tick === 0 || tick === 1
                          ? String(tick)
                          : `.${String(tick).split(".")[1] ?? "00"}`}
                      </text>
                    </g>
                  );
                })}

                {xTicks.map((tick) => {
                  const x =
                    pad.left +
                    ((tick - THETA_MIN) / (THETA_MAX - THETA_MIN)) * plotW;
                  return (
                    <text
                      key={tick}
                      x={x}
                      y={height - 22}
                      textAnchor="middle"
                      className="fill-gray-400"
                      fontSize={10}
                    >
                      {tick}
                    </text>
                  );
                })}

                <text
                  x={pad.left + plotW / 2}
                  y={height - 4}
                  textAnchor="middle"
                  className="fill-gray-500"
                  fontSize={9}
                  letterSpacing={1}
                >
                  PROFICIÊNCIA (θ)
                </text>

                <path
                  d={iPath}
                  fill="none"
                  stroke={INFO}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  className="tri-curve-path"
                />
                <path
                  d={pPath}
                  fill="none"
                  stroke={CURVE}
                  strokeWidth={2.5}
                  className="tri-curve-path"
                />

                <line
                  x1={thetaX}
                  x2={thetaX}
                  y1={pad.top}
                  y2={pad.top + plotHeight}
                  stroke="#9ca3af"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  className="transition-all duration-300 ease-out"
                />
                <circle
                  cx={thetaX}
                  cy={markerY}
                  r={5}
                  fill="white"
                  stroke="#111827"
                  strokeWidth={1.5}
                  className="transition-all duration-300 ease-out"
                />
              </svg>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
              <SliderRow
                label="Discriminação (a)"
                valueLabel={formatBr(a)}
                min={0.3}
                max={3}
                step={0.05}
                value={a}
                onChange={setA}
              />
              <SliderRow
                label="Dificuldade (b)"
                valueLabel={String(bEnem)}
                min={200}
                max={800}
                step={5}
                value={bEnem}
                onChange={setBEnem}
              />
              <SliderRow
                label="Acerto ao acaso (c)"
                valueLabel={formatBr(c)}
                min={0}
                max={0.35}
                step={0.01}
                value={c}
                onChange={setC}
              />
              <SliderRow
                label="Aluno em θ"
                valueLabel={String(thetaEnem)}
                min={200}
                max={800}
                step={5}
                value={thetaEnem}
                onChange={setThetaEnem}
              />
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-lg bg-white/70 p-5 shadow-sm ring-1 ring-gray-200/80">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Leitura do item
              </p>
              <p
                className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tabular-nums transition-colors duration-300 md:text-5xl"
                style={{ color: CURVE }}
              >
                {formatBr(chart.pAtTheta * 100, 1)}%
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                de chance de acerto para um aluno em{" "}
                <span className="font-semibold text-gray-900">{thetaEnem}</span>
              </p>

              <dl className="mt-5 space-y-2.5 border-t border-gray-200 pt-4 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-gray-500">Classificação</dt>
                  <dd className="text-right font-medium text-gray-900">
                    {classifyDifficulty(bEnem)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-gray-500">Informação em θ</dt>
                  <dd className="font-medium tabular-nums text-gray-900">
                    {formatBr(chart.iAtTheta)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-gray-500">Mede melhor em</dt>
                  <dd className="font-medium tabular-nums text-gray-900">
                    {chart.bestEnem}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-gray-500">Escala exibida</dt>
                  <dd className="font-medium text-gray-900">ENEM 0–1000</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-0.5 w-6 rounded-full"
                  style={{ backgroundColor: CURVE }}
                />
                curva característica
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="h-0 w-6 border-t-2 border-dashed"
                  style={{ borderColor: INFO }}
                />
                curva de informação, normalizada ao pico
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SliderRow({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600">
          {label}
        </span>
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: CURVE }}
        >
          {valueLabel}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tri-slider w-full"
        style={
          {
            "--tri-fill": `${((value - min) / (max - min)) * 100}%`,
            accentColor: "#173efd",
          } as CSSProperties
        }
        aria-label={label}
      />
    </label>
  );
}
