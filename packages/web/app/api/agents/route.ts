import { NextResponse } from "next/server";
import { ExportHubOrchestrator } from "@export-hub/agents";

export async function POST(request: Request) {
  let body: { message?: string; agentId?: string };
  try {
    body = await request.json() as { message?: string; agentId?: string };
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }

  const { message, agentId } = body;

  if (!message || typeof message !== "string" || message.length > 2000) {
    return NextResponse.json({ error: "Geçersiz mesaj" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const orchestrator = new ExportHubOrchestrator(apiKey);
  const isDemo = !apiKey;

  const result = agentId
    ? await orchestrator.runAgent(agentId as Parameters<typeof orchestrator.runAgent>[0], message)
    : await orchestrator.askProjectManager(message);

  return NextResponse.json({
    agentId: result.agentId,
    output: result.output,
    approved: result.approved,
    demo: isDemo,
  });
}

export async function GET() {
  return NextResponse.json({
    agents: [
      { id: "project-manager", nameTR: "Proje Yöneticisi", model: "claude-opus-4-7" },
      { id: "senior-export-expert", nameTR: "Kıdemli İhracat Uzmanı", model: "claude-sonnet-4-6" },
      { id: "market-intelligence", nameTR: "Dış Ticaret Uzmanı", model: "claude-sonnet-4-6" },
      { id: "content-marketing", nameTR: "İçerik Ekibi", model: "claude-sonnet-4-6" },
      { id: "seo-growth", nameTR: "Büyüme Uzmanı", model: "claude-sonnet-4-6" },
      { id: "data-analyst", nameTR: "Veri Analisti", model: "claude-sonnet-4-6" },
      { id: "frontend-dev", nameTR: "Frontend Geliştirici", model: "claude-sonnet-4-6" },
      { id: "backend-dev", nameTR: "Backend Geliştirici", model: "claude-sonnet-4-6" },
      { id: "qa-tester", nameTR: "Kalite Güvence Uzmanı", model: "claude-sonnet-4-6" },
      { id: "remotion-specialist", nameTR: "Remotion Animasyon Uzmanı", model: "claude-sonnet-4-6" },
      { id: "ux-designer", nameTR: "UX/UI Tasarımcı ve Erişilebilirlik Uzmanı", model: "claude-sonnet-4-6" },
    ],
  });
}
