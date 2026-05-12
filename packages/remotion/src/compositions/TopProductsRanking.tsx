import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface TopProductsRankingProps {
  title: string;
  items: Array<{ rank: number; ad: string; deger: number; birim?: string; flag?: string }>;
  subtitle?: string;
  year?: string;
}

export const TopProductsRanking: React.FC<TopProductsRankingProps> = ({
  title,
  items,
  subtitle,
  year = "2024",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxDeger = Math.max(...items.map((i) => i.deger));

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "60px 80px",
      }}
    >
      {/* Başlık */}
      <div style={{ marginBottom: 40, opacity: titleOpacity }}>
        <div style={{ color: "#DC143C", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
          ExportHub Türkiye · {year}
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 40, fontWeight: 700 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ color: "#94A3B8", fontSize: 20, marginTop: 6 }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Sıralama Listesi */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.slice(0, 8).map((item, i) => {
          const rowProgress = spring({
            frame: frame - 15 - i * 8,
            fps,
            config: { damping: 18, stiffness: 90 },
          });

          const barWidth = (item.deger / maxDeger) * 600;
          const animBarWidth = barWidth * rowProgress;

          const translateX = interpolate(rowProgress, [0, 1], [-40, 0]);

          return (
            <div
              key={item.ad}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: rowProgress,
                transform: `translateX(${translateX}px)`,
              }}
            >
              {/* Sıra numarası */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: i < 3 ? "#DC143C" : "#1E293B",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.rank}
              </div>

              {/* İsim */}
              <div
                style={{
                  color: "#E2E8F0",
                  fontSize: 17,
                  width: 240,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.flag && <span style={{ marginRight: 6 }}>{item.flag}</span>}
                {item.ad}
              </div>

              {/* Bar */}
              <div
                style={{
                  height: 10,
                  width: animBarWidth,
                  backgroundColor: i < 3 ? "#DC143C" : "#334155",
                  borderRadius: 5,
                  minWidth: 4,
                }}
              />

              {/* Değer */}
              <div
                style={{
                  color: i < 3 ? "#DC143C" : "#94A3B8",
                  fontSize: 17,
                  fontWeight: 600,
                  minWidth: 80,
                }}
              >
                {item.deger.toFixed(1)} {item.birim ?? "milyar $"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 80,
          color: "#475569",
          fontSize: 13,
          opacity: titleOpacity,
        }}
      >
        Kaynak: TİM · TÜİK · {year}
      </div>
    </AbsoluteFill>
  );
};
