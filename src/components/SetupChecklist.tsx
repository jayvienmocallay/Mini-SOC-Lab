import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Monitor,
  Shield,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { loadState, saveState } from "@/services/localStorage";

interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  codeSnippet?: { title: string; code: string };
}

interface ChecklistSection {
  key: string;
  title: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

const sections: ChecklistSection[] = [
  {
    key: "windows",
    title: "Windows VM",
    icon: <Monitor className="w-4 h-4" />,
    items: [
      {
        id: "win-1",
        label: "Install Windows 10/11 Pro (22H2) with 2 vCPUs, 4GB RAM, 60GB disk",
      },
      {
        id: "win-2",
        label: "Set static IP: 192.168.56.10 on host-only adapter",
        codeSnippet: {
          title: "PowerShell - Set Static IP",
          code: "New-NetIPAddress -InterfaceAlias \"Ethernet\" `\n  -IPAddress 192.168.56.10 `\n  -PrefixLength 24 `\n  -DefaultGateway 192.168.56.1",
        },
      },
      {
        id: "win-3",
        label: "Enable Windows Remote Management (WinRM)",
        codeSnippet: {
          title: "PowerShell - Enable WinRM",
          code: "Enable-PSRemoting -Force\nSet-Item WSMan:\\localhost\\Client\\TrustedHosts -Value \"192.168.56.*\"",
        },
      },
      {
        id: "win-4",
        label: "Install Sysmon v15.x with SwiftOnSecurity config",
        codeSnippet: {
          title: "PowerShell - Install Sysmon",
          code: "# Download Sysmon\nInvoke-WebRequest -Uri \"https://download.sysinternals.com/files/Sysmon.zip\" -OutFile Sysmon.zip\nExpand-Archive Sysmon.zip -DestinationPath C:\\Sysmon\n\n# Download SwiftOnSecurity config\nInvoke-WebRequest -Uri \"https://raw.githubusercontent.com/SwiftOnSecurity/sysmon-config/master/sysmonconfig-export.xml\" `\n  -OutFile C:\\Sysmon\\sysmonconfig.xml\n\n# Install\nC:\\Sysmon\\Sysmon64.exe -accepteula -i C:\\Sysmon\\sysmonconfig.xml",
        },
      },
      {
        id: "win-5",
        label: "Enable PowerShell Script Block Logging",
        detail: "Registry: HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging",
        codeSnippet: {
          title: "PowerShell - Script Block Logging",
          code: "New-Item -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging\" -Force\nSet-ItemProperty -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging\" `\n  -Name \"EnableScriptBlockLogging\" -Value 1",
        },
      },
      {
        id: "win-6",
        label: "Enable PowerShell Module Logging and Transcription to C:\\PSLogs\\",
        codeSnippet: {
          title: "PowerShell - Module Logging & Transcription",
          code: "# Module Logging\nNew-Item -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging\" -Force\nSet-ItemProperty -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging\" `\n  -Name \"EnableModuleLogging\" -Value 1\n\n# Transcription\nNew-Item -Path \"C:\\PSLogs\" -ItemType Directory -Force\nNew-Item -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\Transcription\" -Force\nSet-ItemProperty -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\Transcription\" `\n  -Name \"EnableTranscripting\" -Value 1\nSet-ItemProperty -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\Transcription\" `\n  -Name \"OutputDirectory\" -Value \"C:\\PSLogs\"",
        },
      },
      {
        id: "win-7",
        label: "Enable Advanced Audit Policy (Account Logon, Account Management, Logon/Logoff, Object Access, Privilege Use, Process Creation)",
        codeSnippet: {
          title: "CMD - Advanced Audit Policy",
          code: "auditpol /set /subcategory:\"Credential Validation\" /success:enable /failure:enable\nauditpol /set /subcategory:\"User Account Management\" /success:enable /failure:enable\nauditpol /set /subcategory:\"Logon\" /success:enable /failure:enable\nauditpol /set /subcategory:\"Logoff\" /success:enable\nauditpol /set /subcategory:\"File System\" /success:enable /failure:enable\nauditpol /set /subcategory:\"Sensitive Privilege Use\" /success:enable /failure:enable\nauditpol /set /subcategory:\"Process Creation\" /success:enable",
        },
      },
      {
        id: "win-8",
        label: "Create test user: testuser / Password123!",
        codeSnippet: {
          title: "CMD - Create Test User",
          code: "net user testuser Password123! /add\nnet localgroup \"Remote Desktop Users\" testuser /add",
        },
      },
      {
        id: "win-9",
        label: "Install Wazuh Agent 4.x pointing to 192.168.56.100:1514",
        codeSnippet: {
          title: "PowerShell - Install Wazuh Agent",
          code: "Invoke-WebRequest -Uri \"https://packages.wazuh.com/4.x/windows/wazuh-agent-4.x-1.msi\" `\n  -OutFile wazuh-agent.msi\n\nmsiexec.exe /i wazuh-agent.msi /q `\n  WAZUH_MANAGER=\"192.168.56.100\" `\n  WAZUH_REGISTRATION_SERVER=\"192.168.56.100\" `\n  WAZUH_AGENT_GROUP=\"windows\"\n\nNET START WazuhSvc",
        },
      },
    ],
  },
  {
    key: "linux",
    title: "Linux VM",
    icon: <Terminal className="w-4 h-4" />,
    items: [
      {
        id: "lin-1",
        label: "Install Ubuntu Server 22.04 LTS with 2 vCPUs, 2GB RAM, 40GB disk",
      },
      {
        id: "lin-2",
        label: "Set static IP: 192.168.56.11 on host-only adapter",
        codeSnippet: {
          title: "Netplan - /etc/netplan/01-hostonly.yaml",
          code: "network:\n  version: 2\n  ethernets:\n    enp0s8:\n      addresses:\n        - 192.168.56.11/24",
        },
      },
      {
        id: "lin-3",
        label: "Install and configure auditd with Florian Roth rules",
        codeSnippet: {
          title: "Bash - Install auditd",
          code: "sudo apt install auditd audispd-plugins -y\nsudo systemctl enable auditd\n\n# Download Florian Roth audit rules\nsudo curl -o /etc/audit/rules.d/audit.rules \\\n  https://raw.githubusercontent.com/Neo23x0/auditd/master/audit.rules\n\nsudo systemctl restart auditd",
        },
      },
      {
        id: "lin-4",
        label: "Configure rsyslog to forward auth.log, syslog, kern.log",
        codeSnippet: {
          title: "rsyslog - /etc/rsyslog.d/50-forward.conf",
          code: "auth,authpriv.*    @@192.168.56.100:514\n*.*                @@192.168.56.100:514\nkern.*             @@192.168.56.100:514",
        },
      },
      {
        id: "lin-5",
        label: "Enable PAM authentication logging",
        codeSnippet: {
          title: "Bash - PAM Config",
          code: "# Verify PAM auth logging is active\ngrep -r \"pam_unix\" /etc/pam.d/common-auth\n# Should show: auth required pam_unix.so\n\n# Verify sshd PAM\ngrep \"UsePAM\" /etc/ssh/sshd_config\n# Should show: UsePAM yes",
        },
      },
      {
        id: "lin-6",
        label: "Create test user: testuser / password123",
        codeSnippet: {
          title: "Bash - Create Test User",
          code: "sudo useradd -m -s /bin/bash testuser\necho \"testuser:password123\" | sudo chpasswd\nsudo usermod -aG sudo testuser",
        },
      },
      {
        id: "lin-7",
        label: "Configure sudo logging (Defaults logfile=/var/log/sudo.log)",
        codeSnippet: {
          title: "Bash - Sudo Logging",
          code: "echo 'Defaults logfile=\"/var/log/sudo.log\"' | sudo tee /etc/sudoers.d/logging\nsudo chmod 440 /etc/sudoers.d/logging",
        },
      },
      {
        id: "lin-8",
        label: "Install Wazuh Agent pointing to 192.168.56.100:1514",
        codeSnippet: {
          title: "Bash - Install Wazuh Agent",
          code: "curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --no-default-keyring \\\n  --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && sudo chmod 644 /usr/share/keyrings/wazuh.gpg\n\necho \"deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main\" \\\n  | sudo tee /etc/apt/sources.list.d/wazuh.list\n\nsudo apt update && sudo apt install wazuh-agent -y\n\n# Configure manager address\nsudo sed -i 's/MANAGER_IP/192.168.56.100/' /var/ossec/etc/ossec.conf\n\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent",
        },
      },
      {
        id: "lin-9",
        label: "Disable UFW on host-only interface",
        codeSnippet: {
          title: "Bash - Disable UFW on host-only",
          code: "sudo ufw allow in on enp0s8\nsudo ufw reload",
        },
      },
    ],
  },
  {
    key: "siem",
    title: "SIEM Server",
    icon: <Shield className="w-4 h-4" />,
    items: [
      {
        id: "siem-1",
        label: "Install Ubuntu Server 22.04 LTS with 4 vCPUs, 8GB RAM, 100GB disk",
      },
      {
        id: "siem-2",
        label: "Set static IP: 192.168.56.100 on host-only adapter",
        codeSnippet: {
          title: "Netplan - /etc/netplan/01-hostonly.yaml",
          code: "network:\n  version: 2\n  ethernets:\n    enp0s8:\n      addresses:\n        - 192.168.56.100/24",
        },
      },
      {
        id: "siem-3",
        label: "Deploy Wazuh all-in-one (Manager + Indexer + Dashboard)",
        codeSnippet: {
          title: "Bash - Wazuh All-in-One Install",
          code: "curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh\ncurl -sO https://packages.wazuh.com/4.7/config.yml\n\n# Edit config.yml with your IP\nsed -i 's/<indexer-node-ip>/192.168.56.100/' config.yml\nsed -i 's/<wazuh-manager-ip>/192.168.56.100/' config.yml\nsed -i 's/<dashboard-node-ip>/192.168.56.100/' config.yml\n\nsudo bash wazuh-install.sh -a",
        },
      },
      {
        id: "siem-4",
        label: "Configure OpenSearch heap: -Xms2g -Xmx2g",
        codeSnippet: {
          title: "Bash - OpenSearch Heap",
          code: "sudo sed -i 's/-Xms1g/-Xms2g/' /etc/wazuh-indexer/jvm.options\nsudo sed -i 's/-Xmx1g/-Xmx2g/' /etc/wazuh-indexer/jvm.options\nsudo systemctl restart wazuh-indexer",
        },
      },
      {
        id: "siem-5",
        label: "Verify dashboard accessible at https://192.168.56.100:443",
        codeSnippet: {
          title: "Bash - Verify Dashboard",
          code: "curl -sk https://192.168.56.100:443 | head -20\n# Default credentials: admin / admin",
        },
      },
      {
        id: "siem-6",
        label: "Change default admin credentials",
        codeSnippet: {
          title: "Bash - Change Admin Password",
          code: "sudo /usr/share/wazuh-indexer/plugins/opensearch-security/tools/wazuh-passwords-tool.sh \\\n  -u admin -p 'YourNewStrongPassword!'",
        },
      },
      {
        id: "siem-7",
        label: "Configure index rotation: 30-day retention, daily rotation",
        codeSnippet: {
          title: "Bash - Index Rotation via ISM Policy",
          code: "curl -sk -u admin:YourNewStrongPassword! \\\n  -X PUT \"https://192.168.56.100:9200/_plugins/_ism/policies/wazuh-retention\" \\\n  -H 'Content-Type: application/json' -d '{\n  \"policy\": {\n    \"description\": \"Wazuh 30-day retention\",\n    \"default_state\": \"hot\",\n    \"states\": [{\n      \"name\": \"hot\",\n      \"transitions\": [{\n        \"state_name\": \"delete\",\n        \"conditions\": { \"min_index_age\": \"30d\" }\n      }]\n    }, {\n      \"name\": \"delete\",\n      \"actions\": [{ \"delete\": {} }]\n    }],\n    \"ism_template\": [{\n      \"index_patterns\": [\"wazuh-alerts-*\"],\n      \"priority\": 1\n    }]\n  }\n}'",
        },
      },
      {
        id: "siem-8",
        label: "Enable MITRE ATT&CK module",
        detail: "Dashboard > Modules > MITRE ATT&CK > Enable",
      },
      {
        id: "siem-9",
        label: "Verify all agents show 'Active' status",
        codeSnippet: {
          title: "Bash - Check Agent Status",
          code: "sudo /var/ossec/bin/agent_control -l\n# All agents should show \"Active\"",
        },
      },
    ],
  },
];

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3 },
  }),
};

const SetupChecklist = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    loadState("setup-checklist", {} as Record<string, boolean>)
  );
  const [expandedSnippets, setExpandedSnippets] = useState<Record<string, boolean>>({});

  // Persist checklist state to localStorage on every change
  useEffect(() => {
    saveState("setup-checklist", checked);
  }, [checked]);

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSnippet = (id: string) => {
    setExpandedSnippets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getProgress = (sectionKey: string) => {
    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return 0;
    const total = section.items.length;
    const done = section.items.filter((item) => checked[item.id]).length;
    return Math.round((done / total) * 100);
  };

  const totalProgress = useMemo(() => {
    const allItems = sections.flatMap((s) => s.items);
    const done = allItems.filter((item) => checked[item.id]).length;
    return Math.round((done / allItems.length) * 100);
  }, [checked]);

  return (
    <div className="space-y-6">
      {/* Critical Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10"
      >
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-destructive font-mono">
            CRITICAL: Isolated Network Required
          </p>
          <p className="text-xs text-destructive/80 mt-1 font-mono leading-relaxed">
            All VMs must operate on a VirtualBox Host-Only network
            (192.168.56.0/24). Do NOT connect attack simulation VMs to your
            production network. The host-only adapter ensures complete isolation
            from external networks.
          </p>
        </div>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-lg border border-border bg-card glow-box"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-mono text-foreground">
            Overall Setup Progress
          </span>
          <span className="text-sm font-mono text-primary">
            {totalProgress}%
          </span>
        </div>
        <Progress value={totalProgress} className="h-2" />
        {totalProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 mt-3 text-primary"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-mono">
              All setup steps complete -- SOC Lab is ready for operation.
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="windows" className="w-full">
        <TabsList className="w-full bg-secondary border border-border">
          {sections.map((section) => (
            <TabsTrigger
              key={section.key}
              value={section.key}
              className="flex-1 gap-2 font-mono text-xs data-[state=active]:text-primary data-[state=active]:bg-card"
            >
              {section.icon}
              {section.title}
              <span className="ml-1 text-muted-foreground">
                {getProgress(section.key)}%
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => {
          const progress = getProgress(section.key);
          const completedCount = section.items.filter(
            (item) => checked[item.id]
          ).length;

          return (
            <TabsContent key={section.key} value={section.key}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border border-border bg-card p-4 space-y-4"
              >
                {/* Section Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      {completedCount} of {section.items.length} steps completed
                    </span>
                    <span className="text-xs font-mono text-primary">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>

                {/* Checklist Items */}
                <div className="space-y-1">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <div
                        className={`group rounded-md border transition-all duration-200 ${
                          checked[item.id]
                            ? "border-primary/30 bg-primary/5"
                            : "border-border/50 bg-background/30 hover:border-border hover:bg-background/50"
                        }`}
                      >
                        <div className="flex items-start gap-3 p-3">
                          <Checkbox
                            id={item.id}
                            checked={!!checked[item.id]}
                            onCheckedChange={() => toggleCheck(item.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={item.id}
                              className={`text-sm font-mono cursor-pointer leading-relaxed transition-colors ${
                                checked[item.id]
                                  ? "text-primary line-through opacity-70"
                                  : "text-foreground"
                              }`}
                            >
                              <span className="text-muted-foreground mr-2">
                                {String(index + 1).padStart(2, "0")}.
                              </span>
                              {item.label}
                            </label>
                            {item.detail && (
                              <p className="text-xs font-mono text-muted-foreground mt-1 ml-7">
                                {item.detail}
                              </p>
                            )}
                            {item.codeSnippet && (
                              <div className="mt-1 ml-7">
                                <button
                                  onClick={() => toggleSnippet(item.id)}
                                  className="text-xs font-mono text-accent hover:text-primary transition-colors"
                                >
                                  {expandedSnippets[item.id]
                                    ? "[-] Hide command"
                                    : "[+] Show command"}
                                </button>
                                <AnimatePresence>
                                  {expandedSnippets[item.id] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <CodeBlock title={item.codeSnippet.title}>
                                        {item.codeSnippet.code}
                                      </CodeBlock>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {progress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 p-3 rounded-md bg-primary/10 border border-primary/30"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-primary">
                      {section.title} setup complete
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default SetupChecklist;
