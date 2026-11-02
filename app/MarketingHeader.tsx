import Image from "next/image";
import Link from "next/link";

export default function MarketingHeader() {
  const linkClass =
    "hidden text-sm font-medium text-gray-700 transition hover:text-brand sm:inline";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-muted/40 bg-[#eef1ff]/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-gray-900 md:text-2xl"
        >
          <Image
            src="/logo-luh.png"
            alt="Logo LUH Educa"
            width={577}
            height={521}
            className="h-8 w-auto"
          />
          LUH Educa
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/#metodo" className={linkClass}>
            Método
          </Link>
          <Link href="/#tri" className={linkClass}>
            Trilha
          </Link>
          <Link href="/#faq" className={linkClass}>
            FAQ
          </Link>
          <Link href="/#contato" className={linkClass}>
            Contato
          </Link>
          <Link href="/quem-somos" className={linkClass}>
            Quem somos
          </Link>
          <a
            href="https://luh-educa.vercel.app/login"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Portal Escola
          </a>
        </div>
      </nav>
    </header>
  );
}
