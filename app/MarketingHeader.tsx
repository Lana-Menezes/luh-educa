import Image from "next/image";
import Link from "next/link";
import { Button, Container, NavLink } from "@/components/ui";

export default function MarketingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-muted/40 bg-[#eef1ff]/90 backdrop-blur-md">
      <Container as="nav" size="wide" className="flex items-center justify-between py-4">
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
          <NavLink href="/#metodo">Método</NavLink>
          <NavLink href="/#tri">Trilha</NavLink>
          <NavLink href="/#faq">FAQ</NavLink>
          <NavLink href="/#contato">Contato</NavLink>
          <NavLink href="/quem-somos">Quem somos</NavLink>
          <Button href="https://luh-educa.vercel.app/login" size="md">
            Portal Escola
          </Button>
        </div>
      </Container>
    </header>
  );
}
