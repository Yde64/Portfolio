import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "unoptimized" | "optimized";

interface Metrics {
  rps: number;
  latency: number;
  errorRate: number;
}

const TARGET_UNOPTIMIZED: Metrics = { rps: 120, latency: 850, errorRate: 12.4 };
const TARGET_OPTIMIZED: Metrics = { rps: 4200, latency: 23, errorRate: 0.01 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function jitter(value: number, amount: number) {
  return value + (Math.random() - 0.5) * amount;
}

function useAnimatedMetrics(phase: Phase): Metrics {
  const [metrics, setMetrics] = useState<Metrics>({ rps: 0, latency: 0, errorRate: 0 });
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
    const target = phase === "optimized" ? TARGET_OPTIMIZED : TARGET_UNOPTIMIZED;
    const jitterScale = phase === "optimized" ? 0.05 : 0.2;

    const interval = setInterval(() => {
      progressRef.current = Math.min(1, progressRef.current + 0.04);
      const t = progressRef.current;
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

      setMetrics({
        rps: Math.round(jitter(lerp(0, target.rps, eased), target.rps * jitterScale)),
        latency: Math.round(jitter(lerp(0, target.latency, eased), target.latency * jitterScale)),
        errorRate: Math.round(jitter(lerp(0, target.errorRate, eased), target.errorRate * jitterScale) * 100) / 100,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  return metrics;
}

function MetricCard({ label, value, unit, status }: {
  label: string;
  value: string;
  unit: string;
  status: "good" | "bad" | "neutral";
}) {
  const color = status === "good" ? "text-accent" : status === "bad" ? "text-red-400" : "text-text-muted";

  return (
    <div className="text-center">
      <p className="font-mono text-xs text-text-muted mb-1">{label}</p>
      <p className={`font-mono text-lg font-bold ${color} tabular-nums`}>
        {value}
        <span className="text-xs font-normal ml-0.5">{unit}</span>
      </p>
    </div>
  );
}

function SparkLine({ points, color }: { points: number[]; color: string }) {
  const width = 280;
  const height = 60;
  const max = Math.max(...points, 1);

  const pathData = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (p / max) * (height - 4);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {points.length > 1 && (
        <>
          <path
            d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
            fill={`url(#grad-${color})`}
          />
          <path d={pathData} fill="none" stroke={color} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export default function ThroughputDemo() {
  const [phase, setPhase] = useState<Phase>("unoptimized");
  const [rpsHistory, setRpsHistory] = useState<number[]>([]);
  const metrics = useAnimatedMetrics(phase);
  const maxHistory = 40;

  useEffect(() => {
    setRpsHistory([]);
  }, [phase]);

  useEffect(() => {
    setRpsHistory((prev) => {
      const next = [...prev, Math.max(0, metrics.rps)];
      return next.length > maxHistory ? next.slice(-maxHistory) : next;
    });
  }, [metrics.rps]);

  const toggle = useCallback(() => {
    setPhase((p) => (p === "unoptimized" ? "optimized" : "unoptimized"));
  }, []);

  const isOptimized = phase === "optimized";
  const chartColor = isOptimized ? "#64ffda" : "#f87171";

  return (
    <div className="bg-bg-card border border-text-muted/10 rounded-lg p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${isOptimized ? "bg-accent" : "bg-red-400"} animate-pulse`} />
          <span className="font-mono text-xs text-text-muted">
            {isOptimized ? "OPTIMIZED" : "BASELINE"}
          </span>
        </div>
        <button
          onClick={toggle}
          className="font-mono text-xs text-accent border border-accent/30 rounded px-3 py-1.5 hover:bg-accent-muted transition-colors cursor-pointer"
        >
          {isOptimized ? "Reset" : "Optimize"}
        </button>
      </div>

      {/* Chart */}
      <div className="mb-4 border-b border-text-muted/10 pb-4">
        <p className="font-mono text-[10px] text-text-muted mb-1">req/s</p>
        <SparkLine points={rpsHistory} color={chartColor} />
      </div>

      {/* Metrics */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-4"
        >
          <MetricCard
            label="THROUGHPUT"
            value={metrics.rps.toLocaleString()}
            unit="req/s"
            status={isOptimized ? "good" : "bad"}
          />
          <MetricCard
            label="LATENCY"
            value={metrics.latency.toString()}
            unit="ms"
            status={isOptimized ? "good" : "bad"}
          />
          <MetricCard
            label="ERROR RATE"
            value={metrics.errorRate.toFixed(2)}
            unit="%"
            status={isOptimized ? "good" : "bad"}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
