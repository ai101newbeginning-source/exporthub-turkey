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
 *   İstek → keyword intent tespiti → PM Orchestrator
 *        → PM agentları sıralı çalıştırır (delegate_task)
 *        → QA gate (değişiklik içeren intents'te)
 *        → output
 */

import "dotenv/config";
import { ExportHubOrchestrator } from "./orchestrator.js";
import { logTask } from "./performance-tracker.js";
import * as readline from "readline";

interface RouteConfig {
  agents: string[];
  qaRequired: boolean;
  desc: string;
}

const INTENT_ROUTES: Record<string, RouteConfig> = {
  tasarim: {
    agents: ["ux-designer", "frontend-dev"],
    qaRequired: true,
    desc: "Tasarım, renkler, layout, UI/UX değişiklikleri",
  },
  veri: {
    agents: ["data-analyst"],
    qaRequired: true,
    desc: "Veri üretimi, JSON güncelleme, istatistik",
  },
  icerik: {
    agents: ["content-marketing", "senior-export-expert"],
    qaRequired: true,
    desc: "Metin, açıklama, FAQ, Türkçe içerik",
  },
  seo: {
    agents: ["seo-growth", "content-marketing"],
    qaRequired: true,
    desc: "SEO, metadata, arama optimizasyonu",
  },
  denetim: {
    agents: ["site-auditor", "qa-tester"],
    qaRequired: false,
    desc: "Site denetimi, kalite kontrol (salt analiz)",
  },
  ozellik: {
    agents: ["frontend-dev", "data-analyst"],
    qaRequired: true,
    desc: "Yeni özellik geliştirme",
  },
  performans: {
    agents: ["frontend-dev", "qa-tester"],
    qaRequired: true,
    desc: "Performans, animasyon, bundle optimizasyonu",
  },
  genel: {
    agents: [],
    qaRequired: false,
    desc: "Genel sorular, planlama",
  },
  rapor: {
    agents: ["performance-reviewer", "site-auditor"],
    qaRequired: false,
    desc: "Performans raporu ve site denetimi",
  },
  revize: {
    agents: ["revision-coordinator"],
    qaRequired: false,
    desc: "Reddedilen içeriği revize et",
  },
};

function detectIntent(request: string): Promise<string> {
  const req = request.toLowerCase();
  if (/renk|tasarım|css|font|layout|dark|light|tema|görün|link|bileşen|nav|footer|ui|ux/.test(req)) return Promise.resolve("tasarim");
  if (/veri|json|data|istatistik|rakam|sayı|il|sektör ekle|güncelle/.test(req)) return Promise.resolve("veri");
  if (/yaz|metin|içerik|açıklama|faq|türkçe/.test(req)) return Promise.resolve("icerik");
  if (/seo|meta|başlık|arama|google|index|robots|canonical/.test(req)) return Promise.resolve("seo");
  if (/denet|test|audit|kontrol|bug|hata/.test(req)) return Promise.resolve("denetim");
  if (/animasyon|performans|hız|yükleme|bundle|core web/.test(req)) return Promise.resolve("performans");
  if (/rapor|performans raporu|metrik|özet/.test(req)) return Promise.resolve("rapor");
  if (/revize|revizyon|düzelt|red|reddedil/.test(req)) return Promise.resolve("revize");
  if (/rehber|özellik|yeni sayfa|yeni bileşen/.test(req)) return Promise.resolve("ozellik");
  return Promise.resolve("genel");
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
  const intent = await detectIntent(request);
  const route = INTENT_ROUTES[intent] ?? INTENT_ROUTES.genel;

  console.log(`✅  Intent: ${intent} — ${route.desc}`);
  console.log(`🤖  Agent pipeline: ${route.agents.join(" → ")}\n`);
  console.log("─".repeat(43));

  const results: Record<string, string> = {};

  // 2. PM Orchestrator — agentları sıralı çalıştırır
  console.log("🏛️  PM Orchestrator devreye alıyor...\n");
  const pmInstruction = route.agents.length > 0
    ? [
        `İstek: "${request}"`,
        `Intent: ${intent} — ${route.desc}`,
        `Çalıştırılacak agentlar (sırayla): ${route.agents.join(" → ")}`,
        `\nBu agentları delegate_task ile SIRAYLA çağır. Her agentin çıktısını bir sonrakine context olarak geç.`,
      ].join("\n")
    : `İstek: "${request}"\n\nBu genel bir sorudur. Kendi bilginle yanıtla.`;

  const pmResult = await orchestrator.runAgent("project-manager", pmInstruction);
  results["project-manager"] = pmResult.output;
  console.log("  ✓ Orchestrasyon tamamlandı");

  // 3. QA Gate — değişiklik içeren intents'te blocker kontrolü
  let qaApproved = true;
  let qaOutput = "";
  if (route.qaRequired) {
    console.log("\n🔬  QA Tester inceliyor...");
    const qaInput = [
      `İstek: "${request}"`,
      `\nAşağıdaki agent çıktısını incele. BLOCKER varsa "BLOCKER:" ile belirt. Yoksa "QA ONAYLANDI" ile başla.\n`,
      pmResult.output,
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

  // QA blocker — çıktıyı durdur
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

  // 4. Çıktıyı sun
  console.log("\n" + "═".repeat(43));
  if (route.qaRequired) {
    console.log("✅  QA ONAYLADI  |  YEŞİL IŞIK");
  } else {
    console.log("✅  YEŞİL IŞIK");
  }
  console.log("═".repeat(43));
  console.log("📋  ÇIKTI — UYGULAMAYA HAZIR\n");

  console.log(pmResult.output.trim());

  if (results["qa-tester"]) {
    console.log("\n" + "─".repeat(43));
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
