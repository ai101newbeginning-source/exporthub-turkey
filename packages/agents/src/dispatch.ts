#!/usr/bin/env tsx
/**
 * dispatch.ts — ExportHub merkezi istek yönlendirici
 *
 * Kullanım:
 *   pnpm dispatch "renkleri değiştir"
 *   pnpm dispatch "istanbul 2026 verisi ekle"
 *   pnpm dispatch "seo optimize et"
 *   pnpm dispatch "site denetle"
 *
 * Akış:
 *   İstek → PM intent tespiti → agent seçimi → paralel çalışma → QA → output
 */

import { ExportHubOrchestrator } from "./orchestrator.js";
import * as readline from "readline";

const INTENT_ROUTES: Record<
  string,
  { agents: string[]; parallel: boolean; qaRequired: boolean; desc: string }
> = {
  tasarim: {
    agents: ["ux-designer", "frontend-dev"],
    parallel: true,
    qaRequired: true,
    desc: "Tasarım, renkler, layout, UI/UX değişiklikleri",
  },
  veri: {
    agents: ["data-analyst"],
    parallel: false,
    qaRequired: false,
    desc: "Veri üretimi, JSON güncelleme, istatistik",
  },
  icerik: {
    agents: ["content-marketing", "senior-export-expert"],
    parallel: true,
    qaRequired: false,
    desc: "Metin, açıklama, FAQ, Türkçe içerik",
  },
  seo: {
    agents: ["seo-growth", "content-marketing"],
    parallel: true,
    qaRequired: false,
    desc: "SEO, metadata, arama optimizasyonu",
  },
  denetim: {
    agents: ["site-auditor", "qa-tester"],
    parallel: true,
    qaRequired: false,
    desc: "Site denetimi, kalite kontrol",
  },
  ozellik: {
    agents: ["project-manager", "frontend-dev", "data-analyst"],
    parallel: false,
    qaRequired: true,
    desc: "Yeni özellik geliştirme",
  },
  performans: {
    agents: ["frontend-dev", "qa-tester"],
    parallel: true,
    qaRequired: false,
    desc: "Performans, animasyon, bundle optimizasyonu",
  },
  genel: {
    agents: ["project-manager"],
    parallel: false,
    qaRequired: false,
    desc: "Genel sorular, planlama",
  },
};

const ROUTER_SYSTEM_PROMPT = `Sen ExportHub Türkiye projesinin akıllı istek yönlendiricisisin.

Kullanıcı isteğini analiz et ve EN UYGUN intent kategorisini seç:
- tasarim: Renk, font, layout, CSS, UI/UX, görsel tasarım
- veri: Sayısal veri, JSON, istatistik, il/sektör verisi ekleme
- icerik: Metin yazma, açıklama, FAQ, Türkçe içerik
- seo: Metadata, arama, başlık, açıklama optimizasyonu
- denetim: Site denetimi, test, kalite kontrol, bug raporu
- ozellik: Tamamen yeni sayfa, bileşen veya sistem özelliği
- performans: Animasyon, yükleme hızı, bundle, Core Web Vitals
- genel: Planlama, koordinasyon, genel soru

Sadece şu JSON formatında yanıt ver (başka hiçbir şey yazma):
{"intent":"<kategori>","reason":"<neden bu kategori, 1 cümle>"}`;

async function detectIntent(
  orchestrator: ExportHubOrchestrator,
  request: string
): Promise<string> {
  try {
    const result = await orchestrator.runAgent(
      "project-manager",
      `İstek: "${request}"\n\nYukarıdaki sisteme göre intent JSON'u döndür.`
    );
    const match = result.output.match(/\{[^}]+\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return parsed.intent ?? "genel";
    }
  } catch {
    // fallback: keyword matching
  }

  // Keyword fallback
  const req = request.toLowerCase();
  if (/renk|tasarım|css|font|layout|dark|light|tema|görün/.test(req)) return "tasarim";
  if (/veri|json|data|istatistik|rakam|sayı|il|sektör ekle|güncelle/.test(req)) return "veri";
  if (/yaz|metin|içerik|açıklama|faq|rehber|türkçe/.test(req)) return "icerik";
  if (/seo|meta|başlık|arama|google|index/.test(req)) return "seo";
  if (/denetim|test|audit|kontrol|bug|hata/.test(req)) return "denetim";
  if (/animasyon|performans|hız|yükleme|bundle/.test(req)) return "performans";
  return "genel";
}

async function dispatch(request: string): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const orchestrator = new ExportHubOrchestrator(apiKey);

  console.log("\n═══════════════════════════════════════════");
  console.log("🎯  ExportHub Dispatch");
  console.log("═══════════════════════════════════════════");
  console.log(`📥  İstek: ${request}\n`);

  // 1. Intent tespiti
  console.log("🔍  Intent tespit ediliyor...");
  const intent = await detectIntent(orchestrator, request);
  const route = INTENT_ROUTES[intent] ?? INTENT_ROUTES.genel;

  console.log(`✅  Intent: ${intent} — ${route.desc}`);
  console.log(`🤖  Agent pipeline: ${route.agents.join(" → ")}\n`);
  console.log("─".repeat(43));

  const results: Record<string, string> = {};

  // 2. Agent'ları çalıştır
  if (route.parallel && route.agents.length > 1) {
    console.log("⚡  Paralel çalışma başlatılıyor...\n");
    const tasks = route.agents.map(async (agentId) => {
      console.log(`  ▶ ${agentId} başladı`);
      const result = await orchestrator.runAgent(agentId as any, request);
      console.log(`  ✓ ${agentId} tamamlandı`);
      results[agentId] = result.output;
    });
    await Promise.all(tasks);
  } else {
    for (const agentId of route.agents) {
      console.log(`  ▶ ${agentId} çalışıyor...`);
      const result = await orchestrator.runAgent(agentId as any, request);
      console.log(`  ✓ ${agentId} tamamlandı`);
      results[agentId] = result.output;
    }
  }

  // 3. QA kontrolü
  if (route.qaRequired) {
    console.log("\n🔬  QA Tester doğruluyor...");
    const qaInput = `Şu agent çıktılarını ExportHub Türkiye projesi için kalite ve tutarlılık açısından değerlendir:\n\n${Object.entries(results)
      .map(([id, out]) => `[${id}]\n${out}`)
      .join("\n\n")}`;
    const qaResult = await orchestrator.runAgent("qa-tester", qaInput);
    results["qa-tester"] = qaResult.output;
    console.log("  ✓ QA tamamlandı");
  }

  // 4. Output
  console.log("\n═══════════════════════════════════════════");
  console.log("📋  AGENT ÇIKTILARI");
  console.log("═══════════════════════════════════════════\n");

  for (const [agentId, output] of Object.entries(results)) {
    console.log(`┌─ ${agentId.toUpperCase()} ${"─".repeat(Math.max(0, 35 - agentId.length))}┐`);
    console.log(output.trim());
    console.log(`└${"─".repeat(43)}┘\n`);
  }

  console.log("═══════════════════════════════════════════");
  console.log("✅  Dispatch tamamlandı. Yukarıdaki çıktıları uygula.");
  console.log("═══════════════════════════════════════════\n");
}

// CLI veya interaktif mod
const args = process.argv.slice(2);
if (args.length > 0) {
  dispatch(args.join(" ")).catch(console.error);
} else {
  // İnteraktif mod
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("\n🚀  ExportHub Dispatch — İnteraktif Mod");
  console.log('   İsteğinizi yazın veya "exit" ile çıkın\n');

  const ask = () => {
    rl.question("📥 İstek: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }
      if (input.trim()) await dispatch(input.trim());
      ask();
    });
  };
  ask();
}
