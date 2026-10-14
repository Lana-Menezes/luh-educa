"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user?.id);

  return (
    <header className="w-full shrink-0 border-b border-gray-200 bg-white py-4 px-8 shadow-sm">
      <nav className="flex justify-between items-center">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-gray-900 hover:text-brand transition-colors"
        >
          LUH Educa
        </Link>
        {isLoggedIn && (
          <div className="flex items-center space-x-4">
            <Link
              href="/posts/new"
              className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition"
            >
              Nova avaliação
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {session?.user?.name && <div>{session.user.name}</div>}
                <div>{session?.user?.email}</div>
              </div>
              <button
                onClick={() => signOut()}
                className="bg-danger text-white px-4 py-2 rounded-lg hover:bg-danger-hover transition"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
