import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface SectorBreakdownProps {
  province: string;
  sectors: Array<{ ad: string; pay: number }>;
  year?: string;
}

const SECTOR_COLORS = [
  "#DC143C",
  "#3B6BC4",
  "#16A34A",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export const SectorBreakdown: React.FC<SectorBreakdownProps> = ({
  province,
  sectors,
  year = "2024",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 540;
  const cy = 360;
  const outerR = 220;
  const innerR = 110;

  let cumulative = 0;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
      }}
    >
      {/* Sol: Başlık + Açıklama */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          width: 380,
          opacity: titleOpacity,
        }}
      >
        <div style={{ color: "#DC143C", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          ExportHub Türkiye
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>
          {province}
        </div>
        <div style={{ color: "#94A3B8", fontSize: 22, marginTop: 6 }}>
          Sektör Dağılımı {year}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 14 }}>
          {sectors.map((sector, i) => {
            const legendOpacity = interpolate(
              frame,
              [30 + i * 8, 45 + i * 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={sector.ad}
                style={{ display: "flex", alignItems: "center", gap: 12, opacity: legendOpacity }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "#CBD5E1", fontSize: 15, flex: 1 }}>
                  {sector.ad}
                </span>
                <span
                  style={{
                    color: SECTOR_COLORS[i % SECTOR_COLORS.length],
                    fontSize: 15,
                    fontWeight: 700,
                    minWidth: 40,
                    textAlign: "right",
                  }}
                >
                  %{sector.pay}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sağ: Donut Chart SVG */}
      <svg
        style={{ position: "absolute", right: 0, top: 0, width: 760, height: 720 }}
        viewBox="0 0 760 720"
      >
        {sectors.map((sector, i) => {
          const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
          cumulative += sector.pay;
          const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;

          const animProgress = spring({
            frame: frame - i * 5,
            fps,
            config: { damping: 20, stiffness: 60 },
          });

          const animEnd = startAngle + (endAngle - startAngle) * animProgress;

          const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

          const x1 = cx + outerR * Math.cos(startAngle);
          const y1 = cy + outerR * Math.sin(startAngle);
          const x2 = cx + outerR * Math.cos(animEnd);
          const y2 = cy + outerR * Math.sin(animEnd);

          const ix1 = cx + innerR * Math.cos(animEnd);
          const iy1 = cy + innerR * Math.sin(animEnd);
          const ix2 = cx + innerR * Math.cos(startAngle);
          const iy2 = cy + innerR * Math.sin(startAngle);

          const pathD = animProgress < 0.01
            ? ""
            : `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${ix2} ${iy2} Z`;

          const midAngle = startAngle + (animEnd - startAngle) / 2;
          const labelR = (outerR + innerR) / 2;
          const labelX = cx + labelR * Math.cos(midAngle);
          const labelY = cy + labelR * Math.sin(midAngle);

          const labelOpacity = interpolate(frame, [30 + i * 5, 50 + i * 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={sector.ad}>
              <path
                d={pathD}
                fill={SECTOR_COLORS[i % SECTOR_COLORS.length]}
                stroke="#0F172A"
                strokeWidth={3}
                opacity={0.9}
              />
              {sector.pay > 8 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFFFFF"
                  fontSize={14}
                  fontWeight={700}
                  opacity={labelOpacity}
                >
                  %{sector.pay}
                </text>
              )}
            </g>
          );
        })}

        {/* Merkez metin */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={18}
          fontWeight={600}
          opacity={titleOpacity}
        >
          {province}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="#64748B"
          fontSize={14}
          opacity={titleOpacity}
        >
          Sektörler
        </text>
      </svg>
    </AbsoluteFill>
  );
};
