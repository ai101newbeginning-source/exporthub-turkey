import "dotenv/config";
import * as readline from "readline";
import { ExportHubOrchestrator } from "./orchestrator.js";
import type { AgentId } from "./types.js";

const apiKey = process.env.ANTHROPIC_API_KEY;
const orchestrator = new ExportHubOrchestrator(apiKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    rl.once("line", resolve);
  });
}

const AGENT_ALIASES: Record<string, AgentId> = {
  pm: "project-manager",
  yönetici: "project-manager",
  manager: "project-manager",
  auditor: "site-auditor",
  denetçi: "site-auditor",
  ux: "ux-designer",
  tasarımcı: "ux-designer",
  seo: "seo-growth",
  içerik: "content-marketing",
  content: "content-marketing",
  veri: "data-analyst",
  data: "data-analyst",
  frontend: "frontend-dev",
  backend: "backend-dev",
  qa: "qa-tester",
  remotion: "remotion-specialist",
  uzman: "senior-export-expert",
  pazar: "market-intelligence",
};

function printHelp() {
  console.log(`
  Komutlar:
    /ajan <id>    — Konuştuğun ajanı değiştir (varsayılan: project-manager)
    /ajanlar      — Tüm ajanları listele
    /site-denetle — Site Denetçisi'nden tam site analizi iste
    /yardım       — Bu mesajı göster
    çıkış / exit  — Programı kapat
`);
}

async function main() {
  console.log("\n╔═══════════════════════════════════════════════════╗");
  console.log("║     ExportHub Türkiye — Orchestrator Chat         ║");
  console.log("╚═══════════════════════════════════════════════════╝\n");

  if (!apiKey) {
    console.log("⚠  DEMO MODU — ANTHROPIC_API_KEY tanımlı değil.\n");
  }

  console.log("Ajan ekibiyle doğrudan konuşabilirsiniz.");
  console.log("Varsayılan ajan: Proje Yöneticisi (Opus 4.7)");
  printHelp();

  let currentAgent: AgentId = "project-manager";
  const agentList = orchestrator.getAgentList();

  while (true) {
    const agentName = agentList.find((a) => a.id === currentAgent)?.nameTR ?? currentAgent;
    const input = await ask(`\nSen → ${agentName}: `);
    const trimmed = input.trim();

    if (!trimmed) continue;

    if (["çıkış", "exit", "quit", "q"].includes(trimmed.toLowerCase())) {
      console.log("\nGörüşmek üzere! 👋\n");
      break;
    }

    if (trimmed === "/yardım" || trimmed === "/help") {
      printHelp();
      continue;
    }

    if (trimmed === "/ajanlar") {
      console.log("\nMevcut ajanlar:");
      for (const a of agentList) {
        const marker = a.id === currentAgent ? " ◄ aktif" : "";
        console.log(`  ${a.id.padEnd(22)} ${a.nameTR}${marker}`);
      }
      continue;
    }

    if (trimmed.startsWith("/ajan ")) {
      const target = trimmed.slice(6).trim().toLowerCase();
      const resolved = AGENT_ALIASES[target] ?? (target as AgentId);
      if (agentList.some((a) => a.id === resolved)) {
        currentAgent = resolved;
        const name = agentList.find((a) => a.id === resolved)!.nameTR;
        console.log(`\nAjan değiştirildi: ${name}`);
      } else {
        console.log(`\n⚠ Bilinmeyen ajan: "${target}". /ajanlar ile listeyi gör.`);
      }
      continue;
    }

    if (trimmed === "/site-denetle") {
      console.log("\n[Site Denetçisi] Tam site analizi başlatılıyor...\n");
      const result = await orchestrator.runAgent(
        "site-auditor",
        `ExportHub Türkiye sitesini (/, /veriler, /veriler/[il], /sektorler, /sektorler/[sektor], /rehberler, /rehberler/[slug]) tüm sayfaları için eksiksiz denetle. Her sayfa için güçlü yönler, kritik boşluklar, büyüme fikirleri ve SEO notunu ver.`
      );
      console.log(result.output);
      continue;
    }

    console.log(`\n[${agentName}]\n`);
    const result = await orchestrator.runAgent(currentAgent, trimmed);
    console.log(result.output);
  }

  rl.close();
}

main().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
