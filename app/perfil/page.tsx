"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function PerfilPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-gray-50 p-8">
        <p className="text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-gray-50 p-8">
        <p className="text-gray-600">
          Sessão não encontrada.{" "}
          <Link href="/login" className="text-brand hover:underline">
            Acessar
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
      <p className="mt-2 text-gray-600">
        Dados da sua conta na plataforma LUH Educa.
      </p>

      <section className="mt-8 max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-xl font-bold text-brand">
            {(session.user.name || session.user.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-gray-900">
              {session.user.name || "Usuário"}
            </h2>
            <p className="truncate text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-4 border-t border-gray-100 pt-6">
          <div>
            <dt className="text-sm text-gray-500">Nome</dt>
            <dd className="mt-1 font-medium text-gray-900">
              {session.user.name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">E-mail</dt>
            <dd className="mt-1 font-medium text-gray-900">{session.user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Instituição</dt>
            <dd className="mt-1 font-medium text-brand">Colégio Bom Jesus</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover"
          >
            Ir para o Dashboard
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-hover"
          >
            Sair da conta
          </button>
        </div>
      </section>
    </div>
  );
}
