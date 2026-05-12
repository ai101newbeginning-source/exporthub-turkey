import "dotenv/config";
import { ExportHubOrchestrator } from "./orchestrator.js";

const apiKey = process.env.ANTHROPIC_API_KEY;
const orchestrator = new ExportHubOrchestrator(apiKey);

if (!apiKey) {
  console.log("⚠  DEMO MODU — ANTHROPIC_API_KEY tanımlı değil. Mock yanıtlar kullanılıyor.\n");
}

async function main() {
  console.log("ExportHub Türkiye — Multi-Agent Sistemi Başlatıldı\n");
  console.log("Ekip üyeleri:");
  for (const agent of orchestrator.getAgentList()) {
    console.log(`  • ${agent.nameTR} (${agent.id}) — ${agent.model}`);
  }
  console.log("");

  const userRequest =
    process.argv[2] ??
    "Projenin ilk aşaması için yol haritasını çıkar. Hangi ilden başlamalıyız?";

  console.log(`Kullanıcı sorusu: "${userRequest}"\n`);
  console.log("Proje Yöneticisi yanıt veriyor...\n");
  console.log("─".repeat(60));

  const result = await orchestrator.askProjectManager(userRequest);
  console.log(result.output);
  console.log("─".repeat(60));
}

main().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
