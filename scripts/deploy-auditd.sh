#!/usr/bin/env bash
# Mini SOC Lab — Deploy auditd Rules to Linux Endpoint
# SRS: SRS-SOC-2026-001 v1.0
#
# Usage: ./scripts/deploy-auditd.sh [LINUX_EP_IP]
# Default: 192.168.56.11
# Requires: SSH access as root or sudo user

set -euo pipefail

LINUX_IP="${1:-192.168.56.11}"
RULES_FILE="$(cd "$(dirname "$0")/../configs/auditd" && pwd)/audit.rules"

echo "╔══════════════════════════════════════════════════╗"
echo "║  Mini SOC Lab — auditd Rule Deployment            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Linux Endpoint: ${LINUX_IP}"
echo "Rules source:   ${RULES_FILE}"
echo ""

if [ ! -f "$RULES_FILE" ]; then
  echo "[ERROR] audit.rules not found at: ${RULES_FILE}"
  exit 1
fi

read -rp "Deploy auditd rules to ${LINUX_IP}? (y/N): " confirm
if [[ "$confirm" != [yY] ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "[1/4] Backing up existing auditd rules..."
ssh "root@${LINUX_IP}" "cp /etc/audit/rules.d/audit.rules /etc/audit/rules.d/audit.rules.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true"

echo "[2/4] Copying audit.rules to endpoint..."
scp "$RULES_FILE" "root@${LINUX_IP}:/etc/audit/rules.d/audit.rules"

echo "[3/4] Reloading auditd rules..."
ssh "root@${LINUX_IP}" "auditctl -R /etc/audit/rules.d/audit.rules && echo '[OK] Rules loaded' || echo '[ERROR] Failed to load rules'"

echo "[4/4] Restarting auditd service..."
ssh "root@${LINUX_IP}" "systemctl restart auditd && echo '[OK] auditd restarted'"

echo ""
echo "[SUCCESS] auditd rules deployed to ${LINUX_IP}"
echo "Verify: ssh root@${LINUX_IP} 'auditctl -l | wc -l'"
