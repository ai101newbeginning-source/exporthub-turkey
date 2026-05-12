import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ProvinceExportChartProps {
  province: string;
  data: Array<{ year: string; value: number }>;
  unit?: string;
  colorScheme?: "red" | "blue" | "green";
}

const COLORS = {
  red: { primary: "#DC143C", secondary: "#FF4757", bg: "#0F172A" },
  blue: { primary: "#1B3A6B", secondary: "#3B6BC4", bg: "#0F172A" },
  green: { primary: "#16A34A", secondary: "#22C55E", bg: "#0F172A" },
};

export const ProvinceExportChart: React.FC<ProvinceExportChartProps> = ({
  province,
  data,
  unit = "milyar USD",
  colorScheme = "red",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const colors = COLORS[colorScheme];

  const maxValue = Math.max(...data.map((d) => d.value));
  const chartWidth = 960;
  const chartHeight = 320;
  const barWidth = Math.min(80, (chartWidth / data.length) * 0.6);
  const gap = (chartWidth - barWidth * data.length) / (data.length + 1);

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Başlık */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          right: 80,
          opacity: titleOpacity,
        }}
      >
        <div style={{ color: "#94A3B8", fontSize: 22, marginBottom: 8 }}>
          ExportHub Türkiye
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 42, fontWeight: 700, lineHeight: 1.2 }}>
          {province} İhracat Trendi
        </div>
        <div style={{ color: colors.primary, fontSize: 20, marginTop: 8 }}>
          {unit} cinsinden yıllık ihracat
        </div>
      </div>

      {/* Bar Chart */}
      <svg
        viewBox={`0 0 ${chartWidth + 160} ${chartHeight + 80}`}
        style={{ position: "absolute", bottom: 60, left: 80, right: 80, width: "calc(100% - 160px)" }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = gap + index * (barWidth + gap);
          const y = chartHeight - barHeight + 40;

          const barProgress = spring({
            frame: frame - index * 6,
            fps,
            config: { damping: 12, stiffness: 80 },
          });

          const animatedHeight = barHeight * barProgress;
          const animatedY = chartHeight - animatedHeight + 40;

          const labelOpacity = interpolate(
            frame,
            [index * 6 + 10, index * 6 + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const displayValue = interpolate(
            frame,
            [index * 6, index * 6 + 20],
            [0, item.value],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <g key={item.year}>
              {/* Bar */}
              <rect
                x={x}
                y={animatedY}
                width={barWidth}
                height={animatedHeight}
                fill={colors.primary}
                rx={4}
                opacity={0.9}
              />
              {/* Gradient overlay */}
              <rect
                x={x}
                y={animatedY}
                width={barWidth / 3}
                height={animatedHeight}
                fill={colors.secondary}
                rx={4}
                opacity={0.3}
              />
              {/* Değer etiketi */}
              <text
                x={x + barWidth / 2}
                y={animatedY - 10}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={16}
                fontWeight={600}
                opacity={labelOpacity}
              >
                {displayValue.toFixed(1)}
              </text>
              {/* Yıl etiketi */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 65}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize={16}
              >
                {item.year}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={gap / 2}
          y1={chartHeight + 40}
          x2={chartWidth + gap / 2}
          y2={chartHeight + 40}
          stroke="#334155"
          strokeWidth={2}
        />
      </svg>

      {/* Son değer vurgusu */}
      {data.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 80,
            textAlign: "right",
            opacity: interpolate(frame, [durationInFrames - 30, durationInFrames - 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ color: "#94A3B8", fontSize: 18 }}>2024 İhracatı</div>
          <div style={{ color: colors.primary, fontSize: 52, fontWeight: 800 }}>
            ${data[data.length - 1]?.value.toFixed(1)}B
          </div>
          <div style={{ color: "#64748B", fontSize: 16 }}>{unit}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
