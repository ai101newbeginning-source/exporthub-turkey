import type { AgentId, TaskResult } from "./types.js";

const MOCK_RESPONSES: Record<AgentId, (message: string) => string> = {
  "project-manager": (msg) => `
**Proje Yöneticisi** — Değerlendirme tamamlandı.

"${msg.slice(0, 80)}${msg.length > 80 ? "..." : ""}" talebini aldım. Ekip koordinasyonumu şu şekilde planlıyorum:

**Sprint Öncelikleri:**
1. 🔴 **Kritik** — Gaziantep il rehberi içeriği (Senior Export Expert onayına gönderiliyor)
2. 🟠 **Yüksek** — Remotion animasyonları için veri hazırlığı (Data Analyst → Remotion Specialist zinciri)
3. 🟡 **Orta** — SEO anahtar kelime araştırması (Büyüme Uzmanı'na devredildi)

**Ekip Atamaları:**
- **Senior Export Expert** → Teknik içerik doğrulama
- **UX/UI Tasarımcı** → Mobil grafik okunabilirliği planı
- **Data Analyst** → 2024 TÜİK verileri analizi
- **Remotion Specialist** → Gaziantep büyüme animasyonu

**İlk Öneri:** Başlangıç noktası olarak **Gaziantep** öneriyorum. %16.3 büyüme oranıyla Türkiye'nin en hızlı büyüyen ihracat merkezi. Rakip içerik az, SEO fırsatı yüksek.

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "senior-export-expert": (msg) => `
**Kıdemli İhracat Uzmanı** — Teknik Doğrulama

"${msg.slice(0, 60)}..." içeriğini inceledim.

**Teknik Değerlendirme:**

✅ **Onaylanan bilgiler:**
- Incoterms 2020 referansları doğru (ICC standartlarına uygun)
- Gümrük Kanunu 4458 sayılı kanun kapsamında değerlendirme yerinde
- FOB ve CIF ayrımı ihracatçı açısından doğru açıklanmış

⚠️ **Düzeltme gerektiren noktalar:**
- "Gümrük beyannamesi 3 gün içinde teslim edilir" ifadesi eksik — elektronik sistem (BİLGE) üzerinden anlık yapılmakta
- ATR belgesi yalnızca AB ülkeleri için geçerli, genel kullanım belirtilmeli

**Onay Durumu:** Düzeltmeler sonrası **ONAYLANDI** ✅

Kaynak: Gümrük ve Ticaret Bakanlığı, TİM Mevzuat Rehberi 2024

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "market-intelligence": (msg) => `
**Dış Ticaret & Lead Uzmanı** — Pazar Analizi

"${msg.slice(0, 60)}..." talebi için pazar araştırması tamamlandı.

**Hedef Pazar Analizi — Almanya (Tekstil):**

| Gösterge | Değer |
|----------|-------|
| Pazar büyüklüğü | €28.4 milyar |
| Türkiye'nin payı | %11.2 |
| Büyüme trendi | +3.8% (2024) |
| Ana rakipler | Çin (%34), Bangladeş (%18) |

**Potansiyel Lead Kaynakları:**
1. **LinkedIn Sales Navigator** → "Import Manager" + "Tekstil" + Almanya = ~1,200 profil
2. **Kompass.com** → Almanya tekstil ithalatçısı firma listesi
3. **Frankfurter Messe** → Texprocess fuarı alıcı listesi (yıllık)

**Pazar Giriş Stratejisi:** Distribütör modeliyle başla, Düsseldorf veya Hamburg merkezli aracı firma.

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "content-marketing": (msg) => `
**İçerik Ekibi** — Taslak Hazırlandı

"${msg.slice(0, 60)}..." konusunda içerik taslağı:

---
# Gaziantep'ten İhracat: Fırsatlar ve Rehber (2024)

Gaziantep, Türkiye'nin güneydoğu ihracat merkezi olarak 2024 yılında **12.1 milyar dolarlık** ihracat gerçekleştirdi. %16.3'lük büyüme oranıyla ülkenin en hızlı büyüyen ili konumunda.

## Güçlü Olduğunuz Sektörler
- **Tekstil ve Halı** — Dünya genelinde tanınan Gaziantep halıcılığı
- **Makine ve Teçhizat** — Orta Doğu altyapı projelerine tedarik
- **Fıstık ve Gıda** — Coğrafi işaret korumalı Antep fıstığı

## Hedef Pazarlar
Irak, Suriye ve Körfez ülkeleri Gaziantep'in doğal avantaj alanı...

---
*(Senior Export Expert onayına gönderildi — teknik doğrulama bekleniyor)*

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "seo-growth": (msg) => `
**Büyüme Uzmanı** — SEO Analizi

"${msg.slice(0, 60)}..." için anahtar kelime araştırması tamamlandı.

**Yüksek Potansiyelli Anahtar Kelimeler:**

| Kelime | Aylık Arama | Rekabet | Öncelik |
|--------|-------------|---------|---------|
| gaziantep ihracat | 1,900 | Düşük | 🔴 Kritik |
| antep fıstığı ihracat | 880 | Düşük | 🔴 Kritik |
| türkiye ihracat verileri | 2,400 | Orta | 🟠 Yüksek |
| nasıl ihracat yapılır | 3,600 | Yüksek | 🟡 Orta |

**Sayfa Önerileri:**
- Title: "Gaziantep İhracat Verileri 2024 | ExportHub Türkiye" (58 karakter ✅)
- Meta: "Gaziantep'in sektör bazlı ihracat istatistikleri. 2024 yılında $12.1B ihracat, %16.3 büyüme." (92 karakter ✅)

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "data-analyst": (msg) => `
**Veri Analisti** — Analiz Tamamlandı

"${msg.slice(0, 60)}..." için veri analizi:

**Türkiye İhracat Özeti (2024):**
- Toplam ihracat: **$255.8 milyar** (+7.2% büyüme)
- En yüksek büyüme: Gaziantep (%16.3) > Bursa (%9.8) > İzmir (%9.4)
- En büyük sektör: Otomotiv ($32.4B) > Tekstil ($18.7B)

**Grafik Konfigürasyonu (Remotion için):**
\`\`\`json
{
  "type": "bar",
  "data": [52.1, 63.8, 68.4, 72.1, 75.3],
  "labels": ["2020","2021","2022","2023","2024"],
  "province": "İstanbul",
  "animated": true,
  "colorScheme": "red"
}
\`\`\`

**Temel Bulgular:**
1. İstanbul ihracatı 5 yılda %44 artış gösterdi
2. Gaziantep büyüme hızı İstanbul'un 3.7 katı

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "frontend-dev": (msg) => `
**Frontend Geliştirici** — Bileşen Planı

"${msg.slice(0, 60)}..." için geliştirme planı:

**İl Detay Sayfası — Bileşen Yapısı:**
\`\`\`
<IlDetayPage>
  ├── <Hero> — il adı, büyüme badge, 2024 değeri
  ├── <ProvincePlayer> — Remotion animasyon (dynamic import, ssr:false)
  ├── <Grid cols=2>
  │   ├── <TrendChart> — Recharts BarChart, yıllık veri
  │   └── <SektorList> — progress bar + yüzde
  ├── <UlkeGrid> — 5 hedef ülke kartı
  └── <CTASection> — rehber linki
</IlDetayPage>
\`\`\`

**Mobil Notu (UX/UI Tasarımcı'dan):** Remotion Player mobilde \`aspect-video\` koru, kontroller büyütülmeli (44px min).

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "backend-dev": (msg) => `
**Backend Geliştirici** — Mimari Plan

"${msg.slice(0, 60)}..." için teknik analiz:

**TÜİK API Entegrasyon Planı:**
\`\`\`
Endpoint: https://data.tuik.gov.tr/api/
Auth: API key header (ücretsiz kayıt)
Rate limit: ~100 req/dk
Güncelleme: Aylık veri yayını
\`\`\`

**Önerilen Cache Stratejisi:**
- TÜİK verisi → Redis TTL: 24 saat
- İl sayfaları → Next.js ISR: revalidate 3600s
- Sektör verileri → Static generation (aylık manuel güncelleme)

**v2 Veritabanı Şeması:**
\`\`\`sql
Province(id, name, region)
ExportRecord(province_id, year, month, value_usd, sector_id)
Sector(id, name, hs_code)
TradePartner(province_id, country, share_pct)
\`\`\`

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "qa-tester": (msg) => `
**Kalite Güvence Uzmanı** — Test Raporu

"${msg.slice(0, 60)}..." için test senaryoları:

**Test Özeti:** 18 test senaryosu oluşturuldu

✅ **Geçen Testler (14/18):**
- Ana sayfa yükleme < 3 saniye
- /veriler/istanbul → 200 OK
- API /api/data/istanbul → doğru JSON
- Mobil 375px — sayfa bozulmuyor
- Keyboard navigasyonu çalışıyor

⚠️ **Açık Sorunlar (4/18):**
- [ ] Remotion Player ilk yüklemede 2-3 saniye gecikme (LCP etkisi)
- [ ] Renk kontrastı: slate-400 üzerinde metin 3.8:1 (min 4.5:1 olmalı)
- [ ] Veri tablosu 320px ekranda yatay taşıyor
- [ ] /veriler/istanbul 404 sayfası Turkish lang="tr" eksik

**Öncelik:** Kontrast sorunu erişilebilirlik kuralı — acil.

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "remotion-specialist": (msg) => `
**Remotion Animasyon Uzmanı** — Kompozisyon Planı

"${msg.slice(0, 60)}..." için animasyon tasarımı:

**Gaziantep Büyüme Animasyonu — Plan:**

\`\`\`tsx
// Önerilen: 5 saniyelik etki animasyonu
<Sequence from={0} durationInFrames={150}>
  {/* 0-30: Türkiye haritası, Gaziantep highlight */}
  {/* 30-90: Bar chart sıfırdan büyür */}
  {/* 90-120: %16.3 sayacı koşar */}
  {/* 120-150: "En hızlı büyüyen il" badge fade-in */}
</Sequence>
\`\`\`

**inputProps Tipi:**
\`\`\`ts
interface GaziantepAnimationProps {
  growthRate: number;      // 16.3
  exportValue: number;     // 12.1
  year: string;            // "2024"
  colorScheme: "red";
}
\`\`\`

**Player Embed (Next.js):**
\`\`\`tsx
<Player component={GrowthAnimation}
  inputProps={{ growthRate: 16.3, exportValue: 12.1, year: "2024" }}
  durationInFrames={150} fps={30} />
\`\`\`

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),

  "ux-designer": (msg) => `
**UX/UI Tasarımcı & Erişilebilirlik Uzmanı** — Tasarım Kararları

"${msg.slice(0, 60)}..." için mobil-first tasarım planı:

**İl Detay Sayfası — Mobil Davranışları:**

| Bileşen | Mobil (375px) | Desktop (1280px) |
|---------|--------------|-----------------|
| Remotion Player | Tam genişlik, 16:9 | 60% genişlik, sağda |
| Bar Chart | 3 bar göster + "Tümü" toggle | 5 bar yan yana |
| Sektör listesi | 2 sütun grid | 3 sütun grid |
| Ülke kartları | Yatay scroll | 5 kart grid |
| Veri sayıları | 28px bold | 36px bold |

**Erişilebilirlik Notları:**
- ⚠️ Kırmızı (#DC143C) → %AA kontrast için beyaz zemin zorunlu
- ✅ Remotion animasyon → \`prefers-reduced-motion\` medya sorgusu ekle
- ✅ Grafik değerleri → \`aria-label="İstanbul 2024 ihracatı 75.3 milyar dolar"\`
- ⚠️ Touch hedefleri minimum 44×44px — mevcut badge'lar küçük

**Frontend'e Teslim:** Tailwind class'ları \`sm:grid-cols-2 md:grid-cols-3\`, Remotion \`style={{ width: '100%' }}\`

*[DEMO MODU — Gerçek API yanıtı için ANTHROPIC_API_KEY gereklidir]*
  `.trim(),
};

export function getMockResponse(agentId: AgentId, message: string): TaskResult {
  const responseFn = MOCK_RESPONSES[agentId];
  return {
    agentId,
    taskType: "mock",
    output: responseFn ? responseFn(message) : `[${agentId}] Demo yanıtı — ANTHROPIC_API_KEY gerekli.`,
    approved: true,
    metadata: { demo: true },
  };
}

export const IS_DEMO_MODE = !process.env.ANTHROPIC_API_KEY;
