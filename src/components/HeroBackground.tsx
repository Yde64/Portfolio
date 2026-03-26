import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const el = canvasRef.current;
    if (!el) return;

    el.style.animation = "gradient-shift 15s ease infinite";
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 opacity-50"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(100, 255, 218, 0.08) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 80% 20%, rgba(100, 255, 218, 0.05) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 50% 80%, rgba(100, 255, 218, 0.03) 0%, transparent 50%)",
        backgroundSize: "200% 200%",
      }}
      aria-hidden="true"
    />
  );
}
