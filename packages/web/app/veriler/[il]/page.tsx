import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { ProvincePlayer } from "@/components/remotion/ProvincePlayer";

interface ProvinceData {
  id: string;
  il: string;
  bolge: string;
  yillikIhracat: Record<string, number>;
  buyumeOrani2024: number;
  topSektorler: Array<{ ad: string; pay: number; birim?: string }>;
  topUlkeler: Array<{ ulke: string; pay: number; birim?: string }>;
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

function getAllProvinces(): ProvinceData[] {
  const dir = join(process.cwd(), "../../data/provinces");
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(join(dir, f), "utf-8")) as ProvinceData);
  } catch {
    return [];
  }
}

// Sektör adından URL slug'ı tahmin et
const SEKTOR_SLUG: Record<string, string | null> = {
  "Tekstil ve Konfeksiyon": "tekstil",
  "Tekstil": "tekstil",
  "Tekstil ve Halı": "tekstil",
  "Ev Tekstili & Havlu": "tekstil",
  "Hazır Giyim": "tekstil",
  "Hazır Giyim & Tekstil": "tekstil",
  "Otomotiv ve Yan Sanayi": "otomotiv",
  "Otomotiv Yan Sanayi": "otomotiv",
  "Makine ve Teçhizat": "makine",
  "Makina & Teçhizat": "makine",
  "Makina & Tarım Makinaları": "makine",
  "Gıda ve Tarım": "gida",
  "Gıda & İşlenmiş Tarım": "gida",
  "Gıda ve Fıstık Ürünleri": "gida",
  "Taze Sebze & Meyve": "gida",
  "Tarım Ürünleri & Tahıl": "gida",
  "Kimyasallar & Plastik": "kimya",
  "Kimyasallar & Gübre": "kimya",
  "Kimyasallar": "kimya",
  "Plastik & Kauçuk": "kimya",
  "Plastik ve Ambalaj": "kimya",
  "Demir-Çelik": "demir-celik",
  "Savunma & Havacılık": "savunma",
  "Savunma Sanayii": "savunma",
  "Elektronik & Elektrik": "elektronik",
  "Elektronik ve Elektrikli": "elektronik",
  "Mücevherat": null,
  "Metal Ürünler": null,
  "Kimyasal Maddeler": "kimya",
};

// İlgili rehberler — il özelinde
const IL_REHBER: Record<string, { slug: string; baslik: string }[]> = {
  gaziantep: [{ slug: "gaziantep-ihracat", baslik: "Gaziantep'ten İhracat Rehberi" }],
  istanbul: [{ slug: "istanbul-ihracat", baslik: "İstanbul'dan İhracat Rehberi" }],
};
const DEFAULT_REHBERLER = [
  { slug: "ilk-ihracat", baslik: "İlk İhracat Nasıl Yapılır?" },
  { slug: "pazar-arastirmasi", baslik: "Pazar Araştırması ve Alıcı Doğrulama" },
];

export async function generateMetadata({
  params,
}: {
  params: { il: string };
}): Promise<Metadata> {
  const province = getProvince(params.il);
  if (!province) return { title: "İl Bulunamadı" };
  const latest = Object.values(province.yillikIhracat).at(-1)?.toFixed(1);
  return {
    title: `${province.il} İhracat Verileri 2024-2026 — Sektörler, Pazarlar, Rakamlar`,
    description: `${province.il} ilinin ihracat verileri (2020-2026). ${province.topSektorler[0]?.ad ?? ""} başta olmak üzere ${province.topSektorler.length} sektörde $${latest} milyar USD ihracat. TÜİK/TİM verileri.`,
  };
}

export default function IlPage({ params }: { params: { il: string } }) {
  const province = getProvince(params.il);
  if (!province) notFound();

  const all = getAllProvinces();
  const bolgedekiIller = all
    .filter((p) => p.bolge === province.bolge && p.id !== province.id)
    .slice(0, 4);

  const trendData = Object.entries(province.yillikIhracat).map(([year, value]) => ({
    year,
    value,
  }));
  const latestYear = Object.keys(province.yillikIhracat).at(-1) ?? "2026";
  const latestValue = Object.values(province.yillikIhracat).at(-1) ?? 0;
  const ilkValue = Object.values(province.yillikIhracat).at(0) ?? 0;
  const toplamBuyume = (((latestValue - ilkValue) / ilkValue) * 100).toFixed(0);

  const ilgiliRehberler = IL_REHBER[province.id] ?? DEFAULT_REHBERLER;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <a href="/" className="hover:text-white transition-colors">Ana Sayfa</a>
        <span>/</span>
        <a href="/veriler" className="hover:text-white transition-colors">Veriler</a>
        <span>/</span>
        <span className="text-slate-300">{province.il}</span>
      </nav>

      {/* Veri Güncelleme Rozeti */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          Son güncelleme: Mayıs 2026
        </span>
        <span className="text-xs text-slate-600">Kaynak: TÜİK · TİM · Ticaret Bakanlığı</span>
      </div>

      {/* Hero */}
      <div className="mb-10 animate-fade-up">
        <div className="text-turkish-red text-sm font-semibold mb-2">{province.bolge} Bölgesi</div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              {province.il}
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl text-base leading-relaxed">
              {province.aciklama}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold text-white">${latestValue.toFixed(1)}B</div>
            <div className="text-sm text-slate-400">{latestYear} yıllık ihracat</div>
            <div className="text-emerald-400 font-semibold">
              +{province.buyumeOrani2024}% büyüme
            </div>
          </div>
        </div>
      </div>

      {/* Animasyon */}
      <div className="mb-10 animate-fade-up delay-100">
        <h2 className="text-lg font-semibold text-white mb-4">İhracat Trendi Animasyonu</h2>
        <ProvincePlayer province={province.il} data={trendData} colorScheme="red" />
      </div>

      {/* Veri Tabloları */}
      <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-up delay-200">
        {/* Yıllık Trend */}
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Yıllık İhracat (milyar USD)</h2>
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              +{toplamBuyume}% (2020-{latestYear})
            </span>
          </div>
          <div className="space-y-3">
            {trendData.map((d) => (
              <div key={d.year} className="flex items-center gap-3">
                <span className="text-slate-400 text-sm w-10">{d.year}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-turkish-red rounded-full transition-all"
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

        {/* Sektörler — linkli */}
        <div className="card-dark p-6">
          <h2 className="text-base font-semibold text-white mb-4">Öne Çıkan Sektörler</h2>
          <div className="space-y-3">
            {province.topSektorler.map((s, i) => {
              const slug = SEKTOR_SLUG[s.ad];
              return (
                <div key={s.ad} className="flex items-center gap-3">
                  <span className="text-slate-600 text-sm w-4">{i + 1}</span>
                  {slug ? (
                    <Link
                      href={`/sektorler/${slug}`}
                      className="text-slate-300 text-sm flex-1 truncate hover:text-turkish-red transition-colors"
                    >
                      {s.ad}
                    </Link>
                  ) : (
                    <span className="text-slate-300 text-sm flex-1 truncate">{s.ad}</span>
                  )}
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
              );
            })}
          </div>
          <p className="text-xs text-slate-600 mt-4">
            Sektör adına tıklayarak ulusal analize gidin →
          </p>
        </div>
      </div>

      {/* Pazarlar */}
      <div className="card-dark p-6 mb-6 animate-fade-up delay-300">
        <h2 className="text-base font-semibold text-white mb-4">Başlıca İhracat Pazarları</h2>
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

      {/* İhracatçı Sayısı + CTA */}
      <div className="card-dark p-6 mb-10 animate-fade-up delay-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <div className="text-3xl font-extrabold text-white">
              {province.ihracatciSayisi.toLocaleString("tr-TR")}
            </div>
            <div className="text-slate-400 text-sm">
              {province.il} merkezli aktif ihracatçı firma (TİM, 2024)
            </div>
          </div>
          <div className="ml-auto">
            <Link
              href="/rehberler/ilk-ihracat"
              className="bg-turkish-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              İhracata Başlamak için Rehber →
            </Link>
          </div>
        </div>
      </div>

      {/* Aynı Bölgedeki İller */}
      {bolgedekiIller.length > 0 && (
        <div className="mb-10 animate-fade-up delay-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">
              {province.bolge} Bölgesindeki Diğer İller
            </h2>
            <Link href="/veriler" className="text-turkish-red text-xs hover:text-red-400">
              Tümü →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bolgedekiIller.map((p) => {
              const val = Object.values(p.yillikIhracat).at(-1) ?? 0;
              return (
                <Link
                  key={p.id}
                  href={`/veriler/${p.id}`}
                  className="card-dark p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all group"
                >
                  <div className="text-white font-semibold text-sm group-hover:text-turkish-red transition-colors mb-1">
                    {p.il}
                  </div>
                  <div className="text-xl font-extrabold text-white">${val.toFixed(1)}B</div>
                  <div className="text-xs text-emerald-400 mt-0.5">+{p.buyumeOrani2024}%</div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* İlgili Rehberler */}
      <div className="animate-fade-up delay-600">
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">
          İlgili Rehberler
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {ilgiliRehberler.slice(0, 2).map((r) => (
            <Link
              key={r.slug}
              href={`/rehberler/${r.slug}`}
              className="card-dark p-5 hover:border-turkish-red/40 group transition-all"
            >
              <div className="text-white font-semibold text-sm group-hover:text-turkish-red transition-colors mb-1">
                {r.baslik}
              </div>
              <div className="text-turkish-red text-xs font-medium mt-2">Oku →</div>
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${province.il} İhracat Verileri 2020-2026`,
            description: province.aciklama,
            publisher: { "@type": "Organization", name: "ExportHub Türkiye" },
            temporalCoverage: "2020/2026",
            spatialCoverage: province.il,
          }),
        }}
      />
    </div>
  );
}
