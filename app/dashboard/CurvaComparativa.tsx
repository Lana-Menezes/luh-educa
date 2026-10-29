"use client";

import { useState } from "react";
import { formatPercent } from "@/lib/saeb";

export type PontoComparativo = {
  id: string;
  rotulo: string;
  selecionado: boolean;
  crescimento: number;
  condicionalIII: number;
};

/**
 * Curva comparativa (mesmo modelo de "Progresso mês a mês"): cruza, por
 * avaliação, o % de estudantes do 5º/9º ano que cresceram em relação à
 * Diagnóstica com o % de estudantes atingidos pela Condicionalidade III
 * (desempenho adequado nos grupos PPI e baixo NSE).
 */
export function CurvaComparativa({ pontos }: { pontos: PontoComparativo[] }) {
  const [emFoco, setEmFoco] = useState<"crescimento" | "condicionalIII" | null>(null);

  const largura = 640;
  const altura = 180;
  const margemEsq = 46;
  const margemDir = 12;
  const margemSup = 26;
  const margemInf = 20;

  const valores = pontos.flatMap((p) => [p.crescimento, p.condicionalIII]);
  const minV = Math.min(0, ...valores);
  const maxV = Math.max(100, ...valores);
  const base = minV;
  const topo = maxV;

  const x = (i: number) =>
    pontos.length === 1
      ? margemEsq + (largura - margemEsq - margemDir) / 2
      : margemEsq + (i * (largura - margemEsq - margemDir)) / (pontos.length - 1);
  const y = (v: number) => margemSup + (1 - (v - base) / (topo - base)) * (altura - margemSup - margemInf);

  const linha = (chave: "crescimento" | "condicionalIII") =>
    pontos.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[chave])}`).join(" ");

  const PASSO_TICK = 25;
  const gridTicks: number[] = [];
  for (let v = 0; v <= 100; v += PASSO_TICK) gridTicks.push(v);

  const opacidade = (chave: "crescimento" | "condicionalIII") =>
    emFoco === null || emFoco === chave ? 1 : 0.1;

  return (
    <div>
      <svg
        viewBox={`0 0 ${largura} ${altura + 20}`}
        className="w-full min-w-[32rem]"
        role="img"
        aria-label="Curva comparando crescimento dos alunos e atingimento da Condicionalidade III"
      >
        {gridTicks.map((v) => {
          const ly = y(v);
          return (
            <g key={v}>
              <line
                x1={margemEsq}
                x2={largura - margemDir}
                y1={ly}
                y2={ly}
                className="stroke-gray-100"
                strokeWidth={1}
              />
              <text x={margemEsq - 10} y={ly + 3} textAnchor="end" className="fill-gray-400 text-[9px]">
                {formatPercent(v)}
              </text>
            </g>
          );
        })}

        {(["condicionalIII", "crescimento"] as const).map((chave) => (
          <g key={chave} style={{ opacity: opacidade(chave), transition: "opacity 150ms ease-out" }}>
            <path
              d={linha(chave)}
              fill="none"
              className={chave === "crescimento" ? "stroke-brand" : "stroke-chart-mt"}
              strokeWidth={emFoco === chave ? 2.5 : 1.5}
            />
            <path
              d={linha(chave)}
              fill="none"
              stroke="transparent"
              strokeWidth={14}
              onMouseEnter={() => setEmFoco(chave)}
              onMouseLeave={() => setEmFoco(null)}
              className="cursor-pointer"
            />
          </g>
        ))}

        {pontos.map((p, i) => (
          <g key={p.id}>
            {p.selecionado && (
              <line
                x1={x(i)}
                x2={x(i)}
                y1={margemSup}
                y2={altura - margemInf}
                className="stroke-brand"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.35}
              />
            )}
            {(["condicionalIII", "crescimento"] as const).map((chave) => (
              <circle
                key={chave}
                cx={x(i)}
                cy={y(p[chave])}
                r={p.selecionado ? 5 : 3}
                className={chave === "crescimento" ? "fill-brand" : "fill-chart-mt"}
                style={{ opacity: opacidade(chave), transition: "opacity 150ms ease-out" }}
                onMouseEnter={() => setEmFoco(chave)}
                onMouseLeave={() => setEmFoco(null)}
              >
                <title>{`${p.rotulo} · ${chave === "crescimento" ? "Crescimento" : "Cond. III"}: ${formatPercent(p[chave])}`}</title>
              </circle>
            ))}
            <text
              x={x(i)}
              y={y(p.condicionalIII) - 7}
              textAnchor="middle"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
              className="fill-chart-mt text-[9px] font-medium"
              style={{ opacity: opacidade("condicionalIII"), transition: "opacity 150ms ease-out" }}
            >
              {formatPercent(p.condicionalIII)}
            </text>
            <text
              x={x(i)}
              y={y(p.crescimento) - 7}
              textAnchor="middle"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
              className="fill-brand text-[9px] font-medium"
              style={{ opacity: opacidade("crescimento"), transition: "opacity 150ms ease-out" }}
            >
              {formatPercent(p.crescimento)}
            </text>
            <text
              x={x(i)}
              y={altura + 14}
              textAnchor="middle"
              className={`text-[7px] ${p.selecionado ? "fill-brand font-medium" : "fill-gray-400"}`}
            >
              {p.rotulo}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-sm text-gray-900">
        <button
          type="button"
          className="flex items-center gap-1.5"
          style={{ opacity: opacidade("crescimento"), transition: "opacity 150ms ease-out" }}
          onMouseEnter={() => setEmFoco("crescimento")}
          onMouseLeave={() => setEmFoco(null)}
        >
          <span className="h-2 w-2 rounded-full bg-brand" aria-hidden /> Alunos que cresceram
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5"
          style={{ opacity: opacidade("condicionalIII"), transition: "opacity 150ms ease-out" }}
          onMouseEnter={() => setEmFoco("condicionalIII")}
          onMouseLeave={() => setEmFoco(null)}
        >
          <span className="h-2 w-2 rounded-full bg-chart-mt" aria-hidden /> Atingidos pela Cond. III
        </button>
      </div>
    </div>
  );
}
