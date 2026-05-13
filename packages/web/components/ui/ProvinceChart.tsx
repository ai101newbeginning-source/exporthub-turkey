"use client";

import { useEffect, useRef, useState } from "react";

interface DataPoint {
  year: string;
  value: number;
}

interface Props {
  province: string;
  data: DataPoint[];
  colorScheme?: "red" | "blue" | "green";
}

const COLORS = {
  red: { bar: "#DC143C", accent: "#FF4757" },
  blue: { bar: "#3B6BC4", accent: "#60A5FA" },
  green: { bar: "#16A34A", accent: "#22C55E" },
};

export function ProvinceChart({ province, data, colorScheme = "red" }: Props) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const max = Math.max(...data.map((d) => d.value));
  const latest = data[data.length - 1];
  const { bar, accent } = COLORS[colorScheme];

  return (
    <div
      ref={ref}
      className="w-full rounded-xl overflow-hidden bg-slate-900 p-6 flex flex-col"
      style={{ minHeight: 220 }}
    >
      {/* Başlık */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-slate-500 text-xs mb-1">ExportHub Türkiye</div>
          <div className="text-white font-bold text-lg leading-tight">
            {province} İhracat Trendi
          </div>
          <div className="text-xs mt-1" style={{ color: bar }}>
            milyar USD cinsinden yıllık ihracat
          </div>
        </div>
        {latest && (
          <div className="text-right">
            <div className="text-slate-500 text-xs">{latest.year}</div>
            <div className="font-extrabold text-2xl" style={{ color: bar }}>
              ${latest.value.toFixed(1)}B
            </div>
          </div>
        )}
      </div>

      {/* Bar chart */}
      <div className="flex-1 flex items-end gap-1.5 sm:gap-2">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const isLatest = i === data.length - 1;
          return (
            <div
              key={d.year}
              className="flex-1 flex flex-col items-center gap-1"
              style={{ minWidth: 0 }}
            >
              {/* Değer etiketi */}
              <span
                className="text-xs font-semibold text-white transition-opacity duration-300"
                style={{
                  opacity: animated ? 1 : 0,
                  transitionDelay: `${i * 80 + 400}ms`,
                }}
              >
                {d.value.toFixed(1)}
              </span>
              {/* Bar */}
              <div className="w-full flex flex-col justify-end" style={{ height: 140 }}>
                <div
                  className="w-full rounded-t-md transition-all ease-out"
                  style={{
                    height: animated ? `${pct}%` : "0%",
                    minHeight: animated ? 3 : 0,
                    backgroundColor: isLatest ? accent : bar,
                    transitionDuration: "600ms",
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              {/* Yıl etiketi */}
              <span className="text-slate-400 text-xs">{d.year}</span>
            </div>
          );
        })}
      </div>

      {/* Kaynak */}
      <div className="text-slate-600 text-xs mt-4 border-t border-slate-800 pt-3">
        Kaynak: TÜİK · TİM · Ticaret Bakanlığı
      </div>
    </div>
  );
}
