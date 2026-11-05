import { useRef, useState, type ReactNode } from "react";
import { looks, useLook } from "@/lib/avatar-store";

/**
 * Interactive "2K-style" player stage: pointer/touch-driven 3D tilt,
 * moving spotlight, rim glow, crossfading outfit renders.
 */
export function Avatar({ className = "h-[460px]", children, priority }: { className?: string; children?: ReactNode; priority?: boolean }) {
  const look = useLook();
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const move = (cx: number, cy: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setT({ x: (cx - r.left) / r.width - 0.5, y: (cy - r.top) / r.height - 0.5 });
  };

  return (
    <div
      ref={ref}
      onPointerMove={(e) => move(e.clientX, e.clientY)}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
      className={`avatar-stage relative overflow-hidden ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* moving spotlight */}
      <div className="pointer-events-none absolute inset-0 z-10 mix-blend-screen transition-[background] duration-300"
        style={{ background: `radial-gradient(circle at ${50 + t.x * 60}% ${25 + t.y * 30}%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 55%)` }} />
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateY(${t.x * 14}deg) rotateX(${-t.y * 6}deg) scale(1.06) translateX(${t.x * -10}px)` }}
      >
        {(Object.keys(looks) as (keyof typeof looks)[]).flatMap((kit) =>
          (Object.keys(looks[kit]) as (keyof (typeof looks)["black"])[]).map((acc) => {
            const on = look.kit === kit && look.acc === acc;
            return (
              <img key={kit + acc} src={looks[kit][acc]} alt={on ? "Your player" : ""} width={768} height={1152}
                loading={on || priority ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 ${on ? "scale-100 opacity-100 blur-0" : "scale-[1.03] opacity-0 blur-sm"}`} />
            );
          }),
        )}
      </div>
      {/* floor glow + scanline sheen */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-fade" />
      <div className="avatar-sheen pointer-events-none absolute inset-0 z-10" />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}
