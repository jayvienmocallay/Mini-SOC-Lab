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

const WAZUH_PASSWORD_KEY = "wazuh_pass";

export type WazuhErrorCode =
  | "AUTH_MISSING"
  | "AUTH_FAILED"
  | "TIMEOUT"
  | "NETWORK"
  | "API_ERROR"
  | "RESPONSE_INVALID"
  | "UNKNOWN";

export interface WazuhApiErrorInfo {
  code: WazuhErrorCode;
  message: string;
  status?: number;
  operation?: string;
}

class WazuhApiError extends Error {
  code: WazuhErrorCode;
  status?: number;
  operation?: string;

  constructor(info: WazuhApiErrorInfo) {
    super(info.message);
    this.name = "WazuhApiError";
    this.code = info.code;
    this.status = info.status;
    this.operation = info.operation;
  }
}

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
let _lastError: WazuhApiErrorInfo | null = null;

function setLastError(error: WazuhApiErrorInfo | null) {
  _lastError = error;
}

function toErrorInfo(error: unknown): WazuhApiErrorInfo {
  if (error instanceof WazuhApiError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
      operation: error.operation,
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN",
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN",
    message: "Unexpected Wazuh API error",
  };
}

function getWazuhPassword(): string {
  return sessionStorage.getItem(WAZUH_PASSWORD_KEY) || "";
}

async function fetchWithTimeout(input: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), env.wazuhRequestTimeout);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new WazuhApiError({
        code: "TIMEOUT",
        message: `Wazuh request timed out after ${env.wazuhRequestTimeout}ms`,
      });
    }

    throw new WazuhApiError({
      code: "NETWORK",
      message: "Network error while calling Wazuh API",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function authenticate(): Promise<string> {
  if (_token) return _token;
  const password = getWazuhPassword();
  if (!password) {
    throw new WazuhApiError({
      code: "AUTH_MISSING",
      message: "Wazuh password is not set. Add credentials to connect.",
      operation: "authenticate",
    });
  }

  const res = await fetchWithTimeout(`${env.wazuhApiUrl}/security/user/authenticate`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.wazuhApiUser}:${password}`)}`,
    },
  });

  if (!res.ok) {
    throw new WazuhApiError({
      code: "AUTH_FAILED",
      message: `Wazuh authentication failed (${res.status})`,
      status: res.status,
      operation: "authenticate",
    });
  }

  const body = await res.json();
  _token = body.data?.token ?? null;

  if (!_token) {
    throw new WazuhApiError({
      code: "RESPONSE_INVALID",
      message: "Wazuh auth response did not include a token",
      operation: "authenticate",
    });
  }

  return _token;
}

async function wazuhGet<T>(path: string): Promise<T> {
  let token = await authenticate();
  let res = await fetchWithTimeout(`${env.wazuhApiUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Token may expire; retry once with a refreshed token.
  if (res.status === 401) {
    _token = null;
    token = await authenticate();
    res = await fetchWithTimeout(`${env.wazuhApiUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!res.ok) {
    throw new WazuhApiError({
      code: "API_ERROR",
      message: `Wazuh API request failed for ${path} (${res.status})`,
      status: res.status,
      operation: path,
    });
  }

  const body = await res.json();
  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new WazuhApiError({
      code: "RESPONSE_INVALID",
      message: `Wazuh API response shape was invalid for ${path}`,
      operation: path,
    });
  }

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
  } catch (error) {
    setLastError(toErrorInfo(error));
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
  } catch (error) {
    setLastError(toErrorInfo(error));
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

export function setWazuhPassword(password: string) {
  sessionStorage.setItem(WAZUH_PASSWORD_KEY, password);
  clearWazuhAuth();
}

export function hasWazuhPassword() {
  return Boolean(getWazuhPassword());
}

export function getLastWazuhError(): WazuhApiErrorInfo | null {
  return _lastError;
}

export function clearLastWazuhError() {
  setLastError(null);
}
