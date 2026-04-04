import { useMemo, useState } from "react";
import { TerminalSquare, Copy, CheckCircle2 } from "lucide-react";
import { getAuditLog, logAuditAction } from "@/services/auditLogger";

interface DeployTarget {
  id: string;
  label: string;
  script: string;
  command: string;
  notes: string;
}

const targets: DeployTarget[] = [
  {
    id: "wazuh-rules",
    label: "Wazuh Rules",
    script: "scripts/deploy-rules.sh",
    command: "./scripts/deploy-rules.sh",
    notes: "Deploys custom Wazuh XML rules with backup + validation",
  },
  {
    id: "sysmon-config",
    label: "Sysmon Config",
    script: "scripts/deploy-sysmon.ps1",
    command: ".\\scripts\\deploy-sysmon.ps1",
    notes: "Pushes Sysmon config to Windows endpoints via WinRM",
  },
  {
    id: "auditd-rules",
    label: "auditd Rules",
    script: "scripts/deploy-auditd.sh",
    command: "./scripts/deploy-auditd.sh",
    notes: "Deploys Linux audit rules to endpoints via SSH",
  },
];

const RuleDeploymentPanel = () => {
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const recentOps = useMemo(() => getAuditLog().filter((e) => e.action.startsWith("deployment.")).slice(0, 6), []);

  const handleCopy = async (target: DeployTarget) => {
    try {
      await navigator.clipboard.writeText(target.command);
      setCopiedTarget(target.id);
      logAuditAction("deployment.command.copy", `${target.label}: ${target.command}`);
      setTimeout(() => setCopiedTarget(null), 1200);
    } catch {
      logAuditAction("deployment.command.copy", `${target.label}: clipboard copy failed`);
    }
  };

  const handleViewRunbook = (target: DeployTarget) => {
    logAuditAction("deployment.runbook.view", `${target.label}: ${target.script}`);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4 glow-box">
      <div className="flex items-center gap-2">
        <TerminalSquare className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-mono text-foreground">Operational Deployment Panel</h4>
      </div>

      <p className="text-xs font-mono text-muted-foreground">
        Agent push is enabled. Use these runbook commands from a trusted terminal session.
      </p>

      <div className="space-y-2">
        {targets.map((target) => (
          <div key={target.id} className="rounded-md border border-border/70 bg-background/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-mono text-foreground">{target.label}</p>
              <button
                onClick={() => handleCopy(target)}
                className="h-7 px-2 rounded border border-primary/30 text-[10px] font-mono text-primary hover:bg-primary/10"
              >
                {copiedTarget === target.id ? (
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Copied</span>
                ) : (
                  <span className="inline-flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Cmd</span>
                )}
              </button>
            </div>

            <p className="text-[11px] font-mono text-muted-foreground mt-1">{target.notes}</p>
            <p className="text-[10px] font-mono text-primary/90 mt-2 bg-secondary/40 rounded px-2 py-1">{target.command}</p>

            <button
              onClick={() => handleViewRunbook(target)}
              className="mt-2 text-[10px] font-mono text-accent hover:text-primary"
            >
              Log runbook review
            </button>
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-border/60">
        <p className="text-[10px] font-mono text-muted-foreground mb-2">Recent Deployment Ops</p>
        {recentOps.length === 0 ? (
          <p className="text-[10px] font-mono text-muted-foreground">No deployment actions logged yet.</p>
        ) : (
          <div className="space-y-1">
            {recentOps.map((op) => (
              <p key={op.id} className="text-[10px] font-mono text-foreground/80">
                [{new Date(op.timestamp).toLocaleTimeString()}] {op.detail}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleDeploymentPanel;
