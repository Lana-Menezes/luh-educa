"use client";

import { useEffect, useRef } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { IDLE_TIMEOUT_MS } from "@/lib/session-idle";

function SessionIdleGuard() {
  const { status, update } = useSession();
  const lastActivityRef = useRef(0);
  const lastSyncRef = useRef(0);

  useEffect(() => {
    if (status !== "authenticated") return;

    lastActivityRef.current = Date.now();

    const markActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
      "focus",
    ];

    events.forEach((event) =>
      window.addEventListener(event, markActivity, { passive: true }),
    );

    const interval = window.setInterval(async () => {
      const idleFor = Date.now() - lastActivityRef.current;

      if (idleFor >= IDLE_TIMEOUT_MS) {
        await signOut({ callbackUrl: "/login" });
        return;
      }

      if (
        idleFor < 60 * 1000 &&
        Date.now() - lastSyncRef.current >= 60 * 1000
      ) {
        lastSyncRef.current = Date.now();
        await update();
      }
    }, 30 * 1000);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, markActivity),
      );
      window.clearInterval(interval);
    };
  }, [status, update]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus>
      <SessionIdleGuard />
      {children}
    </SessionProvider>
  );
}
