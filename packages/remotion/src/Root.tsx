import { Composition } from "remotion";
import { ProvinceExportChart } from "./compositions/ProvinceExportChart.js";
import { ExportTrendAnimation } from "./compositions/ExportTrendAnimation.js";
import { SectorBreakdown } from "./compositions/SectorBreakdown.js";
import { TopProductsRanking } from "./compositions/TopProductsRanking.js";

const ISTANBUL_TREND = [
  { year: "2020", value: 52.1 },
  { year: "2021", value: 63.8 },
  { year: "2022", value: 68.4 },
  { year: "2023", value: 72.1 },
  { year: "2024", value: 75.3 },
];

const ISTANBUL_SECTORS = [
  { ad: "Tekstil ve Konfeksiyon", pay: 28 },
  { ad: "Makine ve Teçhizat", pay: 18 },
  { ad: "Kimyasal Maddeler", pay: 13 },
  { ad: "Mücevherat", pay: 9 },
  { ad: "Gıda ve Tarım", pay: 8 },
];

const TOP_PROVINCES = [
  { rank: 1, ad: "İstanbul", deger: 75.3 },
  { rank: 2, ad: "Kocaeli", deger: 16.2 },
  { rank: 3, ad: "İzmir", deger: 15.1 },
  { rank: 4, ad: "Bursa", deger: 13.5 },
  { rank: 5, ad: "Gaziantep", deger: 12.1 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProvinceExportChart"
        component={ProvinceExportChart}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          province: "İstanbul",
          data: ISTANBUL_TREND,
          unit: "milyar USD",
          colorScheme: "red" as const,
        }}
      />

      <Composition
        id="ExportTrendAnimation"
        component={ExportTrendAnimation}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Türkiye İhracat Trendi",
          subtitle: "2020-2024 Yılları Arası Toplam İhracat",
          dataPoints: ISTANBUL_TREND.map((d) => ({
            label: d.year,
            value: d.value,
            year: d.year,
          })),
          unit: "milyar USD",
          highlightLast: true,
        }}
      />

      <Composition
        id="SectorBreakdown"
        component={SectorBreakdown}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          province: "İstanbul",
          sectors: ISTANBUL_SECTORS,
          year: "2024",
        }}
      />

      <Composition
        id="TopProductsRanking"
        component={TopProductsRanking}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Türkiye'nin En Fazla İhracat Yapan İlleri",
          subtitle: "Yıllık ihracat değerine göre",
          items: TOP_PROVINCES,
          year: "2024",
        }}
      />
    </>
  );
};
