# ExportHub Türkiye — Claude Code Kuralları

## ⚡ Temel Kural: Her değişiklik önce Dispatch'ten geçer

Kullanıcı bir şey istediğinde **doğrudan uygulamadan önce** `dispatch` sistemini çalıştır:

```bash
cd packages/agents && pnpm dispatch "<kullanıcı isteği>"
```

Dispatch çıktısını al, uygula, sonra commit et.

---

## 🗺️ Intent → Agent Pipeline Haritası

| İstek türü | Agent pipeline | Paralel? |
|---|---|---|
| Tasarım / renkler / CSS | `ux-designer` → `frontend-dev` | ✅ |
| Yeni veri / JSON / istatistik | `data-analyst` | — |
| Metin / içerik / FAQ | `content-marketing` + `senior-export-expert` | ✅ |
| SEO / metadata | `seo-growth` + `content-marketing` | ✅ |
| Site denetimi / test | `site-auditor` + `qa-tester` | ✅ |
| Yeni özellik | `project-manager` → `frontend-dev` → `data-analyst` | — |
| Animasyon / performans | `frontend-dev` + `qa-tester` | ✅ |
| Planlama / genel | `project-manager` | — |
| **Performans raporu** | `performance-reviewer` + `site-auditor` | ✅ |
| **Revizyon / düzeltme** | `revision-coordinator` | — |

---

## 📋 Standart İş Akışı

```
1. Kullanıcı isteği al
2. pnpm dispatch "<istek>" çalıştır
3. Dispatch pipeline çalışır:
   a. Intent tespiti
   b. Agent(lar) paralel/sıralı çalışır
   c. QA Tester inceler → BLOCKER varsa DUR (kullanıcıya sunma)
   d. PM inceler → ONAYLANMADI ise DUR (kullanıcıya sunma)
   e. "✅ QA ONAYLADI | PM ONAYLADI | YEŞİL IŞIK" görünce devam et
4. 📁 DOSYA DEĞİŞİKLİKLERİ bölümlerini uygula
5. TypeScript kontrolü: npx tsc --noEmit
6. Tarayıcıda doğrula (mümkünse)
7. git add + commit + push
```

⚠️ KURAL: "YEŞİL IŞIK" görünmeden hiçbir değişikliği uygulamak yasaktır.
QA blocker veya PM reddi varsa, düzelt → tekrar dispatch.

---

## 🏗️ Proje Yapısı

```
/export
├── packages/
│   ├── web/          # Next.js 14 App Router sitesi
│   │   └── app/      # Sayfalar (veriler, sektorler, rehberler)
│   ├── agents/       # Multi-agent sistemi
│   │   └── src/
│   │       ├── dispatch.ts      # ← Merkezi gateway
│   │       ├── orchestrator.ts  # ← Agent çalıştırıcı
│   │       ├── chat.ts          # ← İnteraktif CLI
│   │       ├── agents/          # ← 14 uzman agent
│   │       └── performance-tracker.ts  # ← Metrik loglama
│   └── remotion/     # Animasyon bileşenleri
└── data/
    ├── provinces/    # 11 il JSON (2020-2026)
    └── sectors/      # 9 sektör JSON
```

---

## 🤖 Agent Sorumlulukları

| Agent | Sorumluluk | Ne üretir |
|---|---|---|
| `project-manager` | Koordinasyon, önceliklendirme | Plan, görev listesi |
| `ux-designer` | Tasarım kararları | Renk, layout, spacing spec |
| `frontend-dev` | Kod değişikliği | Tailwind sınıfları, JSX |
| `data-analyst` | Veri üretimi | JSON dosyaları, istatistikler |
| `content-marketing` | İçerik yazımı | Türkçe metinler, açıklamalar |
| `senior-export-expert` | Domain bilgisi | İhracat terminolojisi, doğrulama |
| `seo-growth` | SEO optimizasyonu | Metadata, keyword önerileri |
| `qa-tester` | Kalite kontrol | Bug raporu, test senaryoları |
| `site-auditor` | Site denetimi (dosya okur) | Öncelikli sorunlar listesi |
| `market-intelligence` | Pazar analizi | Trend, fırsat raporları |
| `revision-coordinator` | **YENİ** Revizyon döngüsü | Red → revize → onayla (max 3 tur) |
| `performance-reviewer` | **YENİ** Metrik analizi | Dispatch istatistikleri, iyileştirme önerileri |

---

## 🛠️ Sık Kullanılan Komutlar

```bash
# Dispatch (her değişiklik için)
cd packages/agents && pnpm dispatch "isteğin buraya"

# Performans raporu (haftalık kontrol)
cd packages/agents && pnpm dispatch "performans raporu"

# Site denetimi
cd packages/agents && pnpm dispatch "site denetle"

# Revizyon talebi (içerik reddedilince)
cd packages/agents && pnpm dispatch "revize: <içerik>"

# İnteraktif chat
cd packages/agents && pnpm chat

# Geliştirme sunucusu
cd packages/web && pnpm dev

# TypeScript kontrol
cd packages/web && npx tsc --noEmit

# Commit & push
git add -A && git commit -m "feat: ..." && git push origin main
```

## 📋 Agent Çıktı Formatı

`frontend-dev`, `content-marketing`, `data-analyst`, `ux-designer`, `seo-growth` agentları artık her yanıtın sonuna şu bölümleri ekliyor:

```
### 📁 DOSYA DEĞİŞİKLİKLERİ
**Dosya:** `packages/web/app/...`
**Değişiklik:** [açıklama]
```tsx
// kod
```

### ✅ UYGULAMA SIRASI
- [ ] Adım 1
- [ ] Adım 2
```

Bu formatı görünce doğrudan uygula — `## DOSYA DEĞİŞİKLİKLERİ` bölümünü bul, ilgili dosyaya yaz.

---

## ⚠️ Önemli Notlar

- `.env` dosyası `packages/agents/.env` konumunda olmalı
- Remotion player'ın `ssr: false` olması zorunlu
- ProvincePlayer: `ProvincePlayerInner` ayrı dosyada — Remotion'a doğrudan component geç
- `data/provinces/*.json` — 2020-2026 yıllık ihracat verileri var
- `data/sectors/*.json` — 9 sektör: otomotiv, tekstil, makine, gıda, kimya, demir-celik, savunma, elektronik, insaat-malzemeleri
