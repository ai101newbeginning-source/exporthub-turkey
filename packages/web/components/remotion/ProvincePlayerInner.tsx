"use client";

import { Player } from "@remotion/player";
import { ProvinceExportChart } from "@export-hub/remotion";
import type { ProvinceExportChartProps } from "@export-hub/remotion";

interface Props {
  province: string;
  data: Array<{ year: string; value: number }>;
  colorScheme?: "red" | "blue" | "green";
}

export function ProvincePlayerInner({ province, data, colorScheme = "red" }: Props) {
  return (
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
  );
}
