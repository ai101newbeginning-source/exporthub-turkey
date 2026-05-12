import type Anthropic from "@anthropic-ai/sdk";

export type AgentId =
  | "project-manager"
  | "senior-export-expert"
  | "market-intelligence"
  | "content-marketing"
  | "seo-growth"
  | "data-analyst"
  | "frontend-dev"
  | "backend-dev"
  | "qa-tester"
  | "remotion-specialist"
  | "ux-designer";

export interface AgentConfig {
  id: AgentId;
  name: string;
  nameTR: string;
  model: string;
  systemPrompt: string;
  tools: Anthropic.Tool[];
}

export interface TaskRequest {
  from: AgentId | "user";
  to: AgentId;
  taskType: string;
  payload: Record<string, unknown>;
  requiresApproval?: AgentId[];
}

export interface TaskResult {
  agentId: AgentId;
  taskType: string;
  output: string;
  approved?: boolean;
  approvedBy?: AgentId;
  metadata?: Record<string, unknown>;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OrchestratorContext {
  activeTask?: TaskRequest;
  conversationHistory: ConversationMessage[];
  pendingApprovals: TaskResult[];
}
