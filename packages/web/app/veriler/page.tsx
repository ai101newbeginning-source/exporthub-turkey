import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import dynamic from "next/dynamic";

const TurkeyMap = dynamic(
  () => import("@/components/ui/TurkeyMap").then((m) => m.TurkeyMap),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Türkiye İhracat Verileri — İl Bazlı İstatistikler",
  description:
    "Türkiye'nin tüm illerinin ihracat verileri. TÜİK ve TİM kaynaklı güncel istatistikler.",
};

interface ProvinceData {
  id: string;
  il: string;
  bolge: string;
  yillikIhracat: Record<string, number>;
  buyumeOrani2024: number;
  topSektorler: Array<{ ad: string; pay: number }>;
  ihracatciSayisi: number;
}

function getProvinces(): ProvinceData[] {
  const dataDir = join(process.cwd(), "../../data/provinces");
  try {
    const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
    return files
      .map((f) => JSON.parse(readFileSync(join(dataDir, f), "utf-8")) as ProvinceData)
      .sort((a, b) => {
        const aVal = Object.values(a.yillikIhracat).at(-1) ?? 0;
        const bVal = Object.values(b.yillikIhracat).at(-1) ?? 0;
        return bVal - aVal;
      });
  } catch {
    return [];
  }
}

export default function VerilerPage() {
  const provinces = getProvinces();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="text-turkish-red text-sm font-semibold mb-2">VERİ PORTALI</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">
          Türkiye İhracat Verileri
        </h1>
        <p className="text-slate-400 max-w-xl">
          İl bazlı ihracat istatistikleri, sektör dağılımları ve büyüme trendleri.
          Kaynak: TÜİK · TİM · Ticaret Bakanlığı
        </p>
      </div>

      {/* Turkey Map */}
      {provinces.length > 0 && (
        <div className="mb-12 card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Harita Görünümü</h2>
              <p className="text-slate-500 text-xs mt-0.5">Üzerine gelin veya tıklayın</p>
            </div>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {provinces.length} il gösteriliyor
            </span>
          </div>
          <TurkeyMap
            provinces={provinces.map((p) => ({
              id: p.id,
              il: p.il,
              ihracat: Object.values(p.yillikIhracat).at(-1) ?? 0,
              buyume: p.buyumeOrani2024,
            }))}
          />
        </div>
      )}

      {provinces.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {provinces.map((p) => {
            const latestValue = Object.values(p.yillikIhracat).at(-1) ?? 0;
            return (
              <Link
                key={p.id}
                href={`/veriler/${p.id}`}
                className="card-dark p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-turkish-red transition-colors">
                      {p.il}
                    </h2>
                    <span className="text-xs text-slate-500">{p.bolge}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      p.buyumeOrani2024 >= 10
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-sky-400 bg-sky-400/10"
                    }`}
                  >
                    +{p.buyumeOrani2024}%
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-extrabold text-white">
                    ${latestValue.toFixed(1)}B
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    2024 yıllık ihracat (milyar USD)
                  </div>
                </div>

                <div className="space-y-1.5">
                  {p.topSektorler.slice(0, 2).map((s) => (
                    <div key={s.ad} className="flex items-center gap-2">
                      <div
                        className="h-1.5 bg-turkish-red/60 rounded-full"
                        style={{ width: `${s.pay * 1.5}px`, maxWidth: "120px" }}
                      />
                      <span className="text-xs text-slate-400 truncate">{s.ad}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
                  {p.ihracatciSayisi.toLocaleString("tr-TR")} aktif ihracatçı firma
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card-dark p-12 text-center">
          <p className="text-slate-400">
            Veri yükleniyor... Uygulama geliştirilme aşamasındadır.
          </p>
        </div>
      )}
    </div>
  );
}
