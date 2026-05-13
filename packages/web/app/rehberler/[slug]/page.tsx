import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRehber, getAllRehberler } from "@/lib/rehberler";

export async function generateStaticParams() {
  return getAllRehberler().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const rehber = getRehber(params.slug);
  if (!rehber) return { title: "Rehber Bulunamadı", robots: { index: false, follow: false } };
  return {
    title: rehber.baslik,
    description: rehber.ozet,
  };
}

const KATEGORİ_RENK: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-400/10",
  sky: "text-sky-400 bg-sky-400/10",
  amber: "text-amber-400 bg-amber-400/10",
  purple: "text-purple-400 bg-purple-400/10",
  red: "text-turkish-red bg-turkish-red/10",
};

export default function RehberDetailPage({ params }: { params: { slug: string } }) {
  const rehber = getRehber(params.slug);
  if (!rehber) notFound();

  const badgeClass = KATEGORİ_RENK[rehber.kategoriRenk] ?? KATEGORİ_RENK.emerald;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-slate-900 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <Link href="/rehberler" className="hover:text-slate-900 transition-colors">Rehberler</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600 line-clamp-1">{rehber.baslik}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeClass}`}>
            {rehber.kategori}
          </span>
          <span className="text-xs text-slate-500">{rehber.okumaSuresi} dk okuma</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
          {rehber.baslik}
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-4">{rehber.ozet}</p>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="text-emerald-500">✓</span>
          <span>{rehber.onayci} tarafından onaylandı</span>
        </div>
      </div>

      {/* Adımlar (adimlar varsa) */}
      {rehber.adimlar && rehber.adimlar.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Adım Adım Rehber</h2>
          <div className="space-y-4">
            {rehber.adimlar.map((adim) => (
              <div key={adim.numara} className="card-dark p-5 flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-turkish-red/20 border border-turkish-red/30 flex items-center justify-center">
                  <span className="text-turkish-red text-sm font-bold">{adim.numara}</span>
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold mb-1.5">{adim.baslik}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{adim.icerik}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bölümler (bolumler varsa) */}
      {rehber.bolumler && rehber.bolumler.length > 0 && (
        <div className="mb-10 space-y-6">
          {rehber.bolumler.map((bolum, i) => (
            <div key={i} className="card-dark p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{bolum.baslik}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{bolum.icerik}</p>
            </div>
          ))}
        </div>
      )}

      {/* Özel Hususlar */}
      {rehber.ozHususlar.length > 0 && (
        <div className="mb-10 border border-amber-400/20 bg-amber-400/5 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-400 text-sm font-semibold">⚠ Özel Hususlar</span>
          </div>
          <ul className="space-y-2">
            {rehber.ozHususlar.map((husus, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                <span>{husus}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Kaynaklar */}
      <div className="border-t border-slate-200 pt-6 flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <span className="text-xs text-slate-500">Kaynaklar: </span>
          <span className="text-xs text-slate-400">{rehber.kaynaklar.join(" · ")}</span>
        </div>
        <Link
          href="/rehberler"
          className="text-sm text-turkish-red hover:text-red-400 transition-colors"
        >
          ← Tüm Rehberler
        </Link>
      </div>

      {/* Sonraki Adım */}
      <div className="border-t border-slate-200 pt-8">
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">Sonraki Adım</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/veriler" className="card-dark p-5 hover:border-turkish-red/40 group transition-all">
            <div className="text-xs text-turkish-red font-semibold mb-2">VERİ</div>
            <div className="text-slate-900 text-sm font-semibold group-hover:text-turkish-red transition-colors mb-1">
              İl Bazlı İhracat Verileri
            </div>
            <div className="text-slate-400 text-xs">İstanbul, İzmir, Gaziantep ve diğer illerin ihracat istatistikleri</div>
            <div className="text-turkish-red text-xs font-medium mt-3">Verilere Git →</div>
          </Link>
          <Link href="/rehberler" className="card-dark p-5 hover:border-turkish-red/40 group transition-all">
            <div className="text-xs text-turkish-red font-semibold mb-2">REHBER</div>
            <div className="text-slate-900 text-sm font-semibold group-hover:text-turkish-red transition-colors mb-1">
              Diğer İhracat Rehberleri
            </div>
            <div className="text-slate-400 text-xs">Gümrük, Incoterms, KDV iadesi ve devlet destekleri hakkında teknik içerikler</div>
            <div className="text-turkish-red text-xs font-medium mt-3">Tüm Rehberler →</div>
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://exporthub.com.tr/" },
              { "@type": "ListItem", position: 2, name: "Rehberler", item: "https://exporthub.com.tr/rehberler" },
              { "@type": "ListItem", position: 3, name: rehber.baslik, item: `https://exporthub.com.tr/rehberler/${params.slug}` },
            ],
          }),
        }}
      />
    </div>
  );
}
