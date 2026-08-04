"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MarketingHeader() {
  const { data: session } = useSession();
  const portalHref = session ? "/dashboard" : "/login";

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white md:text-2xl"
        >
          Luh Educa
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#metodo"
            className="hidden text-sm font-medium text-white/85 transition hover:text-white sm:inline"
          >
            Método
          </a>
          <a
            href="#tri"
            className="hidden text-sm font-medium text-white/85 transition hover:text-white sm:inline"
          >
            TRI
          </a>
          <a
            href="#faq"
            className="hidden text-sm font-medium text-white/85 transition hover:text-white sm:inline"
          >
            FAQ
          </a>
          <Link
            href={portalHref}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft"
          >
            Portal Luh Educa
          </Link>
        </div>
      </nav>
    </header>
  );
}
