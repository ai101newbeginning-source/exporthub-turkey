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
 *   İstek → PM intent tespiti → agent seçimi → paralel çalışma
 *        → QA kontrolü (blocker var mı?) → PM onayı → output
 *
 * Site değiştiren tüm intents'te QA + PM onayı zorunludur.
 * QA blocker bulursa veya PM onaylamazsa çıktı kullanıcıya sunulmaz.
 */

import "dotenv/config";
import { ExportHubOrchestrator } from "./orchestrator.js";
import { logTask } from "./performance-tracker.js";
import * as readline from "readline";

interface RouteConfig {
  agents: string[];
  parallel: boolean;
  qaRequired: boolean;
  orchestratorApproval: boolean;
  desc: string;
}

// orchestratorApproval: true olan intents'lerde QA + PM onayı zorunlu.
// Her ikisi de geçmeden çıktı kullanıcıya sunulmaz.
const INTENT_ROUTES: Record<string, RouteConfig> = {
  tasarim: {
    agents: ["ux-designer", "frontend-dev"],
    parallel: true,
    qaRequired: true,
    orchestratorApproval: true,
    desc: "Tasarım, renkler, layout, UI/UX değişiklikleri",
  },
  veri: {
    agents: ["data-analyst"],
    parallel: false,
    qaRequired: true,
    orchestratorApproval: true,
    desc: "Veri üretimi, JSON güncelleme, istatistik",
  },
  icerik: {
    agents: ["content-marketing", "senior-export-expert"],
    parallel: true,
    qaRequired: true,
    orchestratorApproval: true,
    desc: "Metin, açıklama, FAQ, Türkçe içerik",
  },
  seo: {
    agents: ["seo-growth", "content-marketing"],
    parallel: true,
    qaRequired: true,
    orchestratorApproval: true,
    desc: "SEO, metadata, arama optimizasyonu",
  },
  denetim: {
    agents: ["site-auditor", "qa-tester"],
    parallel: true,
    qaRequired: false,
    orchestratorApproval: false,
    desc: "Site denetimi, kalite kontrol (salt analiz)",
  },
  ozellik: {
    agents: ["project-manager", "frontend-dev", "data-analyst"],
    parallel: false,
    qaRequired: true,
    orchestratorApproval: true,
    desc: "Yeni özellik geliştirme",
  },
  performans: {
    agents: ["frontend-dev", "qa-tester"],
    parallel: true,
    qaRequired: true,
    orchestratorApproval: true,
    desc: "Performans, animasyon, bundle optimizasyonu",
  },
  genel: {
    agents: ["project-manager"],
    parallel: false,
    qaRequired: false,
    orchestratorApproval: false,
    desc: "Genel sorular, planlama",
  },
  rapor: {
    agents: ["performance-reviewer", "site-auditor"],
    parallel: true,
    qaRequired: false,
    orchestratorApproval: false,
    desc: "Performans raporu ve site denetimi",
  },
  revize: {
    agents: ["revision-coordinator"],
    parallel: false,
    qaRequired: false,
    orchestratorApproval: false,
    desc: "Reddedilen içeriği revize et",
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

SADECE şu 10 kategoriden birini seç, başka kategori üretme:
tasarim | veri | icerik | seo | denetim | ozellik | performans | genel | rapor | revize

Sadece şu JSON formatında yanıt ver (başka hiçbir şey yazma):
{"intent":"<kategori>","reason":"<neden bu kategori, 1 cümle>"}`;

const VALID_INTENTS = new Set(Object.keys(INTENT_ROUTES));

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
      const intent = parsed.intent as string;
      // Sadece geçerli route'ları kabul et
      if (intent && VALID_INTENTS.has(intent)) return intent;
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
  if (/denet|test|audit|kontrol|bug|hata/.test(req)) return "denetim";
  if (/animasyon|performans|hız|yükleme|bundle/.test(req)) return "performans";
  if (/rapor|performans raporu|metrik|istatistik|özet/.test(req)) return "rapor";
  if (/revize|revizyon|düzelt|red|reddedil/.test(req)) return "revize";
  return "genel";
}

async function dispatch(request: string): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const orchestrator = new ExportHubOrchestrator(apiKey);
  const startTime = Date.now();

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

  // 3. QA Kontrolü — blocker varsa dur
  let qaApproved = true;
  let qaOutput = "";
  if (route.qaRequired) {
    console.log("\n🔬  QA Tester inceliyor...");
    const qaInput = [
      `İstek: "${request}"`,
      `\nAgent çıktılarını ExportHub Türkiye projesi için incele.`,
      `Kritik bir sorun (blocker) varsa "BLOCKER:" ön ekiyle belirt.`,
      `Sorun yoksa "QA ONAYLANDI" ile başla.\n`,
      ...Object.entries(results).map(([id, out]) => `[${id}]\n${out}`),
    ].join("\n\n");

    const qaResult = await orchestrator.runAgent("qa-tester", qaInput);
    qaOutput = qaResult.output;
    results["qa-tester"] = qaOutput;

    const hasBlocker = /BLOCKER:|KRİTİK HATA:|ENGEL:|STOP:/i.test(qaOutput);
    if (hasBlocker) {
      qaApproved = false;
      console.log("  ✗ QA — KRİTİK SORUN BULUNDU");
    } else {
      console.log("  ✓ QA geçti");
    }
  }

  // QA blocker — kullanıcıya çıktı gösterme, sadece QA raporunu sun
  if (!qaApproved) {
    console.log("\n" + "═".repeat(43));
    console.log("🚫  QA BLOCKER — ÇIKTI DURDURULDU");
    console.log("═".repeat(43));
    console.log("\nAşağıdaki sorunlar giderilmeden değişiklikler uygulanamaz:\n");
    console.log(qaOutput.trim());
    console.log("\n" + "─".repeat(43));
    console.log("💡  Sorunu giderip tekrar dispatch çalıştırın.");
    console.log("═".repeat(43) + "\n");
    logMetric({ intent, agents: route.agents, startTime, approved: false, revisionCount: 0, results });
    return;
  }

  // 4. Orchestrator (PM) Onayı — PM onaylamazsa dur
  let pmApproved = true;
  let pmOutput = "";
  if (route.orchestratorApproval) {
    console.log("\n🏛️  Proje Yöneticisi onay veriyor...");
    const pmInput = [
      `İstek: "${request}"`,
      `\nAşağıdaki agent çıktılarını ve QA raporunu gözden geçir.`,
      `Uygulamaya hazır mı? "ONAYLANDI" veya "ONAYLANMADI: <gerekçe>" ile yanıtla.\n`,
      ...Object.entries(results).map(([id, out]) => `[${id}]\n${out}`),
    ].join("\n\n");

    const pmResult = await orchestrator.runAgent("project-manager", pmInput);
    pmOutput = pmResult.output;

    pmApproved = /ONAYLANDI/i.test(pmOutput) && !/ONAYLANMADI/i.test(pmOutput);
    if (pmApproved) {
      console.log("  ✓ PM onayladı");
    } else {
      console.log("  ✗ PM — ONAYLAMADI");
    }
  }

  // PM onaylamadı — itirazlarını göster, çıktı sunma
  if (!pmApproved) {
    console.log("\n" + "═".repeat(43));
    console.log("⛔  PM ONAYI REDDEDİLDİ — ÇIKTI DURDURULDU");
    console.log("═".repeat(43));
    console.log("\nProje Yöneticisi'nin itirazları:\n");
    console.log(pmOutput.trim());
    console.log("\n" + "─".repeat(43));
    console.log("💡  İtirazları giderip tekrar dispatch çalıştırın.");
    console.log("═".repeat(43) + "\n");
    logMetric({ intent, agents: route.agents, startTime, approved: false, revisionCount: 0, results });
    return;
  }

  // 5. Tüm kapılar geçildi — çıktıyı sun
  console.log("\n" + "═".repeat(43));
  console.log("✅  QA ONAYLADI  |  PM ONAYLADI  |  YEŞİL IŞIK");
  console.log("═".repeat(43));
  console.log("📋  AGENT ÇIKTILARI — UYGULAMAYA HAZIR\n");

  // QA ve PM çıktılarını ayrı göster, asıl agent çıktılarını öne çıkar
  const reviewAgents = new Set(["qa-tester", "project-manager"]);
  for (const [agentId, output] of Object.entries(results)) {
    if (reviewAgents.has(agentId)) continue;
    console.log(`┌─ ${agentId.toUpperCase()} ${"─".repeat(Math.max(0, 35 - agentId.length))}┐`);
    console.log(output.trim());
    console.log(`└${"─".repeat(43)}┘\n`);
  }

  if (results["qa-tester"]) {
    console.log("─".repeat(43));
    console.log("🔬  QA NOTU:");
    console.log(results["qa-tester"].trim());
  }

  console.log("\n" + "═".repeat(43));
  console.log("⬆️  Yukarıdaki 📁 DOSYA DEĞİŞİKLİKLERİ bölümlerini uygula.");
  console.log("═".repeat(43) + "\n");

  logMetric({ intent, agents: route.agents, startTime, approved: true, revisionCount: 0, results });
}

function logMetric(opts: {
  intent: string;
  agents: string[];
  startTime: number;
  approved: boolean;
  revisionCount: number;
  results: Record<string, string>;
}): void {
  const totalOutput = Object.values(opts.results).join("");
  try {
    logTask({
      timestamp: new Date().toISOString(),
      intent: opts.intent,
      agents: opts.agents,
      durationMs: Date.now() - opts.startTime,
      approved: opts.approved,
      revisionCount: opts.revisionCount,
      outputLength: totalOutput.length,
    });
  } catch {
    // Metrik kaydı başarısız olursa dispatch'i engelleme
  }
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
