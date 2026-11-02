import Link from "next/link";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function NavLink({
  href,
  children,
  className = "",
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`hidden text-sm font-medium text-gray-700 transition hover:text-brand sm:inline ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
