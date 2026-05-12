import type { Metadata } from "next";
import Link from "next/link";
import { StatsCounter } from "@/components/ui/StatsCounter";

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
  { label: "Toplam İhracat (2024)", value: "255 Milyar $", kaynak: "TÜİK", numericValue: 255, suffix: " Milyar $" },
  { label: "İhracatçı Firma", value: "82,000+", kaynak: "TİM", numericValue: 82000, suffix: "+" },
  { label: "Hedef Pazar", value: "230+ Ülke", kaynak: "Ticaret Bakanlığı", numericValue: 230, suffix: "+ Ülke" },
  { label: "Büyüme Oranı", value: "%7.2", kaynak: "2024 vs 2023", numericValue: 7, suffix: "%", prefix: "%" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white/60 to-slate-50" />
        {/* Renkli ışıma lekeleri */}
        <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] bg-turkish-red/12 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 badge-gradient rounded-full px-4 py-1.5 text-sm text-turkish-red mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-turkish-red rounded-full animate-pulse" />
            2025-2026 verileri güncellendi
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 animate-fade-up delay-100">
            Türkiye İhracat Verilerini
            <br />
            <span className="text-gradient">Anlayın.</span> Fırsatları{" "}
            <span className="text-gradient">Yakalayın.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            TÜİK ve TİM verilerine dayalı, il bazlı ihracat istatistikleri, sektör
            analizleri ve ihracata başlamak için adım adım rehberler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
            <Link
              href="/veriler"
              className="btn-primary text-white px-8 py-3.5 rounded-xl font-semibold"
            >
              Verileri İncele
            </Link>
            <Link
              href="/rehberler"
              className="border border-slate-500 text-slate-900 px-8 py-3.5 rounded-xl font-semibold hover:border-purple-400/60 hover:bg-purple-500/5 transition-all hover:scale-105"
            >
              İhracat Rehberi
            </Link>
          </div>
        </div>
      </section>

      {/* Özet İstatistikler */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsCounter stats={STATS} />
        </div>
      </section>

      {/* İl Kartları */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Öne Çıkan İller</h2>
              <p className="text-slate-400 mt-1">İhracat hacmine göre Türkiye&apos;nin en güçlü merkezleri</p>
            </div>
            <Link href="/veriler" className="text-turkish-red hover:text-red-400 text-sm font-medium">
              Tümünü gör →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURED_PROVINCES.map((p, i) => {
              const accentColors: Record<string, string> = {
                red: "border-l-turkish-red shadow-[0_0_20px_rgba(220,20,60,0.12)]",
                blue: "border-l-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.1)]",
                green: "border-l-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.1)]",
                yellow: "border-l-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.1)]",
                purple: "border-l-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.1)]",
              };
              const accent = accentColors[p.renk] ?? accentColors.red;
              return (
              <Link
                key={p.id}
                href={`/veriler/${p.id}`}
                className={`card-dark border-l-2 ${accent} p-5 transition-all group animate-fade-up delay-${(i + 1) * 100}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-lg font-semibold text-slate-900 group-hover:text-turkish-red transition-colors">
                    {p.il}
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-semibold">
                    {p.buyume}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  ${p.ihracat}B
                </div>
                <div className="text-xs text-slate-500 mt-1">2026 ihracatı</div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-turkish-red text-sm font-semibold mb-2">SIKÇA SORULAN SORULAR</div>
            <h2 className="text-2xl font-bold text-slate-900">İhracat Hakkında Merak Edilenler</h2>
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
              {
                s: "Akreditif mi, havale mi? Hangi ödeme yöntemi daha güvenli?",
                c: "Akreditif (LC), ithalatçının bankasının —UCP 600 kuralları çerçevesinde— sevkiyat belgelerinin ibrazı karşılığında ödemeyi garanti ettiği bir banka taahhüdüdür; yeni veya güven tesis edilmemiş alıcılarda tercih edilmesi gereken en güvenli yöntemdir. Havale (T/T) daha hızlı ve düşük maliyetlidir ancak ödeme riski tamamen ihracatçıya aittir. Kural: yeni alıcı → akreditif, uzun vadeli güvenilir alıcı → havale.",
              },
              {
                s: "Menşe şahadeti ile EUR.1 belgesinin farkı nedir?",
                c: "Menşe şahadeti, malların Türkiye'de üretildiğini kanıtlayan Ticaret/Sanayi Odası onaylı belgedir; tercihli olmayan menşei ispat eder. EUR.1 ise Türkiye'nin STA'larında tercihli gümrük tarifesinden yararlanmak için düzenlenen belgedir. Kısaca: menşe şahadeti hangi ülkeden geldiğini, EUR.1 tercihli vergi avantajı hakkını kanıtlar.",
              },
              {
                s: "Hedef ülkedeki gümrük vergisini nasıl öğrenebilirim?",
                c: "İlk adım ürününüzün HS kodunu (GTİP) doğru tespit etmektir. Ardından ITC Trade Map (trademap.org), WTO Tariff Analysis Online veya AB için TARIC veritabanını kullanarak söz konusu ülkenin uyguladığı MFN ve varsa Türkiye'ye özgü tercihli vergi oranlarını sorgulayabilirsiniz. Türkiye ile hedef ülke arasında STA varsa EUR.1 ibraz zorunludur.",
              },
              {
                s: "Yurt dışına ticari numune gönderirken nelere dikkat etmeliyim?",
                c: "Numune ihracatı için de gümrük beyanı gereklidir; fatura değeri sembolik yazılabilir ancak üzerine açıkça 'Numune — Ticari Değeri Yoktur / No Commercial Value — Sample' ibaresi yazılmalıdır. İlaç, kozmetik veya gıda gibi ürünlerde hedef ülkenin ek sertifika talep edebileceğini göz önünde bulundurun.",
              },
              {
                s: "İhracat kredi sigortası nedir, KOBİ'lere faydası var mı?",
                c: "İhracat kredi sigortası, alıcının iflas etmesi veya politik nedenlerle ödemenin yapılamaması durumunda alacağı —genellikle %85-95 oranında— tazmin eder. Türk Eximbank bu hizmeti sunar. KOBİ'ler için en somut fayda: sigortalı alacağı bankaya teminat gösterip buna karşılık işletme kredisi kullanabilmektir.",
              },
              {
                s: "ETGB nedir, e-ticaret ihracatında nasıl kullanılır?",
                c: "Elektronik Ticaret Gümrük Beyannamesi (ETGB), Amazon, Etsy veya kendi web siteniz üzerinden yapılan bireysel/küçük hacimli ihracatlarda standart EX beyannamesi yerine kullanılan basitleştirilmiş gümrük beyanıdır. KOBİ'ler için en önemli avantajı kargo firmaları aracılığıyla hızlı gümrük çıkışı ve KDV iadesi hakkının korunmasıdır.",
              },
              {
                s: "AB'ye satış için CE belgesi şart mı, nasıl alınır?",
                c: "Evet; CE işareti Avrupa Ekonomik Alanı'na ihraç edilen pek çok ürün için yasal zorunluluktur. Süreç: uygulanabilecek direktifin tespiti (LVD, EMC, Makine Direktifi vb.), uygunluk değerlendirmesi (düşük riskli ürünlerde üretici kendi beyanı yeterli, yüksek riskli ürünlerde Onaylanmış Kuruluş / Notified Body devreye girer) ve Teknik Dosya hazırlığından oluşur.",
              },
            ].map(({ s, c }, i) => (
              <details
                key={i}
                className="card-dark group open:border-slate-300"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                  <span className="text-slate-900 font-medium text-sm pr-4">{s}</span>
                  <span className="text-turkish-red flex-shrink-0 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-200 pt-4">
                  {c}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Son Eklenen Rehberler */}
      <section className="py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-turkish-red text-sm font-semibold mb-1">UZMAN İÇERİKLER</div>
              <h2 className="text-2xl font-bold text-slate-900">Öne Çıkan Rehberler</h2>
              <p className="text-slate-400 text-sm mt-1">İhracat sürecinizde yol gösteren teknik içerikler</p>
            </div>
            <Link href="/rehberler" className="text-turkish-red hover:text-red-400 text-sm font-medium">
              Tüm Rehberler →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { slug: "ilk-ihracat", baslik: "İlk İhracat Nasıl Yapılır? 10 Adımda Başlangıç", kategori: "Başlangıç", sure: "12 dk" },
              { slug: "incoterms-rehberi", baslik: "Incoterms 2020: EXW'dan DDP'ye Tam Rehber", kategori: "Teknik", sure: "15 dk" },
              { slug: "devlet-destekleri", baslik: "İhracatçılar İçin Devlet Destekleri", kategori: "Finansman", sure: "11 dk" },
            ].map((r) => (
              <Link
                key={r.slug}
                href={`/rehberler/${r.slug}`}
                className="card-dark p-5 hover:border-slate-300 group transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-turkish-red bg-turkish-red/10 px-2 py-0.5 rounded-full font-medium">
                    {r.kategori}
                  </span>
                  <span className="text-xs text-slate-500">{r.sure}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-turkish-red transition-colors mb-3">
                  {r.baslik}
                </h3>
                <div className="text-turkish-red text-xs font-medium">Oku →</div>
              </Link>
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
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sektör Bazlı İhracat</h3>
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
              <h3 className="text-xl font-bold text-slate-900 mb-3">İhracata Nasıl Başlanır?</h3>
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
      {/* Bülten CTA */}
      <section className="py-16 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-turkish-red text-sm font-semibold mb-3">AYLIK BÜLTEN</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            İhracat Verilerini Takip Edin
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Türkiye ihracat istatistikleri, yeni sektör analizleri ve pratik ihracat
            ipuçları her ay doğrudan e-postanıza gelsin. Binlerce ihracatçı ile aynı
            bilgiye sahip olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="e-posta adresiniz"
              className="flex-1 bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-500 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-turkish-red transition-colors"
            />
            <button
              type="button"
              className="bg-turkish-red text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors"
            >
              Abone Ol
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Spam yok. İstediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
        </div>
      </section>
    </>
  );
}
