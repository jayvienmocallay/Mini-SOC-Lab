# Changelog

All notable changes to the Mini SOC Lab project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-03-09

### Added

#### SRS Documentation Viewer
- Interactive single-page SRS viewer with dark cybersecurity theme
- Side navigation with IntersectionObserver-based active section tracking
- Animated hero section with project metadata
- Reusable DataTable, CodeBlock, DetectionCard, SeverityBadge components
- Framer Motion entrance animations throughout
- Custom scrollbar and glow effects (cyber-grid, scan-line, glow-text, glow-box)
- Mobile-responsive sidebar with toggle

#### Detection Rules (12 total)

**Brute Force (3 rules)**
- DET-BF-WIN-001: Windows RDP / Local Account Brute Force (HIGH)
- DET-BF-LNX-001: Linux SSH Brute Force (HIGH)
- DET-BF-WIN-002: Successful Logon Following Brute Force (CRITICAL)

**PowerShell Abuse (4 rules)**
- DET-PS-001: Encoded PowerShell Command Execution (HIGH)
- DET-PS-002: PowerShell Download Cradle / Fileless Attack (CRITICAL)
- DET-PS-003: Execution Policy Bypass (MEDIUM)
- DET-PS-004: AMSI Bypass Attempt (CRITICAL)

**Privilege Escalation (5 rules)**
- DET-PE-WIN-001: User Added to Local Administrators Group (CRITICAL)
- DET-PE-LNX-001: Sudo Privilege Escalation (HIGH)
- DET-PE-LNX-002: SUID Binary Abuse (HIGH)
- DET-PE-WIN-002: Token Impersonation / SeDebugPrivilege (CRITICAL)
- DET-PE-WIN-003: Scheduled Task by Non-Admin User (MEDIUM)

#### Infrastructure Documentation
- VM specifications for Windows, Linux, and SIEM Server
- Network architecture (192.168.56.0/24 host-only segment)
- Wazuh agent installation guide

#### Log Collection
- Windows log sources: Security, Sysmon, PowerShell, WMI, Task Scheduler
- Linux log sources: auth.log, syslog, auditd, kern.log
- 6 forwarding requirements (REQ-LOG-01 through REQ-LOG-06)

#### SIEM Platform
- Wazuh vs Splunk comparison
- 5 required dashboards defined

#### Testing & Validation
- 8 attack simulation scenarios (TEST-BF-001 through TEST-PE-003)
- 5 acceptance criteria (REQ-TEST-01 through REQ-TEST-05)

#### Non-Functional Requirements
- Performance targets (log latency, alert latency, EPS, dashboard load)
- Security requirements (TLS, authentication, isolation, snapshots)
- Maintainability standards (naming conventions, version control, annual review)

#### Appendices
- Windows Event ID reference table
- MITRE ATT&CK coverage map
- External references
