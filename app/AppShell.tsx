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
  const mainRef = useRef<HTMLElement>(null);
  const isMarketing = pathname === "/" || pathname.startsWith("/quem-somos");
  const isAuth = authPaths.some((path) => pathname.startsWith(path));

  function resetScroll() {
    scrollRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
    mainRef.current?.querySelectorAll<HTMLElement>(".overflow-y-auto").forEach((el) => {
      el.scrollTop = 0;
    });
  }

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const [navEntry] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    const isReload = navEntry?.type === "reload";

    if (!isReload) {
      const hash = window.location.hash;
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView();
          return;
        }
      }
    }

    resetScroll();
    requestAnimationFrame(resetScroll);
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
        <main ref={mainRef} className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
        <main ref={mainRef} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
