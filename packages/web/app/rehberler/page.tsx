import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İhracat Rehberleri — Nasıl İhracat Yapılır?",
  description:
    "Türkiye'den ihracat yapmak için kapsamlı rehberler. Gümrük, Incoterms, lojistik, KDV iadesi ve devlet destekleri.",
};

const GUIDES = [
  {
    slug: "ilk-ihracat",
    baslik: "İlk İhracat Nasıl Yapılır? 10 Adımda Başlangıç",
    ozet: "Türkiye'den ilk kez ihracat yapacaklar için eksiksiz başlangıç kılavuzu.",
    kategori: "Başlangıç",
    okumaSuresi: "12 dk",
    uzman: "Senior Export Expert",
    one_cikan: true,
  },
  {
    slug: "pazar-arastirmasi",
    baslik: "İhracatta Pazar Araştırması ve Alıcı Doğrulama",
    ozet: "Hedef pazar nasıl seçilir, yabancı alıcı nasıl bulunur ve güvenilirliği teyit edilir?",
    kategori: "Strateji",
    okumaSuresi: "10 dk",
    uzman: "Market Intelligence",
    one_cikan: true,
  },
  {
    slug: "devlet-destekleri",
    baslik: "İhracatçılar İçin Devlet Destekleri",
    ozet: "KOSGEB, Eximbank ve Ticaret Bakanlığı'nın hibe ve kredi destekleri.",
    kategori: "Finansman",
    okumaSuresi: "11 dk",
    uzman: "Senior Export Expert",
    one_cikan: true,
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
    slug: "akreditif",
    baslik: "Akreditif (Letter of Credit) Nasıl Çalışır?",
    ozet: "Uluslararası ticarette akreditif güvencesi ve UCP 600 kuralları.",
    kategori: "Finansman",
    okumaSuresi: "8 dk",
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
    slug: "kdv-istisnasi",
    baslik: "İhracatta KDV İstisnası ve KDV İadesi",
    ozet: "İhracat teslimleri KDV'den istisnadır. Yüklenilen KDV'yi nasıl geri alırsınız?",
    kategori: "Vergi",
    okumaSuresi: "9 dk",
    uzman: "Senior Export Expert",
  },
  {
    slug: "lojistik-secimi",
    baslik: "İhracatta Lojistik ve Nakliye Modu Seçimi",
    ozet: "Denizyolu, havayolu, karayolu karşılaştırması. Maliyet ve hız dengesini kurun.",
    kategori: "Lojistik",
    okumaSuresi: "8 dk",
    uzman: "Senior Export Expert",
  },
  {
    slug: "uluslararasi-sozlesme",
    baslik: "Uluslararası Satış Sözleşmeleri: CISG Rehberi",
    ozet: "İhracat sözleşmesi nasıl hazırlanır? Hangi hukuk geçerli olur?",
    kategori: "Hukuk",
    okumaSuresi: "10 dk",
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
    ozet: "İstanbul'un ihracat ekosistemi, sektörler ve lojistik avantajları.",
    kategori: "İl Rehberi",
    okumaSuresi: "11 dk",
    uzman: "Market Intelligence",
  },
];

const KATEGORI_RENK: Record<string, string> = {
  Başlangıç: "text-emerald-400 bg-emerald-400/10",
  Strateji: "text-sky-400 bg-sky-400/10",
  Teknik: "text-sky-400 bg-sky-400/10",
  Mevzuat: "text-amber-400 bg-amber-400/10",
  Finansman: "text-purple-400 bg-purple-400/10",
  Vergi: "text-emerald-400 bg-emerald-400/10",
  Lojistik: "text-amber-400 bg-amber-400/10",
  Hukuk: "text-sky-400 bg-sky-400/10",
  "İl Rehberi": "text-turkish-red bg-turkish-red/10",
};

const oneCikanlar = GUIDES.filter((g) => g.one_cikan);
const digerler = GUIDES.filter((g) => !g.one_cikan);

export default function RehberlerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Başlık */}
      <div className="mb-10 animate-fade-up">
        <div className="text-turkish-red text-sm font-semibold mb-2">UZMAN İÇERİKLER</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">İhracat Rehberleri</h1>
        <p className="text-slate-400 max-w-xl">
          Senior Export Expert onaylı teknik rehberler. Gümrük, Incoterms,
          lojistik, KDV iadesi ve pazar stratejisi hakkında güvenilir bilgi.
        </p>
      </div>

      {/* Öne Çıkanlar */}
      <div className="mb-10">
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">Başlangıç Noktası</div>
        <div className="grid sm:grid-cols-3 gap-4">
          {oneCikanlar.map((guide, i) => (
            <Link
              key={guide.slug}
              href={`/rehberler/${guide.slug}`}
              className={`card-dark p-6 border-turkish-red/20 hover:border-turkish-red/50 group animate-fade-up delay-${(i + 1) * 100}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${KATEGORI_RENK[guide.kategori] ?? "text-slate-400 bg-slate-800"}`}>
                  {guide.kategori}
                </span>
                <span className="text-xs text-slate-500">{guide.okumaSuresi}</span>
              </div>
              <h2 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-turkish-red transition-colors">
                {guide.baslik}
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">{guide.ozet}</p>
              <div className="mt-4 text-turkish-red text-xs font-medium">Oku →</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tüm Rehberler */}
      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">Tüm Rehberler</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {digerler.map((guide, i) => (
          <article
            key={guide.slug}
            className={`card-dark p-6 hover:border-slate-600 animate-fade-up delay-${(i + 1) * 100}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${KATEGORI_RENK[guide.kategori] ?? "text-slate-400 bg-slate-800"}`}>
                {guide.kategori}
              </span>
              <span className="text-xs text-slate-500">{guide.okumaSuresi}</span>
            </div>
            <h2 className="text-base font-bold text-white mb-2 leading-snug">{guide.baslik}</h2>
            <p className="text-slate-400 text-sm mb-4">{guide.ozet}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">✓ {guide.uzman} onaylı</span>
              <Link
                href={`/rehberler/${guide.slug}`}
                className="text-turkish-red text-sm font-medium hover:text-red-400 transition-colors"
              >
                Oku →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
