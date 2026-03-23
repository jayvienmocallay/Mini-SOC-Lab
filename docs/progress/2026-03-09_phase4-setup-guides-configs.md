# Phase 4: Setup Guides & Deployable Configurations

**Date:** 2026-03-09
**Status:** Completed

## Summary

Created interactive VM setup checklists with persistent state, Sysmon configuration viewer, and real deployable rule/config files for production use.

## Changes Made

### Interactive Setup Checklists
- **File:** `src/components/SetupChecklist.tsx`
- 3 tabbed sections: Windows VM (9 steps), Linux VM (9 steps), SIEM Server (9 steps)
- shadcn/ui Checkbox components with per-section and overall progress bars
- Expandable code snippets for every command
- **State persists to localStorage** — progress survives page reload and browser close
- Critical warning banner about network isolation

### Sysmon Configuration Viewer
- **File:** `src/components/SysmonConfig.tsx`
- Lists all 9 required Sysmon event types with ON/OFF toggle display
- Monitored process table (powershell.exe, cmd.exe, wscript.exe, cscript.exe, mshta.exe)
- MITRE ATT&CK technique references per event
- SwiftOnSecurity baseline config reference

### Deployable Wazuh Detection Rules
- **File:** `rules/wazuh/brute_force.xml` — DET-BF-WIN-001, DET-BF-WIN-002, DET-BF-LNX-001
- **File:** `rules/wazuh/powershell_abuse.xml` — DET-PS-001, DET-PS-002, DET-PS-003, DET-PS-004
- **File:** `rules/wazuh/privilege_escalation.xml` — DET-PE-WIN-001, DET-PE-LNX-001, DET-PE-WIN-002, DET-PE-WIN-003
- Full XML rules ready to deploy to `/var/ossec/etc/rules/`
- Includes inline comments: MITRE mappings, false positive guidance, tuning notes

### Deployable Sysmon Config
- **File:** `configs/sysmon/sysmonconfig.xml`
- Production-ready Sysmon v4.90 config based on SwiftOnSecurity baseline
- Event types: ProcessCreate, NetworkConnect, ImageLoad, ProcessAccess, FileCreate, Registry, DnsQuery
- Monitored processes: powershell, cmd, wscript, cscript, mshta, regsvr32, rundll32, certutil
- CommandLine keyword filters for encoded commands, download cradles, exec policy bypass

### Deployable auditd Rules
- **File:** `configs/auditd/audit.rules`
- Based on Florian Roth audit rules baseline
- Covers: identity changes, privilege escalation (setuid/setgid, sudo, su), process execution, network activity, cron/systemd persistence, kernel modules, log tampering
- Immutable flag (-e 2) to prevent runtime rule changes

### Deployment Scripts
- **File:** `scripts/deploy-rules.sh` — SSH-based Wazuh rule deployment with backup and validation
- **File:** `scripts/deploy-sysmon.ps1` — WinRM-based Sysmon config push to Windows endpoints
- **File:** `scripts/deploy-auditd.sh` — SSH-based auditd rule deployment to Linux endpoints
