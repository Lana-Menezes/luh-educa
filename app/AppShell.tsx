"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import MarketingHeader from "./MarketingHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  function resetScroll() {
    scrollRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
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
