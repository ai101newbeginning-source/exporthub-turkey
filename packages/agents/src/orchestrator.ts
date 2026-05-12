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
import { validateTaskFlow, getRequiredApprovers } from "./workflow-rules.js";
import { getMockResponse } from "./mocks.js";

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
};

export class ExportHubOrchestrator {
  private client: Anthropic | null;
  private isDemoMode: boolean;
  private conversationHistory: Map<AgentId, ConversationMessage[]> = new Map();

  constructor(apiKey?: string) {
    this.isDemoMode = !apiKey;
    this.client = apiKey ? new Anthropic({ apiKey }) : null;
    for (const agentId of Object.keys(AGENTS) as AgentId[]) {
      this.conversationHistory.set(agentId, []);
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
      const response = await this.client!.messages.create({
        model: agent.model,
        max_tokens: 4096,
        system: agent.systemPrompt,
        tools: agent.tools.length > 0 ? agent.tools : undefined,
        messages: currentMessages,
      });

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
      const approvalResult = await this.runAgent(
        requiredApprovers[0],
        `Lütfen şu içeriği teknik doğruluk açısından incele ve onayla:\n\n${result.output}`,
        { original_task: task.taskType }
      );

      return {
        ...result,
        approved: !approvalResult.output.toLowerCase().includes("onaylamıyorum"),
        approvedBy: requiredApprovers[0],
        metadata: { approvalNote: approvalResult.output },
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
