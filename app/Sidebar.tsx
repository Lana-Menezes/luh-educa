"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  School,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react";

const navItems: { href: string; label: string; icon: typeof Users; also?: string[] }[] = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/escolas", label: "Escolas", icon: School },
  { href: "/avaliacoes", label: "Avaliações", icon: ClipboardList },
];

const hiddenPaths = ["/login", "/register", "/setup"];
const STORAGE_KEY = "luh-educa-sidebar-collapsed";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const isPerfilActive =
    pathname === "/perfil" || pathname.startsWith("/perfil/");

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-500 ease-in-out ${
        collapsed ? "w-14" : "w-44"
      }`}
    >
      <div
        className={`flex items-center border-b border-gray-100 p-2 ${
          collapsed ? "justify-center" : "justify-between px-3"
        }`}
      >
        {!collapsed && (
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Menu
          </p>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      <nav
        className={`flex flex-1 flex-col gap-1 overflow-y-auto p-2 ${
          collapsed ? "items-center" : ""
        }`}
      >
        {navItems.map(({ href, label, icon: Icon, also = [] }) => {
          const isActive = [href, ...also].some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
          );

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`group relative flex items-center rounded-lg text-sm font-medium transition-colors ${
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              } ${
                isActive
                  ? "bg-brand-soft text-brand"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {collapsed ? (
                <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity delay-150 group-hover:opacity-100 z-20">
                  {label}
                </span>
              ) : (
                <span>{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={`mt-auto border-t border-gray-100 p-2 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        {!collapsed && (
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Conta
          </p>
        )}
        <Link
          href="/perfil"
          aria-label="Perfil"
          className={`group relative flex items-center rounded-lg text-sm font-medium transition-colors ${
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
          } ${
            isPerfilActive
              ? "bg-brand-soft text-brand"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <UserRound className="h-5 w-5 shrink-0" aria-hidden />
          {collapsed ? (
            <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity delay-150 group-hover:opacity-100 z-20">
              {session?.user?.name || "Perfil"}
            </span>
          ) : (
            <span className="min-w-0 truncate">
              {session?.user?.name || "Perfil"}
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
