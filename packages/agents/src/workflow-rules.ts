import type { AgentId, TaskRequest } from "./types.js";

export const WORKFLOW_GATES: Record<string, AgentId[]> = {
  content_publish: ["senior-export-expert"],
  data_visualization: ["data-analyst", "remotion-specialist"],
  ui_design: ["ux-designer"],
  deployment: ["qa-tester"],
  lead_list: ["senior-export-expert", "market-intelligence"],
};

export function getRequiredApprovers(taskType: string): AgentId[] {
  for (const [gate, approvers] of Object.entries(WORKFLOW_GATES)) {
    if (taskType.includes(gate.replace("_", "-")) || taskType === gate) {
      return approvers;
    }
  }
  return [];
}

export function validateTaskFlow(task: TaskRequest): {
  valid: boolean;
  reason?: string;
} {
  if (
    task.to === "senior-export-expert" &&
    task.taskType === "validate_content"
  ) {
    return { valid: true };
  }

  if (
    (task.taskType === "write_article" || task.taskType === "create_guide") &&
    task.from !== "senior-export-expert" &&
    !task.requiresApproval?.includes("senior-export-expert")
  ) {
    return {
      valid: false,
      reason:
        "İçerik oluşturma görevleri Senior Export Expert onayı gerektirir.",
    };
  }

  if (
    task.taskType === "create_composition" &&
    task.from !== "data-analyst" &&
    task.from !== "project-manager"
  ) {
    return {
      valid: false,
      reason:
        "Remotion kompozisyonları Data Analyst veri onayından sonra başlamalıdır.",
    };
  }

  if (
    task.to === "frontend-dev" &&
    task.taskType === "generate_component" &&
    task.from !== "ux-designer" &&
    task.from !== "project-manager"
  ) {
    return {
      valid: false,
      reason:
        "Frontend bileşen geliştirme UX/UI Designer tasarım onayından sonra başlamalıdır.",
    };
  }

  return { valid: true };
}
