# Mini SOC Lab

**Blue Team Detection & Response Platform** -- SRS-SOC-2026-001 v1.0

A production-ready, interactive Software Requirements Specification (SRS) viewer and deployment toolkit for a self-contained, virtualized Security Operations Center home lab. Designed for Blue Team practitioners to practice log ingestion, detection engineering, threat hunting, and incident response workflows.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix primitives) |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | React Router DOM 6 |
| State | React Query, localStorage persistence |
| SIEM Integration | Wazuh 4.x REST API (JWT auth) |
| Package Manager | npm |

## Features

### SRS Documentation Viewer
- Dark cybersecurity-themed UI with glassmorphism effects and animated particle background
- Interactive side navigation with scroll-based active tracking and reading progress indicator
- 12 detection rules across 3 attack categories with severity-striped cards and filterable search
- Wazuh XML and Splunk SPL rule examples in terminal-styled code blocks with copy-to-clipboard and line numbers
- VM infrastructure specs, network architecture diagram (SVG with animated connections)
- MITRE ATT&CK coverage matrix (6 tactics, 12 techniques, interactive detail panels)
- Security dashboard visualizations (BarChart, PieChart, AreaChart, heatmap)
- Interactive VM setup checklists with persistent progress (localStorage)
- Response playbooks with step-by-step terminal commands
- Sysmon configuration viewer with event type toggles
- Back-to-top button, reading progress bar, animated stat counters
- Mobile-responsive layout with collapsible sidebar

### Production Deployment Toolkit
- **Wazuh detection rules** (`rules/wazuh/`) -- deployable XML rules for brute force, PowerShell abuse, and privilege escalation
- **Sysmon configuration** (`configs/sysmon/sysmonconfig.xml`) -- production-ready config based on SwiftOnSecurity baseline
- **auditd rules** (`configs/auditd/audit.rules`) -- Linux audit rules based on Florian Roth baseline
- **Deployment scripts** (`scripts/`) -- automated rule deployment via SSH/WinRM
- **Environment configuration** (`src/config/environment.ts`) -- centralized IPs, API URLs, feature flags
- **Wazuh API service** (`src/services/wazuhApi.ts`) -- typed API client with JWT auth and graceful fallback
- **Live data integration** -- dashboards connect to real Wazuh API when `VITE_USE_LIVE_DATA=true`

## Detection Rules

### Brute Force (3 rules)
| Rule ID | Name | Severity | ATT&CK |
|---------|------|----------|--------|
| DET-BF-WIN-001 | Windows RDP / Local Account Brute Force | HIGH | T1110.001 |
| DET-BF-LNX-001 | Linux SSH Brute Force | HIGH | T1110.001 |
| DET-BF-WIN-002 | Successful Logon Following Brute Force | CRITICAL | T1110 |

### PowerShell Abuse (4 rules)
| Rule ID | Name | Severity | ATT&CK |
|---------|------|----------|--------|
| DET-PS-001 | Encoded PowerShell Command Execution | HIGH | T1059.001 |
| DET-PS-002 | PowerShell Download Cradle / Fileless Attack | CRITICAL | T1059.001, T1105 |
| DET-PS-003 | Execution Policy Bypass | MEDIUM | T1059.001, T1562.001 |
| DET-PS-004 | AMSI Bypass Attempt | CRITICAL | T1562.001 |

### Privilege Escalation (5 rules)
| Rule ID | Name | Severity | ATT&CK |
|---------|------|----------|--------|
| DET-PE-WIN-001 | User Added to Local Administrators Group | CRITICAL | T1078.001 |
| DET-PE-LNX-001 | Sudo Privilege Escalation | HIGH | T1548.003 |
| DET-PE-LNX-002 | SUID Binary Abuse | HIGH | T1548.001 |
| DET-PE-WIN-002 | Token Impersonation / SeDebugPrivilege | CRITICAL | T1134.001 |
| DET-PE-WIN-003 | Scheduled Task by Non-Admin User | MEDIUM | T1053.005 |

## Getting Started

```sh
# Clone the repository
git clone <repo-url>
cd Mini-SOC-Lab

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```sh
cp .env.example .env
```

Key variables:
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_USE_LIVE_DATA` | Connect to real Wazuh API | `false` |
| `VITE_WAZUH_API_URL` | Wazuh API endpoint | `https://192.168.56.100:55000` |
| `VITE_SIEM_SERVER_IP` | SIEM server IP | `192.168.56.100` |
| `VITE_DASHBOARD_REFRESH` | Dashboard auto-refresh interval (ms) | `60000` |

## Project Structure

```
Mini-SOC-Lab/
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (49 components)
│   │   ├── CodeBlock.tsx        # Terminal code display + copy + line numbers
│   │   ├── DataTable.tsx        # Zebra-striped data tables
│   │   ├── DashboardSection.tsx # SOC dashboards (Recharts + live API)
│   │   ├── DetectionCard.tsx    # Severity-striped detection rule cards
│   │   ├── DetectionFilter.tsx  # Search + severity + category filters
│   │   ├── HeroSection.tsx      # Animated hero with particle canvas + counters
│   │   ├── MitreAttackMap.tsx   # Interactive ATT&CK coverage matrix
│   │   ├── NetworkDiagram.tsx   # SVG network topology with animated flows
│   │   ├── ResponsePlaybook.tsx # Accordion playbooks with copy-able commands
│   │   ├── SectionHeading.tsx   # Numbered section headers with icon badges
│   │   ├── SetupChecklist.tsx   # Persistent VM setup checklists
│   │   ├── SeverityBadge.tsx    # Color-coded severity indicator
│   │   ├── SideNav.tsx          # Sidebar with scroll progress + active tracking
│   │   └── SysmonConfig.tsx     # Sysmon event type viewer
│   ├── config/
│   │   └── environment.ts       # Centralized environment configuration
│   ├── services/
│   │   ├── wazuhApi.ts          # Typed Wazuh REST API client (JWT)
│   │   └── localStorage.ts     # Namespaced persistent state service
│   ├── pages/
│   │   ├── Index.tsx            # Main SRS viewer (11 sections)
│   │   └── NotFound.tsx         # Cybersecurity-themed 404 page
│   ├── test/
│   │   └── components.test.tsx  # Unit tests (11 passing)
│   ├── index.css                # Theme, glassmorphism, particles, scrollbar
│   ├── App.tsx                  # Router and providers
│   └── main.tsx                 # Entry point
├── rules/
│   └── wazuh/                   # Deployable Wazuh XML detection rules
│       ├── brute_force.xml
│       ├── powershell_abuse.xml
│       └── privilege_escalation.xml
├── configs/
│   ├── sysmon/sysmonconfig.xml  # Production Sysmon v4.90 config
│   └── auditd/audit.rules      # Production auditd rules
├── scripts/
│   ├── deploy-rules.sh          # Wazuh rule deployment (SSH)
│   ├── deploy-sysmon.ps1        # Sysmon config deployment (WinRM)
│   └── deploy-auditd.sh         # auditd rule deployment (SSH)
├── docs/progress/               # Phase completion documentation
├── .env.example                 # Environment variable template
├── CHANGELOG.md                 # Release history
└── tailwind.config.ts           # Theme configuration
```

## Infrastructure

All VMs reside on a dedicated host-only network segment `192.168.56.0/24` with no external routing:

| Host | IP Address | Role |
|------|-----------|------|
| SIEM Server | 192.168.56.100 | Wazuh Manager + Indexer + Dashboard |
| Windows Endpoint | 192.168.56.10 | Attack Target / Log Source |
| Linux Endpoint | 192.168.56.11 | Attack Target / Log Source |
| Host Machine | 192.168.56.1 | Hypervisor Gateway |

## Deployment

### Deploy Wazuh Rules
```sh
./scripts/deploy-rules.sh
```

### Deploy Sysmon Config (Windows endpoints)
```powershell
.\scripts\deploy-sysmon.ps1
```

### Deploy auditd Rules (Linux endpoints)
```sh
./scripts/deploy-auditd.sh
```

## License

Confidential -- Internal Use Only
