"use client";

import { useState } from "react";
import { formatProficiencia } from "@/lib/saeb";

export type PontoEvolucao = {
  id: string;
  rotulo: string;
  selecionado: boolean;
  LP: number;
  MT: number;
};

/**
 * Curva de evolução (LP e MT) ao longo das avaliações do ano, com a avaliação
 * selecionada em destaque. Passar o mouse sobre uma das linhas esmaece a
 * outra, para facilitar a leitura da série em foco.
 */
export function CurvaEvolucao({ pontos }: { pontos: PontoEvolucao[] }) {
  const [emFoco, setEmFoco] = useState<"LP" | "MT" | null>(null);

  const largura = 640;
  const altura = 180;
  const margemEsq = 58;
  const margemDir = 12;
  const margemSup = 26;
  const margemInf = 20;

  const valores = pontos.flatMap((p) => [p.LP, p.MT]);
  const minV = Math.min(...valores);
  const maxV = Math.max(...valores);
  const folga = Math.max((maxV - minV) * 0.15, 5);
  const base = minV - folga;
  const topo = maxV + folga;

  const x = (i: number) =>
    pontos.length === 1
      ? margemEsq + (largura - margemEsq - margemDir) / 2
      : margemEsq + (i * (largura - margemEsq - margemDir)) / (pontos.length - 1);
  const y = (v: number) => margemSup + (1 - (v - base) / (topo - base)) * (altura - margemSup - margemInf);

  const linha = (chave: "LP" | "MT") =>
    pontos.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[chave])}`).join(" ");

  // Ticks do eixo Y em valores redondos, de 10 em 10, em vez de fatias
  // fracionárias do intervalo (que geravam rótulos decimais arbitrários).
  const PASSO_TICK = 5;
  const primeiroTick = Math.ceil(base / PASSO_TICK) * PASSO_TICK;
  const ultimoTick = Math.floor(topo / PASSO_TICK) * PASSO_TICK;
  const gridTicks: number[] = [];
  for (let v = primeiroTick; v <= ultimoTick; v += PASSO_TICK) gridTicks.push(v);

  const opacidade = (chave: "LP" | "MT") => (emFoco === null || emFoco === chave ? 1 : 0.25);

  return (
    <div>
      <svg
        viewBox={`0 0 ${largura} ${altura + 20}`}
        className="w-full min-w-[32rem]"
        role="img"
        aria-label="Curva de evolução da proficiência nas avaliações"
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
              <text
                x={margemEsq - 14}
                y={ly + 3}
                textAnchor="end"
                className="fill-gray-400 text-[7px]"
              >
                {formatProficiencia(v)}
              </text>
            </g>
          );
        })}

        {(["MT", "LP"] as const).map((chave) => (
          <g key={chave} style={{ opacity: opacidade(chave), transition: "opacity 150ms ease-out" }}>
            <path
              d={linha(chave)}
              fill="none"
              className={chave === "LP" ? "stroke-brand" : "stroke-chart-mt"}
              strokeWidth={emFoco === chave ? 2.5 : 1.5}
            />
            {/* Área invisível mais larga, só para facilitar o hover na linha. */}
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
            {(["MT", "LP"] as const).map((chave) => (
              <circle
                key={chave}
                cx={x(i)}
                cy={y(p[chave])}
                r={p.selecionado ? 5 : 3}
                className={chave === "LP" ? "fill-brand" : "fill-chart-mt"}
                style={{ opacity: opacidade(chave), transition: "opacity 150ms ease-out" }}
                onMouseEnter={() => setEmFoco(chave)}
                onMouseLeave={() => setEmFoco(null)}
              >
                <title>
                  {p.rotulo} · {chave}: {formatProficiencia(p[chave])}
                </title>
              </circle>
            ))}
            <text
              x={x(i)}
              y={y(p.MT) - 7}
              textAnchor="middle"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
              className="fill-chart-mt text-[7px] font-medium"
              style={{ opacity: opacidade("MT"), transition: "opacity 150ms ease-out" }}
            >
              {formatProficiencia(p.MT)}
            </text>
            <text
              x={x(i)}
              y={y(p.LP) - 7}
              textAnchor="middle"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
              className="fill-brand text-[7px] font-medium"
              style={{ opacity: opacidade("LP"), transition: "opacity 150ms ease-out" }}
            >
              {formatProficiencia(p.LP)}
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
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
        <button
          type="button"
          className="flex items-center gap-1.5"
          style={{ opacity: opacidade("LP"), transition: "opacity 150ms ease-out" }}
          onMouseEnter={() => setEmFoco("LP")}
          onMouseLeave={() => setEmFoco(null)}
        >
          <span className="h-2 w-2 rounded-full bg-brand" aria-hidden /> Língua Portuguesa
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5"
          style={{ opacity: opacidade("MT"), transition: "opacity 150ms ease-out" }}
          onMouseEnter={() => setEmFoco("MT")}
          onMouseLeave={() => setEmFoco(null)}
        >
          <span className="h-2 w-2 rounded-full bg-chart-mt" aria-hidden /> Matemática
        </button>
      </div>
    </div>
  );
}
