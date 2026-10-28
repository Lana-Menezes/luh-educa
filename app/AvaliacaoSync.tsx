"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AVALIACAO_COOKIE } from "@/lib/avaliacao-cookie";

const UM_ANO_EM_SEGUNDOS = 60 * 60 * 24 * 365;

/**
 * Grava a avaliação selecionada num cookie para que, ao navegar para uma
 * página sem `?avaliacao=` na URL (ex.: links do menu lateral), o próprio
 * servidor já renderize com essa avaliação como padrão — sem precisar de um
 * redirecionamento no cliente, que causava um flash com a avaliação mais
 * recente antes de trocar para a selecionada.
 */
export function AvaliacaoSync({ atual }: { atual: number }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("avaliacao")) return;
    document.cookie = `${AVALIACAO_COOKIE}=${atual}; path=/; max-age=${UM_ANO_EM_SEGUNDOS}; samesite=lax`;
  }, [searchParams, atual]);

  return null;
}
