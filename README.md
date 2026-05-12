# ExportHub Türkiye

Türkiye merkezli, veri odaklı ihracat platformu. Multi-agent sistemi + Next.js + Remotion animasyonları.

## Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# .env dosyasını oluştur
cp .env.example .env
# ANTHROPIC_API_KEY değerini .env dosyasına ekle

# Geliştirme sunucusu
pnpm dev
```

## Paketler

| Paket | Açıklama |
|-------|----------|
| `packages/agents` | 10 Claude agent + orchestrator |
| `packages/web` | Next.js 14 App Router sitesi |
| `packages/remotion` | Veri animasyonu kompozisyonları |

## Agent Sistemi Kullanımı

```bash
# Agent CLI — Proje Yöneticisine soru sor
pnpm agents "Gaziantep ihracatı için içerik stratejisi öner"

# Veya özel mesajla
pnpm --filter agents dev "İstanbul tekstil sektörü analizi yap"
```

## Remotion Preview

```bash
pnpm --filter @export-hub/remotion preview
```

## API Endpoints

- `GET /api/data/[il]` — İl ihracat verisi (istanbul, kocaeli, bursa, gaziantep, izmir)
- `GET /api/agents` — Agent listesi
- `POST /api/agents` — Agent'a mesaj gönder (`{ message, agentId? }`)

## Agent Ekibi

| Agent | Model | Rol |
|-------|-------|-----|
| project-manager | claude-opus-4-7 | Koordinasyon |
| senior-export-expert | claude-sonnet-4-6 | Teknik doğruluk |
| market-intelligence | claude-sonnet-4-6 | Lead & pazar |
| content-marketing | claude-sonnet-4-6 | İçerik üretimi |
| seo-growth | claude-sonnet-4-6 | SEO optimizasyonu |
| data-analyst | claude-sonnet-4-6 | Veri analizi |
| frontend-dev | claude-sonnet-4-6 | UI bileşenleri |
| backend-dev | claude-sonnet-4-6 | API & DB mimarisi |
| qa-tester | claude-sonnet-4-6 | Test & kalite |
| remotion-specialist | claude-sonnet-4-6 | Veri animasyonları |
| ux-designer | claude-sonnet-4-6 | UX tasarımı & erişilebilirlik (frontend'den önce) |

## Veri Kaynakları

Statik JSON veriler `data/` dizininde. Gerçek entegrasyon için:
- TÜİK API: `https://data.tuik.gov.tr/api/`
- TİM verileri: `https://tim.org.tr`
