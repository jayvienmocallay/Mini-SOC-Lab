/**
 * Environment configuration for the Mini SOC Lab.
 * All infrastructure IPs, API endpoints, and feature flags are centralized here.
 * Override via .env file for different deployments.
 */

export const env = {
  // Wazuh API
  wazuhApiUrl: import.meta.env.VITE_WAZUH_API_URL || "https://192.168.56.100:55000",
  wazuhApiUser: import.meta.env.VITE_WAZUH_API_USER || "wazuh-wui",
  wazuhDashboardUrl: import.meta.env.VITE_WAZUH_DASHBOARD_URL || "https://192.168.56.100:443",

  // Infrastructure IPs
  siemServerIp: import.meta.env.VITE_SIEM_IP || "192.168.56.100",
  windowsEndpointIp: import.meta.env.VITE_WIN_EP_IP || "192.168.56.10",
  linuxEndpointIp: import.meta.env.VITE_LINUX_EP_IP || "192.168.56.11",
  hostMachineIp: import.meta.env.VITE_HOST_IP || "192.168.56.1",
  networkSubnet: import.meta.env.VITE_NETWORK_SUBNET || "192.168.56.0/24",

  // Feature flags
  useLiveData: import.meta.env.VITE_USE_LIVE_DATA === "true",
  enableAgentPush: import.meta.env.VITE_ENABLE_AGENT_PUSH === "true",

  // Polling intervals (ms)
  dashboardRefreshInterval: Number(import.meta.env.VITE_DASHBOARD_REFRESH || 60000),
  dashboardRealtimeRefreshInterval: Number(import.meta.env.VITE_DASHBOARD_REFRESH_REALTIME || 10000),
  agentHealthRefreshInterval: Number(import.meta.env.VITE_AGENT_HEALTH_REFRESH || 300000),
  authMonitorRefreshInterval: Number(import.meta.env.VITE_AUTH_MONITOR_REFRESH || 30000),

  // Request timeout (ms)
  wazuhRequestTimeout: Number(import.meta.env.VITE_WAZUH_REQUEST_TIMEOUT || 10000),
} as const;

export type Environment = typeof env;

export function getLiveDataEnvironmentIssues(): string[] {
  if (!env.useLiveData) return [];

  const issues: string[] = [];

  try {
    // Throws if URL is invalid.
    new URL(env.wazuhApiUrl);
  } catch {
    issues.push("VITE_WAZUH_API_URL is invalid");
  }

  if (!env.wazuhApiUser.trim()) {
    issues.push("VITE_WAZUH_API_USER is empty");
  }

  if (!Number.isFinite(env.dashboardRefreshInterval) || env.dashboardRefreshInterval <= 0) {
    issues.push("VITE_DASHBOARD_REFRESH must be a positive number");
  }

  if (!Number.isFinite(env.dashboardRealtimeRefreshInterval) || env.dashboardRealtimeRefreshInterval <= 0) {
    issues.push("VITE_DASHBOARD_REFRESH_REALTIME must be a positive number");
  }

  if (!Number.isFinite(env.wazuhRequestTimeout) || env.wazuhRequestTimeout <= 0) {
    issues.push("VITE_WAZUH_REQUEST_TIMEOUT must be a positive number");
  }

  return issues;
}
