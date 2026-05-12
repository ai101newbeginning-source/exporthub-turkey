import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFileSync } from "fs";
import { join } from "path";

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

function getSector(id: string): SectorData | null {
  const filePath = join(process.cwd(), "../../data/sectors", `${id}.json`);
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as SectorData;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { sektor: string };
}): Promise<Metadata> {
  const sector = getSector(params.sektor);
  if (!sector) return { title: "Sektör Bulunamadı" };
  return {
    title: `${sector.ad} İhracatı 2024 — Türkiye`,
    description: sector.aciklama,
  };
}

export default function SektorPage({ params }: { params: { sektor: string } }) {
  const sector = getSector(params.sektor);
  if (!sector) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-slate-500 mb-8">
        <a href="/" className="hover:text-white transition-colors">Ana Sayfa</a>
        <span className="mx-2">/</span>
        <a href="/sektorler" className="hover:text-white transition-colors">Sektörler</a>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{sector.ad}</span>
      </nav>

      <div className="mb-10">
        <div className="text-turkish-red text-sm font-semibold mb-2">SEKTÖR ANALİZİ</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{sector.ad}</h1>
        <p className="text-slate-400 max-w-xl">{sector.aciklama}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="card-dark p-6 text-center">
          <div className="text-3xl font-extrabold text-white">
            ${sector.toplamIhracat2024}B
          </div>
          <div className="text-slate-400 text-sm mt-1">2024 Toplam İhracat</div>
        </div>
        <div className="card-dark p-6 text-center">
          <div className="text-3xl font-extrabold text-emerald-400">
            +{sector.buyumeOrani2024}%
          </div>
          <div className="text-slate-400 text-sm mt-1">Büyüme Oranı (2024)</div>
        </div>
        <div className="card-dark p-6 text-center">
          <div className="text-3xl font-extrabold text-white">
            {sector.topIller.length}
          </div>
          <div className="text-slate-400 text-sm mt-1">Öne Çıkan İl</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-dark p-6">
          <h2 className="text-base font-semibold text-white mb-4">Öne Çıkan İller</h2>
          <div className="space-y-2">
            {sector.topIller.map((il, i) => (
              <div key={il} className="flex items-center gap-3">
                <span className="text-slate-600 text-sm w-4">{i + 1}</span>
                <span className="text-slate-300 text-sm">{il}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-dark p-6">
          <h2 className="text-base font-semibold text-white mb-4">Ürün Grupları</h2>
          <div className="space-y-3">
            {sector.urunGruplari.map((u) => (
              <div key={u.ad} className="flex items-center gap-3">
                <span className="text-slate-300 text-sm flex-1">{u.ad}</span>
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-turkish-red/80 rounded-full"
                    style={{ width: `${u.pay}%` }}
                  />
                </div>
                <span className="text-turkish-red text-sm font-semibold w-8 text-right">
                  %{u.pay}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
