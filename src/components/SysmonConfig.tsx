import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Activity,
  Network,
  FileCode2,
  Key,
  HardDrive,
  Database,
  Globe,
  ExternalLink,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

interface SysmonEvent {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  details: string;
  mitreRef?: string;
}

const monitoredProcesses = [
  { name: "PowerShell.exe", reason: "Script execution, fileless malware" },
  { name: "cmd.exe", reason: "Command-line execution, batch scripts" },
  { name: "wscript.exe", reason: "Windows Script Host, VBScript/JScript" },
  { name: "cscript.exe", reason: "Console-based script host" },
  { name: "mshta.exe", reason: "HTML Application host, HTA attacks" },
];

const defaultEvents: SysmonEvent[] = [
  {
    id: 1,
    name: "ProcessCreate",
    description: "Full CommandLine capture",
    icon: <Activity className="w-4 h-4" />,
    enabled: true,
    details:
      "Captures process creation with full command line, parent process, user, hashes (SHA256), and current directory. Essential for detecting malicious process chains and LOLBins usage.",
    mitreRef: "T1059 - Command and Scripting Interpreter",
  },
  {
    id: 3,
    name: "NetworkConnect",
    description: "Outbound monitoring",
    icon: <Network className="w-4 h-4" />,
    enabled: true,
    details:
      "Logs TCP/UDP connections initiated by processes. Tracks source/destination IP, port, and the originating process. Critical for identifying C2 beaconing and data exfiltration attempts.",
    mitreRef: "T1071 - Application Layer Protocol",
  },
  {
    id: 7,
    name: "ImageLoad",
    description: "DLL injection detection",
    icon: <FileCode2 className="w-4 h-4" />,
    enabled: true,
    details:
      "Records DLL/image loads with signature status and hash. Detects DLL side-loading, reflective DLL injection, and unsigned module loading into trusted processes.",
    mitreRef: "T1055.001 - Dynamic-link Library Injection",
  },
  {
    id: 10,
    name: "ProcessAccess",
    description: "LSASS credential dumping",
    icon: <Key className="w-4 h-4" />,
    enabled: true,
    details:
      "Monitors cross-process access calls (OpenProcess). Specifically configured to alert on LSASS access patterns used by Mimikatz and similar credential harvesting tools.",
    mitreRef: "T1003.001 - LSASS Memory",
  },
  {
    id: 11,
    name: "FileCreate",
    description: "File creation monitoring",
    icon: <HardDrive className="w-4 h-4" />,
    enabled: true,
    details:
      "Tracks file creation events in monitored directories. Detects malware drops, staging files, and suspicious file writes in temp directories or startup locations.",
    mitreRef: "T1105 - Ingress Tool Transfer",
  },
  {
    id: 12,
    name: "RegistryEvent (Create/Delete)",
    description: "Registry key and value creation/deletion",
    icon: <Database className="w-4 h-4" />,
    enabled: true,
    details:
      "Monitors registry key creation and deletion. Covers persistence mechanisms including Run/RunOnce keys, services, scheduled tasks registration, and COM object hijacking.",
    mitreRef: "T1547.001 - Registry Run Keys",
  },
  {
    id: 13,
    name: "RegistryEvent (ValueSet)",
    description: "Registry value modification",
    icon: <Database className="w-4 h-4" />,
    enabled: true,
    details:
      "Captures registry value modifications. Detects changes to security policies, firewall rules, and other defensive configuration tampering via registry edits.",
    mitreRef: "T1112 - Modify Registry",
  },
  {
    id: 14,
    name: "RegistryEvent (Rename)",
    description: "Registry key/value rename operations",
    icon: <Database className="w-4 h-4" />,
    enabled: true,
    details:
      "Tracks registry key and value renames. Can indicate an attacker attempting to hide persistence by renaming known-bad registry entries to evade detection rules.",
    mitreRef: "T1112 - Modify Registry",
  },
  {
    id: 22,
    name: "DNSEvent (DNS Query)",
    description: "DNS query logging",
    icon: <Globe className="w-4 h-4" />,
    enabled: true,
    details:
      "Logs all DNS queries with the querying process. Identifies DNS tunneling, DGA (Domain Generation Algorithm) domains, and connections to known malicious infrastructure.",
    mitreRef: "T1071.004 - DNS",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SysmonConfig = () => {
  const [events, setEvents] = useState<SysmonEvent[]>(defaultEvents);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const toggleEvent = (id: number) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    );
  };

  const enabledCount = events.filter((e) => e.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card glow-box"
      >
        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold font-mono text-foreground">
            Sysmon v15.x Configuration
          </h3>
          <p className="text-xs font-mono text-muted-foreground mt-1 leading-relaxed">
            Based on the{" "}
            <a
              href="https://github.com/SwiftOnSecurity/sysmon-config"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              SwiftOnSecurity baseline config
              <ExternalLink className="w-3 h-3" />
            </a>
            . This configuration provides high-fidelity telemetry for threat
            detection while minimizing noise from benign system activity.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs font-mono text-muted-foreground">
              Event types:{" "}
              <span className="text-primary">{enabledCount}</span>/
              {events.length} enabled
            </span>
          </div>
        </div>
      </motion.div>

      {/* Install Command */}
      <CodeBlock title="PowerShell - Install Sysmon with Config">
        {"# Download and install Sysmon with SwiftOnSecurity config\nSysmon64.exe -accepteula -i sysmonconfig-export.xml\n\n# Update existing configuration\nSysmon64.exe -c sysmonconfig-export.xml\n\n# Verify installation\nGet-Service Sysmon64 | Select-Object Status, DisplayName"}
      </CodeBlock>

      {/* Event Types */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={itemVariants}
            className={`rounded-lg border transition-all duration-200 ${
              event.enabled
                ? "border-primary/30 bg-card"
                : "border-border/50 bg-card/50 opacity-60"
            }`}
          >
            <div
              className="flex items-center gap-3 p-3 cursor-pointer"
              onClick={() =>
                setExpandedEvent(expandedEvent === event.id ? null : event.id)
              }
            >
              <div
                className={`p-1.5 rounded transition-colors ${
                  event.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {event.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    Event {event.id}
                  </span>
                  <span
                    className={`text-sm font-mono font-medium transition-colors ${
                      event.enabled ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {event.name}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  {event.description}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={event.enabled}
                  onCheckedChange={() => toggleEvent(event.id)}
                />
              </div>
            </div>

            {expandedEvent === event.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border/50 px-3 pb-3 pt-2 ml-10"
              >
                <p className="text-xs font-mono text-foreground/70 leading-relaxed">
                  {event.details}
                </p>
                {event.mitreRef && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-xs font-mono text-accent">
                    <Shield className="w-3 h-3" />
                    MITRE ATT&CK: {event.mitreRef}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Monitored Processes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-lg border border-border bg-card glow-box"
      >
        <div className="px-4 py-3 border-b border-border bg-secondary">
          <h4 className="text-xs font-mono font-semibold text-primary">
            Monitored Process List
          </h4>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            Processes with enhanced logging and command-line capture
          </p>
        </div>
        <div className="divide-y divide-border/50">
          {monitoredProcesses.map((proc, index) => (
            <motion.div
              key={proc.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-sm font-mono text-foreground">
                  {proc.name}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {proc.reason}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Config Reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-lg border border-border/50 bg-secondary/30"
      >
        <div className="flex items-start gap-2">
          <ExternalLink className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-foreground">
              SwiftOnSecurity Sysmon Configuration Reference
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-1 leading-relaxed">
              The baseline configuration is maintained at{" "}
              <a
                href="https://github.com/SwiftOnSecurity/sysmon-config"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-primary transition-colors"
              >
                github.com/SwiftOnSecurity/sysmon-config
              </a>
              . It provides sensible defaults that exclude high-volume benign
              events while maintaining coverage for common attack techniques. The
              configuration should be customized based on your environment and
              tuned to reduce false positives over time.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SysmonConfig;
