import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ExportHub Türkiye — İhracat Verileri ve Rehberler",
};

const FEATURED_PROVINCES = [
  { id: "istanbul", il: "İstanbul", ihracat: "75.3", buyume: "+4.4%", renk: "red" },
  { id: "kocaeli", il: "Kocaeli", ihracat: "16.2", buyume: "+8.7%", renk: "blue" },
  { id: "izmir", il: "İzmir", ihracat: "15.1", buyume: "+9.4%", renk: "green" },
  { id: "bursa", il: "Bursa", ihracat: "13.5", buyume: "+9.8%", renk: "yellow" },
  { id: "gaziantep", il: "Gaziantep", ihracat: "12.1", buyume: "+16.3%", renk: "purple" },
];

const STATS = [
  { label: "Toplam İhracat (2024)", value: "255 Milyar $", kaynak: "TÜİK" },
  { label: "İhracatçı Firma", value: "82,000+", kaynak: "TİM" },
  { label: "Hedef Pazar", value: "230+ Ülke", kaynak: "Ticaret Bakanlığı" },
  { label: "Büyüme Oranı", value: "%7.2", kaynak: "2024 vs 2023" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-turkish-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-turkish-navy/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-turkish-red/10 border border-turkish-red/20 rounded-full px-4 py-1.5 text-sm text-turkish-red mb-6">
            <span className="w-2 h-2 bg-turkish-red rounded-full animate-pulse" />
            2024 verileri güncellendi
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Türkiye İhracat Verilerini
            <br />
            <span className="text-turkish-red">Anlayın.</span> Fırsatları{" "}
            <span className="text-turkish-red">Yakalayın.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            TÜİK ve TİM verilerine dayalı, il bazlı ihracat istatistikleri, sektör
            analizleri ve ihracata başlamak için adım adım rehberler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/veriler"
              className="bg-turkish-red text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Verileri İncele
            </Link>
            <Link
              href="/rehberler"
              className="border border-slate-600 text-slate-200 px-8 py-3.5 rounded-xl font-semibold hover:border-slate-400 transition-colors"
            >
              İhracat Rehberi
            </Link>
          </div>
        </div>
      </section>

      {/* Özet İstatistikler */}
      <section className="py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
                <div className="text-xs text-slate-600 mt-1">Kaynak: {stat.kaynak}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* İl Kartları */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Öne Çıkan İller</h2>
              <p className="text-slate-400 mt-1">İhracat hacmine göre Türkiye&apos;nin en güçlü merkezleri</p>
            </div>
            <Link href="/veriler" className="text-turkish-red hover:text-red-400 text-sm font-medium">
              Tümünü gör →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURED_PROVINCES.map((p) => (
              <Link
                key={p.id}
                href={`/veriler/${p.id}`}
                className="card-dark p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-lg font-semibold text-white group-hover:text-turkish-red transition-colors">
                    {p.il}
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    {p.buyume}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-white">
                  ${p.ihracat}B
                </div>
                <div className="text-xs text-slate-500 mt-1">2024 ihracatı</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-turkish-red text-sm font-semibold mb-2">SIKÇA SORULAN SORULAR</div>
            <h2 className="text-2xl font-bold text-white">İhracat Hakkında Merak Edilenler</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                s: "Türkiye'den ihracat yapmak için ne gerekir?",
                c: "Vergi numarası ve ticaret sicili kaydı yeterlidir. Ek bir ihracat lisansı gerekmez. Bazı ürünler (silah, ilaç, tarım ürünleri vb.) için Ticaret Bakanlığı'ndan özel izin alınması zorunludur.",
              },
              {
                s: "İlk ihracatımda hangi pazardan başlamalıyım?",
                c: "Gümrük Birliği avantajı nedeniyle AB (özellikle Almanya, İtalya, Fransa) ve coğrafi yakınlık nedeniyle Orta Doğu (Irak, BAE) en yaygın başlangıç pazarlarıdır. Ürününüze göre TİM'in pazar araştırma raporlarını inceleyin.",
              },
              {
                s: "Gümrük müşaviri zorunlu mu?",
                c: "Türkiye'de ihracat beyannamesi yetkili gümrük müşaviri aracılığıyla BİLGE sistemine elektronik olarak verilmektedir. İlk ihracatlarda deneyimli bir müşavirle çalışmak hata riskini önemli ölçüde azaltır.",
              },
              {
                s: "FOB ve CIF arasındaki fark nedir?",
                c: "FOB'da satıcı malı gemiye yükler, risk bu noktada alıcıya geçer ve navlun alıcı tarafından ödenir. CIF'de ise satıcı navlun ve sigortayı da üstlenir, ancak risk yine yükleme limanında devredilir.",
              },
              {
                s: "İhracat bedeli ne zaman yurda getirilmeli?",
                c: "Kambiyo mevzuatı gereği ihracat bedelinin sevkiyat tarihinden itibaren 180 gün içinde yurda getirilmesi zorunludur. Sürenin aşılması durumunda Hazine'ye cezai faiz uygulanabilir.",
              },
              {
                s: "Türkiye'nin hangi ülkelerle serbest ticaret anlaşması var?",
                c: "AB Gümrük Birliği'nin yanı sıra EFTA ülkeleri, İsrail, Fas, Tunus, Mısır, Gürcistan, Şili ve diğer pek çok ülkeyle ikili STA bulunmaktadır. Güncel liste için Ticaret Bakanlığı web sitesini takip edin.",
              },
              {
                s: "İhracat teşviklerinden nasıl yararlanabilirim?",
                c: "KOSGEB'in uluslararasılaşma desteği, TİM'in yurt dışı fuar katılım hibesi ve Eximbank'ın ihracat kredileri başlıca desteklerdir. Her birinin başvuru dönemleri ve kriterleri farklıdır; ilgili kurumların web sitelerini düzenli takip edin.",
              },
              {
                s: "ATR belgesi ne işe yarar?",
                c: "ATR (Admission Temporaire/Temporary Admission) belgesi, Türkiye'den AB ülkelerine ihraç edilen sanayi mallarının gümrük vergisinden muaf olmasını sağlayan dolaşım belgesidir. Gümrük Birliği kapsamındaki mallarda uygulanır.",
              },
            ].map(({ s, c }, i) => (
              <details
                key={i}
                className="card-dark group open:border-slate-600"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                  <span className="text-white font-medium text-sm pr-4">{s}</span>
                  <span className="text-turkish-red flex-shrink-0 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
                  {c}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sektörler CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-dark p-8">
              <div className="text-turkish-red text-sm font-semibold mb-2">VERİ ANALİZİ</div>
              <h3 className="text-xl font-bold text-white mb-3">Sektör Bazlı İhracat</h3>
              <p className="text-slate-400 text-sm mb-6">
                Otomotiv, tekstil, makine ve gıda sektörlerinde Türkiye&apos;nin
                ihracat performansını inceleyin.
              </p>
              <Link
                href="/sektorler"
                className="text-turkish-red text-sm font-medium hover:text-red-400"
              >
                Sektör Analizleri →
              </Link>
            </div>
            <div className="card-dark p-8">
              <div className="text-turkish-red text-sm font-semibold mb-2">REHBER</div>
              <h3 className="text-xl font-bold text-white mb-3">İhracata Nasıl Başlanır?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Gümrük işlemleri, Incoterms, akreditif ve lojistik konularında
                uzman içerikler.
              </p>
              <Link
                href="/rehberler"
                className="text-turkish-red text-sm font-medium hover:text-red-400"
              >
                Rehberleri İncele →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
