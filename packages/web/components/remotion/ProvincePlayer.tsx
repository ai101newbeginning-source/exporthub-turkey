"use client";

import dynamic from "next/dynamic";
import type { ProvinceExportChartProps } from "@export-hub/remotion";

const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false }
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
    <div className="w-full rounded-xl overflow-hidden aspect-video bg-slate-900">
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
