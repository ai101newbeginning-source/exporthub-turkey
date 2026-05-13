import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
const METRICS_FILE = join(DATA_DIR, "performance.json");

export interface TaskMetric {
  timestamp: string;
  intent: string;
  agents: string[];
  durationMs: number;
  approved: boolean;
  revisionCount: number;
  outputLength: number;
}

export interface PerformanceSummary {
  totalDispatches: number;
  averageDurationMs: number;
  approvalRate: number;
  averageRevisionCount: number;
  topAgents: Array<{ agent: string; count: number }>;
  intentDistribution: Record<string, number>;
  slowestIntent: string;
}

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readMetrics(): TaskMetric[] {
  ensureDataDir();
  if (!existsSync(METRICS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(METRICS_FILE, "utf-8")) as TaskMetric[];
  } catch {
    return [];
  }
}

export function logTask(metric: TaskMetric): void {
  ensureDataDir();
  const metrics = readMetrics();
  metrics.push(metric);
  // Son 1000 kaydı tut
  const trimmed = metrics.slice(-1000);
  writeFileSync(METRICS_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
}

export function getSummary(): PerformanceSummary | null {
  const metrics = readMetrics();
  if (metrics.length === 0) return null;

  const agentCounts: Record<string, number> = {};
  const intentCounts: Record<string, number> = {};
  const intentDurations: Record<string, number[]> = {};

  for (const m of metrics) {
    for (const a of m.agents) {
      agentCounts[a] = (agentCounts[a] ?? 0) + 1;
    }
    intentCounts[m.intent] = (intentCounts[m.intent] ?? 0) + 1;
    if (!intentDurations[m.intent]) intentDurations[m.intent] = [];
    intentDurations[m.intent].push(m.durationMs);
  }

  const topAgents = Object.entries(agentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([agent, count]) => ({ agent, count }));

  const avgDuration = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const slowestIntent = Object.entries(intentDurations)
    .sort((a, b) => avgDuration(b[1]) - avgDuration(a[1]))[0]?.[0] ?? "-";

  return {
    totalDispatches: metrics.length,
    averageDurationMs: Math.round(avgDuration(metrics.map((m) => m.durationMs))),
    approvalRate: metrics.filter((m) => m.approved).length / metrics.length,
    averageRevisionCount: metrics.reduce((a, b) => a + b.revisionCount, 0) / metrics.length,
    topAgents,
    intentDistribution: intentCounts,
    slowestIntent,
  };
}
