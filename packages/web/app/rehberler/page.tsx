import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İhracat Rehberleri — Nasıl İhracat Yapılır?",
  description:
    "Türkiye'den ihracat yapmak için kapsamlı rehberler. Gümrük, Incoterms, lojistik ve akreditif.",
};

const GUIDES = [
  {
    slug: "ilk-ihracat",
    baslik: "İlk İhracat Nasıl Yapılır? 10 Adımda Başlangıç",
    ozet: "Türkiye'den ilk kez ihracat yapacaklar için eksiksiz başlangıç kılavuzu.",
    kategori: "Başlangıç",
    okumaSuresi: "12 dk",
    uzman: "Senior Export Expert",
  },
  {
    slug: "incoterms-rehberi",
    baslik: "Incoterms 2020 Rehberi: EXW'dan DDP'ye",
    ozet: "13 Incoterms kuralının ihracatçı ve ithalatçı açısından farkları.",
    kategori: "Teknik",
    okumaSuresi: "15 dk",
    uzman: "Senior Export Expert",
  },
  {
    slug: "gumruk-surecleri",
    baslik: "Türkiye Gümrük Süreçleri 2024",
    ozet: "İhracat beyannamesi, ATR belgesi ve gümrük prosedürleri.",
    kategori: "Mevzuat",
    okumaSuresi: "10 dk",
    uzman: "Senior Export Expert",
  },
  {
    slug: "akreditif",
    baslik: "Akreditif (Letter of Credit) Nasıl Çalışır?",
    ozet: "Uluslararası ticarette akreditif güvencesi ve UCP 600 kuralları.",
    kategori: "Finansman",
    okumaSuresi: "8 dk",
    uzman: "Senior Export Expert",
  },
  {
    slug: "gaziantep-ihracat",
    baslik: "Gaziantep'ten İhracat: Sektörler ve Pazarlar",
    ozet: "Gaziantep'in ihracat profili, güçlü sektörleri ve hedef pazar analizi.",
    kategori: "İl Rehberi",
    okumaSuresi: "9 dk",
    uzman: "Market Intelligence",
  },
  {
    slug: "istanbul-ihracat",
    baslik: "İstanbul'dan İhracat: Türkiye'nin Merkezi",
    ozet: "İstanbul'un ihracat ekosistemi, sektörler, lojistik avantajları.",
    kategori: "İl Rehberi",
    okumaSuresi: "11 dk",
    uzman: "Market Intelligence",
  },
];

const KATEGORI_RENK: Record<string, string> = {
  Başlangıç: "text-emerald-400 bg-emerald-400/10",
  Teknik: "text-sky-400 bg-sky-400/10",
  Mevzuat: "text-amber-400 bg-amber-400/10",
  Finansman: "text-purple-400 bg-purple-400/10",
  "İl Rehberi": "text-turkish-red bg-turkish-red/10",
};

export default function RehberlerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="text-turkish-red text-sm font-semibold mb-2">
          UZMAN İÇERİKLER
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">
          İhracat Rehberleri
        </h1>
        <p className="text-slate-400 max-w-xl">
          Senior Export Expert onaylı teknik rehberler. Gümrük, Incoterms,
          lojistik ve pazar stratejisi hakkında güvenilir bilgi.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES.map((guide) => (
          <article key={guide.slug} className="card-dark p-6 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  KATEGORI_RENK[guide.kategori] ?? "text-slate-400 bg-slate-800"
                }`}
              >
                {guide.kategori}
              </span>
              <span className="text-xs text-slate-500">{guide.okumaSuresi}</span>
            </div>
            <h2 className="text-base font-bold text-white mb-2 leading-snug">
              {guide.baslik}
            </h2>
            <p className="text-slate-400 text-sm mb-4">{guide.ozet}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">✓ {guide.uzman} onaylı</span>
              {["ilk-ihracat", "incoterms-rehberi", "gumruk-surecleri", "akreditif", "gaziantep-ihracat", "istanbul-ihracat"].includes(guide.slug) ? (
                <Link
                  href={`/rehberler/${guide.slug}`}
                  className="text-turkish-red text-sm font-medium hover:text-red-400 transition-colors"
                >
                  Oku →
                </Link>
              ) : (
                <span className="text-slate-600 text-sm">Yakında →</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
