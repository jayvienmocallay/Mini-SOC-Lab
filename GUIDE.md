# Mini SOC Lab — User Guide

A complete guide to using the Mini SOC Lab application, from initial setup to deploying detection rules in a live environment.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Running the Application](#3-running-the-application)
4. [Navigating the SRS Viewer](#4-navigating-the-srs-viewer)
5. [Interactive Features](#5-interactive-features)
   - [Setup Checklists](#setup-checklists)
   - [Detection Rule Search & Filter](#detection-rule-search--filter)
   - [Dashboard Visualizations](#dashboard-visualizations)
   - [MITRE ATT&CK Matrix](#mitre-attck-matrix)
   - [Response Playbooks](#response-playbooks)
   - [Code Blocks](#code-blocks)
6. [Connecting to a Live Wazuh Instance](#6-connecting-to-a-live-wazuh-instance)
7. [Deploying Detection Rules](#7-deploying-detection-rules)
   - [Wazuh Rules](#wazuh-rules)
   - [Sysmon Configuration](#sysmon-configuration)
   - [auditd Rules](#auditd-rules)
8. [Running Tests](#8-running-tests)
9. [Building for Production](#9-building-for-production)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Before you begin, make sure you have the following installed:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | 9+ | Package manager (ships with Node.js) |
| Git | 2.x | Version control |
| Modern browser | Chrome, Firefox, Edge | Viewing the application |

**For live SIEM integration (optional):**

| Requirement | Version | Purpose |
|-------------|---------|---------|
| VirtualBox or VMware | 6.x+ / 17+ | VM hypervisor |
| Wazuh | 4.x | SIEM platform |
| Windows 10/11 VM | 22H2 | Windows endpoint |
| Ubuntu Server VM | 22.04 LTS | Linux endpoint + SIEM server |

---

## 2. Installation

```sh
# Clone the repository
git clone <repo-url>
cd Mini-SOC-Lab

# Install dependencies
npm install
```

### Environment Configuration (Optional)

If you plan to connect to a live Wazuh instance, create a `.env` file:

```sh
cp .env.example .env
```

Edit `.env` with your environment values. All variables are optional — the app works out of the box without them.

| Variable | What it does | Default |
|----------|-------------|---------|
| `VITE_USE_LIVE_DATA` | Enable real-time Wazuh API data | `false` |
| `VITE_WAZUH_API_URL` | Wazuh manager API endpoint | `https://192.168.56.100:55000` |
| `VITE_WAZUH_API_USER` | Wazuh API username | `wazuh-wui` |
| `VITE_SIEM_IP` | SIEM server IP (shown in diagrams) | `192.168.56.100` |
| `VITE_WIN_EP_IP` | Windows endpoint IP | `192.168.56.10` |
| `VITE_LINUX_EP_IP` | Linux endpoint IP | `192.168.56.11` |
| `VITE_DASHBOARD_REFRESH` | Dashboard auto-refresh interval (ms) | `60000` |
| `VITE_AGENT_HEALTH_REFRESH` | Agent health poll interval (ms) | `300000` |
| `VITE_AUTH_MONITOR_REFRESH` | Auth monitor poll interval (ms) | `30000` |

---

## 3. Running the Application

```sh
# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port). Open it in your browser.

To preview a production build locally:

```sh
npm run build
npm run preview
```

---

## 4. Navigating the SRS Viewer

### Sidebar Navigation

The left sidebar lists all 12 sections of the SRS document. Click any section to smooth-scroll to it. The sidebar highlights the section you're currently reading.

**On desktop:** The sidebar is always visible (fixed, 256px wide).

**On mobile:** Tap the hamburger menu icon (top-left) to open the sidebar. Tap a section or the backdrop to close it.

### Reading Progress

- The **green progress bar** at the very top of the page shows how far you've scrolled through the document.
- The sidebar also displays a mini progress bar and a **"% read"** counter under the logo.

### Back to Top

A floating **arrow-up button** appears in the bottom-right corner after scrolling down. Click it to return to the top of the page.

### Sections Overview

| # | Section | What's Inside |
|---|---------|---------------|
| 01 | Purpose & Scope | Document purpose, user classes, glossary |
| 02 | Infrastructure | VM specs, network diagram, Sysmon config, agent install commands |
| 03 | Setup Checklists | Step-by-step VM provisioning guides with persistent checkboxes |
| 04 | Log Collection | Windows/Linux log sources, forwarding requirements |
| 05 | SIEM Platform | Wazuh vs Splunk comparison, required dashboards |
| 06 | Dashboards | Interactive chart mockups (severity, auth, agent health) |
| 07 | Detection Rules | All 12 rules with search/filter, Wazuh XML and Splunk SPL examples |
| 08 | Response Playbooks | Step-by-step incident response for each detection category |
| 09 | Testing & Validation | Attack simulation scenarios, acceptance criteria, FP baseline |
| 10 | Non-Functional | Performance targets, security requirements, maintainability |
| 11 | Appendices | Windows Event ID reference, MITRE ATT&CK matrix, references |

---

## 5. Interactive Features

### Setup Checklists

**Location:** Section 03 — Setup Checklists

Three tabbed checklists walk you through provisioning each VM:

- **Windows VM** — 9 steps (OS install, networking, Sysmon, Wazuh agent, etc.)
- **Linux VM** — 9 steps (OS install, networking, auditd, Wazuh agent, etc.)
- **SIEM Server** — 9 steps (Wazuh manager, indexer, dashboard, rules, etc.)

**How to use:**
1. Select a tab (Windows VM / Linux VM / SIEM Server).
2. Check off each step as you complete it. Expand any step to see the exact commands.
3. Track your progress with the per-tab and overall progress bars.
4. **Your progress is saved automatically.** Close the browser, come back later, and your checkmarks will still be there. Progress is stored in your browser's localStorage.

### Detection Rule Search & Filter

**Location:** Section 07 — Detection Engineering

The filter toolbar at the top of the detection rules section lets you narrow down the 12 rules:

- **Search box** — Type to search by rule ID (e.g., `DET-BF`), rule name, or MITRE ATT&CK technique (e.g., `T1110`).
- **Severity buttons** — Filter by `CRITICAL`, `HIGH`, or `MEDIUM`. Click `ALL` to reset.
- **Category buttons** — Filter by `Brute Force`, `PS Abuse`, or `Priv Esc`. Click `ALL` to reset.
- **Clear button** — Appears when any filter is active. Click to reset everything.

Each detection card shows the rule ID, name, severity badge, category, ATT&CK technique mapping, log source, and trigger logic. Cards have a colored left border matching their severity level.

### Dashboard Visualizations

**Location:** Section 06 — Dashboard Mockups

Three dashboard panels demonstrate the SOC monitoring views:

1. **Security Overview** — Bar chart (alerts by severity), pie chart (alert categories), area chart (24-hour event timeline).
2. **Authentication Monitor** — Failed login heatmap (7 days × 24 hours), stat cards (failed logins, unique IPs, brute force candidates, accounts targeted).
3. **Agent Health** — Status cards for each agent (SIEM, Windows, Linux) showing connectivity, ingestion rate (EPS), and uptime.

**With live data enabled** (see [Section 6](#6-connecting-to-a-live-wazuh-instance)):
- A green "Connected" banner appears when the Wazuh API is reachable.
- Charts populate with real alert data.
- A refresh button lets you manually pull the latest data.
- Dashboards auto-refresh at the configured interval.

**Without live data:** Charts display zero-state data (not fake numbers).

### MITRE ATT&CK Matrix

**Location:** Section 11 — Appendices

An interactive matrix showing which MITRE ATT&CK techniques are covered by the lab's detection rules.

- **6 tactic columns**: Credential Access, Execution, Defense Evasion, Privilege Escalation, Persistence, Lateral Movement.
- **12 technique cards**: Each shows the technique ID, name, and which detection rules cover it.
- **Click any technique** to expand a detail panel showing the mapped rules.
- **Click the X button** or click the technique again to collapse.

### Response Playbooks

**Location:** Section 08 — Response Playbooks

Three accordion-style playbooks for incident response:

1. **Brute Force Response** — 5 steps (block IP, disable account, review logons, check success events, password reset).
2. **PowerShell Abuse Response** — 6 steps (isolate endpoint, capture transcripts, decode payloads, check persistence, verify AV, image endpoint).
3. **Privilege Escalation Response** — 6 steps (verify authorization, audit actions, remove users, review logs, audit SUID, check Mimikatz).

**How to use:**
- Click a playbook header to expand it.
- Critical steps are highlighted in red with a warning icon.
- Terminal commands are provided in copyable code blocks — hover over any command block and click the **copy** button.
- MITRE ATT&CK technique tags are displayed on each playbook.

### Code Blocks

Throughout the document, terminal-styled code blocks display configuration files, Wazuh rules, Splunk queries, and shell commands.

- **Line numbers** are displayed on the left for reference.
- **Copy to clipboard** — Hover over any code block to reveal the **Copy** button in the top-right corner. Click to copy the full contents.
- **Syntax context** — The header bar shows the filename or language.

---

## 6. Connecting to a Live Wazuh Instance

To see real data in the dashboards instead of zero-state placeholders:

### Step 1 — Set Up Your Lab Environment

Follow the setup checklists in Section 03 to provision:
- A Wazuh SIEM server (Ubuntu 22.04, 192.168.56.100)
- A Windows endpoint with Sysmon + Wazuh agent (192.168.56.10)
- A Linux endpoint with auditd + Wazuh agent (192.168.56.11)

All VMs should be on a **host-only network** (`192.168.56.0/24`) with no external routing.

### Step 2 — Configure Environment Variables

Edit your `.env` file:

```sh
VITE_USE_LIVE_DATA=true
VITE_WAZUH_API_URL=https://192.168.56.100:55000
VITE_WAZUH_API_USER=wazuh-wui
```

### Step 3 — Restart the Dev Server

```sh
# Stop the running server (Ctrl+C), then:
npm run dev
```

### Step 4 — Verify Connection

Open the app and scroll to Section 06 (Dashboards). You should see:
- A green **"Connected to Wazuh API"** banner.
- Charts populated with real alert data from your SIEM.
- Agent health cards showing actual agent status.

If you see a red "Disconnected" banner, check:
- Is the Wazuh manager running? (`systemctl status wazuh-manager`)
- Is the API accessible from your host? (`curl -k https://192.168.56.100:55000`)
- Are the API credentials correct?

---

## 7. Deploying Detection Rules

The `rules/`, `configs/`, and `scripts/` directories contain production-ready files that can be deployed directly to your lab environment.

### Wazuh Rules

**Files:** `rules/wazuh/brute_force.xml`, `powershell_abuse.xml`, `privilege_escalation.xml`

**Manual deployment:**
```sh
# SSH into your Wazuh manager
ssh user@192.168.56.100

# Copy rules to the custom rules directory
sudo cp brute_force.xml /var/ossec/etc/rules/
sudo cp powershell_abuse.xml /var/ossec/etc/rules/
sudo cp privilege_escalation.xml /var/ossec/etc/rules/

# Validate the rules
sudo /var/ossec/bin/wazuh-analysisd -t

# Restart Wazuh manager to load new rules
sudo systemctl restart wazuh-manager
```

**Automated deployment:**
```sh
# From the project root — deploys all rules via SSH with backup and validation
./scripts/deploy-rules.sh
```

### Sysmon Configuration

**File:** `configs/sysmon/sysmonconfig.xml`

This is a production-ready Sysmon v4.90 configuration based on the SwiftOnSecurity baseline. It monitors:
- Process creation (Event 1) with command-line capture
- Network connections (Event 3)
- Image loads (Event 7)
- Process access (Event 10) — LSASS credential dumping detection
- File creation (Event 11)
- Registry changes (Events 12-14)
- DNS queries (Event 22)

**Manual deployment (on the Windows endpoint):**
```powershell
# Download and install Sysmon (if not already installed)
.\Sysmon64.exe -accepteula -i sysmonconfig.xml

# Or update an existing Sysmon installation
.\Sysmon64.exe -c sysmonconfig.xml
```

**Automated deployment:**
```powershell
# From the project root — deploys to Windows endpoints via WinRM
.\scripts\deploy-sysmon.ps1
```

### auditd Rules

**File:** `configs/auditd/audit.rules`

Based on the Florian Roth audit rules baseline, covering:
- Identity and authentication changes
- Privilege escalation (setuid, setgid, sudo, su)
- Process execution
- Network activity
- Cron and systemd persistence
- Kernel module loading
- Log tampering attempts
- Immutable flag (`-e 2`) to prevent runtime rule modification

**Manual deployment (on the Linux endpoint):**
```sh
# SSH into your Linux endpoint
ssh user@192.168.56.11

# Back up existing rules
sudo cp /etc/audit/rules.d/audit.rules /etc/audit/rules.d/audit.rules.bak

# Copy new rules
sudo cp audit.rules /etc/audit/rules.d/audit.rules

# Restart auditd
sudo systemctl restart auditd

# Verify rules loaded
sudo auditctl -l
```

**Automated deployment:**
```sh
# From the project root — deploys to Linux endpoints via SSH
./scripts/deploy-auditd.sh
```

---

## 8. Running Tests

The project includes unit tests for core UI components:

```sh
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

**What's tested:**
- `SeverityBadge` — Renders all 4 severity levels with correct styling
- `DataTable` — Renders headers, rows, and compact mode
- `CodeBlock` — Renders code content with title
- `DetectionFilter` — Search input, severity buttons, category buttons

---

## 9. Building for Production

```sh
# Type-check, build, and test
npx tsc --noEmit && npm run build && npm test
```

The production build outputs to the `dist/` directory. You can serve it with any static file server:

```sh
# Preview locally
npm run preview

# Or serve with any static server
npx serve dist
```

The built files are static HTML/CSS/JS — no server-side runtime is needed. You can deploy to:
- **GitHub Pages**
- **Netlify / Vercel** (auto-deploys from Git)
- **Any web server** (nginx, Apache, IIS)
- **Internal network** (place `dist/` on a file share and open `index.html`)

---

## 10. Troubleshooting

### The app won't start

```
Error: Cannot find module 'vite'
```

Run `npm install` to install dependencies first.

### Blank page or white screen

- Open the browser developer console (F12) and check for errors.
- Make sure you're using a modern browser (Chrome 90+, Firefox 90+, Edge 90+).
- Try clearing the browser cache or opening in an incognito window.

### Setup checklist progress is lost

Checklist progress is stored in `localStorage` under the `mini-soc-lab:` namespace. Progress will be lost if you:
- Clear browser data / localStorage
- Switch to a different browser
- Open the app from a different URL or port

### Dashboards show zero data

This is expected when `VITE_USE_LIVE_DATA` is `false` (the default). The dashboards intentionally show zeros rather than fake data. To see real data, follow [Section 6](#6-connecting-to-a-live-wazuh-instance).

### "Disconnected from Wazuh API" banner

- Verify the Wazuh manager is running: `systemctl status wazuh-manager`
- Verify the API is reachable: `curl -k https://192.168.56.100:55000`
- Check that `VITE_WAZUH_API_URL` in your `.env` matches the actual API URL.
- Check browser console for CORS errors — the Wazuh API must allow requests from `localhost:5173`.

### Deploy scripts fail

- Ensure the scripts are executable: `chmod +x scripts/deploy-rules.sh scripts/deploy-auditd.sh`
- Verify SSH connectivity to target VMs.
- For PowerShell scripts, ensure WinRM is enabled on the Windows endpoint.

### Build warnings about chunk size

The `Some chunks are larger than 500 kB` warning is informational. The app works correctly. To optimize, you could add code-splitting with dynamic imports, but this is unnecessary for an internal documentation tool.
