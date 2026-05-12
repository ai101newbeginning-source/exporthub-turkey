"use client";

import dynamic from "next/dynamic";

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

// Start loading the heavy Remotion bundle immediately at module parse time,
// not when the component first renders — eliminates the render-triggered delay.
const innerImport = import("./ProvincePlayerInner");

const ProvincePlayerInner = dynamic(
  () => innerImport.then((m) => m.ProvincePlayerInner),
  { ssr: false, loading: () => <PlayerSkeleton /> }
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
      <ProvincePlayerInner province={province} data={data} colorScheme={colorScheme} />
    </div>
  );
}
