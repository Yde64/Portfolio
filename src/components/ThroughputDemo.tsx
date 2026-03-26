import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "baseline" | "optimized";

interface Sample {
  opsPerSec: number;
  timeMs: number;
}

interface DiffLine {
  type: "removed" | "added" | "context";
  text: string;
}

// --- Web Worker (inline blob) ---
// All heavy computation runs off the main thread.

const READINGS_COUNT = 20_000;
const WINDOW_SIZE = 200;

const workerSource = /* js */ `
  const READINGS_COUNT = ${READINGS_COUNT};
  const WINDOW_SIZE = ${WINDOW_SIZE};

  function generateReadings() {
    const readings = new Float64Array(READINGS_COUNT);
    let value = 20;
    for (let i = 0; i < READINGS_COUNT; i++) {
      value += (Math.random() - 0.5) * 2;
      readings[i] = value;
    }
    return readings;
  }

  function processNaive(readings) {
    const results = [];
    for (let i = 0; i < readings.length; i++) {
      const start = Math.max(0, i - WINDOW_SIZE + 1);
      const window = readings.slice(start, i + 1);
      const avg = window.reduce((sum, v) => sum + v, 0) / window.length;
      const sorted = Array.from(window).sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      results.push({ avg, median, min, max });
    }
    return results;
  }

  function processOptimized(readings) {
    const results = [];
    const buffer = new Float64Array(WINDOW_SIZE);
    let bufIdx = 0, bufLen = 0, runningSum = 0;
    const sorted = [];

    function bisectInsert(val) {
      let lo = 0, hi = sorted.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (sorted[mid] < val) lo = mid + 1; else hi = mid;
      }
      sorted.splice(lo, 0, val);
    }

    function bisectRemove(val) {
      let lo = 0, hi = sorted.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (sorted[mid] < val) lo = mid + 1; else hi = mid;
      }
      if (lo < sorted.length && sorted[lo] === val) sorted.splice(lo, 1);
    }

    for (let i = 0; i < readings.length; i++) {
      const newVal = readings[i];
      if (bufLen === WINDOW_SIZE) {
        const oldVal = buffer[bufIdx];
        runningSum -= oldVal;
        bisectRemove(oldVal);
      } else {
        bufLen++;
      }
      buffer[bufIdx] = newVal;
      bufIdx = (bufIdx + 1) % WINDOW_SIZE;
      runningSum += newVal;
      bisectInsert(newVal);
      results.push({
        avg: runningSum / bufLen,
        median: sorted[Math.floor(sorted.length / 2)],
        min: sorted[0],
        max: sorted[sorted.length - 1],
      });
    }
    return results;
  }

  function runSingle(fn) {
    const readings = generateReadings();
    const start = performance.now();
    fn(readings);
    const elapsed = performance.now() - start;
    return {
      opsPerSec: Math.round((READINGS_COUNT / elapsed) * 1000),
      timeMs: Math.round(elapsed * 100) / 100,
    };
  }

  let running = false;

  self.onmessage = function(e) {
    if (e.data.type === "start") {
      running = true;
      const fn = e.data.phase === "optimized" ? processOptimized : processNaive;
      function tick() {
        if (!running) return;
        const sample = runSingle(fn);
        self.postMessage({ type: "sample", sample });
        setTimeout(tick, 0);
      }
      tick();
    } else if (e.data.type === "stop") {
      running = false;
    }
  };
`;

function createWorker(): Worker | null {
  try {
    const blob = new Blob([workerSource], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    URL.revokeObjectURL(url);
    return worker;
  } catch {
    return null;
  }
}

// --- Diff ---

const DIFF_LINES: DiffLine[] = [
  { type: "context", text: " function processReadings(readings) {" },
  { type: "removed", text: "-  for (let i = 0; i < readings.length; i++) {" },
  { type: "removed", text: "-    const window = readings.slice(start, i + 1);" },
  { type: "removed", text: "-    const avg = window.reduce((s, v) => s + v, 0)" },
  { type: "removed", text: "-                / window.length;" },
  { type: "removed", text: "-    const sorted = [...window].sort((a, b) => a - b);" },
  { type: "removed", text: "-    const min = Math.min(...window);" },
  { type: "removed", text: "-    const max = Math.max(...window);" },
  { type: "added", text: "+  const buffer = new Float64Array(WINDOW);" },
  { type: "added", text: "+  let runningSum = 0;" },
  { type: "added", text: "+  const sorted = []; // binary-insert maintained" },
  { type: "added", text: "+  for (let i = 0; i < readings.length; i++) {" },
  { type: "added", text: "+    if (bufLen === WINDOW) {" },
  { type: "added", text: "+      runningSum -= buffer[bufIdx];" },
  { type: "added", text: "+      bisectRemove(buffer[bufIdx]);" },
  { type: "added", text: "+    }" },
  { type: "added", text: "+    runningSum += readings[i];" },
  { type: "added", text: "+    bisectInsert(readings[i]);" },
  { type: "added", text: "+    const avg = runningSum / bufLen;" },
  { type: "added", text: "+    const [min, max] = [sorted[0], sorted.at(-1)];" },
  { type: "context", text: "     results.push({ avg, median, min, max });" },
  { type: "context", text: " }" },
];

function CodeDiff() {
  const lineColors: Record<DiffLine["type"], string> = {
    removed: "text-red-400 bg-red-400/10",
    added: "text-accent bg-accent/10",
    context: "text-text-muted",
  };

  return (
    <div className="font-mono text-[11px] leading-relaxed overflow-x-auto">
      {DIFF_LINES.map((line, i) => (
        <div key={i} className={`px-3 py-0.5 whitespace-pre ${lineColors[line.type]}`}>
          {line.text}
        </div>
      ))}
    </div>
  );
}

// --- UI components ---

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

// --- Main component ---

const MAX_HISTORY = 30;

export default function ThroughputDemo() {
  const [phase, setPhase] = useState<Phase>("baseline");
  const [baselineAvg, setBaselineAvg] = useState<Sample | null>(null);
  const [pinnedBaseline, setPinnedBaseline] = useState<Sample | null>(null);
  const [optimizedAvg, setOptimizedAvg] = useState<Sample | null>(null);
  const [opsHistory, setOpsHistory] = useState<number[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const samplesRef = useRef<Sample[]>([]);

  function startWorker(targetPhase: Phase) {
    workerRef.current?.postMessage({ type: "stop" });
    workerRef.current?.terminate();
    samplesRef.current = [];

    const worker = createWorker();
    if (!worker) return;
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      if (e.data.type !== "sample") return;
      const sample: Sample = e.data.sample;
      samplesRef.current.push(sample);

      const recent = samplesRef.current.slice(-10);
      const avg: Sample = {
        opsPerSec: Math.round(recent.reduce((s, r) => s + r.opsPerSec, 0) / recent.length),
        timeMs: Math.round((recent.reduce((s, r) => s + r.timeMs, 0) / recent.length) * 100) / 100,
      };

      if (targetPhase === "baseline") setBaselineAvg(avg);
      else setOptimizedAvg(avg);

      setOpsHistory((prev) => {
        const next = [...prev, sample.opsPerSec];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    };

    worker.postMessage({ type: "start", phase: targetPhase });
  }

  useEffect(() => {
    startWorker("baseline");
    return () => {
      workerRef.current?.postMessage({ type: "stop" });
      workerRef.current?.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOptimize() {
    setPinnedBaseline(baselineAvg);
    setPhase("optimized");
    setOpsHistory([]);
    startWorker("optimized");
  }

  function handleReset() {
    setPhase("baseline");
    setPinnedBaseline(null);
    setOptimizedAvg(null);
    setOpsHistory([]);
    startWorker("baseline");
  }

  const isOptimized = phase === "optimized";
  const chartColor = isOptimized ? "#64ffda" : "#f87171";
  const currentAvg = isOptimized ? optimizedAvg : baselineAvg;
  const speedup = pinnedBaseline && optimizedAvg
    ? (pinnedBaseline.timeMs / optimizedAvg.timeMs).toFixed(1)
    : null;

  return (
    <div className="bg-bg-card border border-text-muted/10 rounded-lg p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${isOptimized ? "bg-accent" : "bg-red-400"} animate-pulse`} />
          <span className="font-mono text-xs text-text-muted">
            {isOptimized
              ? speedup ? `OPTIMIZED · ${speedup}× FASTER` : "OPTIMIZED"
              : `BASELINE · ${READINGS_COUNT.toLocaleString()} READINGS · W=${WINDOW_SIZE}`
            }
          </span>
        </div>
        <button
          onClick={isOptimized ? handleReset : handleOptimize}
          className="font-mono text-xs text-accent border border-accent/30 rounded px-3 py-1.5 hover:bg-accent-muted transition-colors cursor-pointer"
        >
          {isOptimized ? "Reset" : "Optimize"}
        </button>
      </div>

      {/* Chart */}
      <div className="mb-4 border-b border-text-muted/10 pb-4">
        <p className="font-mono text-[10px] text-text-muted mb-1">batch time (lower is better) · live</p>
        <SparkLine points={opsHistory} color={chartColor} />
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
            label="AVG TIME"
            value={currentAvg ? currentAvg.timeMs.toString() : "—"}
            unit="ms"
            status={isOptimized ? "good" : "bad"}
          />
          <MetricCard
            label="SPEEDUP"
            value={speedup ?? "—"}
            unit="×"
            status={speedup ? "good" : "neutral"}
          />
          <MetricCard
            label="COMPLEXITY"
            value={isOptimized ? "O(n·w)" : "O(n·w·log w)"}
            unit=""
            status={isOptimized ? "good" : "bad"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Code diff — visible when optimized */}
      <AnimatePresence>
        {isOptimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-text-muted/10">
              <p className="font-mono text-[10px] text-text-muted mb-2">
                circular buffer · running sum · binary-insert sorted window
              </p>
              <div className="rounded border border-text-muted/10 overflow-hidden">
                <CodeDiff />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
