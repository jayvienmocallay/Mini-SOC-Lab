import { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import DataTable from "@/components/DataTable";
import CodeBlock from "@/components/CodeBlock";
import DetectionCard from "@/components/DetectionCard";
import { motion } from "framer-motion";
import { FileText, Server, Database, Terminal, AlertTriangle, TestTube, Lock, BookOpen } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SideNav activeSection={activeSection} onNavigate={scrollTo} />

      <main className="lg:ml-64 relative">
        <div className="max-w-4xl mx-auto px-6 pb-20">
          {/* HERO */}
          <section id="hero">
            <HeroSection />
          </section>

          {/* PURPOSE & SCOPE */}
          <section id="purpose">
            <SectionHeading id="purpose-heading" number="01" title="Purpose & Scope" icon={FileText} description="Document purpose, scope, and definitions" />
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the <span className="text-primary font-semibold">Mini Security Operations Center (SOC) Home Lab</span>. The lab provides a controlled, isolated environment for Blue Team practitioners to practice log ingestion, detection engineering, threat hunting, and incident response workflows.</p>
              
              <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Functional Domains</h3>
              <div className="grid gap-2">
                {[
                  "Virtual machine provisioning (Windows 10/11 and Ubuntu Linux)",
                  "Log collection and forwarding (Syslog, WinEventLog, Sysmon, auditd)",
                  "SIEM deployment and configuration (Wazuh Community Edition or Splunk Free)",
                  "Threat detection rules for: Brute Force, PowerShell Abuse, and Privilege Escalation",
                  "Alert tuning, documentation, and response playbooks",
                ].map((item, i) => (
                  <motion.div key={i} className="flex items-start gap-3 p-3 rounded-md bg-card border border-border" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <span className="text-primary font-mono text-xs mt-0.5">▸</span>
                    <span className="text-xs font-mono">{item}</span>
                  </motion.div>
                ))}
              </div>

              <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">User Classes</h3>
              <DataTable
                headers={["User Class", "Description", "Technical Level"]}
                rows={[
                  ["Lab Engineer", "Provisions VMs, installs agents, manages SIEM", "Advanced"],
                  ["Detection Engineer", "Writes and tunes detection rules; MITRE ATT&CK mapping", "Intermediate–Advanced"],
                  ["SOC Analyst (L1)", "Monitors dashboards, triages alerts, escalates", "Intermediate"],
                  ["Security Researcher", "Simulates attacks and validates detection coverage", "Advanced"],
                ]}
              />

              <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Glossary</h3>
              <DataTable
                compact
                headers={["Term", "Definition"]}
                rows={[
                  ["SOC", "Security Operations Center"],
                  ["SIEM", "Security Information and Event Management"],
                  ["IDS", "Intrusion Detection System"],
                  ["Wazuh", "Open-source SIEM/XDR platform"],
                  ["Sysmon", "Windows System Monitor — kernel-level telemetry"],
                  ["auditd", "Linux audit daemon"],
                  ["TTPs", "Tactics, Techniques, and Procedures (MITRE ATT&CK)"],
                ]}
              />
            </div>
          </section>

          {/* INFRASTRUCTURE */}
          <section id="infrastructure">
            <SectionHeading id="infra-heading" number="02" title="Infrastructure Requirements" icon={Server} description="VM specifications, networking, and OS configuration" />
            
            <h3 className="text-lg font-display font-semibold text-foreground mb-3">Virtual Machine Specifications</h3>
            <DataTable
              headers={["Spec", "Windows Endpoint", "Linux Endpoint", "SIEM Server"]}
              rows={[
                ["OS", "Windows 10 Pro (22H2)", "Ubuntu Server 22.04 LTS", "Ubuntu Server 22.04 LTS"],
                ["CPU", "2 vCPUs (min)", "2 vCPUs (min)", "4 vCPUs (recommended)"],
                ["RAM", "4 GB (8 GB rec.)", "2 GB (4 GB rec.)", "8 GB (16 GB rec.)"],
                ["Disk", "60 GB thin", "40 GB thin", "100 GB thin"],
                ["Static IP", "192.168.56.10", "192.168.56.11", "192.168.56.100"],
                ["Role", "Attack Target / Log Source", "Attack Target / Log Source", "Wazuh Manager + Indexer + Dashboard"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Network Architecture</h3>
            <p className="text-sm text-foreground/80 mb-4">All VMs on a dedicated host-only network segment <span className="font-mono text-primary">192.168.56.0/24</span> with no routing to external networks.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { ip: "192.168.56.100", name: "SIEM Server", role: "Wazuh / Splunk" },
                { ip: "192.168.56.10", name: "Windows EP", role: "Attack Target" },
                { ip: "192.168.56.11", name: "Linux EP", role: "Attack Target" },
                { ip: "192.168.56.1", name: "Host Machine", role: "Hypervisor GW" },
              ].map((node, i) => (
                <motion.div key={i} className="p-4 rounded-lg bg-card border border-border text-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="text-xs font-mono text-primary mb-1">{node.ip}</div>
                  <div className="text-sm font-display font-semibold text-foreground">{node.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{node.role}</div>
                </motion.div>
              ))}
            </div>

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Linux VM — Wazuh Agent Install</h3>
            <CodeBlock title="wazuh-agent-install.sh">{`curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --dearmor > /usr/share/keyrings/wazuh.gpg
echo 'deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main' \\
  > /etc/apt/sources.list.d/wazuh.list
apt-get update && apt-get install wazuh-agent -y
WAZUH_MANAGER='192.168.56.100' systemctl start wazuh-agent
systemctl enable wazuh-agent`}</CodeBlock>
          </section>

          {/* LOG COLLECTION */}
          <section id="logs">
            <SectionHeading id="logs-heading" number="03" title="Log Collection Requirements" icon={Database} description="Agent deployment, log sources, and forwarding rules" />

            <h3 className="text-lg font-display font-semibold text-foreground mb-3">Windows Log Sources</h3>
            <DataTable
              headers={["Log Source", "Channel", "Key Events"]}
              rows={[
                ["Security Event Log", "Security", "4624, 4625, 4720, 4728/4732, 4648, 4719"],
                ["Sysmon Events", "Sysmon/Operational", "Event 1, 3, 7, 10, 11, 12-14, 22"],
                ["PowerShell Logs", "PowerShell/Operational", "Event 4103, 4104, 800"],
                ["WMI Activity", "WMI-Activity/Operational", "Event 5857, 5858, 5860, 5861"],
                ["Task Scheduler", "TaskScheduler/Operational", "Event 106, 200, 201"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Linux Log Sources</h3>
            <DataTable
              headers={["Log Source", "File Path", "Key Events"]}
              rows={[
                ["Authentication", "/var/log/auth.log", "SSH login attempts, sudo, su, PAM"],
                ["Syslog", "/var/log/syslog", "Service events, kernel, cron"],
                ["auditd", "/var/log/audit/audit.log", "execve, chmod, setuid, ptrace, socket"],
                ["Kern Log", "/var/log/kern.log", "Kernel activity, module loads"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Forwarding Requirements</h3>
            <div className="space-y-2">
              {[
                ["REQ-LOG-01", "Forward all logs within 30 seconds of event generation"],
                ["REQ-LOG-02", "Encrypted transport (TLS 1.2+) between agents and manager"],
                ["REQ-LOG-03", "Explicit log_format for each monitored file"],
                ["REQ-LOG-04", "Windows agents use eventchannel format"],
                ["REQ-LOG-05", "Buffer up to 1,000 events if SIEM unreachable"],
                ["REQ-LOG-06", "All timestamps normalized to UTC"],
              ].map(([id, desc], i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-card border border-border">
                  <span className="text-[10px] font-mono text-primary shrink-0 mt-0.5">{id}</span>
                  <span className="text-xs text-foreground/80">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SIEM */}
          <section id="siem">
            <SectionHeading id="siem-heading" number="04" title="SIEM Platform Requirements" icon={Terminal} description="Platform selection, deployment, and dashboard configuration" />

            <h3 className="text-lg font-display font-semibold text-foreground mb-3">Platform Comparison</h3>
            <DataTable
              headers={["Criterion", "Wazuh Community", "Splunk Free"]}
              rows={[
                ["Cost", "Free / Open Source", "Free (500 MB/day)"],
                ["Agent Support", "Native Wazuh Agent", "Universal Forwarder"],
                ["Detection Rules", "XML-based (OSSEC)", "SPL queries"],
                ["Dashboards", "OpenSearch Dashboards", "Splunk Web"],
                ["ATT&CK Mapping", "Built-in", "Manual / ES app"],
                ["Recommendation", "✓ Primary", "Secondary"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Required Dashboards</h3>
            <DataTable
              headers={["Dashboard", "Key Panels", "Refresh"]}
              rows={[
                ["Security Overview", "Alert counts, Top rules, Events timeline", "60s"],
                ["Authentication Monitor", "Failed login heatmap, Brute force, Geo-IP", "30s"],
                ["Endpoint Activity", "Process creation, PowerShell, Sysmon", "60s"],
                ["Privilege Escalation", "sudo/RunAs, New admins, Scheduled tasks", "60s"],
                ["Agent Health", "Connectivity, Ingestion rate, Disk usage", "300s"],
              ]}
            />
          </section>

          {/* DETECTIONS */}
          <section id="detections">
            <SectionHeading id="det-heading" number="05" title="Detection Engineering" icon={AlertTriangle} description="Rules for brute force, PowerShell abuse, and privilege escalation" />

            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Brute Force Detections</h3>
            <div className="grid gap-4 mb-8">
              <DetectionCard ruleId="DET-BF-WIN-001" name="Windows RDP / Local Account Brute Force" severity="HIGH" category="Brute Force" attack="T1110.001" logSource="Windows Security — Event ID 4625" triggerLogic="≥ 5 Event ID 4625 (Logon Type 3 or 10) from same source IP within 60s" />
              <DetectionCard ruleId="DET-BF-LNX-001" name="Linux SSH Brute Force — Multiple Auth Failures" severity="HIGH" category="Brute Force" attack="T1110.001" logSource="/var/log/auth.log" triggerLogic="≥ 10 SSH authentication failures from same source IP within 120 seconds" />
              <DetectionCard ruleId="DET-BF-WIN-002" name="Successful Logon Following Brute Force" severity="CRITICAL" category="Brute Force" attack="T1110" triggerLogic="Event ID 4624 from same IP that triggered DET-BF-WIN-001 within 300s" />
            </div>

            <CodeBlock title="Wazuh Rule — Windows Brute Force">{`<rule id="100101" level="10">
  <if_matched_sid>60122</if_matched_sid>
  <same_source_ip />
  <same_user />
  <description>Windows Brute Force: Multiple failed logons from same IP</description>
  <group>authentication_failures,brute_force</group>
  <mitre>
    <id>T1110</id>
    <id>T1110.001</id>
  </mitre>
</rule>`}</CodeBlock>

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-4">PowerShell Abuse Detections</h3>
            <div className="grid gap-4 mb-8">
              <DetectionCard ruleId="DET-PS-001" name="Encoded PowerShell Command Execution" severity="HIGH" category="PS Abuse" attack="T1059.001" logSource="Sysmon Event 1 + PowerShell Event 4104" triggerLogic="CommandLine contains '-enc', '-EncodedCommand', or '[Convert]::FromBase64String'" />
              <DetectionCard ruleId="DET-PS-002" name="PowerShell Download Cradle / Fileless Attack" severity="CRITICAL" category="PS Abuse" attack="T1059.001, T1105" triggerLogic="IEX/Invoke-Expression combined with DownloadString, DownloadFile, WebClient" />
              <DetectionCard ruleId="DET-PS-003" name="Execution Policy Bypass" severity="MEDIUM" category="PS Abuse" attack="T1059.001, T1562.001" triggerLogic="CommandLine contains -ExecutionPolicy Bypass or Set-ExecutionPolicy Unrestricted" />
              <DetectionCard ruleId="DET-PS-004" name="AMSI Bypass Attempt Detected" severity="CRITICAL" category="PS Abuse" attack="T1562.001" triggerLogic="Script Block containing amsiInitFailed, AmsiScanBuffer, or amsi.dll reflection patterns" />
            </div>

            <CodeBlock title="Wazuh Rule — PS Download Cradle">{`<rule id="100202" level="14">
  <if_group>powershell_scriptblock</if_group>
  <field name="win.eventdata.scriptBlockText" type="pcre2">
    (?i)(IEX|Invoke-Expression).{0,100}(DownloadString|DownloadFile|WebClient|HttpClient)
  </field>
  <description>CRITICAL: PowerShell download cradle — possible fileless attack</description>
  <group>powershell_abuse,fileless_malware</group>
  <mitre>
    <id>T1059.001</id>
    <id>T1105</id>
  </mitre>
</rule>`}</CodeBlock>

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-4">Privilege Escalation Detections</h3>
            <div className="grid gap-4 mb-8">
              <DetectionCard ruleId="DET-PE-WIN-001" name="User Added to Administrators Group" severity="CRITICAL" category="Priv Esc" attack="T1078.001, T1136" logSource="Windows Security — Event 4728/4732" triggerLogic="Event 4732 where Group_Name = 'Administrators' or Event 4728 where Group = 'Domain Admins'" />
              <DetectionCard ruleId="DET-PE-LNX-001" name="Sudo to Root Shell" severity="HIGH" category="Priv Esc" attack="T1548.003" logSource="/var/log/auth.log" triggerLogic="COMMAND=/bin/bash or /bin/sh or su from sudo, or ≥3 sudo auth failures in 60s" />
              <DetectionCard ruleId="DET-PE-LNX-002" name="SUID Binary Abuse" severity="HIGH" category="Priv Esc" attack="T1548.001" logSource="auditd — EXECVE syscall" triggerLogic="auid!=0 (non-root) AND euid=0 (effective root) — SUID escalation" />
              <DetectionCard ruleId="DET-PE-WIN-002" name="Token Impersonation / SeDebugPrivilege" severity="CRITICAL" category="Priv Esc" attack="T1134.001" logSource="Windows Security — Event 4672" triggerLogic="SeDebugPrivilege by non-approved account" />
              <DetectionCard ruleId="DET-PE-WIN-003" name="Scheduled Task by Non-Admin User" severity="MEDIUM" category="Priv Esc" attack="T1053.005" logSource="Windows Security — Event 4698" triggerLogic="Non-admin creates task with cmd.exe, powershell.exe, or mshta.exe" />
            </div>

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Detection Rule Summary</h3>
            <DataTable
              headers={["Rule ID", "Name", "Severity", "Category", "ATT&CK"]}
              rows={[
                ["DET-BF-WIN-001", "Windows RDP Brute Force", "HIGH", "Brute Force", "T1110.001"],
                ["DET-BF-WIN-002", "Logon After Brute Force", "CRITICAL", "Brute Force", "T1110"],
                ["DET-BF-LNX-001", "Linux SSH Brute Force", "HIGH", "Brute Force", "T1110.001"],
                ["DET-PS-001", "Encoded PowerShell", "HIGH", "PS Abuse", "T1059.001"],
                ["DET-PS-002", "Download Cradle", "CRITICAL", "PS Abuse", "T1059.001"],
                ["DET-PS-003", "Exec Policy Bypass", "MEDIUM", "PS Abuse", "T1059.001"],
                ["DET-PS-004", "AMSI Bypass", "CRITICAL", "PS Abuse", "T1562.001"],
                ["DET-PE-WIN-001", "User Added to Admins", "CRITICAL", "Priv Esc", "T1078.001"],
                ["DET-PE-LNX-001", "Sudo to Root Shell", "HIGH", "Priv Esc", "T1548.003"],
                ["DET-PE-LNX-002", "SUID Binary Abuse", "HIGH", "Priv Esc", "T1548.001"],
                ["DET-PE-WIN-002", "Token Impersonation", "CRITICAL", "Priv Esc", "T1134.001"],
                ["DET-PE-WIN-003", "Scheduled Task", "MEDIUM", "Priv Esc", "T1053.005"],
              ]}
            />
          </section>

          {/* TESTING */}
          <section id="testing">
            <SectionHeading id="test-heading" number="06" title="Testing & Validation" icon={TestTube} description="Attack simulation scenarios and acceptance criteria" />

            <h3 className="text-lg font-display font-semibold text-foreground mb-3">Attack Simulation Scenarios</h3>
            <DataTable
              headers={["Scenario", "Description", "Tool / Method", "Expected Alert"]}
              rows={[
                ["TEST-BF-001", "RDP brute force — 20 failed in 60s", "Hydra rdp://192.168.56.10", "DET-BF-WIN-001"],
                ["TEST-BF-002", "SSH brute force — 15 failed", "Hydra ssh://192.168.56.11", "DET-BF-LNX-001"],
                ["TEST-BF-003", "Logon after brute force", "Manual logon after TEST-BF-001", "DET-BF-WIN-002"],
                ["TEST-PS-001", "Encoded PS one-liner", "powershell.exe -enc <payload>", "DET-PS-001"],
                ["TEST-PS-002", "Download cradle simulation", "IEX (WebClient).DownloadString", "DET-PS-002"],
                ["TEST-PE-001", "Add user to Admins", "net localgroup Administrators", "DET-PE-WIN-001"],
                ["TEST-PE-002", "Sudo to root shell", "sudo /bin/bash", "DET-PE-LNX-001"],
                ["TEST-PE-003", "Scheduled task w/ PS", "schtasks /create ...", "DET-PE-WIN-003"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Acceptance Criteria</h3>
            <div className="space-y-2">
              {[
                ["REQ-TEST-01", "All 12 rules must alert within 120 seconds of trigger"],
                ["REQ-TEST-02", "Zero false negatives for CRITICAL-severity rules"],
                ["REQ-TEST-03", "False positive rate documented per rule (48h baseline)"],
                ["REQ-TEST-04", "All alerts include valid MITRE ATT&CK technique ID"],
                ["REQ-TEST-05", "Detection logic reviewed and signed off before production"],
              ].map(([id, desc], i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-card border border-border">
                  <span className="text-[10px] font-mono text-primary shrink-0 mt-0.5">{id}</span>
                  <span className="text-xs text-foreground/80">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* NON-FUNCTIONAL */}
          <section id="nonfunctional">
            <SectionHeading id="nf-heading" number="07" title="Non-Functional Requirements" icon={Lock} description="Performance, security, and maintainability" />

            <h3 className="text-lg font-display font-semibold text-foreground mb-3">Performance</h3>
            <DataTable
              headers={["ID", "Requirement", "Target"]}
              rows={[
                ["NFR-P-01", "Log ingestion latency", "≤ 30 seconds"],
                ["NFR-P-02", "Alert generation latency", "≤ 60 seconds"],
                ["NFR-P-03", "SIEM indexing throughput", "≥ 1,000 EPS"],
                ["NFR-P-04", "Dashboard load time", "< 5 seconds (30-day window)"],
                ["NFR-P-05", "Agent CPU overhead", "≤ 5% on idle endpoints"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Security</h3>
            <div className="space-y-2">
              {[
                "All agent ↔ manager communication must use TLS 1.2+",
                "SIEM web interface requires authentication — change default credentials before testing",
                "VM snapshots before any attack simulation (labeled with date + scenario ID)",
                "Host-only adapter must never be bridged to physical network",
                "PowerShell transcript logs encrypted at rest if containing decoded payloads",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-card border border-border">
                  <span className="text-primary font-mono text-xs mt-0.5">▸</span>
                  <span className="text-xs text-foreground/80">{item}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">Maintainability</h3>
            <div className="space-y-2">
              {[
                "Detection rules must include inline comments explaining logic",
                "Naming convention: DET-{CATEGORY}-{PLATFORM}-{SEQUENCE}",
                "CHANGELOG.md documenting all rule changes",
                "Rule files stored in Git, tagged with SRS version",
                "Annual review aligned with MITRE ATT&CK updates",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-card border border-border">
                  <span className="text-primary font-mono text-xs mt-0.5">▸</span>
                  <span className="text-xs text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* APPENDIX */}
          <section id="appendix">
            <SectionHeading id="app-heading" number="08" title="Appendices" icon={BookOpen} description="Event ID reference and MITRE ATT&CK coverage map" />

            <h3 className="text-lg font-display font-semibold text-foreground mb-3">Key Windows Event IDs</h3>
            <DataTable
              compact
              headers={["Event ID", "Source", "Description"]}
              rows={[
                ["4624", "Security", "Successful logon — brute force success chaining"],
                ["4625", "Security", "Failed logon — brute force primary indicator"],
                ["4648", "Security", "Explicit credentials (RunAs) — lateral movement"],
                ["4672", "Security", "Special privileges — SeDebugPrivilege detection"],
                ["4688", "Security", "Process creation with command line"],
                ["4698", "Security", "Scheduled task creation — persistence indicator"],
                ["4720", "Security", "New user account created"],
                ["4728", "Security", "Member added to domain global group"],
                ["4732", "Security", "Member added to local group (Administrators)"],
                ["1 (Sysmon)", "Sysmon", "Process creation with full CommandLine"],
                ["3 (Sysmon)", "Sysmon", "Network connection — C2, lateral movement"],
                ["10 (Sysmon)", "Sysmon", "Process access — LSASS credential dumping"],
                ["4103/4104", "PowerShell", "Script block and module logging"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">MITRE ATT&CK Coverage Map</h3>
            <DataTable
              headers={["Tactic", "Technique", "Sub-technique", "Covered By"]}
              rows={[
                ["Credential Access", "T1110", "T1110.001 Password Guessing", "DET-BF-WIN-001, DET-BF-LNX-001"],
                ["Execution", "T1059", "T1059.001 PowerShell", "DET-PS-001, DET-PS-002, DET-PS-003"],
                ["Defense Evasion", "T1027", "T1027.010 Command Obfuscation", "DET-PS-001"],
                ["Defense Evasion", "T1562", "T1562.001 Disable/Modify Tools", "DET-PS-004"],
                ["Privilege Escalation", "T1078", "T1078.001 Local Accounts", "DET-PE-WIN-001"],
                ["Privilege Escalation", "T1134", "T1134.001 Token Impersonation", "DET-PE-WIN-002"],
                ["Privilege Escalation", "T1548", "T1548.001 Setuid/Setgid", "DET-PE-LNX-002"],
                ["Privilege Escalation", "T1548", "T1548.003 Sudo Caching", "DET-PE-LNX-001"],
                ["Persistence", "T1053", "T1053.005 Scheduled Task", "DET-PE-WIN-003"],
                ["Lateral Movement", "T1105", "Ingress Tool Transfer", "DET-PS-002"],
              ]}
            />

            <h3 className="text-lg font-display font-semibold text-foreground mt-8 mb-3">References</h3>
            <div className="space-y-2 mb-8">
              {[
                "MITRE ATT&CK Framework v14 — https://attack.mitre.org",
                "Wazuh 4.x Documentation — https://documentation.wazuh.com",
                "SwiftOnSecurity Sysmon Config — https://github.com/SwiftOnSecurity/sysmon-config",
                "Florian Roth auditd Rules — https://github.com/Neo23x0/auditd",
                "Splunk Free Documentation — https://docs.splunk.com",
              ].map((ref, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-md">
                  <span className="text-primary font-mono text-xs mt-0.5">{i + 1}.</span>
                  <span className="text-xs font-mono text-muted-foreground">{ref}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-[10px] font-mono text-muted-foreground">
              Blue Team Security Operations • Internal Use Only • SRS-SOC-2026-001 v1.0
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
