/**
 * Wazuh API Service
 *
 * Provides typed functions to query the Wazuh Manager REST API.
 * When VITE_USE_LIVE_DATA is false (default), functions return
 * structured fallback data so the UI works without a running SIEM.
 *
 * Wazuh API docs: https://documentation.wazuh.com/current/user-manual/api/reference.html
 */

import { env } from "@/config/environment";

// ── Types ────────────────────────────────────────────────────────────

export interface WazuhAgent {
  id: string;
  name: string;
  ip: string;
  status: "active" | "disconnected" | "never_connected" | "pending";
  os: { name: string; platform: string };
  lastKeepAlive: string;
}

export interface AlertSeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AlertCategoryDistribution {
  bruteForce: number;
  psAbuse: number;
  privEsc: number;
}

export interface TimelineDataPoint {
  hour: string;
  events: number;
}

export interface AuthFailureStats {
  totalFailedLogins: number;
  uniqueSourceIps: number;
  bruteForceCandidates: number;
  accountsTargeted: number;
}

export interface HeatmapData {
  days: string[];
  hours: number;
  values: number[][];
}

export interface AgentHealth {
  name: string;
  ip: string;
  status: "active" | "disconnected";
  eps: number;
  uptime: string;
}

// ── Internal helpers ─────────────────────────────────────────────────

let _token: string | null = null;

async function authenticate(): Promise<string> {
  if (_token) return _token;
  const res = await fetch(`${env.wazuhApiUrl}/security/user/authenticate`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.wazuhApiUser}:${sessionStorage.getItem("wazuh_pass") || ""}`)}`,
    },
  });
  if (!res.ok) throw new Error(`Wazuh auth failed: ${res.status}`);
  const body = await res.json();
  _token = body.data?.token ?? null;
  if (!_token) throw new Error("No token in auth response");
  return _token;
}

async function wazuhGet<T>(path: string): Promise<T> {
  const token = await authenticate();
  const res = await fetch(`${env.wazuhApiUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Wazuh API ${path}: ${res.status}`);
  const body = await res.json();
  return body.data as T;
}

// ── Fallback data (used when live API is unavailable) ────────────────

function fallbackAgents(): WazuhAgent[] {
  return [
    { id: "001", name: "windows-ep", ip: env.windowsEndpointIp, status: "active", os: { name: "Windows 10 Pro", platform: "windows" }, lastKeepAlive: new Date().toISOString() },
    { id: "002", name: "linux-ep", ip: env.linuxEndpointIp, status: "active", os: { name: "Ubuntu 22.04", platform: "linux" }, lastKeepAlive: new Date().toISOString() },
    { id: "000", name: "siem-server", ip: env.siemServerIp, status: "active", os: { name: "Ubuntu 22.04", platform: "linux" }, lastKeepAlive: new Date().toISOString() },
  ];
}

// ── Public API ───────────────────────────────────────────────────────

/** Fetch list of registered Wazuh agents */
export async function getAgents(): Promise<WazuhAgent[]> {
  if (!env.useLiveData) return fallbackAgents();
  try {
    const data = await wazuhGet<{ affected_items: WazuhAgent[] }>("/agents?select=id,name,ip,status,os,lastKeepAlive");
    return data.affected_items;
  } catch {
    return fallbackAgents();
  }
}

/** Fetch alert counts grouped by severity from the last 24h */
export async function getAlertSeverityCounts(): Promise<AlertSeverityCounts> {
  if (!env.useLiveData) {
    return { critical: 0, high: 0, medium: 0, low: 0 };
  }
  try {
    const data = await wazuhGet<{ affected_items: Array<{ rule: { level: number } }> }>(
      "/alerts?limit=500&sort=-timestamp&q=timestamp>now-24h"
    );
    const counts: AlertSeverityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const alert of data.affected_items) {
      const lvl = alert.rule.level;
      if (lvl >= 12) counts.critical++;
      else if (lvl >= 8) counts.high++;
      else if (lvl >= 4) counts.medium++;
      else counts.low++;
    }
    return counts;
  } catch {
    return { critical: 0, high: 0, medium: 0, low: 0 };
  }
}

/** Fetch agent health metrics */
export async function getAgentHealth(): Promise<AgentHealth[]> {
  const agents = await getAgents();
  return agents.map((a) => ({
    name: a.name,
    ip: a.ip,
    status: a.status === "active" ? "active" : "disconnected",
    eps: 0, // EPS requires OpenSearch query — populated by dashboard polling
    uptime: a.status === "active" ? "Active" : "Disconnected",
  }));
}

/** Clear cached auth token (call on logout or credential change) */
export function clearWazuhAuth() {
  _token = null;
}
