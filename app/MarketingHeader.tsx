"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MarketingHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const portalHref = session ? "/dashboard" : "/login";
  const isLight = pathname === "/";

  const linkClass = isLight
    ? "hidden text-sm font-medium text-gray-700 transition hover:text-brand sm:inline"
    : "hidden text-sm font-medium text-white/85 transition hover:text-white sm:inline";

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
        <Link
          href="/"
          className={`font-[family-name:var(--font-display)] text-xl font-bold tracking-tight md:text-2xl ${
            isLight ? "text-brand" : "text-white"
          }`}
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
            className={
              isLight
                ? "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
                : "rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft"
            }
          >
            Portal Escola
          </Link>
        </div>
      </nav>
    </header>
  );
}
