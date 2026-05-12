"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProvincePoint {
  id: string;
  il: string;
  ihracat: number;
  buyume: number;
}

// Geographic → SVG coords. ViewBox: 0 0 760 400
// x = (lon - 25.5) * 38,  y = (42.5 - lat) * 57
const COORDS: Record<string, { x: number; y: number }> = {
  istanbul:    { x: 133, y: 86 },
  kocaeli:     { x: 167, y: 103 },
  bursa:       { x: 137, y: 131 },
  izmir:       { x: 61,  y: 234 },
  gaziantep:   { x: 452, y: 308 },
  ankara:      { x: 277, y: 148 },
  antalya:     { x: 198, y: 319 },
  mersin:      { x: 346, y: 325 },
  konya:       { x: 266, y: 262 },
  denizli:     { x: 137, y: 268 },
  kayseri:     { x: 380, y: 217 },
};

// Simplified Turkey polygon (clockwise from NW Thrace)
const OUTLINE =
  "19,46 76,29 141,68 171,51 239,57 369,23 540,86 608,57 684,171 733,302 646,314 403,359 190,325 95,314 57,297 38,228 49,143 76,114 114,97 60,85 19,46";

export function TurkeyMap({ provinces }: { provinces: ProvincePoint[] }) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const maxIhracat = Math.max(...provinces.map((p) => p.ihracat));
  const activeData = provinces.find((p) => p.id === active);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 760 400"
        className="w-full h-auto"
        style={{ maxHeight: 340 }}
        aria-label="Türkiye ihracat haritası"
      >
        {/* Ocean background */}
        <rect width="760" height="400" fill="#0f172a" />

        {/* Longitude guide lines */}
        {[28, 32, 36, 40, 44].map((lon) => (
          <line
            key={lon}
            x1={(lon - 25.5) * 38}
            y1="0"
            x2={(lon - 25.5) * 38}
            y2="400"
            stroke="#1e3a5f"
            strokeWidth="0.5"
            strokeDasharray="3,8"
            opacity="0.5"
          />
        ))}

        {/* Turkey landmass */}
        <polygon
          points={OUTLINE}
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Province bubbles */}
        {provinces.map((p) => {
          const pos = COORDS[p.id];
          if (!pos) return null;
          const r = 16 + (p.ihracat / maxIhracat) * 22;
          const isActive = active === p.id;

          return (
            <g
              key={p.id}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => router.push(`/veriler/${p.id}`)}
              role="button"
              aria-label={`${p.il} — $${p.ihracat}B ihracat`}
            >
              {/* Outer glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r + 8}
                fill="rgba(220,20,60,0.08)"
                stroke="rgba(220,20,60,0.15)"
                strokeWidth="1"
              />
              {/* Main bubble */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill={isActive ? "rgba(220,20,60,0.65)" : "rgba(220,20,60,0.3)"}
                stroke={isActive ? "#DC143C" : "rgba(220,20,60,0.6)"}
                strokeWidth={isActive ? 2 : 1.5}
                style={{ transition: "all 0.15s ease" }}
              />
              {/* City name */}
              <text
                x={pos.x}
                y={pos.y - (r > 28 ? 4 : 3)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={r > 28 ? 10 : 8}
                fontWeight="bold"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {p.il.length > 8 ? p.il.slice(0, 7) + "…" : p.il}
              </text>
              {/* Export value */}
              <text
                x={pos.x}
                y={pos.y + (r > 28 ? 9 : 8)}
                textAnchor="middle"
                fill="rgba(255,255,255,0.75)"
                fontSize={r > 28 ? 8 : 7}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                ${p.ihracat}B
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(16, 350)">
          <circle cx="6" cy="6" r="6" fill="rgba(220,20,60,0.3)" stroke="rgba(220,20,60,0.6)" strokeWidth="1.5" />
          <text x="16" y="10" fill="#94a3b8" fontSize="9">İhracatçı il (daire büyüklüğü = hacim)</text>
        </g>
      </svg>

      {/* Hover tooltip */}
      {activeData && (
        <div
          className="absolute top-3 right-3 card-dark p-3 text-xs pointer-events-none animate-fade-in"
          style={{ minWidth: 140 }}
        >
          <div className="text-white font-bold mb-1.5 text-sm">{activeData.il}</div>
          <div className="text-slate-400 mb-0.5">
            İhracat: <span className="text-white font-semibold">${activeData.ihracat}B</span>
          </div>
          <div className="text-emerald-400 mb-1.5">+{activeData.buyume}% büyüme</div>
          <div className="text-turkish-red font-medium">Detay için tıkla →</div>
        </div>
      )}
    </div>
  );
}
