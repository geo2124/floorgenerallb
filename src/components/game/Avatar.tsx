import { useRef, useState, type ReactNode } from "react";
import { looks, previewFor, useLook } from "@/lib/avatar-store";

const presets = Object.values(looks).flatMap((k) => Object.values(k));

/**
 * Interactive "2K-style" player stage: pointer-driven 3D tilt,
 * moving spotlight, sheen, and crossfades between renders.
 */
export function Avatar({ className = "h-[460px]", children, priority, override }: { className?: string; children?: ReactNode; priority?: boolean; override?: string | null }) {
  const look = useLook();
  const active = override ?? look.render ?? previewFor(look);
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const srcs = look.render ? [...presets, look.render] : presets;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: "1200px" }}
    >
      <div className="pointer-events-none absolute inset-0 z-10 mix-blend-screen transition-[background] duration-300"
        style={{ background: `radial-gradient(circle at ${50 + t.x * 60}% ${25 + t.y * 30}%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 55%)` }} />
      <div className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateY(${t.x * 14}deg) rotateX(${-t.y * 6}deg) scale(1.06) translateX(${t.x * -10}px)` }}>
        {srcs.map((src) => {
          const on = src === active;
          return (
            <img key={src.slice(0, 80) + src.length} src={src} alt={on ? "Your player" : ""} width={768} height={1152}
              loading={on || priority ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 ${on ? "scale-100 opacity-100 blur-0" : "scale-[1.03] opacity-0 blur-sm"}`} />
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-fade" />
      <div className="avatar-sheen pointer-events-none absolute inset-0 z-10" />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}
