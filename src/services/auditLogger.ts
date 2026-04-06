import { loadState, saveState } from "@/services/localStorage";

const AUDIT_KEY = "audit-log";
const MAX_AUDIT_ENTRIES = 200;

export type AuditActionType =
  | "dashboard.refresh"
  | "dashboard.auth.save"
  | "dashboard.export"
  | "deployment.command.copy"
  | "deployment.runbook.view";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditActionType;
  detail: string;
}

export function getAuditLog(): AuditEntry[] {
  return loadState<AuditEntry[]>(AUDIT_KEY, []);
}

export function logAuditAction(action: AuditActionType, detail: string) {
  const entry: AuditEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    action,
    detail,
  };

  const existing = getAuditLog();
  const next = [entry, ...existing].slice(0, MAX_AUDIT_ENTRIES);
  saveState(AUDIT_KEY, next);
}
