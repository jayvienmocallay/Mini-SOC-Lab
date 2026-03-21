import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, Shield, Terminal, Zap, Copy, Check } from "lucide-react";

interface PlaybookStep {
  step: number;
  action: string;
  command?: string;
  critical?: boolean;
}

interface Playbook {
  id: string;
  title: string;
  icon: React.ReactNode;
  rules: string[];
  techniques: string[];
  borderColor: string;
  steps: PlaybookStep[];
}

const playbooks: Playbook[] = [
  {
    id: "brute-force",
    title: "Brute Force Response",
    icon: <Shield className="w-4 h-4" />,
    rules: ["DET-BF-WIN-001", "DET-BF-LNX-001", "DET-BF-WIN-002"],
    techniques: ["T1110", "T1110.001"],
    borderColor: "border-l-severity-high",
    steps: [
      { step: 1, action: "Block source IP at host firewall", command: "# Windows\nnetsh advfirewall firewall add rule name=\"Block Brute Force\" dir=in action=block remoteip=<SRC_IP>\n\n# Linux\niptables -A INPUT -s <SRC_IP> -j DROP" },
      { step: 2, action: "Disable target account temporarily", command: "# Windows\nnet user testuser /active:no\n\n# Linux\nusermod -L testuser" },
      { step: 3, action: "Review preceding successful logons from same source IP" },
      { step: 4, action: "Check for Event 4624 (successful logon) immediately after failures" },
      { step: 5, action: "If DET-BF-WIN-002 fires (success after brute force): assume credential compromise, force immediate password reset", critical: true },
    ],
  },
  {
    id: "powershell",
    title: "PowerShell Abuse Response",
    icon: <Terminal className="w-4 h-4" />,
    rules: ["DET-PS-001", "DET-PS-002", "DET-PS-003", "DET-PS-004"],
    techniques: ["T1059.001", "T1105", "T1562.001", "T1027"],
    borderColor: "border-l-severity-critical",
    steps: [
      { step: 1, action: "Isolate endpoint from network immediately", critical: true },
      { step: 2, action: "Capture PowerShell transcript logs", command: "# Collect transcripts\nGet-ChildItem C:\\PSLogs\\ -Recurse | Copy-Item -Destination C:\\Evidence\\PSLogs\\\n\n# Export PowerShell event logs\nwevtutil epl Microsoft-Windows-PowerShell/Operational C:\\Evidence\\ps_operational.evtx" },
      { step: 3, action: "Decode any Base64 encoded payloads", command: "# PowerShell decode\n[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('<encoded_string>'))" },
      { step: 4, action: "Check for persistence mechanisms: scheduled tasks, registry run keys, startup folder", command: "# Check scheduled tasks\nschtasks /query /fo LIST /v\n\n# Check registry run keys\nreg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\nreg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\n\n# Check startup folder\ndir \"%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\"" },
      { step: 5, action: "For AMSI bypass (DET-PS-004): verify AV/EDR status, run offline scan", critical: true },
      { step: 6, action: "For download cradle (DET-PS-002): image endpoint for forensic analysis if confirmed", critical: true },
    ],
  },
  {
    id: "priv-esc",
    title: "Privilege Escalation Response",
    icon: <Zap className="w-4 h-4" />,
    rules: ["DET-PE-WIN-001", "DET-PE-LNX-001", "DET-PE-LNX-002", "DET-PE-WIN-002", "DET-PE-WIN-003"],
    techniques: ["T1078.001", "T1134.001", "T1548.001", "T1548.003", "T1053.005"],
    borderColor: "border-l-severity-critical",
    steps: [
      { step: 1, action: "Verify if change was authorized — check change management tickets and approved requests" },
      { step: 2, action: "Audit all actions performed by the escalated account", command: "# Windows — query recent logon events for account\nwevtutil qe Security /q:\"*[System[(EventID=4624)] and EventData[Data[@Name='TargetUserName']='<USERNAME>']]\" /c:50 /f:text" },
      { step: 3, action: "For admin group adds (DET-PE-WIN-001): immediately remove unauthorized user and audit full group membership", command: "# Remove from Administrators\nnet localgroup Administrators <USERNAME> /delete\n\n# Audit current membership\nnet localgroup Administrators", critical: true },
      { step: 4, action: "For sudo abuse (DET-PE-LNX-001): review auth.log and bash history", command: "# Review sudo events\ngrep 'sudo' /var/log/auth.log | tail -50\n\n# Check user history\ncat /home/testuser/.bash_history" },
      { step: 5, action: "For SUID abuse (DET-PE-LNX-002): audit all SUID binaries on the system", command: "# Find all SUID binaries\nfind / -perm -4000 -type f 2>/dev/null\n\n# Compare against known-good baseline\ndiff <(find / -perm -4000 -type f 2>/dev/null | sort) /root/baseline_suid.txt" },
      { step: 6, action: "For token impersonation (DET-PE-WIN-002): check for Mimikatz artifacts, review LSASS process access", critical: true },
    ],
  },
];

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-[9px] font-mono text-muted-foreground/50 hover:text-primary flex items-center gap-1 transition-colors"
    >
      {copied ? <><Check className="w-2.5 h-2.5" /> copied</> : <><Copy className="w-2.5 h-2.5" /> copy</>}
    </button>
  );
};

const ResponsePlaybook = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {playbooks.map((pb) => {
        const isOpen = expanded === pb.id;
        return (
          <motion.div
            key={pb.id}
            className={`rounded-xl border bg-card overflow-hidden glow-box card-hover ${isOpen ? 'border-primary/20' : 'border-border'}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <button
              onClick={() => setExpanded(isOpen ? null : pb.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                {pb.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-display font-semibold text-foreground">{pb.title}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pb.rules.map((r) => (
                    <span key={r} className="text-[8px] font-mono text-primary/80 bg-primary/8 rounded-md px-1.5 py-0.5">{r}</span>
                  ))}
                </div>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1 mr-2">
                {pb.techniques.map((t) => (
                  <span key={t} className="text-[8px] font-mono text-accent/80 bg-accent/8 rounded-md px-1.5 py-0.5 border border-accent/15">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-mono text-muted-foreground/40">{pb.steps.length} steps</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Steps */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-4">
                    {pb.steps.map((step) => (
                      <div
                        key={step.step}
                        className={`border-l-2 ${step.critical ? "border-l-severity-critical" : pb.borderColor} pl-4 py-1`}
                      >
                        <div className="flex items-start gap-2">
                          {step.critical && <AlertTriangle className="w-3.5 h-3.5 text-severity-critical shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-xs text-foreground/80">
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold mr-2 align-text-bottom">{step.step}</span>
                              <span className={step.critical ? "text-severity-critical font-semibold" : ""}>{step.action}</span>
                            </p>
                            {step.command && (
                              <div className="mt-2 rounded-lg bg-background/80 border border-border/50 overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-secondary/30">
                                  <span className="text-[9px] font-mono text-muted-foreground/50">Terminal</span>
                                  <CopyButton text={step.command} />
                                </div>
                                <pre className="p-3 text-[10px] font-mono text-foreground/60 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                  {step.command}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ResponsePlaybook;
