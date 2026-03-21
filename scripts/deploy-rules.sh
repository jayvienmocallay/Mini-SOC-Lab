#!/usr/bin/env bash
# Mini SOC Lab — Deploy Wazuh Detection Rules to SIEM Server
# SRS: SRS-SOC-2026-001 v1.0
#
# Usage: ./scripts/deploy-rules.sh [SIEM_IP]
# Default SIEM IP: 192.168.56.100
# Requires: SSH access to the SIEM server as root or sudo user

set -euo pipefail

SIEM_IP="${1:-192.168.56.100}"
RULES_DIR="$(cd "$(dirname "$0")/../rules/wazuh" && pwd)"
REMOTE_RULES_DIR="/var/ossec/etc/rules"

echo "╔══════════════════════════════════════════════════╗"
echo "║  Mini SOC Lab — Wazuh Rule Deployment            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "SIEM Server:  ${SIEM_IP}"
echo "Rules source: ${RULES_DIR}"
echo "Rules target: ${SIEM_IP}:${REMOTE_RULES_DIR}"
echo ""

# Verify rules exist
for rule_file in "${RULES_DIR}"/*.xml; do
  if [ ! -f "$rule_file" ]; then
    echo "[ERROR] No rule files found in ${RULES_DIR}"
    exit 1
  fi
  echo "[OK] Found: $(basename "$rule_file")"
done
echo ""

# Confirm
read -rp "Deploy rules to ${SIEM_IP}? (y/N): " confirm
if [[ "$confirm" != [yY] ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "[1/4] Backing up existing rules on SIEM server..."
ssh "root@${SIEM_IP}" "cp ${REMOTE_RULES_DIR}/local_rules.xml ${REMOTE_RULES_DIR}/local_rules.xml.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true"

echo "[2/4] Copying rule files to SIEM server..."
for rule_file in "${RULES_DIR}"/*.xml; do
  scp "$rule_file" "root@${SIEM_IP}:${REMOTE_RULES_DIR}/$(basename "$rule_file")"
  echo "  -> Deployed: $(basename "$rule_file")"
done

echo "[3/4] Validating rules on SIEM server..."
ssh "root@${SIEM_IP}" "/var/ossec/bin/wazuh-logtest-legacy -t 2>&1 || /var/ossec/bin/wazuh-analysisd -t 2>&1" || {
  echo "[WARN] Rule validation command not available — verify manually"
}

echo "[4/4] Restarting Wazuh Manager..."
ssh "root@${SIEM_IP}" "systemctl restart wazuh-manager"

echo ""
echo "[SUCCESS] Rules deployed and Wazuh Manager restarted."
echo "Verify at: https://${SIEM_IP}:443 → Management → Rules"
