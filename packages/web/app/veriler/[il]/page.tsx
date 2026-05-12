import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFileSync } from "fs";
import { join } from "path";
import { ProvincePlayer } from "@/components/remotion/ProvincePlayer";

interface ProvinceData {
  id: string;
  il: string;
  bolge: string;
  yillikIhracat: Record<string, number>;
  buyumeOrani2024: number;
  topSektorler: Array<{ ad: string; pay: number; birim: string }>;
  topUlkeler: Array<{ ulke: string; pay: number; birim: string }>;
  ihracatciSayisi: number;
  aciklama: string;
}

function getProvince(id: string): ProvinceData | null {
  const filePath = join(process.cwd(), "../../data/provinces", `${id}.json`);
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as ProvinceData;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { il: string };
}): Promise<Metadata> {
  const province = getProvince(params.il);
  if (!province) return { title: "İl Bulunamadı" };
  return {
    title: `${province.il} İhracat Verileri 2024`,
    description: `${province.il} ilinin ihracat istatistikleri, sektör dağılımı ve büyüme trendi. 2024 yılı: $${Object.values(province.yillikIhracat).at(-1)?.toFixed(1)} milyar USD.`,
  };
}

export default function IlPage({ params }: { params: { il: string } }) {
  const province = getProvince(params.il);
  if (!province) notFound();

  const trendData = Object.entries(province.yillikIhracat).map(([year, value]) => ({
    year,
    value,
  }));

  const latestValue = Object.values(province.yillikIhracat).at(-1) ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-8">
        <a href="/" className="hover:text-white transition-colors">Ana Sayfa</a>
        <span className="mx-2">/</span>
        <a href="/veriler" className="hover:text-white transition-colors">Veriler</a>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{province.il}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="text-turkish-red text-sm font-semibold mb-2">
          {province.bolge} Bölgesi
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              {province.il}
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl text-base">
              {province.aciklama}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold text-white">
              ${latestValue.toFixed(1)}B
            </div>
            <div className="text-sm text-slate-400">2024 yıllık ihracat</div>
            <div className="text-emerald-400 font-semibold">
              +{province.buyumeOrani2024}% büyüme
            </div>
          </div>
        </div>
      </div>

      {/* Remotion Animasyon */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">
          İhracat Trendi Animasyonu
        </h2>
        <ProvincePlayer
          province={province.il}
          data={trendData}
          colorScheme="red"
        />
      </div>

      {/* Veri Tabloları */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Yıllık Trend */}
        <div className="card-dark p-6">
          <h2 className="text-base font-semibold text-white mb-4">
            Yıllık İhracat (milyar USD)
          </h2>
          <div className="space-y-3">
            {trendData.map((d) => (
              <div key={d.year} className="flex items-center gap-3">
                <span className="text-slate-400 text-sm w-10">{d.year}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-turkish-red rounded-full"
                    style={{ width: `${(d.value / latestValue) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm font-semibold w-12 text-right">
                  ${d.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sektörler */}
        <div className="card-dark p-6">
          <h2 className="text-base font-semibold text-white mb-4">
            Öne Çıkan Sektörler
          </h2>
          <div className="space-y-3">
            {province.topSektorler.map((s, i) => (
              <div key={s.ad} className="flex items-center gap-3">
                <span className="text-slate-600 text-sm w-4">{i + 1}</span>
                <span className="text-slate-300 text-sm flex-1 truncate">{s.ad}</span>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-turkish-red/80 rounded-full"
                    style={{ width: `${s.pay}%` }}
                  />
                </div>
                <span className="text-turkish-red text-sm font-semibold w-10 text-right">
                  %{s.pay}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Ülkeler */}
      <div className="card-dark p-6 mb-10">
        <h2 className="text-base font-semibold text-white mb-4">
          Başlıca İhracat Pazarları
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {province.topUlkeler.map((u, i) => (
            <div key={u.ulke} className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">%{u.pay}</div>
              <div className="text-sm text-slate-400 mt-1">{u.ulke}</div>
              <div className="text-xs text-slate-600">#{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* İhracatçı Sayısı */}
      <div className="card-dark p-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-extrabold text-white">
              {province.ihracatciSayisi.toLocaleString("tr-TR")}
            </div>
            <div className="text-slate-400 text-sm">
              {province.il} merkezli aktif ihracatçı firma
            </div>
          </div>
          <div className="ml-auto">
            <a
              href="/rehberler"
              className="bg-turkish-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              İhracata Başlamak için Rehber
            </a>
          </div>
        </div>
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${province.il} İhracat Verileri 2024`,
            description: province.aciklama,
            publisher: { "@type": "Organization", name: "ExportHub Türkiye" },
          }),
        }}
      />
    </div>
  );
}
