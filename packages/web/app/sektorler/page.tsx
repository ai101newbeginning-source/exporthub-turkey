import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export const metadata: Metadata = {
  title: "Türkiye İhracat Sektörleri — Sektör Bazlı Analiz",
  description:
    "Otomotiv, tekstil, savunma ve 9 sektörde Türkiye'nin ihracat performansı. TÜİK ve TİM kaynaklı 2024-2026 verileri.",
};

interface SectorData {
  id: string;
  ad: string;
  toplamIhracat2024: number;
  birim: string;
  buyumeOrani2024: number;
  topIller: string[];
  topUlkeler: string[];
  urunGruplari: Array<{ ad: string; pay: number }>;
  aciklama: string;
}

function getSectors(): SectorData[] {
  const dataDir = join(process.cwd(), "../../data/sectors");
  try {
    const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
    return files
      .map((f) => JSON.parse(readFileSync(join(dataDir, f), "utf-8")) as SectorData)
      .sort((a, b) => b.toplamIhracat2024 - a.toplamIhracat2024);
  } catch {
    return [];
  }
}

const SEKTOR_RENK: Record<string, string> = {
  otomotiv: "blue",
  tekstil: "purple",
  makine: "amber",
  gida: "emerald",
  kimya: "sky",
  "demir-celik": "slate",
  savunma: "red",
  elektronik: "cyan",
  "insaat-malzemeleri": "orange",
};

const RENK_CLASSES: Record<string, { badge: string; bar: string; icon: string }> = {
  blue: {
    badge: "text-sky-400 bg-sky-400/10",
    bar: "bg-sky-400",
    icon: "text-sky-400",
  },
  purple: {
    badge: "text-purple-400 bg-purple-400/10",
    bar: "bg-purple-400",
    icon: "text-purple-400",
  },
  amber: {
    badge: "text-amber-400 bg-amber-400/10",
    bar: "bg-amber-400",
    icon: "text-amber-400",
  },
  emerald: {
    badge: "text-emerald-400 bg-emerald-400/10",
    bar: "bg-emerald-400",
    icon: "text-emerald-400",
  },
  sky: {
    badge: "text-sky-400 bg-sky-400/10",
    bar: "bg-sky-400",
    icon: "text-sky-400",
  },
  slate: {
    badge: "text-slate-600 bg-slate-200",
    bar: "bg-slate-400",
    icon: "text-slate-600",
  },
  red: {
    badge: "text-turkish-red bg-red-500/10",
    bar: "bg-turkish-red",
    icon: "text-turkish-red",
  },
  cyan: {
    badge: "text-cyan-400 bg-cyan-400/10",
    bar: "bg-cyan-400",
    icon: "text-cyan-400",
  },
  orange: {
    badge: "text-orange-400 bg-orange-400/10",
    bar: "bg-orange-400",
    icon: "text-orange-400",
  },
};

export default function SektorlerPage() {
  const sectors = getSectors();
  const toplamIhracat = sectors.reduce((s, x) => s + x.toplamIhracat2024, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Başlık */}
      <div className="mb-10">
        <div className="text-turkish-red text-sm font-semibold mb-2">VERİ ANALİZİ</div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          Sektör Bazlı İhracat
        </h1>
        <p className="text-slate-400 max-w-xl">
          Türkiye'nin güçlü ihracat sektörleri, ürün grupları ve hedef pazarları.
          TÜİK ve TİM kaynaklı 2024 verileri.
        </p>
      </div>

      {/* Özet Bant */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="card-dark p-5 text-center">
          <div className="text-3xl font-extrabold text-slate-900">
            ${toplamIhracat.toFixed(1)}B
          </div>
          <div className="text-xs text-slate-400 mt-1">Analiz Edilen Sektörler</div>
        </div>
        <div className="card-dark p-5 text-center">
          <div className="text-3xl font-extrabold text-slate-900">{sectors.length}</div>
          <div className="text-xs text-slate-400 mt-1">Sektör</div>
        </div>
        <div className="card-dark p-5 text-center col-span-2 sm:col-span-1">
          <div className="text-3xl font-extrabold text-emerald-400">
            +{(sectors.reduce((s, x) => s + x.buyumeOrani2024, 0) / sectors.length).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Ort. Büyüme (2024)</div>
        </div>
      </div>

      {/* Sektör Kartları */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sectors.map((sektor) => {
          const renk = SEKTOR_RENK[sektor.id] ?? "blue";
          const renkClass = RENK_CLASSES[renk];
          const maxPay = Math.max(...sektor.urunGruplari.map((u) => u.pay));

          return (
            <div
              key={sektor.id}
              className="card-dark p-6 hover:border-slate-300 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${renkClass.badge}`}
                >
                  {sektor.ad}
                </span>
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  +{sektor.buyumeOrani2024}%
                </span>
              </div>

              {/* İhracat Hacmi */}
              <div className="mb-4">
                <div className="text-3xl font-extrabold text-slate-900">
                  ${sektor.toplamIhracat2024}B
                </div>
                <div className="text-xs text-slate-500 mt-0.5">2024 toplam ihracat</div>
              </div>

              {/* Açıklama */}
              <p className="text-slate-400 text-sm mb-5 leading-relaxed line-clamp-2">
                {sektor.aciklama}
              </p>

              {/* Ürün Grupları */}
              <div className="mb-5">
                <div className="text-xs text-slate-500 mb-2 font-medium">Ürün Grupları</div>
                <div className="space-y-2">
                  {sektor.urunGruplari.slice(0, 3).map((u) => (
                    <div key={u.ad} className="flex items-center gap-2">
                      <span className="text-slate-600 text-xs w-32 truncate">{u.ad}</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${renkClass.bar} rounded-full`}
                          style={{ width: `${(u.pay / maxPay) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold w-8 text-right ${renkClass.icon}`}>
                        %{u.pay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top İller */}
              <div className="mb-5">
                <div className="text-xs text-slate-500 mb-2 font-medium">Öne Çıkan İller</div>
                <div className="flex flex-wrap gap-1.5">
                  {sektor.topIller.slice(0, 3).map((il) => (
                    <Link
                      key={il}
                      href={`/veriler/${il.toLowerCase().replace("İ", "i").replace("ı", "i").replace("ş", "s").replace("ğ", "g").replace("ü", "u").replace("ö", "o").replace("ç", "c")}`}
                      className="text-xs text-slate-400 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                    >
                      {il}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Top Ülkeler + CTA */}
              <div className="border-t border-slate-200 pt-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1.5 font-medium">Başlıca Pazarlar</div>
                  <div className="text-xs text-slate-400">
                    {sektor.topUlkeler.slice(0, 3).join(" · ")}
                  </div>
                </div>
                <Link
                  href={`/sektorler/${sektor.id}`}
                  className="text-turkish-red text-xs font-semibold hover:text-red-400 transition-colors flex-shrink-0 ml-4"
                >
                  Detay →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 card-dark p-8 text-center">
        <div className="text-turkish-red text-sm font-semibold mb-2">DETAYLI ANALİZ</div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          İhracat Haritasını Keşfet
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          İl bazlı ihracat verileri, sektör dağılımı ve büyüme trendleri için
          tüm 81 ilin analizini inceleyin.
        </p>
        <Link
          href="/veriler"
          className="inline-block bg-turkish-red text-slate-900 px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors text-sm"
        >
          İl Bazlı Verilere Git →
        </Link>
      </div>
    </div>
  );
}
