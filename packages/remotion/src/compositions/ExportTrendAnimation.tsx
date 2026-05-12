import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export interface ExportTrendAnimationProps {
  title: string;
  subtitle?: string;
  dataPoints: Array<{ label: string; value: number; year: string }>;
  unit?: string;
  highlightLast?: boolean;
}

export const ExportTrendAnimation: React.FC<ExportTrendAnimationProps> = ({
  title,
  subtitle,
  dataPoints,
  unit = "milyar USD",
  highlightLast = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const maxValue = Math.max(...dataPoints.map((d) => d.value));
  const padding = { top: 100, right: 120, bottom: 80, left: 80 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom - 180;

  // Zaman serisi için x koordinatları
  const xScale = (index: number) =>
    padding.left + (index / (dataPoints.length - 1)) * chartW;
  const yScale = (value: number) =>
    padding.top + chartH - (value / maxValue) * chartH;

  // Path draw animasyonu
  const pathProgress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // SVG path oluştur
  const buildPath = (progress: number): string => {
    if (dataPoints.length === 0) return "";
    const totalPoints = Math.max(1, Math.floor(progress * (dataPoints.length - 1) * 100));
    let d = "";

    for (let i = 0; i <= Math.min(dataPoints.length - 1, totalPoints / 100); i++) {
      const t = Math.min(1, (totalPoints / 100 - i + 1));
      if (i === 0) {
        d = `M ${xScale(0)} ${yScale(dataPoints[0].value)}`;
      } else {
        const prevX = xScale(i - 1);
        const currX = xScale(i);
        const prevY = yScale(dataPoints[i - 1].value);
        const currY = yScale(dataPoints[i].value);
        const cpX = prevX + (currX - prevX) * 0.5;
        const animY = prevY + (currY - prevY) * Math.min(1, t);
        d += ` C ${cpX} ${prevY}, ${cpX} ${animY}, ${currX} ${animY}`;
      }
    }
    return d;
  };

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Başlık */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 80,
          opacity: titleOpacity,
        }}
      >
        <div style={{ color: "#DC143C", fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
          ExportHub Türkiye
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 36, fontWeight: 700 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ color: "#94A3B8", fontSize: 18, marginTop: 4 }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* SVG Line Chart */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Grid çizgileri */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = yScale(maxValue * ratio);
          const gridOpacity = interpolate(frame, [10, 25], [0, 0.3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke="#334155"
                strokeWidth={1}
                strokeDasharray="4,4"
                opacity={gridOpacity}
              />
              <text
                x={padding.left - 10}
                y={y + 5}
                textAnchor="end"
                fill="#64748B"
                fontSize={13}
                opacity={gridOpacity}
              >
                {(maxValue * ratio).toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Alan dolgusu */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DC143C" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#DC143C" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Alan */}
        <path
          d={`${buildPath(pathProgress)} L ${xScale(Math.min(dataPoints.length - 1, pathProgress * (dataPoints.length - 1)))} ${padding.top + chartH} L ${xScale(0)} ${padding.top + chartH} Z`}
          fill="url(#areaGrad)"
        />

        {/* Ana çizgi */}
        <path
          d={buildPath(pathProgress)}
          fill="none"
          stroke="#DC143C"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Veri noktaları ve etiketler */}
        {dataPoints.map((point, i) => {
          const pointAppear = spring({
            frame: frame - 20 - i * 5,
            fps,
            config: { damping: 15, stiffness: 100 },
          });
          const x = xScale(i);
          const y = yScale(point.value);
          const isLast = i === dataPoints.length - 1;

          return (
            <g key={point.year} opacity={pointAppear}>
              {/* Nokta */}
              <circle
                cx={x}
                cy={y}
                r={isLast && highlightLast ? 8 : 5}
                fill={isLast && highlightLast ? "#DC143C" : "#1B3A6B"}
                stroke="#DC143C"
                strokeWidth={2}
              />
              {/* Yıl etiketi */}
              <text
                x={x}
                y={padding.top + chartH + 30}
                textAnchor="middle"
                fill="#64748B"
                fontSize={14}
              >
                {point.year}
              </text>
            </g>
          );
        })}

        {/* Son nokta büyük vurgu */}
        {highlightLast && dataPoints.length > 0 && (() => {
          const last = dataPoints[dataPoints.length - 1];
          const lx = xScale(dataPoints.length - 1);
          const ly = yScale(last.value);
          const highlightOpacity = interpolate(frame, [90, 110], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g opacity={highlightOpacity}>
              <rect
                x={lx + 15}
                y={ly - 30}
                width={130}
                height={52}
                rx={6}
                fill="#DC143C"
              />
              <text x={lx + 80} y={ly - 8} textAnchor="middle" fill="#FFFFFF" fontSize={13}>
                {last.year}
              </text>
              <text x={lx + 80} y={ly + 12} textAnchor="middle" fill="#FFFFFF" fontSize={17} fontWeight={700}>
                ${last.value.toFixed(1)}B
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Unit etiketi */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 80,
          color: "#475569",
          fontSize: 14,
          opacity: titleOpacity,
        }}
      >
        Birim: {unit}
      </div>
    </AbsoluteFill>
  );
};
