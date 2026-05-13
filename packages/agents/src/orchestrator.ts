import Anthropic from "@anthropic-ai/sdk";
import type {
  AgentId,
  AgentConfig,
  TaskRequest,
  TaskResult,
  ConversationMessage,
} from "./types.js";
import { projectManagerAgent } from "./agents/project-manager.js";
import { seniorExportExpertAgent } from "./agents/senior-export-expert.js";
import { marketIntelligenceAgent } from "./agents/market-intelligence.js";
import { contentMarketingAgent } from "./agents/content-marketing.js";
import { seoGrowthAgent } from "./agents/seo-growth.js";
import { dataAnalystAgent } from "./agents/data-analyst.js";
import { frontendDevAgent } from "./agents/frontend-dev.js";
import { backendDevAgent } from "./agents/backend-dev.js";
import { qaTesterAgent } from "./agents/qa-tester.js";
import { remotionSpecialistAgent } from "./agents/remotion-specialist.js";
import { uxDesignerAgent } from "./agents/ux-designer.js";
import { siteAuditorAgent } from "./agents/site-auditor.js";
import { revisionCoordinatorAgent } from "./agents/revision-coordinator.js";
import { performanceReviewerAgent } from "./agents/performance-reviewer.js";
import { validateTaskFlow, getRequiredApprovers } from "./workflow-rules.js";
import { getMockResponse } from "./mocks.js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const AGENTS: Record<AgentId, AgentConfig> = {
  "project-manager": projectManagerAgent,
  "senior-export-expert": seniorExportExpertAgent,
  "market-intelligence": marketIntelligenceAgent,
  "content-marketing": contentMarketingAgent,
  "seo-growth": seoGrowthAgent,
  "data-analyst": dataAnalystAgent,
  "frontend-dev": frontendDevAgent,
  "backend-dev": backendDevAgent,
  "qa-tester": qaTesterAgent,
  "remotion-specialist": remotionSpecialistAgent,
  "ux-designer": uxDesignerAgent,
  "site-auditor": siteAuditorAgent,
  "revision-coordinator": revisionCoordinatorAgent,
  "performance-reviewer": performanceReviewerAgent,
};

export class ExportHubOrchestrator {
  private client: Anthropic | null;
  private isDemoMode: boolean;
  private conversationHistory: Map<AgentId, ConversationMessage[]> = new Map();

  constructor(apiKey?: string) {
    this.isDemoMode = !apiKey;
    this.client = apiKey ? new Anthropic({ apiKey }) : null;
    for (const agentId of Object.keys(AGENTS) as AgentId[]) {
      this.conversationHistory.set(agentId as AgentId, []);
    }
  }

  async runAgent(
    agentId: AgentId,
    userMessage: string,
    contextData?: Record<string, unknown>
  ): Promise<TaskResult> {
    if (this.isDemoMode) {
      return getMockResponse(agentId, userMessage);
    }

    const agent = AGENTS[agentId];
    const history = this.conversationHistory.get(agentId) ?? [];

    const messageContent = contextData
      ? `${userMessage}\n\nBağlam Verisi:\n${JSON.stringify(contextData, null, 2)}`
      : userMessage;

    history.push({ role: "user", content: messageContent });

    const messages: Anthropic.MessageParam[] = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let finalText = "";
    let continueLoop = true;
    const currentMessages = [...messages];

    while (continueLoop) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      let retries = 0;
      while (true) {
        try {
          response = await this.client!.messages.create({
            model: agent.model,
            max_tokens: 4096,
            system: agent.systemPrompt,
            tools: agent.tools.length > 0 ? agent.tools : undefined,
            messages: currentMessages,
          });
          break;
        } catch (err: unknown) {
          const e = err as { status?: number; headers?: { get?: (k: string) => string | null } };
          if (e?.status === 429 && retries < 3) {
            const retryAfter = parseInt(e.headers?.get?.("retry-after") ?? "60", 10);
            const wait = (retryAfter + 2) * 1000;
            process.stderr.write(`  ⏳ Rate limit — ${retryAfter + 2}s bekleniyor...\n`);
            await new Promise((r) => setTimeout(r, wait));
            retries++;
          } else {
            throw err;
          }
        }
      }

      const assistantContent: Anthropic.ContentBlock[] = response.content;
      currentMessages.push({ role: "assistant", content: assistantContent });

      if (response.stop_reason === "tool_use") {
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of assistantContent) {
          if (block.type === "tool_use") {
            const result = await this.handleToolCall(
              agentId,
              block.name,
              block.input as Record<string, unknown>
            );
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: result,
            });
          } else if (block.type === "text") {
            finalText += block.text;
          }
        }

        currentMessages.push({ role: "user", content: toolResults });
      } else {
        for (const block of assistantContent) {
          if (block.type === "text") {
            finalText += block.text;
          }
        }
        continueLoop = false;
      }
    }

    history.push({ role: "assistant", content: finalText });
    this.conversationHistory.set(agentId, history);

    return {
      agentId,
      taskType: "general",
      output: finalText,
    };
  }

  async processTask(task: TaskRequest): Promise<TaskResult> {
    const validation = validateTaskFlow(task);
    if (!validation.valid) {
      return {
        agentId: task.to,
        taskType: task.taskType,
        output: `[WORKFLOW HATASI] ${validation.reason}`,
        approved: false,
      };
    }

    const requiredApprovers = getRequiredApprovers(task.taskType);
    const result = await this.runAgent(task.to, task.payload.instruction as string, task.payload);

    if (requiredApprovers.length > 0) {
      const MAX_REVISIONS = 3;
      let approved = false;
      let revisionCount = 0;
      let currentOutput = result.output;
      let approvalNote = "";
      let currentInstruction = task.payload.instruction as string;

      while (!approved && revisionCount <= MAX_REVISIONS) {
        const approvalResult = await this.runAgent(
          requiredApprovers[0],
          `Lütfen şu içeriği teknik doğruluk açısından incele ve onayla:\n\n${currentOutput}`,
          { original_task: task.taskType }
        );
        approvalNote = approvalResult.output;
        approved = !approvalNote.toLowerCase().includes("onaylamıyorum");

        if (!approved && revisionCount < MAX_REVISIONS) {
          const revisionResult = await this.runAgent(
            "revision-coordinator",
            `Red gerekçesi:\n${approvalNote}\n\nReddedilen içerik:\n${currentOutput}\n\nRevizyon talimatı hazırla ve Content Marketing'e ver. Bu tur ${revisionCount + 1}/3.`,
          );
          currentInstruction = revisionResult.output;
          const revisedResult = await this.runAgent(task.to, currentInstruction);
          currentOutput = revisedResult.output;
          revisionCount++;
        } else {
          break;
        }
      }

      return {
        ...result,
        output: currentOutput,
        approved,
        approvedBy: approved ? requiredApprovers[0] : undefined,
        metadata: { approvalNote, revisionCount },
      };
    }

    return result;
  }

  async askProjectManager(userRequest: string): Promise<TaskResult> {
    return this.runAgent("project-manager", userRequest);
  }

  private async handleToolCall(
    agentId: AgentId,
    toolName: string,
    input: Record<string, unknown>
  ): Promise<string> {
    if (toolName === "delegate_task") {
      const targetAgentId = input.to as AgentId;
      const instruction = input.instruction as string;
      const context = input.context as Record<string, unknown> | undefined;

      const delegatedResult = await this.runAgent(
        targetAgentId,
        instruction,
        context
      );

      return `[${AGENTS[targetAgentId].nameTR} yanıtı]\n${delegatedResult.output}`;
    }

    if (toolName === "read_file") {
      const filePath = join(PROJECT_ROOT, input.path as string);
      try {
        const content = readFileSync(filePath, "utf-8");
        return `[Dosya: ${input.path}]\n${content.slice(0, 8000)}${content.length > 8000 ? "\n... (truncated)" : ""}`;
      } catch {
        return `[HATA] Dosya okunamadı: ${input.path}`;
      }
    }

    if (toolName === "list_pages") {
      const dir = input.dir as string | undefined ?? "packages/web/app";
      const fullDir = join(PROJECT_ROOT, dir);
      try {
        const entries = readdirSync(fullDir, { withFileTypes: true });
        const list = entries.map((e) => `${e.isDirectory() ? "📁" : "📄"} ${e.name}`).join("\n");
        return `[${dir}]\n${list}`;
      } catch {
        return `[HATA] Dizin okunamadı: ${dir}`;
      }
    }

    if (toolName === "check_seo") {
      const filePath = join(PROJECT_ROOT, input.path as string);
      try {
        const content = readFileSync(filePath, "utf-8");
        const title = content.match(/title[:\s]+["'`]([^"'`]+)/)?.[1] ?? "—";
        const description = content.match(/description[:\s]+["'`]([^"'`]+)/)?.[1] ?? "—";
        const h1s = [...content.matchAll(/<h1[^>]*>([^<]+)/g)].map((m) => m[1].trim());
        const h2s = [...content.matchAll(/<h2[^>]*>([^<]+)/g)].map((m) => m[1].trim());
        const hasSchema = content.includes("application/ld+json");
        return `[SEO Analizi: ${input.path}]
Title: ${title}
Description: ${description}
H1'ler: ${h1s.join(", ") || "—"}
H2'ler: ${h2s.slice(0, 5).join(", ") || "—"}
Schema markup: ${hasSchema ? "✅ var" : "❌ yok"}`;
      } catch {
        return `[HATA] Dosya analiz edilemedi: ${input.path}`;
      }
    }

    if (toolName === "validate_content" || toolName === "lookup_regulation") {
      return `[${AGENTS[agentId].nameTR}] "${toolName}" işlemi için bilgi işleniyor... Lütfen mevzuat ve teknik bilgi tabanıma göre yanıt üretiyorum.`;
    }

    if (toolName === "query_export_data") {
      return `[Veri Sorgulama] Parametre: ${JSON.stringify(input)}. Gerçek entegrasyonda data/ dizininden veya TÜİK API'sinden veri çekilecek.`;
    }

    if (toolName === "create_composition" || toolName === "animate_data" || toolName === "export_video_config") {
      return `[Remotion] "${toolName}" isteği işleniyor. Kompozisyon konfigürasyonu hazırlanıyor...`;
    }

    return `[${toolName}] Araç çağrısı alındı: ${JSON.stringify(input)}`;
  }

  getAgentList(): Array<{ id: AgentId; name: string; nameTR: string; model: string }> {
    return Object.values(AGENTS).map(({ id, name, nameTR, model }) => ({
      id,
      name,
      nameTR,
      model,
    }));
  }
}
