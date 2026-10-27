"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatDelta, formatProficiencia, type Padrao } from "@/lib/saeb";
import { PadroesBarra, deltaClass } from "../../../ui";

export default function TurmaLinha({
  href,
  nome,
  turno,
  totalAlunos,
  participacao,
  disciplinas,
}: {
  href: string;
  nome: string;
  turno: string;
  totalAlunos: number;
  participacao: string;
  disciplinas: {
    codigo: string;
    media: number;
    delta: number;
    padroes: Record<Padrao, number>;
  }[];
}) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(href)}
      className="group cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
    >
      <td className="py-3 pr-3">
        <p className="font-medium text-gray-900 group-hover:text-brand">{nome}</p>
        <p className="text-xs text-gray-500">
          {turno} · {totalAlunos} estudantes
        </p>
      </td>
      <td className="px-2 py-3 text-gray-700">{participacao}</td>
      {disciplinas.map(({ codigo, media, delta, padroes }) => (
        <td key={codigo} className="px-2 py-3">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-gray-900">{formatProficiencia(media)}</span>
            <span className={`text-xs ${deltaClass(delta)}`}>{formatDelta(delta)}</span>
          </div>
          <div className="mt-1.5 w-40">
            <PadroesBarra contagem={padroes} compacta />
          </div>
        </td>
      ))}
      <td>
        <ChevronRight
          className="h-5 w-5 text-gray-300 group-hover:text-brand"
          aria-hidden
        />
      </td>
    </tr>
  );
}
