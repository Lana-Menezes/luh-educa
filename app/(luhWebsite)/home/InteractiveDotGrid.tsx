"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

const GAP = 28;
const RADIUS = 110;
const MAX_PUSH = 10;
const FRICTION = 0.86;
const SPRING = 0.08;

export default function InteractiveDotGrid({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const hoverTarget =
      (canvas.closest("section") as HTMLElement | null) ?? parent;

    function buildDots(width: number, height: number) {
      const dots: Dot[] = [];
      const cols = Math.ceil(width / GAP) + 1;
      const rows = Math.ceil(height / GAP) + 1;
      const offsetX = (width - (cols - 1) * GAP) / 2;
      const offsetY = (height - (rows - 1) * GAP) / 2;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = offsetX + col * GAP;
          const y = offsetY + row * GAP;
          dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
      dotsRef.current = dots;
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(rect.width * dpr);
      canvas!.height = Math.floor(rect.height * dpr);
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots(rect.width, rect.height);
    }

    function onPointerMove(event: PointerEvent) {
      const sectionRect = hoverTarget.getBoundingClientRect();
      const inside =
        event.clientX >= sectionRect.left &&
        event.clientX <= sectionRect.right &&
        event.clientY >= sectionRect.top &&
        event.clientY <= sectionRect.bottom;

      if (!inside) {
        mouseRef.current.active = false;
        return;
      }

      const canvasRect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top,
        active: true,
      };
    }

    function frame() {
      const { width, height } = canvas!.getBoundingClientRect();
      const mouse = mouseRef.current;
      const dots = dotsRef.current;

      ctx!.clearRect(0, 0, width, height);

      for (const dot of dots) {
        if (mouse.active) {
          const dx = dot.ox - mouse.x;
          const dy = dot.oy - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < RADIUS && dist > 0.001) {
            const force = (1 - dist / RADIUS) ** 2;
            const nx = dx / dist;
            const ny = dy / dist;
            dot.vx += nx * force * MAX_PUSH * 0.35;
            dot.vy += ny * force * MAX_PUSH * 0.35;
          }
        }

        dot.vx += (dot.ox - dot.x) * SPRING;
        dot.vy += (dot.oy - dot.y) * SPRING;
        dot.vx *= FRICTION;
        dot.vy *= FRICTION;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const drift = Math.min(
          Math.hypot(dot.x - dot.ox, dot.y - dot.oy) / MAX_PUSH,
          1
        );
        const alpha = 0.22 + drift * 0.45;
        const size = 1.1 + drift * 1.2;

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = window.requestAnimationFrame(frame);
    }

    resize();
    frame();

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    // Listen on window so text/links on top of the hero still drive the grid
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
