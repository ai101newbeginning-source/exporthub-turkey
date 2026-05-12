import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { ExportHubOrchestrator } from "./orchestrator.js";

const apiKey = process.env.ANTHROPIC_API_KEY;
const orchestrator = new ExportHubOrchestrator(apiKey);

if (!apiKey) {
  console.log("⚠  API key yok — DEMO MODU aktif (mock yanıtlar kullanılıyor)\n");
}
const WEB_APP = join(process.cwd(), "../../packages/web/app");

async function step(label: string, fn: () => Promise<string>) {
  console.log(`\n${"─".repeat(60)}\n▶ ${label}\n${"─".repeat(60)}`);
  const out = await fn();
  console.log(out.slice(0, 500) + (out.length > 500 ? "\n…" : ""));
  return out;
}

// ── 1. /sektorler sayfası ──────────────────────────────────────
async function buildSektorlerPage() {
  const sectorData = `Mevcut sektör verileri (data/sectors/):
- otomotiv: 32.4 milyar USD, %11.3 büyüme, topIller: Kocaeli/Bursa/Sakarya
- tekstil: 21.8 milyar USD, topIller: İstanbul/Bursa/Denizli
- makine: 19.2 milyar USD, topIller: İstanbul/Ankara/İzmir`;

  const result = await step(
    "Frontend Dev → /sektorler sayfası",
    () => orchestrator.runAgent(
      "frontend-dev",
      `Next.js 14 App Router için /sektorler sayfasını yaz.

Mevcut veri yapısı (data/sectors/otomotiv.json örneği):
{
  "id": "otomotiv",
  "ad": "Otomotiv ve Yan Sanayi",
  "toplamIhracat2024": 32.4,
  "birim": "milyar USD",
  "buyumeOrani2024": 11.3,
  "topIller": ["Kocaeli","Bursa","Sakarya","İstanbul","Ankara"],
  "topUlkeler": ["Almanya","Fransa","İtalya","İspanya","Romanya"],
  "urunGruplari": [{"ad":"Binek Araçlar","pay":44}, {"ad":"Otomotiv Parçaları","pay":31}, {"ad":"Ticari Araçlar","pay":25}],
  "aciklama": "..."
}

Aynı yapıda tekstil.json ve makine.json var.

GÖREV: packages/web/app/sektorler/page.tsx dosyasının TAM içeriğini yaz.
Gereksinimler:
- Server Component, readFileSync ile data/sectors/*.json oku
- path: join(process.cwd(), "../../data/sectors")
- Metadata export et
- Her sektör için kart: ad, toplamIhracat2024, buyumeOrani2024, aciklama, topIller (ilk 3)
- Tailwind: card-dark class kullan (mevcut tasarımla uyumlu)
- Hover effects, responsive grid (1/2/3 sütun)
- Sadece TSX kodu, açıklama yok`,
      { context: sectorData }
    ).then(r => r.output)
  );
  return result;
}

// ── 2. Rehber detay içeriği ───────────────────────────────────
async function buildRehberContent() {
  const result = await step(
    "Senior Export Expert → İlk İhracat Rehberi içeriği",
    () => orchestrator.processTask({
      from: "user",
      to: "content-marketing",
      taskType: "write_article",
      requiresApproval: ["senior-export-expert"],
      payload: {
        instruction: `"İlk İhracat Nasıl Yapılır? 10 Adımda Başlangıç" başlıklı rehberin TÜRKÇE içeriğini yaz.

Format: Markdown değil, Next.js JSX için uygun bir JSON yapısı döndür:
{
  "slug": "ilk-ihracat",
  "baslik": "...",
  "ozet": "...",
  "kategori": "Başlangıç",
  "okumaSuresi": 12,
  "adimlar": [
    {"numara": 1, "baslik": "...", "icerik": "... (2-3 cümle)"},
    ...10 adım...
  ],
  "ozHususlar": ["...", "...", "..."],
  "kaynaklar": ["TÜİK", "TİM", "Ticaret Bakanlığı"]
}

Gerçek, pratik ihracat bilgisi ver. Türkçe yaz.`,
      },
    }).then(r => r.output)
  );
  return result;
}

// ── 3. /rehberler/[slug] sayfa şablonu ───────────────────────
async function buildRehberPage() {
  const result = await step(
    "Frontend Dev → /rehberler/[slug] sayfa şablonu",
    () => orchestrator.runAgent(
      "frontend-dev",
      `Next.js 14 App Router için /rehberler/[slug]/page.tsx yaz.

Veri kaynağı: packages/web/lib/rehberler.ts dosyasından import edilecek (statik veri objesi).
Veri tipi:
interface Adim { numara: number; baslik: string; icerik: string; }
interface Rehber {
  slug: string; baslik: string; ozet: string; kategori: string;
  okumaSuresi: number; adimlar: Adim[]; ozHususlar: string[]; kaynaklar: string[];
}

GÖREV: packages/web/app/rehberler/[slug]/page.tsx TAM içeriğini yaz.
Gereksinimler:
- Server Component
- import { getRehber } from "@/lib/rehberler"
- notFound() eğer slug yoksa
- Metadata export
- Hero: başlık, kategori badge, okuma süresi, özet
- Adımlar: numaralı liste, baslik + icerik
- Özel Hususlar: uyarı kutusu
- Kaynaklar: footer kısmında
- Tailwind card-dark, turkish-red renk paleti
- Sadece TSX kodu`,
    ).then(r => r.output)
  );
  return result;
}

async function main() {
  console.log("ExportHub Sayfaları Oluşturuluyor — Agent Pipeline\n");

  const [sektorlerCode, rehberContent, rehberPageCode] = await Promise.all([
    buildSektorlerPage(),
    buildRehberContent(),
    buildRehberPage(),
  ]);

  console.log("\n" + "═".repeat(60));
  console.log("AGENT ÇIKTILARI HAZIR — dosyalar yazılıyor...");
  console.log("═".repeat(60));

  // sektorler çıktısını kaydet
  writeFileSync("/tmp/agent_sektorler.txt", sektorlerCode);
  writeFileSync("/tmp/agent_rehber_content.txt", rehberContent);
  writeFileSync("/tmp/agent_rehber_page.txt", rehberPageCode);

  console.log("\n✓ /tmp/agent_sektorler.txt");
  console.log("✓ /tmp/agent_rehber_content.txt");
  console.log("✓ /tmp/agent_rehber_page.txt");
  console.log("\nSonraki adım: çıktıları parse edip dosyalara yaz.");
}

main().catch(console.error);
