"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

/** Dropdown de seleção única da avaliação (Diagnóstica, Formativa 1–8, Somativa) do dashboard da rede. */
export default function AvaliacaoDropdown({
  avaliacoes,
  atual,
}: {
  avaliacoes: readonly { id: string; nome: string }[];
  atual: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Avaliação
      <span className="relative">
        <select
          value={atual}
          onChange={(event) => {
            const params = new URLSearchParams(window.location.search);
            params.set("avaliacao", event.target.value);
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-900 focus:border-brand focus:outline-none"
        >
          {avaliacoes.map((avaliacao, i) => (
            <option key={avaliacao.id} value={i}>
              {avaliacao.nome}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden
        />
      </span>
    </label>
  );
}
