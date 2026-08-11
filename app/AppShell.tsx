"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MarketingHeader from "./MarketingHeader";

const authPaths = ["/login", "/register", "/setup"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMarketing = pathname === "/" || pathname.startsWith("/quem-somos");
  const isAuth = authPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isMarketing) {
    return (
      <div
        ref={scrollRef}
        className="min-h-dvh overflow-x-hidden overflow-y-auto bg-white"
      >
        <MarketingHeader />
        {children}
      </div>
    );
  }

  if (isAuth) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
