import type { Metadata } from "next";
import Link from "next/link";
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

export async function generateStaticParams() {
  return ["otomotiv", "tekstil", "makine", "gida", "kimya", "demir-celik", "savunma", "elektronik", "insaat-malzemeleri"].map((s) => ({ sektor: s }));
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

const IL_IDS: Record<string, string> = {
  "Kocaeli": "kocaeli",
  "Bursa": "bursa",
  "Sakarya": "sakarya",
  "İstanbul": "istanbul",
  "Ankara": "ankara",
  "İzmir": "izmir",
  "Gaziantep": "gaziantep",
  "Kahramanmaraş": "kahramanmaras",
  "Denizli": "denizli",
  "Konya": "konya",
};

// Estimated market share % for top countries (sector-specific)
const COUNTRY_CONTEXT: Record<string, string> = {
  "Almanya": "AB'nin en büyük otomotiv pazarı",
  "Fransa": "Renault üretim ortaklığı",
  "İtalya": "Fiat-Stellantis tedarik zinciri",
  "İspanya": "SEAT üretim ortaklığı",
  "Romanya": "Dacia-Renault köprü pazarı",
  "ABD": "NATO tedarik zinciri ve stratejik ortak",
  "İngiltere": "Fast fashion ve savunma tedarikçiliği",
  "Irak": "Bölgesel distribütörlük merkezi",
  "BAE": "Körfez yeniden ihracat noktası",
  "Hollanda": "Avrupa liman dağıtım merkezi",
  "Suudi Arabistan": "Körfez savunma harcamaları",
  "Pakistan": "Bayraktar TB2 alımı ve stratejik ortaklık",
  "Azerbaycan": "Savunma ve enerji köprüsü",
  "Rusya": "Seramik ve inşaat malzemesi ithalatçısı",
  "Libya": "Kuzey Afrika altyapı projeleri",
};

export default function SektorPage({ params }: { params: { sektor: string } }) {
  const sector = getSector(params.sektor);
  if (!sector) notFound();

  const maxPay = Math.max(...sector.urunGruplari.map((u) => u.pay));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-8 flex items-center gap-2">
        <a href="/" className="hover:text-white transition-colors">Ana Sayfa</a>
        <span>/</span>
        <a href="/sektorler" className="hover:text-white transition-colors">Sektörler</a>
        <span>/</span>
        <span className="text-slate-300">{sector.ad}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="text-turkish-red text-sm font-semibold mb-2">SEKTÖR ANALİZİ · 2024</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{sector.ad}</h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">{sector.aciklama}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10 animate-fade-up delay-100">
        <div className="card-dark p-6 text-center">
          <div className="text-3xl font-extrabold text-white mb-1">
            ${sector.toplamIhracat2024}B
          </div>
          <div className="text-slate-400 text-sm">2024 Toplam İhracat</div>
          <div className="text-xs text-slate-600 mt-1">milyar USD</div>
        </div>
        <div className="card-dark p-6 text-center">
          <div className="text-3xl font-extrabold text-emerald-400 mb-1">
            +{sector.buyumeOrani2024}%
          </div>
          <div className="text-slate-400 text-sm">Büyüme Oranı</div>
          <div className="text-xs text-slate-600 mt-1">2023&apos;e göre</div>
        </div>
        <div className="card-dark p-6 text-center">
          <div className="text-3xl font-extrabold text-sky-400 mb-1">
            {sector.topUlkeler.length}
          </div>
          <div className="text-slate-400 text-sm">Hedef Pazar</div>
          <div className="text-xs text-slate-600 mt-1">başlıca ihracat ülkesi</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Product Groups with Bar Chart */}
        <div className="card-dark p-6 animate-fade-up delay-200">
          <h2 className="text-base font-semibold text-white mb-5">Ürün Grubu Dağılımı</h2>
          <div className="space-y-4">
            {sector.urunGruplari.map((u, i) => (
              <div key={u.ad}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 text-sm">{u.ad}</span>
                  <span className="text-turkish-red font-bold text-sm">%{u.pay}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(u.pay / maxPay) * 100}%`,
                      background: i === 0
                        ? "#DC143C"
                        : i === 1
                        ? "rgba(220,20,60,0.65)"
                        : "rgba(220,20,60,0.35)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Export Countries */}
        <div className="card-dark p-6 animate-fade-up delay-300">
          <h2 className="text-base font-semibold text-white mb-5">Başlıca İhracat Pazarları</h2>
          <div className="space-y-3">
            {sector.topUlkeler.map((ulke, i) => (
              <div key={ulke} className="flex items-start gap-3">
                <span className="text-slate-600 text-sm w-5 pt-0.5 flex-shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <div className="text-slate-200 text-sm font-medium">{ulke}</div>
                  {COUNTRY_CONTEXT[ulke] && (
                    <div className="text-slate-500 text-xs mt-0.5">{COUNTRY_CONTEXT[ulke]}</div>
                  )}
                </div>
                <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden self-center">
                  <div
                    className="h-full bg-turkish-red/60 rounded-full"
                    style={{ width: `${100 - i * 16}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Provinces */}
      <div className="card-dark p-6 mb-6 animate-fade-up delay-400">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Öne Çıkan İller</h2>
          <Link href="/veriler" className="text-turkish-red text-xs hover:text-red-400">
            Tüm veri →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sector.topIller.map((il, i) => {
            const ilId = IL_IDS[il];
            const inner = (
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-extrabold text-slate-700 leading-none">
                  {i + 1}
                </span>
                <div>
                  <div className="text-white text-sm font-semibold">{il}</div>
                  <div className="text-slate-500 text-xs">{sector.ad} merkezi</div>
                </div>
              </div>
            );
            return ilId ? (
              <Link
                key={il}
                href={`/veriler/${ilId}`}
                className="bg-slate-800/60 border border-slate-700/50 hover:border-turkish-red/40 rounded-lg p-3 transition-all group"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={il}
                className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA row */}
      <div className="grid sm:grid-cols-2 gap-5 animate-fade-up delay-500">
        <div className="card-dark p-6">
          <div className="text-turkish-red text-xs font-semibold mb-2">REHBER</div>
          <h3 className="text-white font-bold mb-2">
            {sector.ad} Sektöründe İhracata Nasıl Başlanır?
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Bu sektörde ilk ihracatınızı yapmak için adım adım kılavuz ve pazar araştırması.
          </p>
          <Link href="/rehberler/pazar-arastirmasi" className="text-turkish-red text-sm hover:text-red-400">
            Pazar Araştırması Rehberi →
          </Link>
        </div>
        <div className="card-dark p-6">
          <div className="text-turkish-red text-xs font-semibold mb-2">FİNANSMAN</div>
          <h3 className="text-white font-bold mb-2">Devlet Destekleri ve Teşvikler</h3>
          <p className="text-slate-400 text-sm mb-4">
            KOSGEB, Eximbank ve Ticaret Bakanlığı destekleriyle ihracat maliyetlerinizi düşürün.
          </p>
          <Link href="/rehberler/devlet-destekleri" className="text-turkish-red text-sm hover:text-red-400">
            Destekleri İncele →
          </Link>
        </div>
      </div>
    </div>
  );
}
