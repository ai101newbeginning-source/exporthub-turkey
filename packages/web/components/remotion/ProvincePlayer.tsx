"use client";

import dynamic from "next/dynamic";
import type { ProvinceExportChartProps } from "@export-hub/remotion";

function PlayerSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-turkish-red rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-600 text-xs">Animasyon hazırlanıyor…</p>
      </div>
    </div>
  );
}

const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false, loading: () => <PlayerSkeleton /> }
);

const ProvinceExportChart = dynamic(
  () =>
    import("@export-hub/remotion").then((m) => m.ProvinceExportChart) as Promise<
      React.ComponentType<ProvinceExportChartProps>
    >,
  { ssr: false }
);

interface ProvincePlayerProps {
  province: string;
  data: Array<{ year: string; value: number }>;
  colorScheme?: "red" | "blue" | "green";
}

export function ProvincePlayer({ province, data, colorScheme = "red" }: ProvincePlayerProps) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden bg-slate-900"
      style={{ aspectRatio: "16/9", minHeight: 200 }}
    >
      <Player
        component={ProvinceExportChart as unknown as React.ComponentType<Record<string, unknown>>}
        inputProps={{ province, data, colorScheme }}
        durationInFrames={150}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        clickToPlay={false}
        loop
      />
    </div>
  );
}
