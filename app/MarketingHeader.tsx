"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MarketingHeader() {
  const { data: session } = useSession();
  const portalHref = session ? "/dashboard" : "/login";

  const linkClass =
    "hidden text-sm font-medium text-gray-700 transition hover:text-brand sm:inline";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-muted/40 bg-[#eef1ff]/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-gray-900 md:text-2xl"
        >
          Luh Educa
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/#metodo" className={linkClass}>
            Método
          </Link>
          <Link href="/#tri" className={linkClass}>
            TRI
          </Link>
          <Link href="/#faq" className={linkClass}>
            FAQ
          </Link>
          <Link href="/quem-somos" className={linkClass}>
            Quem somos
          </Link>
          <Link
            href={portalHref}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Portal Escola
          </Link>
        </div>
      </nav>
    </header>
  );
}
