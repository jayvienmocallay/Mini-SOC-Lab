```text
███╗   ███╗██╗███╗   ██╗██╗    ███████╗ ██████╗  ██████╗    ██╗      █████╗ ██████╗
████╗ ████║██║████╗  ██║██║    ██╔════╝██╔═══██╗██╔════╝    ██║     ██╔══██╗██╔══██╗
██╔████╔██║██║██╔██╗ ██║██║    ███████╗██║   ██║██║         ██║     ███████║██████╔╝
██║╚██╔╝██║██║██║╚██╗██║██║    ╚════██║██║   ██║██║         ██║     ██╔══██║██╔══██╗
██║ ╚═╝ ██║██║██║ ╚████║██║    ███████║╚██████╔╝╚██████╗    ███████╗██║  ██║██████╔╝
╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝    ╚══════╝ ╚═════╝  ╚═════╝    ╚══════╝╚═╝  ╚═╝╚═════╝
```

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)
![SIEM](https://img.shields.io/badge/SIEM-Wazuh%204.x-0B3D91)
![Package Manager](https://img.shields.io/badge/Package-npm-CB3837)

Blue Team Detection & Response Platform -- SRS-SOC-2026-001 v1.0

Interactive SOC home-lab platform for detection engineering, log analysis, and incident response training.
Built for hands-on learning with realistic telemetry, deployable rules, and guided workflows.

## What It Does

- Provides a full SRS-style SOC walkthrough with interactive sections and side navigation
- Includes 12 detection rules across 3 attack categories:
	- Brute Force
	- PowerShell Abuse
	- Privilege Escalation
- Visualizes SOC telemetry with 3 dashboard panels:
	- Security Overview
	- Authentication Monitor
	- Agent Health
- Maps detections to MITRE ATT&CK techniques with interactive coverage view
- Ships deployable security configs:
	- Wazuh custom rules
	- Sysmon config (Windows)
	- auditd rules (Linux)
- Supports live Wazuh API data mode with fallback behavior for offline demos
- Provides setup checklists (27 total steps) for Windows, Linux, and SIEM environments

## Quick Start

```sh
# Clone
git clone <repo-url>
cd Mini-SOC-Lab

# Install
npm install

# Run
npm run dev
```

Open the app at the local Vite URL (usually http://localhost:5173).

### Build + Validate

```sh
npm test
npm run build
npm run lint
```

## Demo Detections

| Rule ID | Category | Severity | ATT&CK |
|---|---|---|---|
| DET-BF-WIN-001 | Brute Force | HIGH | T1110.001 |
| DET-BF-LNX-001 | Brute Force | HIGH | T1110.001 |
| DET-BF-WIN-002 | Brute Force | CRITICAL | T1110 |
| DET-PS-001 | PS Abuse | HIGH | T1059.001 |
| DET-PS-002 | PS Abuse | CRITICAL | T1059.001, T1105 |
| DET-PS-003 | PS Abuse | MEDIUM | T1059.001, T1562.001 |
| DET-PS-004 | PS Abuse | CRITICAL | T1562.001 |
| DET-PE-WIN-001 | Priv Esc | CRITICAL | T1078.001 |
| DET-PE-LNX-001 | Priv Esc | HIGH | T1548.003 |
| DET-PE-LNX-002 | Priv Esc | HIGH | T1548.001 |
| DET-PE-WIN-002 | Priv Esc | CRITICAL | T1134.001 |
| DET-PE-WIN-003 | Priv Esc | MEDIUM | T1053.005 |

## Learn

| Module | Topic |
|---|---|
| 00 - Overview | Scope, architecture, and goals |
| 01 - Infrastructure | VM topology and segmentation |
| 02 - Collection | Sysmon, auditd, and forwarding |
| 03 - Detection | Rule logic and ATT&CK mapping |
| 04 - Response | Playbooks and triage workflows |
| 05 - Validation | Test scenarios and acceptance checks |

Detailed usage: [GUIDE.md](GUIDE.md)

## Repository Layout

- [src](src): app pages, components, services, config
- [rules/wazuh](rules/wazuh): deployable Wazuh XML rules
- [configs/sysmon](configs/sysmon): Sysmon configuration
- [configs/auditd](configs/auditd): auditd rule set
- [scripts](scripts): deployment scripts (SSH/WinRM)

## Live Data Mode

1. Copy env template:

```sh
cp .env.example .env
```

2. Set:
- `VITE_USE_LIVE_DATA=true`
- `VITE_WAZUH_API_URL=...`
- `VITE_WAZUH_API_USER=...`

3. Restart dev server:

```sh
npm run dev
```

## License

Confidential -- Internal Use Only